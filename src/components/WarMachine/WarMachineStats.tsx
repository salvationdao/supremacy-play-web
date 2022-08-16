import { Box, Divider, Fade, IconButton, Slide, Stack, Typography } from "@mui/material"
import { ReactElement, useEffect, useMemo } from "react"
import { ClipThing } from ".."
import { SvgExternalLink } from "../../assets"
import { useGame, useMobile, useSupremacy } from "../../containers"
import { useTheme } from "../../containers/theme"
import { useToggle } from "../../hooks"
import { fonts, siteZIndex } from "../../theme/theme"
import { WindowPortal } from "../Common/WindowPortal"
import { WarMachineItem } from "./WarMachineItem/WarMachineItem"

export const WarMachineStats = () => {
    const { battleIdentifier } = useSupremacy()
    return <WarMachineStatsInner key={battleIdentifier} />
}

const WarMachineStatsInner = () => {
    const { isMobile } = useMobile()
    const theme = useTheme()
    const { warMachines, bribeStage, map, factionWarMachines, otherWarMachines, ownedMiniMechs } = useGame()
    const [isPoppedout, toggleIsPoppedout] = useToggle()

    // Temp hotfix ask james ****************************
    const [show, toggleShow] = useToggle(false)
    useEffect(() => {
        toggleShow(bribeStage && bribeStage.phase !== "HOLD" ? true : false)
    }, [bribeStage, toggleShow])
    // End ****************************************

    const haveFactionMechs = useMemo(() => factionWarMachines && factionWarMachines.length > 0, [factionWarMachines])

    if (isPoppedout) {
        return (
            <WindowPortal
                title="Supremacy - Live Chat"
                onClose={() => toggleIsPoppedout(false)}
                features={{
                    width: 345,
                    height: 896,
                }}
            >
                <Stack
                    alignItems="center"
                    justifyContent="flex-start"
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    {/* map background image */}
                    <Box
                        sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            background: `url(${map?.image_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            opacity: 0.15,
                        }}
                    />

                    <ClipThing
                        clipSize="10px"
                        border={{
                            borderColor: theme.factionTheme.primary,
                            borderThickness: ".6rem",
                        }}
                        opacity={0.7}
                        backgroundColor={theme.factionTheme.background}
                        sx={{ flex: 1, transform: "scale(0.7)" }}
                    >
                        <Stack sx={{ height: "100%" }}>
                            <Box
                                sx={{
                                    flex: 1,
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    ml: "1.9rem",
                                    mr: ".5rem",
                                    pr: "1.4rem",
                                    my: "1rem",
                                    direction: "ltr",
                                    scrollbarWidth: "none",
                                    "::-webkit-scrollbar": {
                                        width: ".4rem",
                                    },
                                    "::-webkit-scrollbar-track": {
                                        background: "#FFFFFF15",
                                        borderRadius: 3,
                                    },
                                    "::-webkit-scrollbar-thumb": {
                                        background: (theme) => theme.factionTheme.primary,
                                        borderRadius: 3,
                                    },
                                }}
                            >
                                <Box sx={{ direction: "ltr", height: 0 }}>
                                    <Stack spacing="2.6rem" justifyContent="center" sx={{ p: "2rem" }}>
                                        {otherWarMachines &&
                                            otherWarMachines.length > 0 &&
                                            otherWarMachines.map((wm, i) => (
                                                <Box key={`${wm.participantID} - ${wm.hash}`}>
                                                    <WarMachineItem
                                                        warMachine={wm}
                                                        scale={1}
                                                        label={i + 1 + (factionWarMachines ? factionWarMachines?.length : 0)}
                                                        initialExpanded
                                                        isPoppedout
                                                    />
                                                </Box>
                                            ))}

                                        <Divider orientation="horizontal" />

                                        {haveFactionMechs &&
                                            factionWarMachines &&
                                            factionWarMachines.map((wm, i) => (
                                                <Box key={`${wm.participantID} - ${wm.hash}`}>
                                                    <WarMachineItem warMachine={wm} scale={1} label={i + 1} initialExpanded isPoppedout />
                                                </Box>
                                            ))}

                                        {ownedMiniMechs.length && (
                                            <>
                                                <Divider orientation="horizontal" />
                                                {ownedMiniMechs.map((mm) => (
                                                    <Box key={`${mm.participantID}`}>
                                                        <WarMachineItem warMachine={mm} scale={0.8} transformOrigin="0 0" initialExpanded isPoppedout />
                                                    </Box>
                                                ))}
                                            </>
                                        )}
                                    </Stack>
                                </Box>
                            </Box>
                        </Stack>
                    </ClipThing>
                </Stack>
            </WindowPortal>
        )
    }

    if (!warMachines || warMachines.length <= 0) return null

    if (isMobile) {
        if (!show) return null
        return (
            <>
                <Fade in={ownedMiniMechs.length > 0}>
                    <Stack
                        spacing="1rem"
                        sx={{
                            backgroundColor: "#FFFFFF12",
                            boxShadow: 2,
                            border: "#FFFFFF20 1px solid",
                            p: "1.2rem 1.4rem",
                        }}
                    >
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>YOUR MINI MECHS</Typography>

                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 50%)" }}>
                            {ownedMiniMechs.map((mm) => (
                                <WarMachineItem key={`${mm.participantID}`} warMachine={mm} scale={0.5} transformOrigin="0 0" initialExpanded />
                            ))}
                        </Box>
                    </Stack>
                </Fade>
                {haveFactionMechs && (
                    <Stack
                        spacing="1rem"
                        sx={{
                            backgroundColor: "#FFFFFF12",
                            boxShadow: 2,
                            border: "#FFFFFF20 1px solid",
                            p: "1.2rem 1.4rem",
                        }}
                    >
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>YOUR FACTION</Typography>

                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 25%)" }}>
                            {factionWarMachines &&
                                factionWarMachines.map((wm, i) => (
                                    <WarMachineItem
                                        key={`${wm.participantID} - ${wm.hash}`}
                                        warMachine={wm}
                                        scale={0.7}
                                        label={i + 1}
                                        transformOrigin="0 0"
                                        initialExpanded
                                    />
                                ))}
                        </Box>
                    </Stack>
                )}

                {otherWarMachines && otherWarMachines.length > 0 && (
                    <Stack
                        spacing="1rem"
                        sx={{
                            backgroundColor: "#FFFFFF12",
                            boxShadow: 2,
                            border: "#FFFFFF20 1px solid",
                            p: "1.2rem 1.4rem",
                        }}
                    >
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>OTHER FACTIONS</Typography>

                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 25%)" }}>
                            {otherWarMachines &&
                                otherWarMachines.map((wm, i) => (
                                    <WarMachineItem
                                        key={`${wm.participantID} - ${wm.hash}`}
                                        warMachine={wm}
                                        scale={0.7}
                                        transformOrigin="0 0"
                                        label={i + 1 + (factionWarMachines ? factionWarMachines?.length : 0)}
                                        initialExpanded
                                    />
                                ))}
                        </Box>
                    </Stack>
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
                <Fade in={ownedMiniMechs.length > 0}>
                    <Stack direction="row" sx={{ ml: "-3rem", pl: "2rem", transform: "skew(-6deg)" }}>
                        <Box>
                            <HorizontalScrollContainer>
                                <Stack spacing="-3rem" direction="row" alignItems="center" justifyContent="center" sx={{ px: ".6rem", py: ".6rem" }}>
                                    {ownedMiniMechs.map((mm) => (
                                        <WarMachineItem key={`${mm.participantID}`} warMachine={mm} scale={0.6} />
                                    ))}
                                </Stack>
                            </HorizontalScrollContainer>
                        </Box>
                    </Stack>
                </Fade>
                <IconButton
                    onClick={() => toggleIsPoppedout()}
                    edge="end"
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        opacity: 0.5,
                        ":hover": { opacity: 1 },
                        transition: "all .1s",
                        zIndex: 99,
                    }}
                >
                    <SvgExternalLink size="1.3rem" fill="#FFFFFF" sx={{ pb: 0 }} />
                </IconButton>
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
                                <Stack spacing="-.9rem" direction="row" alignItems="center" justifyContent="center" sx={{ px: "1.2rem", py: "2rem" }}>
                                    {factionWarMachines &&
                                        factionWarMachines.map((wm, i) => (
                                            <WarMachineItem key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} scale={0.75} label={i + 1} />
                                        ))}
                                </Stack>
                            </HorizontalScrollContainer>
                        </ClipThing>
                    )}

                    {otherWarMachines && otherWarMachines.length > 0 && (
                        <HorizontalScrollContainer>
                            <Stack spacing="-1.1rem" direction="row" alignItems="center" sx={{ flex: 1, px: "1.2rem", py: "2rem" }}>
                                {otherWarMachines.map((wm, i) => (
                                    <WarMachineItem
                                        key={`${wm.participantID} - ${wm.hash}`}
                                        warMachine={wm}
                                        scale={0.7}
                                        label={i + 1 + (factionWarMachines ? factionWarMachines?.length : 0)}
                                    />
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
