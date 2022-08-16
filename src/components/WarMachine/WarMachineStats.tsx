import { Box, Fade, Slide, Stack } from "@mui/material"
import { ReactElement, useEffect, useMemo } from "react"
import { useAuth, useGame, useMobile, useSupremacy } from "../../containers"
import { useToggle } from "../../hooks"
import { siteZIndex } from "../../theme/theme"
import { AIType } from "../../types"
import { SectionHeading } from "../LeftDrawer/BattleArena/Common/SectionHeading"
import { WarMachineItem } from "./WarMachineItem/WarMachineItem"

export const WarMachineStats = () => {
    const { battleIdentifier } = useSupremacy()
    return <WarMachineStatsInner key={battleIdentifier} />
}

const WarMachineStatsInner = () => {
    const { isMobile } = useMobile()
    const { factionID, userID } = useAuth()
    const { warMachines, spawnedAI, bribeStage } = useGame()

    // Temp hotfix ask james ****************************
    const [show, toggleShow] = useToggle(false)
    useEffect(() => {
        toggleShow(bribeStage && bribeStage.phase !== "HOLD" ? true : false)
    }, [bribeStage, toggleShow])
    // End ****************************************

    const factionMechs = useMemo(() => (warMachines ? warMachines.filter((wm) => wm.factionID && wm.factionID === factionID) : []), [warMachines, factionID])
    const otherMechs = useMemo(() => (warMachines ? warMachines.filter((wm) => wm.factionID && wm.factionID !== factionID) : []), [warMachines, factionID])
    const haveFactionMechs = useMemo(() => factionMechs.length > 0, [factionMechs])
    const ownedMiniMechs = useMemo(
        () => (spawnedAI ? spawnedAI.filter((sa) => sa.aiType === AIType.MiniMech && sa.ownedByID === userID) : []),
        [spawnedAI, userID],
    )

    if (!warMachines || warMachines.length <= 0) return null

    if (isMobile) {
        if (!show) return null
        return (
            <>
                {ownedMiniMechs.length > 0 && (
                    <Fade in>
                        <Box>
                            <SectionHeading label="YOUR MINI MECHS" />
                            <Stack
                                spacing="1rem"
                                sx={{
                                    backgroundColor: "#FFFFFF12",
                                    boxShadow: 2,
                                    border: "#FFFFFF20 1px solid",
                                    p: "1.2rem 1.4rem",
                                }}
                            >
                                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 50%)" }}>
                                    {ownedMiniMechs.map((mm) => (
                                        <WarMachineItem key={`${mm.participantID}`} warMachine={mm} scale={0.5} transformOrigin="0 0" initialExpanded />
                                    ))}
                                </Box>
                            </Stack>
                        </Box>
                    </Fade>
                )}

                {haveFactionMechs && (
                    <Box>
                        <SectionHeading label="YOUR FACTION" />
                        <Stack
                            spacing="1rem"
                            sx={{
                                backgroundColor: "#FFFFFF12",
                                boxShadow: 2,
                                border: "#FFFFFF20 1px solid",
                                p: "1.2rem 1.4rem",
                            }}
                        >
                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 50%)" }}>
                                {factionMechs.map((wm) => (
                                    <WarMachineItem
                                        key={`${wm.participantID} - ${wm.hash}`}
                                        warMachine={wm}
                                        scale={0.7}
                                        transformOrigin="0 0"
                                        initialExpanded
                                    />
                                ))}
                            </Box>
                        </Stack>
                    </Box>
                )}

                {otherMechs.length > 0 && (
                    <Box>
                        <SectionHeading label="OTHER FACTIONS" />
                        <Stack
                            spacing="1rem"
                            sx={{
                                backgroundColor: "#FFFFFF12",
                                boxShadow: 2,
                                border: "#FFFFFF20 1px solid",
                                p: "1.2rem 1.4rem",
                            }}
                        >
                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 50%)" }}>
                                {otherMechs
                                    .sort((a, b) => a.factionID.localeCompare(b.factionID))
                                    .map((wm) => (
                                        <WarMachineItem
                                            key={`${wm.participantID} - ${wm.hash}`}
                                            warMachine={wm}
                                            scale={0.7}
                                            transformOrigin="0 0"
                                            initialExpanded
                                        />
                                    ))}
                            </Box>
                        </Stack>
                    </Box>
                )}
            </>
        )
    }

    return (
        <Slide in={show} direction="up">
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: siteZIndex.MechStats,
                    overflow: "hidden",
                    filter: "drop-shadow(0 3px 3px #00000020)",
                }}
            >
                {ownedMiniMechs.length > 0 && (
                    <Fade in>
                        <Stack sx={{ px: "2rem", transform: "skew(-6deg)" }}>
                            <HorizontalScrollContainer>
                                <Stack spacing="-3rem" direction="row" alignItems="center">
                                    {ownedMiniMechs.map((mm) => (
                                        <WarMachineItem key={`${mm.participantID}`} warMachine={mm} scale={0.6} />
                                    ))}
                                </Stack>
                            </HorizontalScrollContainer>
                        </Stack>
                    </Fade>
                )}

                <Stack sx={{ px: "2rem", transform: "skew(-6deg)" }}>
                    {haveFactionMechs && (
                        <HorizontalScrollContainer>
                            <Stack spacing="-1.1rem" direction="row" alignItems="center">
                                {factionMechs.map((wm) => (
                                    <WarMachineItem key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} scale={0.7} />
                                ))}
                            </Stack>
                        </HorizontalScrollContainer>
                    )}

                    {otherMechs.length > 0 && (
                        <HorizontalScrollContainer>
                            <Stack spacing="-1.1rem" direction="row" alignItems="center">
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
