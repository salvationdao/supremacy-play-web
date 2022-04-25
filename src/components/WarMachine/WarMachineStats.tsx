import { Box, Slide, Stack } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { useTheme } from "@mui/styles"
import { ReactElement, useEffect, useMemo } from "react"
import { BoxSlanted } from ".."
import { MINI_MAP_DEFAULT_SIZE } from "../../constants"
import { useDimension, useGame, useGameServerAuth, useGameServerWebsocket, useOverlayToggles } from "../../containers"
import { GameServerKeys } from "../../keys"
import { WarMachineItem } from "./WarMachineItem"

export const WarMachineStats = () => {
    const theme = useTheme<Theme>()
    const { state, subscribe } = useGameServerWebsocket()
    const { factionID } = useGameServerAuth()
    const { warMachines } = useGame()
    const { remToPxRatio } = useDimension()
    const { isMapOpen } = useOverlayToggles()

    const adjustment = useMemo(() => Math.min(remToPxRatio, 10) / 10, [remToPxRatio])

    // DO NOT REMOVE THIS! Subscribe to the result of the vote
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe(GameServerKeys.TriggerWarMachineLocationUpdated, () => null, null)
    }, [state, subscribe])

    const factionMechs = useMemo(
        () => (warMachines ? warMachines.filter((wm) => wm.faction && wm.faction.id && wm.factionID == factionID) : []),
        [warMachines, factionID],
    )
    const otherMechs = useMemo(
        () => (warMachines ? warMachines.filter((wm) => wm.faction && wm.faction.id && wm.factionID != factionID) : []),
        [warMachines, factionID],
    )
    const haveFactionMechs = useMemo(() => factionMechs.length > 0, [factionMechs])

    if (!warMachines || warMachines.length <= 0) return null

    return (
        <Slide in direction="up">
            <Stack
                id="tutorial-mech-stats"
                direction="row"
                alignItems="flex-end"
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: isMapOpen ? `calc(${MINI_MAP_DEFAULT_SIZE * adjustment}px + 2rem)` : 0,
                    zIndex: 13,
                    overflow: "hidden",
                    filter: "drop-shadow(0 3px 3px #00000020)",
                }}
            >
                {haveFactionMechs && (
                    <BoxSlanted
                        clipSize="9px"
                        clipSlantSize="26px"
                        skipLeft
                        sx={{
                            pl: ".5rem",
                            pr: "1.2rem",
                            pt: "2rem",
                            pb: "1.6rem",
                            backgroundColor: `${theme.factionTheme.background}95`,
                        }}
                    >
                        <ScrollContainer>
                            <Stack spacing="-3.8rem" direction="row" alignItems="center" justifyContent="center">
                                {factionMechs.map((wm) => (
                                    <WarMachineItem key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} scale={0.75} shouldBeExpanded={false} />
                                ))}
                            </Stack>
                        </ScrollContainer>
                    </BoxSlanted>
                )}

                {otherMechs.length > 0 && (
                    <Box sx={{ mb: ".48rem", pr: "1.6rem", pl: haveFactionMechs ? 0 : "1.28rem", overflow: "hidden" }}>
                        <ScrollContainer>
                            <Stack
                                spacing={haveFactionMechs ? "-4.96rem" : "-4.4rem"}
                                direction="row"
                                alignItems="center"
                                sx={{
                                    flex: 1,
                                    ml: haveFactionMechs ? "-1.8rem" : 0,
                                    pb: haveFactionMechs ? 0 : ".48rem",
                                }}
                            >
                                {otherMechs
                                    .sort((a, b) => a.factionID.localeCompare(b.factionID))
                                    .map((wm) => (
                                        <Box key={`${wm.participantID} - ${wm.hash}`} sx={{ ":not(:last-child)": { pr: "1.6rem" } }}>
                                            <WarMachineItem warMachine={wm} scale={haveFactionMechs ? 0.7 : 0.7} shouldBeExpanded={false} />
                                        </Box>
                                    ))}
                            </Stack>
                        </ScrollContainer>
                    </Box>
                )}
            </Stack>
        </Slide>
    )
}

const ScrollContainer = ({ children }: { children: ReactElement }) => {
    const theme = useTheme<Theme>()

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "hidden",
                overflowX: "auto",
                direction: "ltr",
                scrollbarWidth: "none",
                "::-webkit-scrollbar": {
                    height: ".4rem",
                },
                "::-webkit-scrollbar-track": {
                    background: "#FFFFFF15",
                    borderRadius: 3,
                },
                "::-webkit-scrollbar-thumb": {
                    background: `${theme.factionTheme.primary}50`,
                    borderRadius: 3,
                },
                transition: "all .2s",
            }}
        >
            <Box sx={{ direction: "ltr" }}>{children}</Box>
        </Box>
    )
}
