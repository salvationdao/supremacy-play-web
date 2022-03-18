import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { GenericWarMachinePNG, SvgMapSkull, SvgMapWarMachine } from "../../../assets"
import { useGame, useGameServerWebsocket, WebSocketProperties } from "../../../containers"
import { shadeColor } from "../../../helpers"
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

export const MapWarMachines = ({
    gridWidth,
    gridHeight,
    warMachines,
    map,
    enlarged,
    targeting,
}: MapWarMachineProps) => {
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
    const mapScale = map.width / (map.cells_x * 2000)

    const wmImageUrl = imageAvatar || GenericWarMachinePNG

    const SIZE = Math.min(gridWidth, gridHeight) * 1.8
    const ICON_SIZE = isSpawnedAI ? 0.8 * SIZE : 1 * SIZE
    const ARROW_LENGTH = ICON_SIZE / 2 + 0.5 * SIZE
    const DOT_SIZE = isSpawnedAI ? 0.7 * SIZE : 1.2 * SIZE

    const [health, setHealth] = useState<number>(warMachine.health)
    const [shield, setShield] = useState<number>(warMachine.shield)
    const [position, sePosition] = useState<Vector2i>(warMachine.position)
    // 0 is east, and goes CW, can be negative and above 360
    const [rotation, setRotation] = useState<number>(warMachine.rotation)
    const isAlive = health > 0
    const primaryColor = faction && faction.theme ? faction.theme.primary : "#FFFFFF"

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

    const handleClick = (mechHash: string) => {
        if (mechHash === highlightedMechHash) {
            setHighlightedMechHash(undefined)
        } else setHighlightedMechHash(mechHash)
    }

    if (!position) return null

    return (
        <Stack
            key={`warMachine-${participantID}`}
            alignItems="center"
            justifyContent="center"
            onClick={() => handleClick(hash)}
            sx={{
                position: "absolute",
                pointerEvents: targeting ? "none" : "all",
                cursor: "pointer",
                transform: `translate(-50%, -50%) translate3d(${(position.x - map.left) * mapScale}px, ${
                    (position.y - map.top) * mapScale
                }px, 0)`,
                transition: "transform 0.2s linear",
                zIndex: isAlive ? 5 : 4,
                opacity: isSpawnedAI ? 0.8 : 1,
            }}
        >
            <Box
                sx={
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
                              border: `${primaryColor} solid 1px`,
                              borderRadius: 1,
                              boxShadow:
                                  highlightedMechHash === warMachine.hash
                                      ? `0px 0px 20px 10px ${colors.neonBlue}`
                                      : isAlive
                                      ? `0 0 8px 2px ${shadeColor(primaryColor, 80)}70`
                                      : "none",
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
                              boxShadow:
                                  highlightedMechHash === warMachine.hash
                                      ? `0px 0px 20px 20px ${colors.neonBlue}`
                                      : "unset",
                              zIndex: 2,
                          }
                }
            >
                {!isAlive && (
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(#00000040, #00000090)",
                            opacity: enlarged ? 1 : 0.5,
                        }}
                    >
                        <SvgMapSkull
                            fill="#000000"
                            size={enlarged ? `${0.5 * SIZE}px` : isSpawnedAI ? `${1.3 * SIZE}px` : `${1.8 * SIZE}px`}
                            sx={{
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
                        sx={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: `translate(-50%, -50%) rotate(${rotation + 90}deg)`,
                            transition: "all .2s",
                            zIndex: 3,
                        }}
                    >
                        <Box sx={{ position: "relative", height: ARROW_LENGTH }}>
                            <SvgMapWarMachine
                                fill={primaryColor}
                                size={`${0.45 * SIZE}px`}
                                sx={{
                                    position: "absolute",
                                    top: -6,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                }}
                            />
                        </Box>
                        <Box sx={{ height: ARROW_LENGTH }} />
                    </Box>
                )}

                {isAlive && (
                    <Stack
                        spacing=".24rem"
                        sx={{
                            position: "absolute",
                            bottom: enlarged ? "-.3rem" : "-1.2rem",
                            left: "50%",
                            transform: "translate(-50%, calc(100% + 10px))",
                            width: SIZE * 1.2,
                            zIndex: 1,
                        }}
                    >
                        {warMachine.maxShield > 0 && (
                            <Box
                                sx={{
                                    width: "100%",
                                    height: `${0.3 * SIZE}px`,
                                    border: "1px solid #00000080",
                                    overflow: "hidden",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: `${(shield / maxShield) * 100}%`,
                                        height: "100%",
                                        backgroundColor: colors.shield,
                                    }}
                                />
                            </Box>
                        )}
                        <Box
                            sx={{
                                width: "100%",
                                height: `${0.3 * SIZE}px`,
                                border: "1px solid #00000080",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    width: `${(health / maxHealth) * 100}%`,
                                    height: "100%",
                                    backgroundColor: health / maxHealth <= 0.45 ? colors.red : colors.health,
                                }}
                            />
                        </Box>
                    </Stack>
                )}
            </Box>
        </Stack>
    )
}
