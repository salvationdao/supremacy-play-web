import { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { PlayerAbility } from "../types"

//todo: Player Abilities hotkeys and custom hotkey maps

export const HotkeyContainer = createContainer(() => {
    //ability hot keys
    const [shownPlayerAbilities, setShownPlayerAbilities] = useState<PlayerAbility[]>([])

    //records
    type hotkey = { [key: string]: () => void }
    const [hotkeyRecord, setHotkeyRecord] = useState<hotkey>({})
    const [controlHotkeyRecord, setControlHotkeyRecord] = useState<hotkey>({})

    //keys reserved for mech abilities
    const mechAbilityKey = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]

    const addToHotkeyRecord = useCallback(
        (isControlModified: boolean, key: string, value: () => void) => {
            //if already exists, update and return
            let setRecord = setHotkeyRecord
            let record = hotkeyRecord
            if (isControlModified) {
                setRecord = setControlHotkeyRecord
                record = controlHotkeyRecord
            }

            console.log("hit")
            if (record[key]) {
                record[key] = value
                return
            }

            setRecord((prev) => {
                return { ...prev, [key]: value }
            })
        },
        [hotkeyRecord, setHotkeyRecord, controlHotkeyRecord, setControlHotkeyRecord],
    )

    useEffect(() => {
        console.log("hkr", hotkeyRecord)
        console.log("chkr", controlHotkeyRecord)
    }, [hotkeyRecord, controlHotkeyRecord])

    const handleHotKey = useCallback(
        (e: KeyboardEvent) => {
            e.preventDefault()

            //int = highlight faction mech
            // const key = parseInt(e.key)
            // if (key) {
            //     //select mini mechs
            //     if (e.ctrlKey) {
            //         const mmID = key + addMiniMechParticipantId
            //         const mmIndex = ownedMiniMechs.findIndex((w) => w.participantID === mmID)
            //         if (mmIndex === -1) return
            //         setHighlightedMechParticipantID(mmID)
            //         return
            //     }
            //     if (key > factionWarMachines.length) return
            //     setHighlightedMechParticipantID(factionWarMachines[key - 1]?.participantID)
            //     return
            // }
            //
            // //mech commander functions
            // if (highlightedMechParticipantID) {
            //     const w =
            //         highlightedMechParticipantID < addMiniMechParticipantId
            //             ? factionWarMachines.find((w) => w.ownedByID === user.id && w.participantID === highlightedMechParticipantID)
            //             : ownedMiniMechs.find((w) => w.ownedByID === user.id && w.participantID === highlightedMechParticipantID)
            //
            //     if (!w || e.ctrlKey) return

            let handlePress = hotkeyRecord[e.key]
            if (e.ctrlKey) {
                console.log(controlHotkeyRecord)
                handlePress = controlHotkeyRecord[e.key]
            }

            if (!handlePress) return

            handlePress()
        },
        [hotkeyRecord, controlHotkeyRecord],
    )
    useEffect(() => {
        document.addEventListener("keydown", handleHotKey)
        return () => document.removeEventListener("keydown", handleHotKey)
    }, [handleHotKey])

    return {
        shownPlayerAbilities,
        setShownPlayerAbilities,
        mechAbilityKey,
        addToHotkeyRecord,
    }
})

export const HotkeyProvider = HotkeyContainer.Provider
export const useHotkey = HotkeyContainer.useContainer
