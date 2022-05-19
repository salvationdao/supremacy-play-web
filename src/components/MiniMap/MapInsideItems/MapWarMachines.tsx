import { Box, Stack } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { GenericWarMachinePNG, SvgMapSkull, SvgMapWarMachine } from "../../../assets"
import { useGameServerSubscription } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { LocationSelectType, Map, PlayerAbility, Vector2i, WarMachineState } from "../../../types"
import { WarMachineLiveState } from "../../../types/game"
import { Faction } from "../../../types/user"
import { MapSelection } from "../MiniMapInside"

interface MapWarMachineProps {
    gridWidth: number
    gridHeight: number
    // useAuth
    userID?: string
    factionID?: string
    // useSupremacy
    getFaction: (factionID: string) => Faction
    // useGame
    map?: Map
    warMachines?: WarMachineState[]
    // useMiniMap
    enlarged: boolean
    targeting: boolean
    setSelection: React.Dispatch<React.SetStateAction<MapSelection | undefined>>
    highlightedMechHash?: string
    setHighlightedMechHash: React.Dispatch<React.SetStateAction<string | undefined>>
    // useConsumables
    playerAbility?: PlayerAbility
}

export const MapWarMachines = ({
    gridWidth,
    gridHeight,
    userID,
    getFaction,
    map,
    warMachines,
    enlarged,
    targeting,
    setSelection,
    highlightedMechHash,
    setHighlightedMechHash,
    playerAbility,
}: MapWarMachineProps) => {
    if (!map || !warMachines || warMachines.length <= 0) return null

    return (
        <>
            {warMachines.map((wm) => (
                <MapWarMachine
                    key={`${wm.participantID} - ${wm.hash}`}
                    getFaction={getFaction}
                    gridWidth={gridWidth}
                    gridHeight={gridHeight}
                    warMachine={wm}
                    map={map}
                    enlarged={enlarged}
                    targeting={targeting}
                    userID={userID}
                    playerAbility={playerAbility}
                    setSelection={setSelection}
                    highlightedMechHash={highlightedMechHash}
                    setHighlightedMechHash={setHighlightedMechHash}
                />
            ))}
        </>
    )
}

interface Props {
    getFaction: (factionID: string) => Faction
    gridWidth: number
    gridHeight: number
    warMachine: WarMachineState
    map: Map
    // useAuth
    userID?: string
    factionID?: string
    // useMiniMap
    enlarged: boolean
    targeting: boolean
    setSelection: React.Dispatch<React.SetStateAction<MapSelection | undefined>>
    highlightedMechHash?: string
    setHighlightedMechHash: React.Dispatch<React.SetStateAction<string | undefined>>
    // useConsumables
    playerAbility?: PlayerAbility
}

