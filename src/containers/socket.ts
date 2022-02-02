import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createContainer } from 'unstated-next'
import { GAME_SERVER_HOSTNAME, LOG_API_CALLS } from '../constants'
import { useDebounce } from '../hooks/useDebounce'
import HubKey from '../keys'
import { NetMessageType } from '../types'
import { parseNetMessage } from './netMessages'

// websocket message struct
interface MessageData {
    key: string
    transactionID: string
    payload: any
}

// makeid is used to generate a random transactionID for the websocket
export function makeid(length = 12): string {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

const DateParse = () => {
    const reISO =
        /^([0-9]+)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])[Tt]([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(([Zz])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/

    return function (key: string, value: any) {
        if (typeof value === 'string') {
            const a = reISO.exec(value)
            if (a) return new Date(value)
        }
        return value
    }
}

const dp = DateParse()

export function protocol() {
    return window.location.protocol.match(/^https/) ? 'wss' : 'ws'
}

enum SocketState {
    CONNECTING = WebSocket.CONNECTING,
    OPEN = WebSocket.OPEN,
    CLOSING = WebSocket.CLOSING,
    CLOSED = WebSocket.CLOSED,
}

export type WSSendFn = <Y = any, X = any>(key: string, payload?: X) => Promise<Y>

interface WebSocketProperties {
    send: WSSendFn
    connect: () => Promise<undefined>
    state: SocketState
    subscribe: <T>(
        key: string,
        callback: (payload: T) => void,
        args?: any,
        listenOnly?: boolean,
        disableLog?: boolean,
    ) => () => void
    subscribeNetMessage: <T>(netMessageType: NetMessageType, callback: (payload: T) => void) => () => void
    onReconnect: () => void
}

type SubscribeCallback = (payload: any) => void

export interface Message<T> {
    transactionID?: string
    key: string
    payload: T
}

type WSCallback<T = any> = (data: T) => void

interface HubError {
    transactionID: string
    key: string
    message: string
}

const UseWebsocket = (): WebSocketProperties => {
    const [state, setState] = useState<SocketState>(SocketState.CLOSED)
    const callbacks = useRef<{ [key: string]: WSCallback }>({})
    const [outgoing, setOutgoing] = useDebounce<Message<any>[]>([], 100)

    const webSocket = useRef<WebSocket | null>(null)

    const send = useRef<WSSendFn>(function send<Y = any, X = any>(key: string, payload?: X): Promise<Y> {
        const transactionID = makeid()

        if (LOG_API_CALLS) {
            console.log(
                `%c>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STREAM SITE REQUEST: "${key}"`,
                'background: #D1E5FF; color: #000000',
            )
            console.log({
                key,
                payload,
            })
        }

        return new Promise(function (resolve, reject) {
            callbacks.current[transactionID] = (data: Message<Y> | HubError) => {
                if (data.key === 'HUB:ERROR') {
                    reject((data as HubError).message)
                    return
                }
                const result = (data as Message<Y>).payload

                if (LOG_API_CALLS) {
                    console.log(
                        `%c>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STREAM SITE RESPONSE: "${key}"`,
                        'background: #FFD5C7; color: #000000',
                    )
                    console.log(result)
                }

                resolve(result)
            }

            setOutgoing((prev) => [
                ...prev,
                {
                    key,
                    payload,
                    transactionID,
                },
            ])
        })
    })

    const subs = useRef<{ [key: string]: SubscribeCallback[] }>({})

    const subscribe = useMemo(() => {
        return <T>(
            key: string,
            callback: (payload: T) => void,
            args?: any,
            listenOnly?: boolean,
            disableLog?: boolean,
        ) => {
            const transactionID = makeid()

            let subKey = key
            if (!listenOnly) {
                subKey = transactionID
            }

            if (LOG_API_CALLS) {
                console.log(
                    `%c>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STREAM SITE REQUEST (${
                        listenOnly ? 'LISTEN' : 'SUBSCRIPTION'
                    }): "${key}"`,
                    'background: #D1E5FF; color: #000000',
                )
                console.log({
                    key,
                    subKey,
                    payload: args,
                })
            }

            const callback2 = (payload: T) => {
                if (LOG_API_CALLS && !disableLog) {
                    console.log(
                        `%c>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STREAM SITE RESPONSE (${
                            listenOnly ? 'LISTEN' : 'SUBSCRIPTION'
                        }): "${key}"`,
                        'background: #FFD5C7; color: #000000',
                    )
                    console.log({
                        key,
                        subKey,
                        payload,
                    })
                }
                callback(payload)
            }

            if (subs.current[subKey]) {
                subs.current[subKey].push(callback2)
            } else {
                subs.current[subKey] = [callback2]
            }

            const setSubscribeState = (key: string, open: boolean, args?: any) => {
                setOutgoing((prev) => [
                    ...prev,
                    {
                        key: key + (open ? '' : ':UNSUBSCRIBE'),
                        payload: open ? args : undefined,
                        transactionID,
                    },
                ])
            }

            if (!listenOnly) setSubscribeState(key, true, args)

            return () => {
                const i = subs.current[subKey].indexOf(callback2)
                if (i === -1) return
                subs.current[subKey].splice(i, 1)

                if (!listenOnly) setSubscribeState(key, false)
            }
        }
    }, [setOutgoing])

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

    const sendOutgoingMessages = useCallback(() => {
        if (outgoing.length === 0) return
        if (!webSocket.current) throw new Error('no websocket')

        outgoing.forEach((og) => {
            if (!webSocket.current) throw new Error('no websocket')
            webSocket.current.send(JSON.stringify(og))
        })

        setOutgoing([])
    }, [outgoing, setOutgoing])

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
                // Binary Message?
                if (message.data instanceof ArrayBuffer) {
                    const parsedNetMessage = parseNetMessage(message.data)
                    if (parsedNetMessage === undefined) return
                    if (subs.current[parsedNetMessage.type]) {
                        for (const callback of subs.current[parsedNetMessage.type]) {
                            callback(parsedNetMessage.payload)
                        }
                    }
                    return
                }

                const msgData: MessageData = JSON.parse(message.data, dp)
                // Use network sub menu to see payloads traveling between client and server
                // https://stackoverflow.com/a/5757171
                if (msgData.key === HubKey.Welcome) {
                    setReadyState()
                    if (onopen) {
                        onopen()
                    }
                }

                if (subs.current[msgData.transactionID]) {
                    for (const callback of subs.current[msgData.transactionID]) {
                        callback(msgData.payload)
                    }
                } else if (subs.current[msgData.key]) {
                    for (const callback of subs.current[msgData.key]) {
                        callback(msgData.payload)
                    }
                } else if (msgData.transactionID) {
                    const { [msgData.transactionID]: cb, ...withoutCb } = callbacks.current
                    if (cb) {
                        cb(msgData)
                        callbacks.current = withoutCb
                    }
                }
            }
            ws.onclose = (e) => {
                setReadyState()
            }
        },
        [],
    )

    const connect = useMemo(() => {
        return (): Promise<undefined> => {
            return new Promise(function (resolve, reject) {
                setState(WebSocket.CONNECTING)
                setTimeout(() => {
                    webSocket.current = new WebSocket(`${protocol()}://${GAME_SERVER_HOSTNAME}/api/ws`)
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

    useEffect(() => {
        webSocket.current = new WebSocket(`${protocol()}://${GAME_SERVER_HOSTNAME}/api/ws`)
        setupWS(webSocket.current)

        return () => {
            if (webSocket.current) webSocket.current.close()
        }
    }, [])

    useEffect(() => {
        if (webSocket.current) sendOutgoingMessages()
    }, [webSocket, sendOutgoingMessages])

    return { send: send.current, state, connect, subscribe, subscribeNetMessage, onReconnect: sendOutgoingMessages }
}

const WebsocketContainer = createContainer(UseWebsocket)
export const SocketProvider = WebsocketContainer.Provider
export const useWebsocket = WebsocketContainer.useContainer

export default WebsocketContainer
