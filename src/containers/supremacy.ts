import { useState, useEffect, useCallback } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { createContainer } from "unstated-next"
import { FallbackFaction, useSnackbar } from "."
import { GAME_SERVER_HOSTNAME } from "../constants"
import { GetFactionsAll } from "../fetching"
import { FactionsAll } from "../types"
import { useWS } from "./ws/useWS"

export const SupremacyContainer = createContainer(() => {
    const { newSnackbarMessage } = useSnackbar()
    const { state } = useWS({
        URI: "/public/online",
        host: GAME_SERVER_HOSTNAME,
    })
    const [isServerUp, toggleIsServerUp] = useState<boolean | undefined>(undefined) // Needs 3 states: true, false, undefined. Undefined means it's not loaded yet.
    const [haveSups, toggleHaveSups] = useState<boolean>() // Needs 3 states: true, false, undefined. Undefined means it's not loaded yet.
    const [factionsAll, setFactionsAll] = useState<FactionsAll>({})
    const [battleIdentifier, setBattleIdentifier] = useState<number>()

    const { query: queryGetFactionsAll } = useParameterizedQuery(GetFactionsAll)

    // Listens on the server status
    useEffect(() => {
        toggleIsServerUp(state === WebSocket.OPEN)
    }, [state, toggleIsServerUp])

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
                newSnackbarMessage(typeof e === "string" ? e : "Failed to retrieve syndicate data.", "error")
                console.debug(e)
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

    return { isServerUp, factionsAll, getFaction, battleIdentifier, setBattleIdentifier, haveSups, toggleHaveSups }
})

export const SupremacyProvider = SupremacyContainer.Provider
export const useSupremacy = SupremacyContainer.useContainer
