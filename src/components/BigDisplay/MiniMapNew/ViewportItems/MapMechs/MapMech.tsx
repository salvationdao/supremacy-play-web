import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ADD_MINI_MECH_PARTICIPANT_ID } from "../../../../../constants"
import { useArena, useAuth, useGame, useMiniMapPixi, useSupremacy } from "../../../../../containers"
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
        getPositionInViewport,
        highlightedMechParticipantID,
        isTargeting,
        selection,
        setSelection,
        selectionInstant,
        playerAbility,
        setHighlightedMechParticipantID,
        setPlayerAbility,
        resetPlayerAbilitySelection,
    } = useMiniMapPixi()
    const { id, hash, participantID, factionID: warMachineFactionID, maxHealth, maxShield, ownedByID } = warMachine

    const [pixiMapMech, setPixiMapMech] = useState<PixiMapMech>()

    const iconDimension = useRef<Dimension>({ width: 5, height: 5 })
    const prevRotation = useRef(warMachine.rotation)
    const [isAlive, setIsAlive] = useState(warMachine.health > 0)
    const isMechHighlighted = useMemo(
        () => highlightedMechParticipantID === warMachine.participantID || selection?.mechHash === hash || playerAbility?.mechHash === hash,
        [hash, highlightedMechParticipantID, playerAbility?.mechHash, selection?.mechHash, warMachine.participantID],
    )
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
    const abilityPulseEffect = useMemo(() => abilityEffects.find((da) => da.mech_display_effect_type === MechDisplayEffectType.Pulse), [abilityEffects])
    const abilityShakeEffect = useMemo(() => abilityEffects.find((da) => da.mech_display_effect_type === MechDisplayEffectType.Shake), [abilityEffects])

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMainItems) return
        const pixiMapMech = new PixiMapMech(label)
        pixiMainItems.viewport.addChild(pixiMapMech.root)
        setPixiMapMech(pixiMapMech)
    }, [label, pixiMainItems])

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

        pixiMapMech.updateNumberText(primaryColor, iconDimension.current)
        pixiMapMech.updateRectBox(primaryColor, iconDimension.current)
        pixiMapMech.updateRotationArrow(primaryColor, iconDimension.current)
        pixiMapMech.updateHpShieldBars(iconDimension.current)
        pixiMapMech.updateMechMoveSprite(primaryColor, iconDimension.current)
    }, [pixiMapMech, primaryColor, map, gridSizeRef, isAI])

    // Update zIndex
    useEffect(() => {
        if (!pixiMapMech) return

        let zIndex = 4
        if (isMechHighlighted) zIndex = 7
        if (isAlive && factionID === warMachineFactionID) zIndex = 6
        if (isAlive) zIndex = 5

        pixiMapMech.updateZIndex(zIndex)
    }, [factionID, isAlive, isMechHighlighted, pixiMapMech, warMachineFactionID])

    // Highlight the mech circle
    useEffect(() => {
        if (!pixiMapMech) return
        if (isMechHighlighted) {
            pixiMapMech.highlightMech(iconDimension.current)
        } else {
            pixiMapMech.unhighlightMech()
        }
    }, [iconDimension, isMechHighlighted, pixiMapMech, primaryColor])

    const onMechClick = useCallback(() => {
        if (playerAbility && isAlive) {
            const locationSelectType = playerAbility.ability.location_select_type

            if (
                (locationSelectType === LocationSelectType.MechSelectAllied && factionID !== warMachineFactionID) ||
                (locationSelectType === LocationSelectType.MechSelectOpponent && factionID === warMachineFactionID)
            ) {
                setSelection((prev) => {
                    if (prev?.mechHash === hash) return undefined
                    return { mechHash: hash }
                })

                return
            }
        }

        if (participantID === highlightedMechParticipantID) {
            setHighlightedMechParticipantID(undefined)
        } else {
            setHighlightedMechParticipantID(participantID)
        }

        // Activate mech move command if user owns the mech, un-activate on click again
        if (playerAbility?.ability.location_select_type === LocationSelectType.MechCommand) {
            resetPlayerAbilitySelection()
        } else if (isAlive && ownedByID === userID && !playerAbility) {
            setPlayerAbility({
                ...MechMoveCommandAbility,
                mechHash: hash,
            })
        }
    }, [
        factionID,
        hash,
        highlightedMechParticipantID,
        isAlive,
        ownedByID,
        participantID,
        playerAbility,
        setHighlightedMechParticipantID,
        setPlayerAbility,
        setSelection,
        userID,
        warMachineFactionID,
        resetPlayerAbilitySelection,
    ])

    // Setup onclick handler
    useEffect(() => {
        if (!pixiMapMech) return

        pixiMapMech.root.removeListener("pointerup")
        pixiMapMech.root.on("pointerup", onMechClick)
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

            // Update position
            if (payload?.position !== undefined && pixiMapMech) {
                const newPos = getPositionInViewport.current(payload.position.x, payload.position.y)
                pixiMapMech.updatePosition(newPos.x, newPos.y)

                // Update the mech move dash line length and rotation
                const mCommand = tempMechMoveCommand.current || mechMoveCommand.current
                if (mCommand?.cell_x && mCommand?.cell_y && !mCommand?.reached_at) {
                    const mapPos = getPositionInViewport.current(mCommand.cell_x, mCommand.cell_y)
                    pixiMapMech.updateMechMovePosition(iconDimension.current, primaryColor, mapPos.x, mapPos.y)
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

    // Immediately render the mech move dashed line when player selects it for fast UX
    useEffect(() => {
        if (playerAbility?.ability.location_select_type === LocationSelectType.MechCommand && playerAbility.mechHash === hash) {
            if (selectionInstant?.startCoords) {
                const mCommand: MechMoveCommand = {
                    id: "move_command",
                    mech_id: id,
                    triggered_by_id: "x",
                    cell_x: selectionInstant.startCoords.x,
                    cell_y: selectionInstant.startCoords.y,
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
    }, [id, hash, playerAbility?.ability, playerAbility?.ability.location_select_type, selectionInstant, playerAbility?.mechHash])

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
