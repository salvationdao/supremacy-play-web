import React, { useCallback, useEffect, useRef, useState } from "react"
import { Crosshair } from "../../../../../assets"
import { MapSelection, useGame, useMiniMapPixi } from "../../../../../containers"
import { AnyAbility, LocationSelectType, MechMoveCommandAbility, Position } from "../../../../../types"
import { PixiMapTargetSelect } from "./pixiMapTargetSelect"

interface MapTargetHintAbility {
    anyAbility: AnyAbility
    endTime?: Date
    cancelable?: boolean
}

export const MapTargetSelect = React.memo(function TargetHint() {
    const { onAnyAbilityUseCallbacks } = useMiniMapPixi()
    const [targetHintAbility, setTargetHintAbility] = useState<MapTargetHintAbility>()

    useEffect(() => {
        onAnyAbilityUseCallbacks.current["target-hint"] = (aa: AnyAbility | undefined) => {
            if (aa) {
                setTargetHintAbility({
                    anyAbility: aa,
                    cancelable: true,
                })
            } else {
                setTargetHintAbility(undefined)
            }
        }
    }, [onAnyAbilityUseCallbacks])

    if (targetHintAbility) {
        const { anyAbility, endTime, cancelable } = targetHintAbility
        return (
            <TargetHintInner
                key={`target-hint-${anyAbility.id}-${endTime?.toDateString()}`}
                anyAbility={anyAbility}
                endTime={endTime}
                cancelable={cancelable}
            />
        )
    }

    return null
})

const propsAreEqual = (prevProps: MapTargetHintAbility, nextProps: MapTargetHintAbility) => {
    return prevProps.endTime === nextProps.endTime && prevProps.cancelable === nextProps.cancelable && prevProps.anyAbility.id === nextProps.anyAbility.id
}

const TargetHintInner = React.memo(function TargetHintInner({ anyAbility, endTime, cancelable }: MapTargetHintAbility) {
    const {
        pixiMiniMapPixi,
        mapMousePosition,
        gridSizeRef,
        onSelectMapPositionCallbacks,
        gridCellToViewportPosition,
        useAnyAbility,
        selectMapPosition,
        onTargetConfirm,
        mapItemMinSize,
    } = useMiniMapPixi()
    const { abilityDetails } = useGame()
    const [pixiTargetHint, setPixiTargetHint] = useState<PixiMapTargetSelect>()
    const selectedStartCoord = useRef<Position>()
    const selectedEndCoord = useRef<Position>()

    const onCancel = useCallback(() => {
        useAnyAbility.current(undefined)
    }, [useAnyAbility])

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMiniMapPixi) return

        const pixiTargetHint = new PixiMapTargetSelect(
            pixiMiniMapPixi.viewport,
            mapMousePosition,
            gridSizeRef,
            anyAbility,
            endTime,
            undefined,
            cancelable ? onCancel : undefined,
            mapItemMinSize,
        )
        pixiMiniMapPixi.viewport.addChild(pixiTargetHint.viewportRoot)
        pixiMiniMapPixi.app.stage.addChild(pixiTargetHint.stageRoot)
        setPixiTargetHint((prev) => {
            prev?.destroy()
            return pixiTargetHint
        })
    }, [anyAbility, endTime, pixiMiniMapPixi, mapMousePosition, gridSizeRef, onCancel, cancelable, mapItemMinSize])

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
        const abilityDetail = typeof anyAbility?.game_client_ability_id !== "undefined" ? abilityDetails[anyAbility.game_client_ability_id] : undefined
        pixiTargetHint.updateAbilityDetail(abilityDetail)
    }, [anyAbility.game_client_ability_id, abilityDetails, pixiTargetHint])

    useEffect(() => {
        if (!pixiTargetHint) return

        onSelectMapPositionCallbacks.current["target-hint-inner"] = (mapPos: MapSelection | undefined) => {
            const locationSelectType = anyAbility.location_select_type
            const isLocationSelection = locationSelectType === LocationSelectType.LocationSelect || locationSelectType === LocationSelectType.MechCommand
            const isLineSelection = locationSelectType === LocationSelectType.LineSelect

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
                        locationSelectType === LocationSelectType.MechCommand ||
                        anyAbility.game_client_ability_id === MechMoveCommandAbility.game_client_ability_id
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
            if (locationSelectType !== LocationSelectType.MechCommand) {
                if (isLocationSelection) {
                    pixiTargetHint.mouseIcon.showIcon(!selectedStartCoord.current)
                } else if (isLineSelection) {
                    pixiTargetHint.mouseIcon.showIcon(!selectedStartCoord.current || !selectedEndCoord.current)
                }
            }

            return () => {
                const cb = onSelectMapPositionCallbacks
                delete cb.current["target-hint-inner"]
            }
        }
    }, [anyAbility.game_client_ability_id, anyAbility.location_select_type, endTime, gridCellToViewportPosition, onSelectMapPositionCallbacks, pixiTargetHint, selectMapPosition])

    return null
}, propsAreEqual)
