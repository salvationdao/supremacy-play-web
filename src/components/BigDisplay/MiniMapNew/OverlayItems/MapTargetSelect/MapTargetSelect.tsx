import React, { useCallback, useEffect, useRef, useState } from "react"
import { Crosshair } from "../../../../../assets"
import { MapSelection, useGame, useMiniMapPixi } from "../../../../../containers"
import { BlueprintPlayerAbility, GameAbility, LocationSelectType, MechMoveCommandAbility, PlayerAbility, Position } from "../../../../../types"
import { PixiMapTargetSelect } from "./pixiMapTargetSelect"
import { PlayerSupporterAbility } from "../../../../LeftDrawer/BattleArena/BattleAbility/SupporterAbilities"

interface MapTargetHintAbility {
    ability: GameAbility | BlueprintPlayerAbility | PlayerSupporterAbility
    endTime?: Date
    cancelable?: boolean
}

export const MapTargetSelect = React.memo(function TargetHint() {
    const { onAbilityUseCallbacks } = useMiniMapPixi()
    const [targetHintAbility, setTargetHintAbility] = useState<MapTargetHintAbility>()

    useEffect(() => {
        onAbilityUseCallbacks.current["target-hint"] = (pa: PlayerAbility | undefined, sa: PlayerSupporterAbility | undefined) => {
            if (sa) {
                setTargetHintAbility({
                    ability: sa,
                    cancelable: true,
                })
            } else if (pa) {
                setTargetHintAbility({
                    ability: pa.ability,
                    cancelable: true,
                })
            } else {
                setTargetHintAbility(undefined)
            }
        }
    }, [onAbilityUseCallbacks])

    if (targetHintAbility) {
        const { ability, endTime, cancelable } = targetHintAbility
        return <TargetHintInner key={`target-hint-${ability.id}-${endTime?.toDateString()}`} ability={ability} endTime={endTime} cancelable={cancelable} />
    }

    return null
})

const propsAreEqual = (prevProps: MapTargetHintAbility, nextProps: MapTargetHintAbility) => {
    return prevProps.endTime === nextProps.endTime && prevProps.cancelable === nextProps.cancelable && prevProps.ability.id === nextProps.ability.id
}

