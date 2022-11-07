import { Box, Slide, Stack, useTheme } from "@mui/material"
import { ReactElement, useEffect, useMemo, useRef } from "react"
import { useMobile, useTraining } from "../../../containers"
import { siteZIndex } from "../../../theme/theme"
import { MechAbilityStages } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { WarMachineItemBT } from "./WarMachineItem/WarMachineItemBT"

export const WarMachineStatsBT = () => {
    const { isMobile } = useMobile()
    const theme = useTheme()
    const { warMachines, setTutorialRef, trainingStage } = useTraining()

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (trainingStage === MechAbilityStages.ExplainMA) {
            setTutorialRef(ref)
        }
    }, [trainingStage, setTutorialRef])

    const factionMechs = useMemo(
        () => (warMachines ? warMachines.filter((wm) => wm.factionID && wm.factionID === "7c6dde21-b067-46cf-9e56-155c88a520e2") : []),
        [warMachines],
    )
    const otherMechs = useMemo(
        () => (warMachines ? warMachines.filter((wm) => wm.factionID && wm.factionID !== "7c6dde21-b067-46cf-9e56-155c88a520e2") : []),
        [warMachines],
    )
    const haveFactionMechs = useMemo(() => factionMechs.length > 0, [factionMechs])

    if (!warMachines || warMachines.length <= 0) return null

    if (isMobile) {
        return (
            <>
                {haveFactionMechs && (
                    <Box
                        sx={{
                            backgroundColor: "#FFFFFF12",
                            boxShadow: 2,
                            border: "#FFFFFF20 1px solid",
                            p: "1.2rem 1.4rem",
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 50%)",
                        }}
                    >
                        {factionMechs.map((wm) => (
                            <WarMachineItemBT key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} scale={0.7} transformOrigin="0 0" initialExpanded />
                        ))}
                    </Box>
                )}

                {otherMechs.length > 0 && (
                    <Box
                        sx={{
                            backgroundColor: "#FFFFFF12",
                            boxShadow: 2,
                            border: "#FFFFFF20 1px solid",
                            p: "1.2rem 1.4rem",
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 50%)",
                        }}
                    >
                        {otherMechs
                            .sort((a, b) => a.factionID.localeCompare(b.factionID))
                            .map((wm) => (
                                <WarMachineItemBT key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} scale={0.7} transformOrigin="0 0" initialExpanded />
                            ))}
                    </Box>
                )}
            </>
        )
    }

    return (
        <Slide in direction="up">
            <Box
                id="tutorial-mech-stats"
                sx={{
                    position: "absolute",
                    bottom: "1rem",
                    left: 0,
                    right: 0,
                    zIndex: siteZIndex.MechStats,
                    overflow: "hidden",
                    filter: "drop-shadow(0 3px 3px #00000020)",
                }}
            >
                <Stack direction="row" alignItems="flex-end" sx={{ ml: "-3rem", pl: "2rem", transform: "skew(-6deg)" }}>
                    {haveFactionMechs && (
                        <ClipThing
                            ref={ref}
                            clipSize="10px"
                            corners={{ topRight: true }}
                            opacity={0.7}
                            backgroundColor={theme.factionTheme.background}
                            sx={{ height: "100%" }}
                        >
                            <HorizontalScrollContainer>
                                <Stack spacing="-.9rem" direction="row" alignItems="center" justifyContent="center" sx={{ px: "1.2rem", py: "2rem" }}>
                                    {factionMechs.map((wm) => (
                                        <WarMachineItemBT key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} scale={0.75} initialExpanded />
                                    ))}
                                </Stack>
                            </HorizontalScrollContainer>
                        </ClipThing>
                    )}

                    {otherMechs.length > 0 && (
                        <HorizontalScrollContainer>
                            <Stack spacing="-1.1rem" direction="row" alignItems="center" sx={{ flex: 1, px: "1.2rem", py: "2rem" }}>
                                {otherMechs
                                    .sort((a, b) => a.factionID.localeCompare(b.factionID))
                                    .map((wm) => (
                                        <WarMachineItemBT key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} scale={0.7} />
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
                transition: "all .2s",
            }}
        >
            <Box sx={{ direction: "ltr" }}>{children}</Box>
        </Box>
    )
}
