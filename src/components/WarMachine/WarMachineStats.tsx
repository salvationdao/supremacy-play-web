import { Box, Fade, Slide, Stack } from "@mui/material"
import { useMemo } from "react"
import { ADD_MINI_MECH_PARTICIPANT_ID } from "../../constants"
import { BattleState, useGame, useMobile, useSupremacy } from "../../containers"
import { siteZIndex } from "../../theme/theme"
import { SectionHeading } from "../LeftDrawer/BattleArena/Common/SectionHeading"
import { WarMachineItem } from "./WarMachineItem/WarMachineItem"

export const WarMachineStats = () => {
    const { battleIdentifier } = useSupremacy()
    return <WarMachineStatsInner key={battleIdentifier} />
}

const WarMachineStatsInner = () => {
    const { isMobile } = useMobile()
    const { warMachines, factionWarMachines, otherWarMachines, ownedMiniMechs, battleState } = useGame()

    const haveFactionMechs = useMemo(() => factionWarMachines && factionWarMachines.length > 0, [factionWarMachines])

    if (!warMachines || warMachines.length <= 0) return null

    if (isMobile) {
        if (battleState !== BattleState.BattlingState) return null

        return (
            <>
                {ownedMiniMechs.length > 0 && (
                    <Fade in>
                        <Box>
                            <SectionHeading label="YOUR SUPPORT MACHINES" />
                            <Stack
                                spacing="1rem"
                                sx={{
                                    backgroundColor: "#FFFFFF12",
                                    boxShadow: 2,
                                    border: "#FFFFFF20 1px solid",
                                    p: "1.2rem 1.4rem",
                                    mx: "-3rem",
                                }}
                            >
                                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 50%)" }}>
                                    {ownedMiniMechs.map((wm) => (
                                        <WarMachineItem
                                            key={`war-machine-item-${wm.hash}`}
                                            warMachine={wm}
                                            scale={0.5}
                                            label={wm.participantID - ADD_MINI_MECH_PARTICIPANT_ID}
                                            transformOrigin="0 0"
                                            initialExpanded
                                        />
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
                                {factionWarMachines &&
                                    factionWarMachines.map((wm, i) => (
                                        <WarMachineItem
                                            key={`war-machine-item-${wm.hash}`}
                                            warMachine={wm}
                                            scale={0.7}
                                            label={i + 1}
                                            transformOrigin="0 0"
                                            initialExpanded
                                        />
                                    ))}
                            </Box>
                        </Stack>
                    </Box>
                )}

                {otherWarMachines && otherWarMachines.length > 0 && (
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
                                {otherWarMachines &&
                                    otherWarMachines.map((wm, i) => (
                                        <WarMachineItem
                                            key={`war-machine-item-${wm.hash}`}
                                            warMachine={wm}
                                            scale={0.7}
                                            transformOrigin="0 0"
                                            label={i + 1 + (factionWarMachines?.length || 0)}
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
        <Slide in={battleState === BattleState.BattlingState} direction="up">
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: siteZIndex.MechStats,
                    overflow: "hidden",
                    filter: "drop-shadow(0 3px 3px #00000020)",
                    pointerEvents: "none",
                }}
            >
                <Box
                    sx={{
                        overflowY: "hidden",
                        overflowX: "auto",
                        direction: "ltr",
                        mx: "1rem",
                        mb: ".8rem",
                        px: ".8rem",
                        py: ".8rem",

                        "::-webkit-scrollbar": {
                            height: ".6em",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: (theme) => `${theme.factionTheme.primary}`,
                        },
                        transition: "all .2s",
                    }}
                >
                    <Box sx={{ direction: "ltr" }}>
                        <Stack spacing="1rem" sx={{ transform: "skew(-6deg)" }}>
                            {ownedMiniMechs.length > 0 && (
                                <Fade in>
                                    <Stack spacing="-1.2rem" direction="row" alignItems="center">
                                        {ownedMiniMechs.map((wm) => (
                                            <WarMachineItem
                                                key={`war-machine-item-${wm.hash}`}
                                                warMachine={wm}
                                                label={wm.participantID - ADD_MINI_MECH_PARTICIPANT_ID}
                                                scale={0.6}
                                            />
                                        ))}
                                    </Stack>
                                </Fade>
                            )}

                            <Stack direction="row" alignItems="center">
                                {haveFactionMechs &&
                                    factionWarMachines &&
                                    factionWarMachines.map((wm, i) => (
                                        <WarMachineItem key={`war-machine-item-${wm.hash}`} warMachine={wm} scale={0.75} label={i + 1} />
                                    ))}

                                {otherWarMachines &&
                                    otherWarMachines.length > 0 &&
                                    otherWarMachines.map((wm, i) => (
                                        <WarMachineItem
                                            key={`war-machine-item-${wm.hash}`}
                                            warMachine={wm}
                                            scale={0.7}
                                            label={i + 1 + (factionWarMachines ? factionWarMachines?.length : 0)}
                                        />
                                    ))}
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Slide>
    )
}
