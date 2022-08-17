import { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useOverlayToggles } from "./overlayToggles"

//todo: Player Abilities hotkeys and custom hotkey maps

export const HotkeyContainer = createContainer(() => {
    //records
    type hotkey = { [key: string]: () => void }
    type recordType = "global" | "ctrl_map" | "map"
    const [hotkeyRecord, setHotkeyRecord] = useState<hotkey>({})
    const [controlHotkeyRecord, setControlHotkeyRecord] = useState<hotkey>({})
    const [globalHotkeyRecord, setGlobalHotkeyRecord] = useState<hotkey>({})

    const { toggleIsMapOpen } = useOverlayToggles()

    //keys reserved for mech abilities
    const mechAbilityKey = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]

    const addToHotkeyRecord = useCallback(
        (recordType: recordType, key: string, value: () => void) => {
            //keys often come from the index, return if it is more than 10
            const numKey = parseInt(key)
            if (numKey && numKey > 10) {
                console.error("Cannot create key more than keyboard number value")
            }
            if (numKey === 10) {
                key = "0"
            }

            let setRecord = setHotkeyRecord
            let record = hotkeyRecord
            switch (recordType) {
                //if global set to specific global record
                case "global":
                    setRecord = setGlobalHotkeyRecord
                    record = globalHotkeyRecord
                    break
                //if modifying the shortcut with [Ctrl + int] set it to specified CTRL record
                case "ctrl_map":
                    setRecord = setControlHotkeyRecord
                    record = controlHotkeyRecord
                    break
                default:
                    break
            }

            //if already exists, update and return
            if (record[key]) {
                record[key] = value
                return
            }

            //else create record
            setRecord((prev) => {
                return { ...prev, [key]: value }
            })
        },
        [hotkeyRecord, setHotkeyRecord, controlHotkeyRecord, setControlHotkeyRecord, globalHotkeyRecord, setGlobalHotkeyRecord],
    )

    const handleHotKey = useCallback(
        (e) => {
            e.preventDefault()

            let handlePress = hotkeyRecord[e.key]
            if (e.ctrlKey) {
                handlePress = controlHotkeyRecord[e.key]
            }

            if (!handlePress) return

            handlePress()
        },
        [hotkeyRecord, controlHotkeyRecord],
    )

    const handleGlobalHotKey = useCallback(
        (e) => {
            const handlePress = globalHotkeyRecord[e.key]
            if (!handlePress) return

            e.preventDefault()
            handlePress()
        },
        [globalHotkeyRecord],
    )

    useEffect(() => {
        document.addEventListener("keydown", handleGlobalHotKey)
        return () => document.removeEventListener("keydown", handleGlobalHotKey)
    }, [handleGlobalHotKey])

    useEffect(() => {
        addToHotkeyRecord("global", "m", toggleIsMapOpen)
    }, [addToHotkeyRecord])

    return {
        mechAbilityKey,
        addToHotkeyRecord,
        handleHotKey,
    }
})

export const HotkeyProvider = HotkeyContainer.Provider
export const useHotkey = HotkeyContainer.useContainer
