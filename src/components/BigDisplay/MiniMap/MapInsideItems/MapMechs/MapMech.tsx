import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useRef, useState } from "react"
import { SvgMapSkull, SvgMapWarMachine } from "../../../../../assets"
import { useAuth, useGame, useMiniMap, useSupremacy } from "../../../../../containers"
import { useArena } from "../../../../../containers/arena"
import { closestAngle } from "../../../../../helpers"
import { useGameServerSubscription, useGameServerSubscriptionFaction } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { spinEffect } from "../../../../../theme/keyframes"
import { colors, fonts } from "../../../../../theme/theme"
import { LocationSelectType, Map, WarMachineState } from "../../../../../types"
import { WarMachineLiveState } from "../../../../../types/game"
import { MechMoveCommand } from "../../../../WarMachine/WarMachineItem/MoveCommand"

const TRANSITION_DURATION = 0.275 // seconds

interface MapMechProps {
    warMachine: WarMachineState
    label: number
    isAI?: boolean
}

export const MapMech = (props: MapMechProps) => {
    const { map } = useGame()
    if (!map) return null
    return <MapMechInner map={map} {...props} />
}

interface MapMechInnerProps extends MapMechProps {
    map: Map
}

const MapMechInner = ({ warMachine, map, label, isAI }: MapMechInnerProps) => {
    const { userID, factionID } = useAuth()
    const { currentArenaID } = useArena()
    const { getFaction } = useSupremacy()
    const { isTargeting, gridWidth, gridHeight, playerAbility, highlightedMechParticipantID, setHighlightedMechParticipantID, selection, setSelection } =
        useMiniMap()
    const { hash, participantID, factionID: warMachineFactionID, maxHealth, maxShield, ownedByID } = warMachine

    // For rendering: size, colors etc.
    const prevRotation = useRef(warMachine.rotation)
    const mapScale = useMemo(() => map.width / (map.cells_x * 2000), [map])
    const iconSize = useMemo(() => Math.max(gridWidth, gridHeight, 50) * (isAI ? 1.2 : 1.8), [gridWidth, gridHeight, isAI])
    const dirArrowLength = useMemo(() => iconSize / 2 + 0.6 * iconSize, [iconSize])
    const primaryColor = useMemo(
        () => (ownedByID === userID ? colors.gold : getFaction(warMachineFactionID).primary_color || colors.neonBlue),
        [ownedByID, userID, getFaction, warMachineFactionID],
    )
    const [isAlive, setIsAlive] = useState(warMachine.health > 0)
    const [isHidden, setIsHidden] = useState<boolean>(warMachine.isHidden)
    const isMechHighlighted = useMemo(
        () => highlightedMechParticipantID === warMachine.participantID || selection?.mechHash === hash || playerAbility?.mechHash === hash,
        [hash, highlightedMechParticipantID, playerAbility?.mechHash, selection?.mechHash, warMachine.participantID],
    )
    const zIndex = useMemo(() => {
        if (isMechHighlighted) return 7
        if (isAlive && factionID === warMachineFactionID) return 6
        if (isAlive) return 5
        return 4
    }, [factionID, isAlive, isMechHighlighted, warMachineFactionID])

    // Mech move command related
    const mechMoveCommand = useRef<MechMoveCommand>()

    // Listen on mech stats
    useGameServerSubscription<WarMachineLiveState | undefined>(
        {
            URI: `/public/arena/${currentArenaID}/mech/${participantID}`,
            key: GameServerKeys.SubMechLiveStats,
            ready: !!participantID && !!currentArenaID,
            batchURI: `/public/arena/${currentArenaID}/mech`,
        },
        (payload) => {
            // Direct DOM manipulation is a lot more optimized than re-rendering
            if (payload?.health !== undefined) {
                if (payload.health <= 0) setIsAlive(false)

                const healthBarEl = document.getElementById(`map-mech-health-bar-${hash}`)
                if (healthBarEl) {
                    const percent = Math.min((payload.health / maxHealth) * 100, 100)
                    healthBarEl.style.width = `${percent}%`
                    if (percent <= 45) healthBarEl.style.backgroundColor = colors.red
                }
            }

            if (payload?.shield !== undefined) {
                const shieldBarEl = document.getElementById(`map-mech-shield-bar-${hash}`)
                if (shieldBarEl) {
                    const percent = Math.min((payload.shield / maxShield) * 100, 100)
                    shieldBarEl.style.width = `${percent}%`
                }
            }

            if (payload?.position !== undefined) {
                const positionEl = document.getElementById(`map-mech-position-${hash}`)
                if (positionEl) {
                    const mechMapX = ((payload.position?.x || 0) - map.left_pixels) * mapScale
                    const mechMapY = ((payload.position?.y || 0) - map.top_pixels) * mapScale
                    positionEl.style.transform = `translate(-50%, -50%) translate3d(${mechMapX}px, ${mechMapY}px, 0)`

                    // Update the mech move dash line length and rotation
                    const moveCommandEl = document.getElementById(`map-mech-move-command-${hash}`)
                    if (moveCommandEl) {
                        if (mechMoveCommand.current?.cell_x && mechMoveCommand.current?.cell_y) {
                            const commandMapX = mechMoveCommand.current.cell_x * gridWidth
                            const commandMapY = mechMoveCommand.current.cell_y * gridHeight
                            const x = Math.abs(mechMapX - commandMapX)
                            const y = Math.abs(mechMapY - commandMapY)
                            const rotation = (Math.atan2(commandMapY - mechMapY, commandMapX - mechMapX) * 180) / Math.PI
                            moveCommandEl.style.display = "block"
                            moveCommandEl.style.height = `${2 * Math.sqrt(x * x + y * y)}px`
                            moveCommandEl.style.transform = `translate(-50%, -50%) rotate(${rotation + 90}deg)`
                        } else {
                            moveCommandEl.style.display = "none"
                        }
                    }
                }
            }

            if (payload?.rotation !== undefined) {
                const rotationEl = document.getElementById(`map-mech-rotation-${hash}`)
                if (rotationEl) {
                    // 0 is east, and goes CW, can be negative and above 360
                    const newRotation = closestAngle(prevRotation.current, payload.rotation || 0)
                    rotationEl.style.transform = `translate(-50%, -50%) rotate(${newRotation + 90}deg)`
                    prevRotation.current = newRotation
                }
            }

            if (payload?.is_hidden !== undefined) setIsHidden(payload.is_hidden)
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
            if (!payload) return
            mechMoveCommand.current = payload
        },
    )

    const handleClick = useCallback(() => {
        if (playerAbility && factionID === warMachineFactionID) {
            setSelection((prev) => {
                if (prev?.mechHash === hash) return undefined
                return { mechHash: hash }
            })

            return
        }

        if (participantID === highlightedMechParticipantID) {
            setHighlightedMechParticipantID(undefined)
        } else {
            setHighlightedMechParticipantID(participantID)
        }
    }, [playerAbility, factionID, warMachineFactionID, hash, participantID, highlightedMechParticipantID, setSelection, setHighlightedMechParticipantID])

    return useMemo(() => {
        // Don't show on map if the mech is hidden
        if (isHidden) return null

        return (
            <Stack
                id={`map-mech-position-${hash}`}
                key={`warMachine-${participantID}`}
                alignItems="center"
                justifyContent="center"
                spacing=".6rem"
                onClick={handleClick}
                style={{
                    position: "absolute",
                    pointerEvents: isTargeting && playerAbility?.ability.location_select_type !== LocationSelectType.MechSelect ? "none" : "all",
                    cursor: "pointer",
                    padding: "1rem 1.3rem",
                    transition: `transform ${TRANSITION_DURATION}s linear`,
                    opacity: 1,
                    zIndex,
                }}
            >
                {/* Show player ability icon above the mech */}
                {playerAbility?.ability.location_select_type === LocationSelectType.MechSelect && selection?.mechHash === hash && (
                    <Box
                        onClick={() => setSelection(undefined)}
                        sx={{
                            position: "absolute",
                            top: "0",
                            left: "50%",
                            transform: "translate(-50%, -80%)",
                            height: iconSize,
                            width: iconSize,
                            cursor: "pointer",
                            border: `3px solid ${playerAbility.ability.colour}`,
                            borderRadius: 1,
                            boxShadow: 2,
                            backgroundImage: `url(${playerAbility.ability.image_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            zIndex: 100,
                        }}
                    />
                )}

                {/* The mech icon and rotation arrow */}
                <Box
                    style={{
                        position: "relative",
                        width: iconSize,
                        height: iconSize,
                        overflow: "visible",
                        backgroundColor: primaryColor,
                        borderRadius: 3,
                        boxShadow: isAlive ? `0 0 8px 2px ${primaryColor}70` : "none",
                        opacity: isAlive ? 1 : 0.7,
                        zIndex: 2,
                        transition: "opacity 0.2s ease-out",
                    }}
                >
                    {/* Highlighted mech */}
                    {isMechHighlighted && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 99,
                            }}
                        >
                            <Box
                                sx={{
                                    width: iconSize * 1.6,
                                    height: iconSize * 1.6,
                                    border: `${primaryColor} 1.5rem dashed`,
                                    borderStyle: "dashed solid",
                                    borderRadius: "50%",
                                    backgroundColor: `${primaryColor}20`,
                                    animation: `${spinEffect} 3s infinite`,
                                    boxShadow: "0 0 12px 9px #FFFFFF40",
                                }}
                            />
                        </Box>
                    )}

                    {/* Number */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            px: "1rem",
                            backgroundColor: "#000000DD",
                        }}
                    >
                        <Typography
                            variant={isAI ? "h4" : "h1"}
                            sx={{
                                color: primaryColor,
                                fontSize: iconSize * 0.98,
                                lineHeight: 1,
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            {label}
                        </Typography>
                    </Box>

                    {/* Skull icon */}
                    {!isAlive && (
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            style={{
                                width: "100%",
                                height: "100%",
                                background: "linear-gradient(#00000040, #00000090)",
                                opacity: 1,
                            }}
                        >
                            <SvgMapSkull
                                fill="#000000"
                                size={`${0.8 * iconSize}px`}
                                style={{
                                    position: "absolute",
                                    top: "52%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                            />
                        </Stack>
                    )}

                    {/* Rotation arrow */}
                    {isAlive && (
                        <Box
                            id={`map-mech-rotation-${hash}`}
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transition: `all ${TRANSITION_DURATION}s`,
                                zIndex: 3,
                            }}
                        >
                            <Box style={{ position: "relative", height: dirArrowLength }}>
                                <SvgMapWarMachine
                                    fill={primaryColor}
                                    size={`${0.6 * iconSize}px`}
                                    style={{
                                        position: "absolute",
                                        top: -6,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                    }}
                                />
                            </Box>
                            <Box style={{ height: dirArrowLength }} />
                        </Box>
                    )}
                </Box>

                {/* Health and shield bars */}
                {isAlive && (
                    <Stack spacing=".2rem" style={{ width: iconSize * 0.9, zIndex: 1 }}>
                        {warMachine.maxShield > 0 && (
                            <Box
                                style={{
                                    width: "100%",
                                    height: `${0.2 * iconSize}px`,
                                    border: "3px solid #00000080",
                                    overflow: "hidden",
                                }}
                            >
                                <Box
                                    id={`map-mech-shield-bar-${hash}`}
                                    style={{
                                        width: `${(warMachine.shield / maxShield) * 100}%`,
                                        height: "100%",
                                        backgroundColor: colors.shield,
                                    }}
                                />
                            </Box>
                        )}

                        <Box
                            style={{
                                width: "100%",
                                height: `${0.2 * iconSize}px`,
                                border: "3px solid #00000080",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                id={`map-mech-health-bar-${hash}`}
                                style={{
                                    width: `${(warMachine.health / maxHealth) * 100}%`,
                                    height: "100%",
                                    backgroundColor: colors.health,
                                }}
                            />
                        </Box>
                    </Stack>
                )}

                {/* Mech move command dashed line */}
                {isAlive && mechMoveCommand.current && !mechMoveCommand.current?.reached_at && !mechMoveCommand.current?.cancelled_at && (
                    <Box
                        id={`map-mech-move-command-${hash}`}
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transition: `all ${TRANSITION_DURATION}s`,
                            zIndex: 1,
                        }}
                    >
                        <Box
                            style={{
                                position: "relative",
                                height: "50%",
                                borderLeft: `${primaryColor} 1.3rem dashed`,
                                transition: `all ${TRANSITION_DURATION}s`,
                            }}
                        >
                            <Box
                                style={{
                                    width: "1.6rem",
                                    height: "1.6rem",
                                    position: "absolute",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    backgroundColor: primaryColor,
                                    borderRadius: "50%",
                                }}
                            />
                        </Box>

                        <Box
                            style={{
                                height: "50%",
                                transition: `all ${TRANSITION_DURATION}s`,
                            }}
                        />
                    </Box>
                )}
            </Stack>
        )
    }, [
        dirArrowLength,
        handleClick,
        hash,
        iconSize,
        isAI,
        isAlive,
        isMechHighlighted,
        isTargeting,
        label,
        maxHealth,
        maxShield,
        participantID,
        playerAbility?.ability.colour,
        playerAbility?.ability.image_url,
        playerAbility?.ability.location_select_type,
        primaryColor,
        selection?.mechHash,
        setSelection,
        warMachine.health,
        warMachine.maxShield,
        warMachine.shield,
        zIndex,
        isHidden,
    ])
}
