import { useCallback, useEffect, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { createContainer } from "unstated-next"
import { FallbackFaction, useSnackbar } from "."
import { GAME_SERVER_HOSTNAME } from "../constants"
import { GetFactionsAll } from "../fetching"
import { useToggle } from "../hooks"
import { FactionsAll } from "../types"
import { useWS } from "./ws/useWS"

export const SupremacyContainer = createContainer(() => {
    const { newSnackbarMessage } = useSnackbar()
    const { state, isReconnecting, isServerDown } = useWS({
        URI: "/public/online",
        host: GAME_SERVER_HOSTNAME,
    })
    const [serverConnectedBefore, setServerConnectedBefore] = useState(false)
    const [haveSups, toggleHaveSups] = useState<boolean>() // Needs 3 states: true, false, undefined. Undefined means it's not loaded yet.
    const [factionsAll, setFactionsAll] = useState<FactionsAll>({})
    const [battleIdentifier, setBattleIdentifier] = useState<number>()
    const [isQuickDeployOpen, toggleIsQuickDeployOpen] = useToggle(localStorage.getItem("quickDeployOpen") === "true")
    const [isQuickPlayerAbilitiesOpen, toggleIsQuickPlayerAbilitiesOpen] = useToggle(localStorage.getItem("quickPlayerAbilitiesOpen") === "true")

    const { query: queryGetFactionsAll } = useParameterizedQuery(GetFactionsAll)

    useEffect(() => {
        setServerConnectedBefore((prev) => {
            if (state === WebSocket.OPEN && !prev) return true
            return prev
        })
    }, [state])

    // Get main color of each factions
    useEffect(() => {
        ;(async () => {
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
    }, [newSnackbarMessage, queryGetFactionsAll])

    const getFaction = useCallback(
        (factionID: string) => {
            return factionsAll[factionID] || FallbackFaction
        },
        [factionsAll],
    )

    useEffect(() => {
        localStorage.setItem("quickDeployOpen", isQuickDeployOpen.toString())
    }, [isQuickDeployOpen])

    useEffect(() => {
        localStorage.setItem("quickPlayerAbilitiesOpen", isQuickPlayerAbilitiesOpen.toString())
    }, [isQuickPlayerAbilitiesOpen])

    return {
        serverConnectedBefore,
        isReconnecting,
        isServerDown,

        factionsAll,
        getFaction,
        battleIdentifier,
        setBattleIdentifier,
        haveSups,
        toggleHaveSups,

        isQuickDeployOpen,
        toggleIsQuickDeployOpen,

        isQuickPlayerAbilitiesOpen,
        toggleIsQuickPlayerAbilitiesOpen,
    }
})

export const SupremacyProvider = SupremacyContainer.Provider
export const useSupremacy = SupremacyContainer.useContainer
