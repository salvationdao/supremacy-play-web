import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { GenericWarMachinePNG, SvgMapSkull, SvgMapWarMachine } from "../../assets"
import { useGame, useWebsocket } from "../../containers"
import { shadeColor } from "../../helpers"
import { colors } from "../../theme/theme"
import { Map, NetMessageTickWarMachine, Vector2i, WarMachineState } from "../../types"

export const MapWarMachine = ({
    warMachine,
    map,
    enlarged,
    isSpawnedAI,
}: {
    warMachine: WarMachineState
    map: Map
    enlarged: boolean
    isSpawnedAI?: boolean
}) => {
    const { participantID, faction, maxHealth, maxShield, imageUrl } = warMachine
    const { state, subscribeWarMachineStatNetMessage } = useWebsocket()
    const { highlightMech } = useGame()

    const wmImageUrl = imageUrl || GenericWarMachinePNG

    const ICON_SIZE = isSpawnedAI ? 32 : 40
    const ARROW_LENGTH = ICON_SIZE / 2 + 20
    const DOT_SIZE = isSpawnedAI ? 45 : 70

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

    if (!position) return null

    return (
        <Stack
            key={`warMachine-${participantID}`}
            alignItems="center"
            justifyContent="center"
            sx={{
                position: "absolute",
                pointerEvents: "none",
                transform: `translate(-50%, -50%) translate3d(${(position.x - map.left) * map.scale}px, ${
                    (position.y - map.top) * map.scale
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
                                  highlightMech === warMachine.hash
                                      ? `0px 0px 20px 10px ${primaryColor}`
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
                              border: `6px solid #000000${isAlive ? "" : "00"}`,
                              borderRadius: "50%",
                              boxShadow:
                                  highlightMech === warMachine.hash ? `0px 0px 20px 20px ${primaryColor}` : "unset",
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
                            size={enlarged ? "25px" : isSpawnedAI ? "65px" : "90px"}
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
                                size="15px"
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

                {isAlive && enlarged && (
                    <Stack
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: "50%",
                            transform: "translate(-50%, calc(100% + 10px))",
                            width: 50,
                            zIndex: 1,
                        }}
                        spacing={0.3}
                    >
                        {warMachine.maxShield > 0 && (
                            <Box sx={{ width: "100%", height: 12, border: "1px solid #00000080", overflow: "hidden" }}>
                                <Box
                                    sx={{
                                        width: `${(shield / maxShield) * 100}%`,
                                        height: "100%",
                                        backgroundColor: colors.shield,
                                    }}
                                />
                            </Box>
                        )}
                        <Box sx={{ width: "100%", height: 12, border: "1px solid #00000080", overflow: "hidden" }}>
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
