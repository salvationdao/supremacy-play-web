import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { Box, Fade, Stack, Typography, useTheme } from "@mui/material"
import { Mask } from "@reactour/mask"
import { Popover } from "@reactour/popover"
import { useRect } from "@reactour/utils"
import React, { useEffect, useRef } from "react"
import { useTraining } from "../../containers"
import { zoomEffect } from "../../theme/keyframes"
import { fonts } from "../../theme/theme"
import { Context, TrainingLobby } from "../../types"
import { TOP_BAR_HEIGHT } from "../BattleArena/BigDisplay/MiniMapNew/MiniMapNew"
import { FancyButton } from "../Common/Deprecated/FancyButton"
import { Congratulations, TrainingAbility } from "./Congratulations"
import { tourStyles } from "./SetupTutorial"

interface TutorialContainerProps {
    currentAbility: TrainingAbility
    stage: Context | null
    context: Context[]
    videoSource: string
    setStage: React.Dispatch<React.SetStateAction<Context | null>>
    end: boolean
    videoRef: React.RefObject<HTMLVideoElement>
    popoverOpen: boolean
    setPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const TutorialContainer: React.FC<TutorialContainerProps> = ({
    children,
    currentAbility,
    stage,
    context,
    videoSource,
    setStage,
    end,
    videoRef,
    popoverOpen,
    setPopoverOpen,
}) => {
    const { tutorialRef, setTrainingStage, updater, isStreamBigDisplay, bigDisplayRef, smallDisplayRef, completed } = useTraining()
    const sizes = useRect(tutorialRef, updater)
    const ref = useRef<HTMLDivElement>(null)
    const theme = useTheme()

    useEffect(() => {
        const thisElement = ref.current
        const newContainerElement = isStreamBigDisplay ? bigDisplayRef : smallDisplayRef

        if (thisElement && newContainerElement) {
            newContainerElement.appendChild(thisElement)
        }
    }, [isStreamBigDisplay, smallDisplayRef, bigDisplayRef])

    useEffect(() => {
        if (!end) return
        // If all abilities are completed
        if (Object.values(completed).every((c) => c)) return
        // Redirect to lobby after 5 seconds after showing congratulations
        const redirectToLobby = setTimeout(() => {
            setTrainingStage(TrainingLobby.All)
        }, 5000)

        return () => {
            clearTimeout(redirectToLobby)
        }
    }, [setTrainingStage, end, completed])

    return (
        <Box ref={ref} sx={{ background: "#000", width: "100%", height: "100%" }}>
            {/* Top bar */}
            <Stack
                spacing="1rem"
                direction="row"
                alignItems="center"
                sx={{
                    p: ".6rem 1.6rem",
                    height: `${TOP_BAR_HEIGHT}rem`,
                    background: (theme) => `linear-gradient(${theme.factionTheme.background} 26%, ${theme.factionTheme.background}BB)`,
                }}
            >
                <Typography sx={{ fontFamily: fonts.nostromoHeavy }}>BATTLE TRAINING</Typography>
            </Stack>
            {children}
            {end && <Congratulations open={end} ability={currentAbility} />}
            {stage && (
                <Fade in={popoverOpen}>
                    <Box>
                        <Popover sizes={sizes} styles={{ popover: tourStyles?.popover }} position="right">
                            <p>{stage.text}</p>
                            {stage.showNext && (
                                <FancyButton
                                    clipThingsProps={{
                                        backgroundColor: theme.factionTheme.primary,
                                        sx: { position: "relative", ml: "auto", mt: "2rem" },
                                        border: { borderColor: theme.factionTheme.primary },
                                        opacity: 0.5,
                                    }}
                                    onClick={() => {
                                        const i = context.findIndex((s) => s === stage)
                                        const nextStage = context[i + 1]
                                        if (nextStage.videoSource !== videoSource) {
                                            videoRef.current?.play()
                                            setPopoverOpen(false)
                                        } else {
                                            setStage(context[i + 1])
                                            setTrainingStage(context[i + 1].state)
                                        }
                                    }}
                                    sx={{
                                        width: "fit-content",
                                        fontFamily: fonts.nostromoBlack,
                                        p: ".5em 2em",

                                        display: "flex",
                                        gap: ".5rem",
                                        animation: `${zoomEffect(1.35)} 2s infinite`,
                                        color: theme.factionTheme.text,
                                    }}
                                >
                                    Next <ArrowForwardIcon />
                                </FancyButton>
                            )}
                        </Popover>
                        <Mask sizes={sizes} styles={{ maskWrapper: tourStyles?.maskWrapper }} />
                    </Box>
                </Fade>
            )}
        </Box>
    )
}
