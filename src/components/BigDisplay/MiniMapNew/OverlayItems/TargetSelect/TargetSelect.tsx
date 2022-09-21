import React, { useCallback, useEffect, useRef, useState } from "react"
import { MapSelection, useGlobalNotifications, useMiniMapPixi, WinnerStruct } from "../../../../../containers"
import { BlueprintPlayerAbility, GameAbility, LocationSelectType, PlayerAbility } from "../../../../../types"
import { PixiTargetSelect } from "./pixiTargetSelect"

interface TargetHintAbility {
    ability: GameAbility | BlueprintPlayerAbility
    endTime?: Date
    cancelable?: boolean
}

export const TargetHint = React.memo(function TargetHint() {
    const { onAbilityUseCallbacks } = useMiniMapPixi()
    const [targetHintAbility, setTargetHintAbility] = useState<TargetHintAbility>()
    const isTargetingWinner = useRef(false)

    useEffect(() => {
        onAbilityUseCallbacks.current["target-hint"] = (wn: WinnerStruct | undefined, pa: PlayerAbility | undefined) => {
            if (wn) {
                const newTha = {
                    ability: wn.game_ability,
                    endTime: wn.end_time,
                    cancelable: false,
                }

                // If we are transitioning from player ability to winner, then do a X second gap
                if (pa && !isTargetingWinner.current) {
                    setTargetHintAbility(undefined)

                    setTimeout(() => {
                        setTargetHintAbility(newTha)
                        isTargetingWinner.current = true
                    }, 1000)
                } else {
                    setTargetHintAbility(newTha)
                    isTargetingWinner.current = true
                }
            } else if (pa) {
                setTargetHintAbility({
                    ability: pa.ability,
                    cancelable: true,
                })
                isTargetingWinner.current = false
            } else {
                setTargetHintAbility(undefined)
                isTargetingWinner.current = false
            }
        }
    }, [onAbilityUseCallbacks])

    if (targetHintAbility) {
        const { ability, endTime, cancelable } = targetHintAbility
        return <TargetHintInner key={`target-hint-${ability.id}-${endTime?.toDateString()}`} ability={ability} endTime={endTime} cancelable={cancelable} />
    }

    return null
})

const propsAreEqual = (prevProps: TargetHintAbility, nextProps: TargetHintAbility) => {
    return prevProps.endTime === nextProps.endTime && prevProps.cancelable === nextProps.cancelable && prevProps.ability.id === nextProps.ability.id
}

const TargetHintInner = React.memo(function TargetHintInner({ ability, endTime, cancelable }: TargetHintAbility) {
    const { newSnackbarMessage } = useGlobalNotifications()
    const {
        pixiMainItems,
        mapMousePosition,
        gridSizeRef,
        onSelectMapPositionCallbacks,
        gridCellToViewportPosition,
        usePlayerAbility,
        useWinner,
        selectMapPosition,
    } = useMiniMapPixi()
    const [pixiTargetHint, setPixiTargetHint] = useState<PixiTargetSelect>()

    const onCountdownExpired = useCallback(() => {
        newSnackbarMessage("Failed to submit target location on time.", "error")
        useWinner.current(undefined)
    }, [newSnackbarMessage, useWinner])

    const onCancel = useCallback(() => {
        usePlayerAbility.current(undefined)
    }, [usePlayerAbility])

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMainItems) return
        const pixiTargetHint = new PixiTargetSelect(
            pixiMainItems.viewport,
            mapMousePosition,
            gridSizeRef,
            ability,
            endTime,
            onCountdownExpired,
            cancelable ? onCancel : undefined,
        )
        pixiMainItems.viewport.addChild(pixiTargetHint.viewportRoot)
        pixiMainItems.app.stage.addChild(pixiTargetHint.stageRoot)
        setPixiTargetHint((prev) => {
            prev?.destroy()
            return pixiTargetHint
        })
    }, [ability, endTime, pixiMainItems, mapMousePosition, gridSizeRef, onCountdownExpired, onCancel, cancelable])

    // Cleanup
    useEffect(() => {
        return () => {
            pixiTargetHint?.destroy()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiTargetHint])

    // If ability has an end time and selection is placed, hide the icon
    useEffect(() => {
        if (!pixiTargetHint) return

        onSelectMapPositionCallbacks.current["target-hint-inner"] = (mapPos: MapSelection | undefined) => {
            const abilityType = ability.location_select_type
            const isLocationSelection = abilityType === LocationSelectType.LocationSelect || abilityType === LocationSelectType.MechCommand
            const isLineSelection = abilityType === LocationSelectType.LineSelect

            // If ability is not a map select type, ignore
            if (!isLocationSelection && !isLineSelection) {
                pixiTargetHint.setStartCoord(undefined)
                pixiTargetHint.setEndCoord(undefined)
                return
            }

            if ((isLocationSelection || isLineSelection) && mapPos?.startCoords) {
                const pos = gridCellToViewportPosition.current(mapPos.startCoords.x, mapPos.startCoords.y)
                pixiTargetHint.setStartCoord(pos, () => selectMapPosition.current({ ...mapPos, startCoords: undefined }))
            } else {
                pixiTargetHint.setStartCoord(undefined)
            }

            if (isLineSelection && mapPos?.endCoords) {
                const pos = gridCellToViewportPosition.current(mapPos.endCoords.x, mapPos.endCoords.y)
                pixiTargetHint.setEndCoord(pos, () => selectMapPosition.current({ ...mapPos, endCoords: undefined }))
            } else {
                pixiTargetHint.setEndCoord(undefined)
            }

            // pixiTargetHint.showIcon(!mapPos?.startCoords)
        }
    }, [ability.location_select_type, endTime, gridCellToViewportPosition, onSelectMapPositionCallbacks, pixiTargetHint, selectMapPosition])

    return null
}, propsAreEqual)