const MapWarMachine = ({
    getFaction,
    gridWidth,
    gridHeight,
    warMachine,
    map,
    enlarged,
    targeting,
    userID,
    factionID,
    highlightedMechHash,
    setHighlightedMechHash,
    playerAbility,
    setSelection,
}: Props) => {
    const { hash, participantID, factionID: warMachineFactionID, maxHealth, maxShield, imageAvatar, ownedByID } = warMachine

    const [health, setHealth] = useState<number>(warMachine.health)
    const [shield, setShield] = useState<number>(warMachine.shield)
    const [position, sePosition] = useState<Vector2i>(warMachine.position)
    // 0 is east, and goes CW, can be negative and above 360
    const [rotation, setRotation] = useState<number>(warMachine.rotation)

    const mapScale = useMemo(() => map.width / (map.cells_x * 2000), [map])
    const wmImageUrl = useMemo(() => imageAvatar || GenericWarMachinePNG, [imageAvatar])
    const SIZE = useMemo(() => Math.min(gridWidth, gridHeight) * 1.1, [gridWidth, gridHeight])
    const ICON_SIZE = useMemo(() => 1 * SIZE, [SIZE])
    const ARROW_LENGTH = useMemo(() => ICON_SIZE / 2 + 0.6 * SIZE, [ICON_SIZE, SIZE])
    const DOT_SIZE = useMemo(() => 1.2 * SIZE, [SIZE])
    const primaryColor = useMemo(() => getFaction(warMachineFactionID).primary_color || "#FFFFFF", [warMachineFactionID, getFaction])
    const isAlive = useMemo(() => health > 0, [health])

    // Listen on current war machine changes
    useGameServerSubscription<WarMachineLiveState | undefined>(
        {
            URI: `/battle/mech/${participantID}`,
            key: GameServerKeys.SubMechLiveStats,
        },
        (payload) => {
            if (payload?.health !== undefined) setHealth(payload.health)
            if (payload?.shield !== undefined) setShield(payload.shield)
            if (payload?.position !== undefined) sePosition(payload.position)
            if (payload?.rotation !== undefined) setRotation(payload.rotation)
        },
    )

    const handleClick = useCallback(() => {
        if (hash === highlightedMechHash) {
            setHighlightedMechHash(undefined)
            if (playerAbility) {
                setSelection(undefined)
            }
        } else {
            if (playerAbility && factionID !== warMachineFactionID) return
            setHighlightedMechHash(hash)
            if (playerAbility) {
                setSelection({
                    mechHash: hash,
                })
            }
        }
    }, [hash, highlightedMechHash, setHighlightedMechHash, setSelection, playerAbility, factionID, warMachineFactionID])

    if (!position) return null

    return (
        <Stack
            key={`warMachine-${participantID}`}
            alignItems="center"
            justifyContent="center"
            spacing="1rem"
            onClick={handleClick}
            style={{
                position: "absolute",
                pointerEvents: targeting && playerAbility?.ability.location_select_type !== LocationSelectType.MECH_SELECT ? "none" : "all",
                cursor: "pointer",
                transform: `translate(-50%, -50%) translate3d(${(position.x - map.left_pixels) * mapScale}px, ${
                    (position.y - map.top_pixels) * mapScale
                }px, 0)`,
                transition: "transform 0.2s linear",
                zIndex: isAlive ? 5 : 4,
                opacity: 1,
                border: highlightedMechHash === warMachine.hash ? `${primaryColor} 1rem dashed` : "unset",
                backgroundColor: ownedByID === userID ? `${colors.neonBlue}65` : highlightedMechHash === warMachine.hash ? `${primaryColor}60` : "unset",
                padding: "1rem 1.3rem",
            }}
        >
            {playerAbility && playerAbility.ability.location_select_type === LocationSelectType.MECH_SELECT && hash === highlightedMechHash && (
                <Box
                    onClick={() => setSelection(undefined)}
                    sx={{
                        position: "absolute",
                        top: "0",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        height: `${SIZE}px`,
                        width: `${SIZE}px`,
                        cursor: "pointer",
                        border: `2px solid ${playerAbility.ability.colour}`,
                        borderRadius: 1,
                        backgroundImage: `url(${playerAbility.ability.image_url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        zIndex: 100,
                    }}
                />
            )}
            <Box
                style={
                    enlarged
                        ? {
                              position: "relative",
                              width: ICON_SIZE,
                              height: ICON_SIZE,
                              overflow: "visible",
                              backgroundColor: primaryColor,
                              backgroundImage: `url(${wmImageUrl})`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              border: `${primaryColor} solid 7.5px`,
                              borderRadius: 3,
                              opacity: isAlive ? 1 : 0.7,
                              boxShadow: isAlive ? `0 0 8px 2px ${primaryColor}70` : "none",
                              zIndex: 2,
                          }
                        : {
                              position: "relative",
                              width: DOT_SIZE,
                              height: DOT_SIZE,
                              overflow: "visible",
                              backgroundColor: `${primaryColor}${isAlive ? "" : "00"}`,
                              border: `9px solid #000000${isAlive ? "" : "00"}`,
                              borderRadius: "50%",
                              zIndex: 2,
                          }
                }
            >
                {!isAlive && (
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        style={{
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(#00000040, #00000090)",
                            opacity: enlarged ? 1 : 0.6,
                        }}
                    >
                        <SvgMapSkull
                            fill="#000000"
                            size={enlarged ? `${0.8 * SIZE}px` : `${1.3 * SIZE}px`}
                            style={{
                                position: "absolute",
                                top: "52%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                    </Stack>
                )}

                {isAlive && enlarged && (
                    <Box
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: `translate(-50%, -50%) rotate(${rotation + 90}deg)`,
                            transition: "all .2s",
                            zIndex: 3,
                        }}
                    >
                        <Box style={{ position: "relative", height: ARROW_LENGTH }}>
                            <SvgMapWarMachine
                                fill={primaryColor}
                                size={`${0.6 * SIZE}px`}
                                style={{
                                    position: "absolute",
                                    top: -6,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                }}
                            />
                        </Box>
                        <Box style={{ height: ARROW_LENGTH }} />
                    </Box>
                )}
            </Box>

            {isAlive && (
                <Stack
                    spacing=".24rem"
                    style={{
                        width: SIZE * 1.2,
                        zIndex: 1,
                    }}
                >
                    {warMachine.maxShield > 0 && (
                        <Box
                            style={{
                                width: "100%",
                                height: `${0.3 * SIZE}px`,
                                border: "1px solid #00000080",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                style={{
                                    width: `${(shield / maxShield) * 100}%`,
                                    height: "100%",
                                    backgroundColor: colors.shield,
                                }}
                            />
                        </Box>
                    )}
                    <Box
                        style={{
                            width: "100%",
                            height: `${0.3 * SIZE}px`,
                            border: "1px solid #00000080",
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            style={{
                                width: `${(health / maxHealth) * 100}%`,
                                height: "100%",
                                backgroundColor: health / maxHealth <= 0.45 ? colors.red : colors.health,
                            }}
                        />
                    </Box>
                </Stack>
            )}
        </Stack>
    )
}
