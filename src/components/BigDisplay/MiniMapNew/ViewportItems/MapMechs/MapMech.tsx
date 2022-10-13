import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ADD_MINI_MECH_PARTICIPANT_ID } from "../../../../../constants"
import { MapSelection, useArena, useAuth, useGame, useMiniMapPixi, useSupremacy, WinnerStruct } from "../../../../../containers"
import { RecordType, useHotkey } from "../../../../../containers/hotkeys"
import { closestAngle, deg2rad } from "../../../../../helpers"
import { BinaryDataKey, useGameServerSubscription, useGameServerSubscriptionFaction } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors } from "../../../../../theme/theme"
import {
    Dimension,
    DisplayedAbility,
    LocationSelectType,
    MechDisplayEffectType,
    MechMoveCommand,
    MechMoveCommandAbility,
    PlayerAbility,
    WarMachineLiveState,
    WarMachineState,
} from "../../../../../types"
import { PixiMapMech } from "./pixiMapMech"
import { AbilityEffectParser } from "../../../../../helpers/binaryDataParsers/abilityEffectParser"
import { WarMachineStatsBinaryParser } from "../../../../../helpers/binaryDataParsers/warMachineStatsParser"

interface MapMechProps {
    warMachine: WarMachineState
    label: number
    isAI?: boolean
}

const propsAreEqual = (prevProps: MapMechProps, nextProps: MapMechProps) => {
    return prevProps.warMachine.id === nextProps.warMachine.id && prevProps.label === nextProps.label && prevProps.isAI === nextProps.isAI
}

