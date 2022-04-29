import { Box, Stack } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { GenericWarMachinePNG, SvgMapSkull, SvgMapWarMachine } from "../../../assets"
import { useGame, useGameServerWebsocket, WebSocketProperties } from "../../../containers"
import { colors } from "../../../theme/theme"
import { Map, NetMessageTickWarMachine, Vector2i, WarMachineState } from "../../../types"

interface MapWarMachineProps {
    gridWidth: number
    gridHeight: number
    warMachines: WarMachineState[]

    map: Map
    enlarged: boolean
    targeting?: boolean
}

export const MapWarMachines = ({ gridWidth, gridHeight, warMachines, map, enlarged, targeting }: MapWarMachineProps) => {
    if (!map || !warMachines || warMachines.length <= 0) return null

    return (
        <>
            {warMachines.map((wm) => (
                <MapWarMachine
                    key={`${wm.participantID} - ${wm.hash}`}
                    gridWidth={gridWidth}
                    gridHeight={gridHeight}
                    warMachine={wm}
                    map={map}
                    enlarged={enlarged}
                    targeting={targeting}
                />
            ))}
        </>
    )
}

interface Props {
    gridWidth: number
    gridHeight: number
    warMachine: WarMachineState
    map: Map
    enlarged: boolean
    targeting?: boolean
}

const MapWarMachine = (props: Props) => {
    const { state, subscribeWarMachineStatNetMessage } = useGameServerWebsocket()
    const { highlightedMechHash, setHighlightedMechHash } = useGame()

    return (
        <MapWarMachineInner
            {...props}
            state={state}
            subscribeWarMachineStatNetMessage={subscribeWarMachineStatNetMessage}
            highlightedMechHash={highlightedMechHash}
            setHighlightedMechHash={setHighlightedMechHash}
        />
    )
}

interface PropsInner extends Props, Partial<WebSocketProperties> {
    isSpawnedAI?: boolean
    highlightedMechHash?: string
    setHighlightedMechHash: (s?: string) => void
}

const MapWarMachineInner = ({
    gridWidth,
    gridHeight,
    warMachine,
    map,
    enlarged,
    targeting,
    isSpawnedAI,
    subscribeWarMachineStatNetMessage,
    state,
    highlightedMechHash,
    setHighlightedMechHash,
}: PropsInner) => {
    const { hash, participantID, faction, maxHealth, maxShield, imageAvatar } = warMachine

    const [health, setHealth] = useState<number>(warMachine.health)
    const [shield, setShield] = useState<number>(warMachine.shield)
    const [position, sePosition] = useState<Vector2i>(warMachine.position)
    // 0 is east, and goes CW, can be negative and above 360
    const [rotation, setRotation] = useState<number>(warMachine.rotation)

    const mapScale = useMemo(() => map.width / (map.cells_x * 2000), [map])
    const wmImageUrl = useMemo(() => imageAvatar || GenericWarMachinePNG, [imageAvatar])
    const SIZE = useMemo(() => Math.min(gridWidth, gridHeight) * 1.1, [gridWidth, gridHeight])
    const ICON_SIZE = useMemo(() => (isSpawnedAI ? 0.8 * SIZE : 1 * SIZE), [SIZE, isSpawnedAI])
    const ARROW_LENGTH = useMemo(() => ICON_SIZE / 2 + 0.5 * SIZE, [ICON_SIZE, SIZE])
    const DOT_SIZE = useMemo(() => (isSpawnedAI ? 0.7 * SIZE : 1.2 * SIZE), [isSpawnedAI, SIZE])
    const primaryColor = useMemo(() => (faction && faction.theme ? faction.theme.primary : "#FFFFFF"), [faction])
    const isAlive = useMemo(() => health > 0, [health])

    // Listen on current war machine changes
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeWarMachineStatNetMessage) return
        return subscribeWarMachineStatNetMessage<NetMessageTickWarMachine | undefined>(participantID, (payload) => {
            if (payload?.health !== undefined) setHealth(payload.health)
            if (payload?.shield !== undefined) setShield(payload.shield)
            if (payload?.position !== undefined) sePosition(payload.position)
            if (payload?.rotation !== undefined) setRotation(payload.rotation)
        })
    }, [participantID, state, subscribeWarMachineStatNetMessage])

    const handleClick = useCallback(() => {
        if (hash === highlightedMechHash) {
            setHighlightedMechHash(undefined)
        } else setHighlightedMechHash(hash)
    }, [hash, highlightedMechHash, setHighlightedMechHash])

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
                pointerEvents: targeting ? "none" : "all",
                cursor: "pointer",
                transform: `translate(-50%, -50%) translate3d(${(position.x - map.left_pixels) * mapScale}px, ${
                    (position.y - map.top_pixels) * mapScale
                }px, 0)`,
                transition: "transform 0.2s linear",
                zIndex: isAlive ? 5 : 4,
                opacity: isSpawnedAI ? 0.8 : 1,
                border: highlightedMechHash === warMachine.hash ? `${primaryColor} 1rem dashed` : "unset",
                backgroundColor: highlightedMechHash === warMachine.hash ? `${primaryColor}60` : "unset",
                padding: "1rem 1.3rem",
            }}
        >
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
                            size={enlarged ? `${0.8 * SIZE}px` : isSpawnedAI ? `${1 * SIZE}px` : `${1.3 * SIZE}px`}
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
                                size={`${0.45 * SIZE}px`}
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
