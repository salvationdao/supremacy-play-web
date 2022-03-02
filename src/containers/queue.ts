import {createContainer} from "unstated-next";
import {useWebsocket} from "./socket";
import {useEffect, useState} from "react";
import HubKey from "../keys";
import {useAuth} from "./auth";

export const QueueContainer = createContainer(() => {
    const { state, subscribe } = useWebsocket()
    const {user} = useAuth()
    const [queueLength, setQueueLength] = useState<number>(-1)
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !user) return
        return subscribe<number>(HubKey.HubKeyFactionQueueJoin,  (payload) => {
            setQueueLength(payload);
        });
    }, [state,subscribe, user]);

    return {queueLength}
})

export const QueueProvider = QueueContainer.Provider
export const useQueue = QueueContainer.useContainer
