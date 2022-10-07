import { useCallback, useEffect, useRef, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { createContainer } from "unstated-next"
import { FallbackFaction, useGlobalNotifications } from "."
import { GAME_SERVER_HOSTNAME } from "../constants"
import { GetFactionsAll } from "../fetching"
import { FactionsAll } from "../types"
import { useWS } from "./ws/useWS"

export const SupremacyContainer = createContainer(() => {
    const isTraining = location.pathname.includes("/training")
    const { newSnackbarMessage } = useGlobalNotifications()
    const { state, isReconnecting, isServerDown } = useWS({
        URI: "/public/online",
        host: GAME_SERVER_HOSTNAME,
    })
    const [serverConnectedBefore, setServerConnectedBefore] = useState(false)
    const [firstConnectTimedOut, setFirstConnectTimedOut] = useState(false)
    const windowReloadTimeout = useRef<NodeJS.Timeout | null>(null)
    const [hasInteracted, setHasInteracted] = useState(false)

    const [haveSups, toggleHaveSups] = useState<boolean>() // Needs 3 states: true, false, undefined. Undefined means it's not loaded yet.
    const [factionsAll, setFactionsAll] = useState<FactionsAll>({})
    const [battleIdentifier, setBattleIdentifier] = useState<number>()
    const [battleID, setBattleID] = useState<string>()

    const { query: queryGetFactionsAll } = useParameterizedQuery(GetFactionsAll)

    useEffect(() => {
        setServerConnectedBefore((prev) => {
            if (state === WebSocket.OPEN && !prev) return true
            return prev
        })
    }, [state])

    const clearWindowReloadTimeout = useCallback(() => {
        windowReloadTimeout.current && clearTimeout(windowReloadTimeout.current)
        windowReloadTimeout.current = null
    }, [])

    useEffect(() => {
        const callback = () => {
            setHasInteracted(true)
        }

        document.addEventListener("pointerdown", callback, { once: true })
    }, [])

    // If server is down and we're not trying to reconnect, reload window after 30 minutes
    useEffect(() => {
        if (isServerDown && !isReconnecting) {
            clearWindowReloadTimeout()
            windowReloadTimeout.current = setTimeout(() => {
                location.reload()
            }, 1200000)
        } else {
            clearWindowReloadTimeout()
        }
    }, [clearWindowReloadTimeout, isReconnecting, isServerDown])

    // If it's been X amount of time and we never connected, then server is probs down
    useEffect(() => {
        if (isTraining) {
            setFirstConnectTimedOut(true)
            return
        }
        const timeout = setTimeout(() => {
            if (!serverConnectedBefore) setFirstConnectTimedOut(true)
        }, 20000)

        return () => clearTimeout(timeout)
    }, [serverConnectedBefore, isTraining])

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
        hasInteracted,

        factionsAll,
        getFaction,
        battleIdentifier,
        setBattleIdentifier,
        battleID,
        setBattleID,
        haveSups,
        toggleHaveSups,
    }
})

export const SupremacyProvider = SupremacyContainer.Provider
export const useSupremacy = SupremacyContainer.useContainer
