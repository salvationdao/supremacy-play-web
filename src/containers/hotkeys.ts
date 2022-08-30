import { useCallback, useEffect, useRef } from "react"
import { createContainer } from "unstated-next"

type hotkey = { [key: string]: () => void }

export enum RecordType {
    Global = "GLOBAL",
    CtrlMap = "CTRL_MAP",
    Map = "MAP",
}

// Keys reserved for mech abilities
export const MECH_ABILITY_KEY = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]

export const HotkeyContainer = createContainer(() => {
    const hotkeyRecord = useRef<hotkey>({})
    const globalHotkeyRecord = useRef<hotkey>({})
    const controlHotkeyRecord = useRef<hotkey>({})

    const addToHotkeyRecord = useCallback(
        (recordType: RecordType, key: string, value: () => void) => {
            //keys often come from the index, return if it is more than 10
            const numKey = parseInt(key)

            if (numKey && numKey > 10) {
                console.error("Cannot create key more than keyboard number value.")
            }

            if (numKey === 10) {
                key = "0"
            }

            let record = hotkeyRecord
            switch (recordType) {
                //if global set to specific global record
                case RecordType.Global:
                    record = globalHotkeyRecord
                    break
                //if modifying the shortcut with [Ctrl + int] set it to specified CTRL record
                case RecordType.CtrlMap:
                    record = controlHotkeyRecord
                    break
                case RecordType.Map:
                    record = hotkeyRecord
                    break
                default:
                    break
            }

            record.current = { ...record.current, [key]: value }
        },
        [hotkeyRecord, controlHotkeyRecord, globalHotkeyRecord],
    )

    const handleHotKey = useCallback(
        (e) => {
            e.stopPropagation()
            e.preventDefault()

            let handlePress = hotkeyRecord.current[e.key]
            if (e.ctrlKey) {
                handlePress = controlHotkeyRecord.current[e.key]
            }

            handlePress && handlePress()
        },
        [hotkeyRecord, controlHotkeyRecord],
    )

    const handleGlobalHotKey = useCallback(
        (e) => {
            e.stopPropagation()
            e.preventDefault()

            const handlePress = globalHotkeyRecord.current[e.key]
            handlePress && handlePress()
        },
        [globalHotkeyRecord],
    )

    useEffect(() => {
        document.addEventListener("keydown", handleGlobalHotKey)
        return () => document.removeEventListener("keydown", handleGlobalHotKey)
    }, [handleGlobalHotKey])

    return {
        addToHotkeyRecord,
        handleHotKey,
    }
})

export const HotkeyProvider = HotkeyContainer.Provider
export const useHotkey = HotkeyContainer.useContainer
