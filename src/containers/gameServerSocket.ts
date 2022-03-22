import { useEffect, useMemo, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { GAME_SERVER_HOSTNAME } from "../constants"
import { sleep } from "../helpers"
import { parseNetMessage } from "../helpers/netMessages"
import { GameServerKeys } from "../keys"
import { GameAbilityProgress, NetMessageTick, NetMessageType, User } from "../types"

// websocket message struct
interface MessageData {
    key: string
    transaction_id: string
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    payload: any
}

// makeid is used to generate a random transaction_id for the websocket
export function makeid(length = 12): string {
    let result = ""
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

const DateParse = () => {
    const reISO =
        /^([0-9]+)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])[Tt]([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(([Zz])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    return function (key: string, value: any) {
        if (typeof value === "string") {
            const a = reISO.exec(value)
            if (a) return new Date(value)
        }
        return value
    }
}

const dp = DateParse()

export function wsProtocol() {
    return window.location.protocol.match(/^https/) ? "wss" : "ws"
}

export function httpProtocol() {
    return window.location.protocol.match(/^https/) ? "https" : "http"
}

export enum SocketState {
    CONNECTING = WebSocket.CONNECTING,
    OPEN = WebSocket.OPEN,
    CLOSING = WebSocket.CLOSING,
    CLOSED = WebSocket.CLOSED,
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export type WSSendFn = <Y = any, X = any>(key: string, payload?: X) => Promise<Y>

export interface WebSocketProperties {
    send: WSSendFn
    connect: () => Promise<undefined>
    state: SocketState
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    subscribe: <T>(key: string, callback: (payload: T) => void, args?: any, listenOnly?: boolean) => () => void
    subscribeNetMessage: <T>(netMessageType: NetMessageType, callback: (payload: T) => void) => () => void
    subscribeAbilityNetMessage: <T>(abilityID: string, callback: (payload: T) => void) => () => void
    subscribeWarMachineStatNetMessage: <T>(participantID: number, callback: (payload: T) => void) => () => void
    isServerUp: boolean
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type SubscribeCallback = (payload: any) => void

export interface Message<T> {
    transaction_id?: string
    key: string
    payload: T
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type WSCallback<T = any> = (data: T) => void

interface HubError {
    transaction_id: string
    key: string
    message: string
}

const backoffIntervalCalc = async (num: number) => {
    const calc = new Promise<number>((resolve) => {
        const jitter = Math.floor((Math.random() * 1000000) / 1000)
        const backoffInterval = 2 ** (num - 1) * 5 + jitter
        resolve(backoffInterval)
    })
    const i = await calc
    return i
}

const GameServerWebsocket = (initialState?: { login: User | null }): WebSocketProperties => {
    const [state, setState] = useState<SocketState>(SocketState.CLOSED)
    const callbacks = useRef<{ [key: string]: WSCallback }>({})

    const webSocket = useRef<WebSocket | null>(null)
    const [reconnect, setIsReconnect] = useState<boolean>(false)
    const [isServerUp, setIsServerUp] = useState<boolean>(true)

    const login = initialState ? initialState.login : ""

    // ******* Reconnect Logic Start ******* //
    // Check to see if server is up, if yes conenct WS, else don't
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await fetch(`${window.location.protocol}//${GAME_SERVER_HOSTNAME}/api/check`)
                const body = resp.ok as boolean
                if (body) {
                    webSocket.current = new WebSocket(`${wsProtocol()}://${GAME_SERVER_HOSTNAME}/api/ws`)
                    webSocket.current.binaryType = "arraybuffer"
                    setupWS(webSocket.current)

                    return () => {
                        if (webSocket.current) webSocket.current.close()
                    }
                }
            } catch {
                setIsReconnect(true)
            }
        })()
    }, [])

    useEffect(() => {
        if (!reconnect) return
        serverCheckInterval(1)
        setTimeout(() => {
            setIsServerUp(false)
        }, 90000)
    }, [reconnect])

    const serverCheckInterval = async (num: number) => {
        const i = await backoffIntervalCalc(num)
        setTimeout(async () => {
            try {
                const resp = await fetch(`${window.location.protocol}//${GAME_SERVER_HOSTNAME}/api/check`)
                const body = resp.ok as boolean
                if (body) {
                    window.location.reload()
                }
            } catch {
                serverCheckInterval(num + 1)
            }
        }, i)
    }

    // ******* Reconnect Logic End ******* //

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const send = useRef<WSSendFn>(function send<Y = any, X = any>(key: string, payload?: X): Promise<Y> {
        const transaction_id = makeid()

        return new Promise(function (resolve, reject) {
            callbacks.current[transaction_id] = (data: Message<Y> | HubError) => {
                if (data.key === "HUB:ERROR") {
                    reject((data as HubError).message)
                    return
                }
                const result = (data as Message<Y>).payload
                resolve(result)
            }

            const sendFn = () => {
                if (!webSocket.current || webSocket.current.readyState !== WebSocket.OPEN) {
                    setTimeout(sendFn, 500)
                    return
                }
                webSocket.current.send(
                    JSON.stringify({
                        key,
                        payload,
                        transaction_id,
                    }),
                )
            }
            sendFn()
        })
    })

    const subs = useRef<{ [key: string]: SubscribeCallback[] }>({})

    const subscribe = useMemo(() => {
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        return <T>(key: string, callback: (payload: T) => void, args?: any, listenOnly?: boolean) => {
            const transaction_id = makeid()

            let subKey = key
            if (!listenOnly) {
                subKey = transaction_id
            }

            const callback2 = (payload: T) => {
                callback(payload)
            }

            if (subs.current[subKey]) {
                subs.current[subKey].push(callback2)
            } else {
                subs.current[subKey] = [callback2]
            }

            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            const setSubscribeState = async (key: string, open: boolean, args?: any) => {
                while (webSocket.current === null) {
                    await sleep(1000)
                }
                webSocket.current.send(
                    JSON.stringify({
                        key: key + (open ? "" : ":UNSUBSCRIBE"),
                        payload: open ? args : undefined,
                        transaction_id,
                    }),
                )
            }

            if (!listenOnly) setSubscribeState(key, true, args)

            return () => {
                const i = subs.current[subKey].indexOf(callback2)
                if (i === -1) return
                subs.current[subKey].splice(i, 1)

                if (!listenOnly) setSubscribeState(key, false)
            }
        }
    }, [login])

    // subscription function for Faction Ability only
    const abilitySubs = useRef<{ [abilityIdentity: string]: SubscribeCallback[] }>({})
    const subscribeAbilityNetMessage = useMemo(() => {
        return <T>(abilityIdentity: string, callback: (payload: T) => void) => {
            if (abilitySubs.current[abilityIdentity]) {
                abilitySubs.current[abilityIdentity].push(callback)
            } else {
                abilitySubs.current[abilityIdentity] = [callback]
            }
            return () => {
                const i = abilitySubs.current[abilityIdentity].indexOf(callback)
                if (i === -1) return
                abilitySubs.current[abilityIdentity].splice(i, 1)
            }
        }
    }, [])

    // subscription function for War Machine Stat only
    const warMachineStatSubs = useRef<{ [participantID: number]: SubscribeCallback[] }>({})
    const subscribeWarMachineStatNetMessage = useMemo(() => {
        return <T>(participantID: number, callback: (payload: T) => void) => {
            if (warMachineStatSubs.current[participantID]) {
                warMachineStatSubs.current[participantID].push(callback)
            } else {
                warMachineStatSubs.current[participantID] = [callback]
            }

            return () => {
                const i = warMachineStatSubs.current[participantID].indexOf(callback)
                if (i === -1) return
                warMachineStatSubs.current[participantID].splice(i, 1)
            }
        }
    }, [])

    const subscribeNetMessage = useMemo(() => {
        return <T>(netMessageType: NetMessageType, callback: (payload: T) => void) => {
            if (subs.current[netMessageType]) {
                subs.current[netMessageType].push(callback)
            } else {
                subs.current[netMessageType] = [callback]
            }

            return () => {
                const i = subs.current[netMessageType].indexOf(callback)
                if (i === -1) return
                subs.current[netMessageType].splice(i, 1)
            }
        }
    }, [])

    const setupWS = useMemo(
        () => (ws: WebSocket, onopen?: () => void) => {
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ;(window as any).ws = ws

            ws.onopen = () => {
                // Use network sub menu to see payloads traveling between client and server
                // https://stackoverflow.com/a/5757171
                // console.info("WebSocket open.")
            }
            ws.onerror = () => {
                // Use network sub menu to see payloads traveling between client and server
                // https://stackoverflow.com/a/5757171
                // console.error("onerror", e)
                ws.close()
            }
            ws.onmessage = (message) => {
                // Binary Message?
                if (message.data instanceof ArrayBuffer) {
                    const parsedNetMessage = parseNetMessage(message.data)
                    if (parsedNetMessage === undefined) return
                    // parse faction ability net message individually
                    if (parsedNetMessage.type === NetMessageType.GameAbilityProgressTick) {
                        for (const data of parsedNetMessage.payload as GameAbilityProgress[]) {
                            if (abilitySubs.current[data.id]) {
                                for (const callback of abilitySubs.current[data.id]) {
                                    callback(data)
                                }
                            }
                        }
                    } else if (parsedNetMessage.type === NetMessageType.Tick) {
                        const parsed = parsedNetMessage.payload as NetMessageTick
                        for (const data of parsed.warmachines) {
                            if (data.participant_id) {
                                if (warMachineStatSubs.current[data.participant_id]) {
                                    for (const callback of warMachineStatSubs.current[data.participant_id]) {
                                        callback(data)
                                    }
                                }
                            }
                        }
                    } else if (subs.current[parsedNetMessage.type]) {
                        for (const callback of subs.current[parsedNetMessage.type]) {
                            callback(parsedNetMessage.payload)
                        }
                    }
                    return
                }

                const msgData: MessageData = JSON.parse(message.data, dp)
                // Use network sub menu to see payloads traveling between client and server
                // https://stackoverflow.com/a/5757171
                if (msgData.key === GameServerKeys.Welcome) {
                    setReadyState()
                    if (onopen) {
                        onopen()
                    }
                }

                if (subs.current[msgData.transaction_id]) {
                    for (const callback of subs.current[msgData.transaction_id]) {
                        callback(msgData.payload)
                    }
                } else if (subs.current[msgData.key]) {
                    for (const callback of subs.current[msgData.key]) {
                        callback(msgData.payload)
                    }
                } else if (msgData.transaction_id) {
                    const { [msgData.transaction_id]: cb, ...withoutCb } = callbacks.current
                    if (cb) {
                        cb(msgData)
                        callbacks.current = withoutCb
                    }
                }
            }
            ws.onclose = () => {
                setReadyState()
                setIsReconnect(true)
            }
        },
        [],
    )

    const connect = useMemo(() => {
        return (): Promise<undefined> => {
            return new Promise(function (resolve) {
                setState(WebSocket.CONNECTING)
                setTimeout(() => {
                    webSocket.current = new WebSocket(`${wsProtocol()}://${GAME_SERVER_HOSTNAME}/api/ws`)
                    webSocket.current.binaryType = "arraybuffer"
                    setupWS(webSocket.current)
                    resolve(undefined)
                }, 2000)
            })
        }
    }, [setupWS])

    const setReadyState = () => {
        if (!webSocket.current) {
            setState(WebSocket.CLOSED)
            return
        }
        setState(webSocket.current.readyState)
    }

    return {
        send: send.current,
        state,
        connect,
        subscribe,
        subscribeNetMessage,
        subscribeAbilityNetMessage,
        subscribeWarMachineStatNetMessage,
        isServerUp,
    }
}

const WebsocketContainer = createContainer(GameServerWebsocket)
export const GameServerSocketProvider = WebsocketContainer.Provider
export const useGameServerWebsocket = WebsocketContainer.useContainer

export default WebsocketContainer
