import { Box, Slide, Stack } from "@mui/material"
import { ReactElement, useEffect, useMemo } from "react"
import { ClipThing } from ".."
import { MINI_MAP_DEFAULT_SIZE } from "../../constants"
import { useAuth, useDimension, useGame, useOverlayToggles, useSupremacy } from "../../containers"
import { useTheme } from "../../containers/theme"
import { useToggle } from "../../hooks"
import { siteZIndex } from "../../theme/theme"
import { WarMachineItem } from "./WarMachineItem/WarMachineItem"

export const WarMachineStats = () => {
    const theme = useTheme()
    const { factionID } = useAuth()
    const { battleIdentifier } = useSupremacy()
    const { warMachines, bribeStage } = useGame()
    const { remToPxRatio } = useDimension()
    const { isMapOpen } = useOverlayToggles()

    // Temp hotfix ask james ****************************
    const [show, toggleShow] = useToggle(false)
    useEffect(() => {
        toggleShow(bribeStage && bribeStage.phase !== "HOLD")
    }, [bribeStage, toggleShow])
    // End ****************************************

    const adjustment = useMemo(() => Math.min(remToPxRatio, 10) / 10, [remToPxRatio])

    const factionMechs = useMemo(() => (warMachines ? warMachines.filter((wm) => wm.factionID && wm.factionID === factionID) : []), [warMachines, factionID])
    const otherMechs = useMemo(() => (warMachines ? warMachines.filter((wm) => wm.factionID && wm.factionID !== factionID) : []), [warMachines, factionID])
    const haveFactionMechs = useMemo(() => factionMechs.length > 0, [factionMechs])

    if (!warMachines || warMachines.length <= 0) return null

    return (
        <Slide in={show} direction="up" key={battleIdentifier}>
            <Box
                id="tutorial-mech-stats"
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: isMapOpen ? `calc(${MINI_MAP_DEFAULT_SIZE * adjustment}px + 2rem)` : 0,
                    zIndex: siteZIndex.MechStats,
                    overflow: "hidden",
                    filter: "drop-shadow(0 3px 3px #00000020)",
                }}
            >
                <Stack direction="row" alignItems="flex-end" sx={{ ml: "-3rem", pl: "2rem", transform: "skew(-6deg)" }}>
                    {haveFactionMechs && (
                        <ClipThing
                            clipSize="10px"
                            corners={{ topRight: true }}
                            opacity={0.7}
                            backgroundColor={theme.factionTheme.background}
                            sx={{ height: "100%" }}
                        >
                            <HorizontalScrollContainer>
                                <Stack spacing="-.6rem" direction="row" alignItems="center" justifyContent="center" sx={{ px: "2rem", py: "2rem" }}>
                                    {factionMechs.map((wm) => (
                                        <WarMachineItem key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} scale={0.75} />
                                    ))}
                                </Stack>
                            </HorizontalScrollContainer>
                        </ClipThing>
                    )}

                    {otherMechs.length > 0 && (
                        <HorizontalScrollContainer>
                            <Stack spacing="-.8rem" direction="row" alignItems="center" sx={{ flex: 1, px: "2rem", py: "2rem" }}>
                                {otherMechs
                                    .sort((a, b) => a.factionID.localeCompare(b.factionID))
                                    .map((wm) => (
                                        <WarMachineItem key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} scale={0.7} />
                                    ))}
                            </Stack>
                        </HorizontalScrollContainer>
                    )}
                </Stack>
            </Box>
        </Slide>
    )
}

const HorizontalScrollContainer = ({ children }: { children: ReactElement }) => {
    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "hidden",
                overflowX: "auto",
                direction: "ltr",

                "::-webkit-scrollbar": {
                    height: ".4rem",
                },
                "::-webkit-scrollbar-track": {
                    background: "#FFFFFF15",
                    borderRadius: 3,
                },
                "::-webkit-scrollbar-thumb": {
                    background: (theme) => `${theme.factionTheme.primary}50`,
                    borderRadius: 3,
                },
                transition: "all .2s",
            }}
        >
            <Box sx={{ direction: "ltr" }}>{children}</Box>
        </Box>
    )
}