export const MapMech = React.memo(function MapMech({ warMachine, label, isAI }: MapMechProps) {
    const { map } = useGame()
    const { userID, factionID } = useAuth()
    const { currentArenaID } = useArena()
    const { getFaction, isWindowFocused } = useSupremacy()
    const { addToHotkeyRecord } = useHotkey()
    const {
        pixiMiniMapPixi,
        gridSizeRef,
        clientPositionToViewportPosition,
        gridCellToViewportPosition,
        highlightedMechParticipantID,
        setHighlightedMechParticipantID,
        playerAbility,
        onTargetConfirm,
        selection,
        selectMapPosition,
        usePlayerAbility,
        onAbilityUseCallbacks,
        onSelectMapPositionCallbacks,
        mapItemMinSize,
    } = useMiniMapPixi()
    const { id, hash, participantID, factionID: warMachineFactionID, maxHealth, maxShield, ownedByID } = warMachine

    const [pixiMapMech, setPixiMapMech] = useState<PixiMapMech>()

    const iconDimension = useRef<Dimension>({ width: 5, height: 5 })
    const prevRotation = useRef(warMachine.rotation)
    const [isAlive, setIsAlive] = useState(warMachine.health > 0)
    const primaryColor = useMemo(
        () => (ownedByID === userID ? colors.gold : getFaction(warMachineFactionID).primary_color || colors.neonBlue),
        [ownedByID, userID, getFaction, warMachineFactionID],
    )

    // Mech move command related
    const mechMoveCommand = useRef<MechMoveCommand>()
    const tempMechMoveCommand = useRef<MechMoveCommand>()

    // Mech ability display
    const [abilityEffects, setAbilityEffects] = useState<DisplayedAbility[]>([])
    const abilityBorderEffect = useMemo(() => abilityEffects.find((da) => da.mech_display_effect_type === MechDisplayEffectType.Border), [abilityEffects])
    const abilityShakeEffect = useMemo(() => abilityEffects.find((da) => da.mech_display_effect_type === MechDisplayEffectType.Shake), [abilityEffects])
    const abilityPulseEffect = useMemo(() => abilityEffects.find((da) => da.mech_display_effect_type === MechDisplayEffectType.Pulse), [abilityEffects])

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMiniMapPixi) return
        const pixiMapMech = new PixiMapMech(label, hash, gridSizeRef, mapItemMinSize)
        pixiMiniMapPixi.viewport.addChild(pixiMapMech.root)
        setPixiMapMech(pixiMapMech)
    }, [hash, label, gridSizeRef, pixiMiniMapPixi, mapItemMinSize])

    // Cleanup
    useEffect(() => {
        return () => pixiMapMech?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiMapMech])

    // Update graphics
    useEffect(() => {
        if (!pixiMapMech) return

        // Set the icon dimensions
        iconDimension.current = {
            width: Math.max(gridSizeRef.current.width, mapItemMinSize.current),
            height: Math.max(gridSizeRef.current.height, mapItemMinSize.current),
        }
        // If it's a mini mech, make it look smaller
        if (isAI) {
            iconDimension.current.width *= 0.6
            iconDimension.current.height *= 0.6
        }

        pixiMapMech.updateStyles(primaryColor, iconDimension.current)
        pixiMapMech.updateHpShieldBars(iconDimension.current)
    }, [pixiMapMech, primaryColor, map, gridSizeRef, isAI, mapItemMinSize])

    // Update zIndex
    useEffect(() => {
        if (!pixiMapMech) return

        let zIndex = 4
        if (isAlive && factionID === warMachineFactionID) zIndex = 6
        if (isAlive) zIndex = 5

        pixiMapMech.updateZIndex(zIndex)
    }, [factionID, isAlive, pixiMapMech, warMachineFactionID])

    // Update the onTargetConfirm function within
    useEffect(() => {
        if (!pixiMapMech) return
        pixiMapMech.onTargetConfirm = onTargetConfirm
    }, [onTargetConfirm, pixiMapMech])

    const updateIsMechHighlighted = useCallback(() => {
        const isHighlighted = highlightedMechParticipantID === participantID || playerAbility.current?.mechHash === hash

        // Highlight the mech circle
        if (!pixiMapMech) return
        if (isHighlighted) {
            pixiMapMech.highlightMech(iconDimension.current)
        } else {
            pixiMapMech.unhighlightMech()
        }
    }, [hash, highlightedMechParticipantID, pixiMapMech, playerAbility, participantID])

    // If the mech dies and its mech is about to use player ability is active, cancel it
    useEffect(() => {
        if (!isAlive && playerAbility.current?.mechHash === hash) {
            usePlayerAbility.current(undefined)
        }
    }, [hash, isAlive, playerAbility, usePlayerAbility])

    // Handle what happens when ability is used or map location is selected
    useEffect(() => {
        onAbilityUseCallbacks.current[`map-mech-${hash}`] = (wn: WinnerStruct | undefined, pa: PlayerAbility | undefined) => {
            updateIsMechHighlighted()

            // Show the dashed line border box around mech is it can be clicked on for the ability
            let showDashedBox = false
            const ability = wn?.game_ability || pa?.ability

            if (isAlive && !abilityBorderEffect && ability) {
                const locationSelectType = ability.location_select_type
                switch (locationSelectType) {
                    case LocationSelectType.MechSelectAllied:
                        showDashedBox = factionID === warMachineFactionID
                        break
                    case LocationSelectType.MechSelectOpponent:
                        showDashedBox = factionID !== warMachineFactionID
                        break
                    case LocationSelectType.MechSelect:
                        showDashedBox = true
                        break
                    default:
                        showDashedBox = false
                }
            }

            pixiMapMech?.showDashedBox(showDashedBox)

            if (pixiMapMech) {
                // Allow clicking on mech IF not using any ability, or using ability and it related to this mech
                pixiMapMech.rootInner2.interactive =
                    !ability ||
                    ability.location_select_type === LocationSelectType.MechSelect ||
                    ability.location_select_type === LocationSelectType.MechSelectAllied ||
                    ability.location_select_type === LocationSelectType.MechSelectOpponent ||
                    (ability.location_select_type === LocationSelectType.MechCommand && pa?.mechHash === hash)
            }
        }

        onSelectMapPositionCallbacks.current[`map-mech-${hash}`] = (
            mapPos: MapSelection | undefined,
            wn: WinnerStruct | undefined,
            pa: PlayerAbility | undefined,
        ) => {
            updateIsMechHighlighted()

            // Immediately render the mech move dashed line when player selects it for fast UX
            if (!wn && pa?.ability.location_select_type === LocationSelectType.MechCommand && pa.mechHash === hash) {
                if (mapPos?.position) {
                    const mCommand: MechMoveCommand = {
                        id: "move_command",
                        mech_id: id,
                        triggered_by_id: "x",
                        cell_x: mapPos.position.x,
                        cell_y: mapPos.position.y,
                        is_moving: true,
                        remain_cooldown_seconds: 0,
                        is_mini_mech: false,
                    }
                    mechMoveCommand.current = undefined
                    tempMechMoveCommand.current = mCommand
                }
            } else {
                tempMechMoveCommand.current = undefined
            }

            // If mech is selected for ability, show it
            const ability = wn?.game_ability || pa?.ability
            if (ability && mapPos?.mechHash === hash) {
                pixiMapMech?.applyAbility(ability)
            } else {
                pixiMapMech?.unApplyAbility()
            }
        }
    }, [abilityBorderEffect, factionID, hash, id, isAlive, onAbilityUseCallbacks, onSelectMapPositionCallbacks, pixiMapMech, selection, updateIsMechHighlighted, warMachineFactionID])

    // A set time out to counter the race condition which makes the mech unhighlighted at beginning
    useEffect(() => {
        setTimeout(() => {
            updateIsMechHighlighted()
        }, 50)
    }, [updateIsMechHighlighted])

    const onMechClick = useCallback(() => {
        let alreadyApplyingAbility = false

        if (playerAbility.current && isAlive) {
            const locationSelectType = playerAbility.current?.ability.location_select_type

            if (
                (locationSelectType === LocationSelectType.MechSelectAllied && factionID === warMachineFactionID) ||
                (locationSelectType === LocationSelectType.MechSelectOpponent && factionID !== warMachineFactionID)
            ) {
                alreadyApplyingAbility = true

                if (selection.current?.mechHash === hash) {
                    selectMapPosition.current(undefined)
                } else {
                    selectMapPosition.current({ mechHash: hash })
                }
            }

            if (ownedByID !== userID) return
        }

        if (participantID === highlightedMechParticipantID) {
            setHighlightedMechParticipantID(undefined)
            tempMechMoveCommand.current = undefined
            if (!alreadyApplyingAbility) usePlayerAbility.current(undefined)
        } else {
            setHighlightedMechParticipantID(participantID)

            if (!alreadyApplyingAbility) {
                if (isAlive && ownedByID === userID) {
                    usePlayerAbility.current({
                        ...MechMoveCommandAbility,
                        mechHash: hash,
                    })
                } else {
                    usePlayerAbility.current(undefined)
                }
            }
        }
    }, [
        playerAbility,
        isAlive,
        usePlayerAbility,
        participantID,
        highlightedMechParticipantID,
        factionID,
        warMachineFactionID,
        selection,
        hash,
        selectMapPosition,
        setHighlightedMechParticipantID,
        ownedByID,
        userID,
    ])

    // Setup onclick handler
    useEffect(() => {
        if (!pixiMapMech) return

        pixiMapMech.rootInner2.removeListener("pointerup")
        pixiMapMech.rootInner2.on("pointerup", onMechClick)
    }, [onMechClick, pixiMapMech])

    // Add hotkey to select this mech
    useEffect(() => {
        if (!label) return
        if (participantID > ADD_MINI_MECH_PARTICIPANT_ID) {
            addToHotkeyRecord(RecordType.MiniMapCtrl, label.toString(), onMechClick)
            return
        }
        addToHotkeyRecord(RecordType.MiniMap, label.toString(), onMechClick)
    }, [onMechClick, label, participantID, addToHotkeyRecord, factionID, warMachineFactionID])

    // Display or stop displaying abilities applied to the mech
    useEffect(() => {
        if (!pixiMapMech) return
        pixiMapMech.borderEffect(abilityBorderEffect)
        pixiMapMech.shakeEffect(abilityShakeEffect)
        pixiMapMech.pulseEffect(abilityPulseEffect)
    }, [abilityBorderEffect, abilityShakeEffect, abilityPulseEffect, pixiMapMech])

    useGameServerSubscription<WarMachineLiveState[]>(
        {
            URI: `/public/arena/${currentArenaID}/mech_stats`,
            binaryKey: BinaryDataKey.WarMachineStats,
            binaryParser: WarMachineStatsBinaryParser,
            ready: !!currentArenaID,
        },
        (payload) => {
            console.log(payload)

            // If window is not in focus, discard the payloads else will crash browser
            if (!payload || !isWindowFocused.current || !pixiMapMech) return

            const target = payload.find((p) => p.participant_id === warMachine.participantID)
            if (!target) return

            const { health, shield, position, rotation, is_hidden } = target

            setIsAlive(health > 0)
            pixiMapMech.updateHpBar((health / maxHealth) * 100)
            pixiMapMech.updateShieldBar((shield / maxShield) * 100)

            // Update position, only when not hidden (else pos will set to like -100, -100 or something)
            if (!is_hidden) {
                const newPos = clientPositionToViewportPosition.current(position.x, position.y)
                pixiMapMech.updatePosition(newPos.x, newPos.y)
            }

            // Update the mech move dash line length and rotation
            const mCommand = tempMechMoveCommand.current || mechMoveCommand.current
            if (mCommand?.cell_x && mCommand?.cell_y && !mCommand?.reached_at) {
                const mapPos = gridCellToViewportPosition.current(mCommand.cell_x, mCommand.cell_y)
                pixiMapMech.updateMechMovePosition(mapPos.x, mapPos.y)
            } else {
                pixiMapMech.hideMechMovePosition()
            }

            // Update rotation
            const newRot = closestAngle(prevRotation.current, rotation || 0)
            const newRotRad = deg2rad(newRot + 90)
            pixiMapMech.updateRotation(newRotRad)
            prevRotation.current = newRot

            // Update visibility
            pixiMapMech.updateVisibility(!is_hidden)
        },
    )

    // Listen on mech move command positions for this mech
    useGameServerSubscriptionFaction<MechMoveCommand>(
        {
            URI: `/arena/${currentArenaID}/mech_command/${hash}`,
            key: GameServerKeys.SubMechMoveCommand,
            ready: factionID === warMachineFactionID && !!participantID && !!currentArenaID,
        },
        (payload) => {
            if (!payload) {
                mechMoveCommand.current = undefined
                return
            }
            tempMechMoveCommand.current = undefined
            mechMoveCommand.current = payload
        },
    )

    // Listen on abilities that apply on this mech to display
    useGameServerSubscription<DisplayedAbility[]>(
        {
            URI: `/public/arena/${currentArenaID}/mini_map_ability_display_list`,
            binaryKey: BinaryDataKey.MiniMapAbilityContents,
            binaryParser: AbilityEffectParser,
            ready: !!currentArenaID,
        },
        (payload) => {
            if (!payload) {
                setAbilityEffects([])
                return
            }
            setAbilityEffects(payload.filter((da) => da.mech_id === id) || [])
        },
    )

    return null
}, propsAreEqual)
