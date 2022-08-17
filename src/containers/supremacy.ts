import { useCallback, useEffect, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { createContainer } from "unstated-next"
import { FallbackFaction, useGlobalNotifications } from "."
import { GAME_SERVER_HOSTNAME } from "../constants"
import { GetFactionsAll } from "../fetching"
import { FactionsAll } from "../types"
import { useWS } from "./ws/useWS"

export const SupremacyContainer = createContainer(() => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { state, isReconnecting, isServerDown } = useWS({
        URI: "/public/online",
        host: GAME_SERVER_HOSTNAME,
    })
    const [serverConnectedBefore, setServerConnectedBefore] = useState(false)
    const [firstConnectTimedOut, setFirstConnectTimedOut] = useState(false)
    const [haveSups, toggleHaveSups] = useState<boolean>() // Needs 3 states: true, false, undefined. Undefined means it's not loaded yet.
    const [factionsAll, setFactionsAll] = useState<FactionsAll>({})
    const [battleIdentifier, setBattleIdentifier] = useState<number>()

    const { query: queryGetFactionsAll } = useParameterizedQuery(GetFactionsAll)

    useEffect(() => {
        setServerConnectedBefore((prev) => {
            if (state === WebSocket.OPEN && !prev) return true
            return prev
        })
    }, [state])

    // If it's been X amount of time and we never connected, then server is probs down
    useEffect(() => {
        setTimeout(() => {
            if (!serverConnectedBefore) setFirstConnectTimedOut(true)
        }, 20000)
    }, [serverConnectedBefore])

    // Get main color of each factions
    useEffect(() => {
        ;(async () => {
            if (isServerDown) return

            try {
                const resp = await queryGetFactionsAll({})
                if (resp.error || !resp.payload) return
                const currentData = {} as FactionsAll
                resp.payload.forEach((f) => {
                    currentData[f.id] = f
                })
                setFactionsAll(currentData)
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to retrieve faction data.", "error")
                console.error(e)
                return false
            }
        })()
    }, [newSnackbarMessage, isServerDown, queryGetFactionsAll])

    const getFaction = useCallback(
        (factionID: string) => {
            return factionsAll[factionID] || FallbackFaction
        },
        [factionsAll],
    )

    return {
        serverConnectedBefore,
        isReconnecting,
        isServerDown,
        firstConnectTimedOut,

        factionsAll,
        getFaction,
        battleIdentifier,
        setBattleIdentifier,
        haveSups,
        toggleHaveSups,
    }
})

export const SupremacyProvider = SupremacyContainer.Provider
export const useSupremacy = SupremacyContainer.useContainer
