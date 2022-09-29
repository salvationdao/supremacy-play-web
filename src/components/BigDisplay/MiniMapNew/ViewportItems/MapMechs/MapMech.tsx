import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ADD_MINI_MECH_PARTICIPANT_ID } from "../../../../../constants"
import { MapSelection, useArena, useAuth, useGame, useMiniMapPixi, useSupremacy, WinnerStruct } from "../../../../../containers"
import { RecordType, useHotkey } from "../../../../../containers/hotkeys"
import { closestAngle, deg2rad } from "../../../../../helpers"
import { useGameServerSubscription, useGameServerSubscriptionFaction } from "../../../../../hooks/useGameServer"
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
    const { getFaction } = useSupremacy()
    const { addToHotkeyRecord } = useHotkey()
    const {
        pixiMainItems,
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

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMainItems) return
        const pixiMapMech = new PixiMapMech(label, hash)
        pixiMainItems.viewport.addChild(pixiMapMech.root)
        setPixiMapMech(pixiMapMech)
    }, [hash, label, pixiMainItems])

    // Cleanup
    useEffect(() => {
        return () => pixiMapMech?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiMapMech])

    // Update graphics
    useEffect(() => {
        if (!pixiMapMech) return

        // Set the icon dimensions
        iconDimension.current = { width: gridSizeRef.current.width, height: gridSizeRef.current.height }
        // If it's a mini mech, make it look smaller
        if (isAI) {
            iconDimension.current.width *= 0.7
            iconDimension.current.height *= 0.7
        }

        pixiMapMech.updateStyles(primaryColor, iconDimension.current)
        pixiMapMech.updateHpShieldBars(iconDimension.current)
    }, [pixiMapMech, primaryColor, map, gridSizeRef, isAI])

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

        pixiMapMech.rootInner.removeListener("pointerup")
        pixiMapMech.rootInner.on("pointerup", onMechClick)
    }, [onMechClick, pixiMapMech])

    // Add hotkey to select this mech
    useEffect(() => {
        if (!label || warMachineFactionID !== factionID) return
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
    }, [abilityBorderEffect, abilityShakeEffect, pixiMapMech])

    // Listen on mech stats
    useGameServerSubscription<WarMachineLiveState | undefined>(
        {
            URI: `/public/arena/${currentArenaID}/mech/${participantID}`,
            key: GameServerKeys.SubMechLiveStats,
            ready: !!participantID && !!currentArenaID && !!pixiMapMech,
            batchURI: `/public/arena/${currentArenaID}/mech`,
        },
        (payload) => {
            if (payload?.health !== undefined && pixiMapMech) {
                setIsAlive(payload.health > 0)
                const percent = (payload.health / maxHealth) * 100
                pixiMapMech.updateHpBar(percent)
            }

            if (payload?.shield !== undefined && pixiMapMech) {
                const percent = (payload.shield / maxShield) * 100
                pixiMapMech.updateShieldBar(percent)
            }

            // Update position, only when not hidden (else pos will set to like -100, -100 or something)
            if (!payload?.is_hidden && payload?.position !== undefined && pixiMapMech) {
                const newPos = clientPositionToViewportPosition.current(payload.position.x, payload.position.y)
                pixiMapMech.updatePosition(newPos.x, newPos.y)

                // Update the mech move dash line length and rotation
                const mCommand = tempMechMoveCommand.current || mechMoveCommand.current
                if (mCommand?.cell_x && mCommand?.cell_y && !mCommand?.reached_at) {
                    const mapPos = gridCellToViewportPosition.current(mCommand.cell_x, mCommand.cell_y)
                    pixiMapMech.updateMechMovePosition(mapPos.x, mapPos.y)
                } else {
                    pixiMapMech.hideMechMovePosition()
                }
            }

            // Update rotation
            if (payload?.rotation !== undefined && pixiMapMech) {
                const newRot = closestAngle(prevRotation.current, payload.rotation || 0)
                const newRotRad = deg2rad(newRot + 90)
                pixiMapMech.updateRotation(newRotRad)
                prevRotation.current = newRot
            }

            // Update visibility
            if (pixiMapMech) {
                pixiMapMech.updateVisibility(!payload?.is_hidden)
            }
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
            key: GameServerKeys.SubMiniMapAbilityDisplayList,
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