const TargetHintInner = React.memo(function TargetHintInner({ ability, endTime, cancelable }: MapTargetHintAbility) {
    const {
        pixiMainItems,
        mapMousePosition,
        gridSizeRef,
        onSelectMapPositionCallbacks,
        gridCellToViewportPosition,
        usePlayerAbility,
        useSupportAbility,
        selectMapPosition,
        onTargetConfirm,
        mapItemMinSize,
    } = useMiniMapPixi()
    const { abilityDetails } = useGame()
    const [pixiTargetHint, setPixiTargetHint] = useState<PixiMapTargetSelect>()
    const selectedStartCoord = useRef<Position>()
    const selectedEndCoord = useRef<Position>()

    const onCancel = useCallback(() => {
        usePlayerAbility.current(undefined)
        useSupportAbility.current(undefined)
    }, [usePlayerAbility, useSupportAbility])

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMainItems) return

        const pixiTargetHint = new PixiMapTargetSelect(
            pixiMainItems.viewport,
            mapMousePosition,
            gridSizeRef,
            ability,
            endTime,
            cancelable ? onCancel : undefined,
            mapItemMinSize,
        )
        pixiMainItems.viewport.addChild(pixiTargetHint.viewportRoot)
        pixiMainItems.app.stage.addChild(pixiTargetHint.stageRoot)
        setPixiTargetHint((prev) => {
            prev?.destroy()
            return pixiTargetHint
        })
    }, [ability, endTime, pixiMainItems, mapMousePosition, gridSizeRef, onCancel, cancelable, mapItemMinSize])

    // Cleanup
    useEffect(() => {
        return () => {
            pixiTargetHint?.destroy()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiTargetHint])

    // Hide the mouse cursor
    useEffect(() => {
        // Focus on the minimap and hide mouse cursor
        document.getElementById("mini-map")?.focus()
        const pixiMapEl = document.getElementById("minimap-pixi-container")
        if (pixiMapEl) {
            pixiMapEl.style.cursor = `url(${Crosshair}) 5 5, auto`
        }

        return () => {
            const pixiMapEl = document.getElementById("minimap-pixi-container")
            if (pixiMapEl) pixiMapEl.style.cursor = "auto"
        }
    }, [])

    // Update the onTargetConfirm function within
    useEffect(() => {
        if (!pixiTargetHint) return
        pixiTargetHint.onTargetConfirm = onTargetConfirm
    }, [onTargetConfirm, pixiTargetHint])

    // Update pixi's abilityDetails array
    useEffect(() => {
        if (!pixiTargetHint) return
        const abilityDetail = typeof ability?.game_client_ability_id !== "undefined" ? abilityDetails[ability.game_client_ability_id] : undefined
        pixiTargetHint.updateAbilityDetail(abilityDetail)
    }, [ability.game_client_ability_id, abilityDetails, pixiTargetHint])

    useEffect(() => {
        if (!pixiTargetHint) return

        onSelectMapPositionCallbacks.current["target-hint-inner"] = (mapPos: MapSelection | undefined) => {
            const abilityType = ability.location_select_type
            const isLocationSelection = abilityType === LocationSelectType.LocationSelect || abilityType === LocationSelectType.MechCommand
            const isLineSelection = abilityType === LocationSelectType.LineSelect

            // If ability is not a map select type, ignore
            if ((!isLocationSelection && !isLineSelection) || !mapPos?.position) {
                selectedStartCoord.current = undefined
                selectedEndCoord.current = undefined
                pixiTargetHint.setStartCoord(undefined)
                pixiTargetHint.setEndCoord(undefined)
                pixiTargetHint.resetCountdown()
                return
            }

            // if its a location selection, then just play with the start coord, end coord not needed
            if (isLocationSelection) {
                selectedStartCoord.current = mapPos.position
                selectedEndCoord.current = undefined
                const pos = gridCellToViewportPosition.current(mapPos.position.x, mapPos.position.y)
                pixiTargetHint.setStartCoord(pos, () => {
                    selectedStartCoord.current = undefined
                    pixiTargetHint.setStartCoord(undefined)
                    pixiTargetHint.resetCountdown()
                })

                // Start / stop countdown
                if (selectedStartCoord.current) {
                    // For mech commands/mini mech commands, dont countdown, and dont destroy pixi object when confirmed, keep going
                    if (
                        ability.location_select_type === LocationSelectType.MechCommand ||
                        ability.game_client_ability_id === MechMoveCommandAbility.ability.game_client_ability_id
                    ) {
                        pixiTargetHint.startCountdown(0, 3, false, false)
                    } else {
                        pixiTargetHint.startCountdown()
                    }
                } else {
                    pixiTargetHint.resetCountdown()
                }
            }

            // If its line select, then handle start and end coord accordingly
            if (isLineSelection) {
                const pos = gridCellToViewportPosition.current(mapPos.position.x, mapPos.position.y)

                if (!selectedStartCoord.current) {
                    selectedStartCoord.current = mapPos.position
                    pixiTargetHint.setStartCoord(pos, () => {
                        selectedStartCoord.current = undefined
                        pixiTargetHint.setStartCoord(undefined)
                        pixiTargetHint.resetCountdown()
                    })
                } else {
                    selectedEndCoord.current = mapPos.position
                    pixiTargetHint.setEndCoord(pos, () => {
                        selectedEndCoord.current = undefined
                        pixiTargetHint.setEndCoord(undefined)
                        pixiTargetHint.resetCountdown()
                    })
                }

                // Start / stop countdown
                if (selectedStartCoord.current && selectedEndCoord.current) {
                    pixiTargetHint.startCountdown()
                } else {
                    pixiTargetHint.resetCountdown()
                }
            }

            // If ability selection is placed, hide the mouse icon
            if (ability.location_select_type !== LocationSelectType.MechCommand) {
                if (isLocationSelection) {
                    pixiTargetHint.mouseIcon.showIcon(!selectedStartCoord.current)
                } else if (isLineSelection) {
                    pixiTargetHint.mouseIcon.showIcon(!selectedStartCoord.current || !selectedEndCoord.current)
                }
            }
        }
    }, [ability.game_client_ability_id, ability.location_select_type, endTime, gridCellToViewportPosition, onSelectMapPositionCallbacks, pixiTargetHint, selectMapPosition])

    return null
}, propsAreEqual)
