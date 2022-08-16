import { useCallback, useState } from "react"
import { createContainer } from "unstated-next"

//todo: Player Abilities hotkeys and custom hotkey maps

export const HotkeyContainer = createContainer(() => {
    //records
    type hotkey = { [key: string]: () => void }
    const [hotkeyRecord, setHotkeyRecord] = useState<hotkey>({})
    const [controlHotkeyRecord, setControlHotkeyRecord] = useState<hotkey>({})

    //keys reserved for mech abilities
    const mechAbilityKey = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]

    const addToHotkeyRecord = useCallback(
        (isControlModified: boolean, key: string, value: () => void) => {
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
            //if modifying the shortcut with [Ctrl + int] set it to specified CTRL record
            if (isControlModified) {
                setRecord = setControlHotkeyRecord
                record = controlHotkeyRecord
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
        [hotkeyRecord, setHotkeyRecord, controlHotkeyRecord, setControlHotkeyRecord],
    )

    const handleHotKey = useCallback(
        (e) => {
            e.preventDefault()
            console.log(e.key, hotkeyRecord)

            let handlePress = hotkeyRecord[e.key]
            if (e.ctrlKey) {
                handlePress = controlHotkeyRecord[e.key]
            }

            if (!handlePress) return

            handlePress()
        },
        [hotkeyRecord, controlHotkeyRecord],
    )

    return {
        mechAbilityKey,
        addToHotkeyRecord,
        handleHotKey,
    }
})

export const HotkeyProvider = HotkeyContainer.Provider
export const useHotkey = HotkeyContainer.useContainer
