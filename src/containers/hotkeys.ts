import { useCallback, useEffect, useRef } from "react"
import { createContainer } from "unstated-next"

type hotkey = { [key: string]: () => void }

export enum RecordType {
    Global = "GLOBAL",
    MiniMapCtrl = "CTRL_MAP",
    MiniMap = "MAP",
}

// Keys reserved for mech abilities
export const MECH_ABILITY_KEY = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]

export const HotkeyContainer = createContainer(() => {
    const globalHotkeyRecord = useRef<hotkey>({}) // Works globally
    const miniMapHotkeyRecord = useRef<hotkey>({}) // Works when focused on minimap
    const miniMapControlHotkeyRecord = useRef<hotkey>({}) // Works when focused on minimap with ctrl

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

            let record = miniMapHotkeyRecord
            switch (recordType) {
                //if global set to specific global record
                case RecordType.Global:
                    record = globalHotkeyRecord
                    break
                //if modifying the shortcut with [Ctrl + int] set it to specified CTRL record
                case RecordType.MiniMapCtrl:
                    record = miniMapControlHotkeyRecord
                    break
                case RecordType.MiniMap:
                    record = miniMapHotkeyRecord
                    break
                default:
                    break
            }

            record.current = { ...record.current, [key]: value }
        },
        [miniMapHotkeyRecord, miniMapControlHotkeyRecord, globalHotkeyRecord],
    )

    const handleMiniMapHotKey = useCallback(
        (e) => {
            e.stopPropagation()
            e.preventDefault()

            let handlePress = miniMapHotkeyRecord.current[e.key]
            if (e.ctrlKey) {
                handlePress = miniMapControlHotkeyRecord.current[e.key]
            }

            handlePress && handlePress()
        },
        [miniMapHotkeyRecord, miniMapControlHotkeyRecord],
    )

    const handleGlobalHotKey = useCallback(
        (e) => {
            const handlePress = globalHotkeyRecord.current[e.key]
            if (handlePress) {
                e.stopPropagation()
                e.preventDefault()
                handlePress()
            }
        },
        [globalHotkeyRecord],
    )

    useEffect(() => {
        document.addEventListener("keydown", handleGlobalHotKey)
        return () => document.removeEventListener("keydown", handleGlobalHotKey)
    }, [handleGlobalHotKey])

    return {
        addToHotkeyRecord,
        handleMiniMapHotKey,
    }
})

export const HotkeyProvider = HotkeyContainer.Provider
export const useHotkey = HotkeyContainer.useContainer
