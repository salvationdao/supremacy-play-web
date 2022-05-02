import { useState, useEffect } from "react"
import { createContainer } from "unstated-next"
import { FactionsAll, usePassportServerWebsocket, useSnackbar } from "."
import { PassportServerKeys } from "../keys"
import { FactionGeneralData } from "../types/passport"

export const SupremacyContainer = createContainer(() => {
    const { newSnackbarMessage } = useSnackbar()
    const { state, send } = usePassportServerWebsocket()
    const [factionsAll, setFactionsAll] = useState<FactionsAll>({})
    const [battleIdentifier, setBattleIdentifier] = useState<number>()
    const [haveSups, toggleHaveSups] = useState<boolean>()

    // Get main color of each factions
    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        ;(async () => {
            try {
                const resp = await send<FactionGeneralData[]>(PassportServerKeys.GetFactionsAll)
                if (resp) {
                    const currentData = {} as FactionsAll
                    resp.forEach((f) => {
                        currentData[f.id] = f
                    })
                    setFactionsAll(currentData)
                }
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to retrieve syndicate data.", "error")
                console.debug(e)
                return false
            }
        })()
    }, [newSnackbarMessage, send, state])

    return { factionsAll, battleIdentifier, setBattleIdentifier, haveSups, toggleHaveSups }
})

export const SupremacyProvider = SupremacyContainer.Provider
export const useSupremacy = SupremacyContainer.useContainer
