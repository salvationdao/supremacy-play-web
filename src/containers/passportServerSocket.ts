import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { PassportServerKeys } from "../keys"
import { sleep } from "../helpers"

// makeid is used to generate a random transaction_id for the websocket
function makeid(length = 12): string {
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

    return function (key: string, value: any) {
        if (typeof value === "string") {
            const a = reISO.exec(value)
            if (a) return new Date(value)
        }
        return value
    }
}

const dp = DateParse()

function protocol() {
    return window.location.protocol.match(/^https/) ? "wss" : "ws"
}

enum SocketState {
    CONNECTING = WebSocket.CONNECTING,
    OPEN = WebSocket.OPEN,
    CLOSING = WebSocket.CLOSING,
    CLOSED = WebSocket.CLOSED,
}

type WSSendFn = <Y = any, X = any>(key: string, payload?: X) => Promise<Y>

interface WebSocketProperties {
    send: WSSendFn
    connect: () => Promise<undefined>
    state: SocketState
    subscribe: <T>(key: string, callback: (payload: T) => void, args?: any, listenOnly?: boolean) => () => void
    isServerUp: boolean
}

type SubscribeCallback = (payload: any) => void

interface Message<T> {
    transaction_id?: string
    key: string
    payload: T
}

type WSCallback<T = any> = (data: T) => void

interface HubError {
    transaction_id: string
    key: string
    message: string
}

const backoffIntervalCalc = async (num: number) => {
    const calc = new Promise<number>((resolve, reject) => {
        const jitter = Math.floor((Math.random() * 1000000) / 1000)
        const backoffInterval = 2 ** (num - 1) * 5 + jitter
        resolve(backoffInterval)
    })
    const i = await calc
    return i
}

const PassportServerWebsocket = (initialState?: string): WebSocketProperties => {
    const [state, setState] = useState<SocketState>(SocketState.CLOSED)
    const callbacks = useRef<{ [key: string]: WSCallback }>({})

    const webSocket = useRef<WebSocket | null>(null)
    const [reconnect, setIsReconnect] = useState<boolean>(false)
    const [isServerUp, setIsServerUp] = useState<boolean>(true)

    useEffect(() => {
        if (!reconnect) return
        serverCheckInterval(1)
        setTimeout(() => {
            setIsServerUp(false)
        }, 120000)
    }, [reconnect])

    const serverCheckInterval = async (num: number) => {
        const i = await backoffIntervalCalc(num)
        setTimeout(async () => {
            try {
                const resp = await fetch(`${window.location.protocol}//${initialState}/api/check`)
                const body = resp.ok as boolean
                if (body) {
                    window.location.reload()
                }
            } catch {
                serverCheckInterval(num + 1)
            }
        }, i)
    }

    const send = useRef<WSSendFn>(function send<Y = any, X = any>(key: string, payload?: X): Promise<Y> {
        const transaction_id = makeid()
        return new Promise((resolve, reject) => {
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
    }, [])

    const setupWS = useMemo(
        () => (ws: WebSocket, onopen?: () => void) => {
            ;(window as any).ws = ws

            ws.onopen = (e) => {
                // Use network sub menu to see payloads traveling between client and server
                // https://stackoverflow.com/a/5757171
                // console.info("WebSocket open.")
            }
            ws.onerror = (e) => {
                // Use network sub menu to see payloads traveling between client and server
                // https://stackoverflow.com/a/5757171
                // console.error("onerror", e)
                ws.close()
            }
            ws.onmessage = (message) => {
                const msgData = JSON.parse(message.data, dp)
                // Use network sub menu to see payloads traveling between client and server
                // https://stackoverflow.com/a/5757171
                if (msgData.key === PassportServerKeys.Welcome) {
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
            ws.onclose = (e) => {
                setReadyState()
                setIsReconnect(true)
            }
        },
        [],
    )

    const connect = useMemo(() => {
        return (): Promise<undefined> => {
            return new Promise(function (resolve, reject) {
                setState(WebSocket.CONNECTING)
                setTimeout(() => {
                    webSocket.current = new WebSocket(`${protocol()}://${initialState}/api/ws`)
                    setupWS(webSocket.current)
                    resolve(undefined)
                }, 2000)
            })
        }
    }, [setupWS, initialState])

    const setReadyState = () => {
        if (!webSocket.current) {
            setState(WebSocket.CLOSED)
            return
        }
        setState(webSocket.current.readyState)
    }

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await fetch(`${window.location.protocol}//${initialState}/api/check`)
                const body = resp.ok as boolean
                if (body) {
                    webSocket.current = new WebSocket(`${protocol()}://${initialState}/api/ws`)
                    setupWS(webSocket.current)

                    return () => {
                        if (webSocket.current) webSocket.current.close()
                    }
                }
            } catch {
                setIsReconnect(true)
            }
        })()
    }, [initialState, setupWS])

    return { send: send.current, state, connect, subscribe, isServerUp }
}

const WebsocketContainer = createContainer(PassportServerWebsocket)
export const PassportServerSocketProvider = WebsocketContainer.Provider
export const usePassportServerWebsocket = WebsocketContainer.useContainer

export default WebsocketContainer
