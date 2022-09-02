import { Box, Typography } from "@mui/material"
import { useState } from "react"
import { TRAINING_ASSETS } from "../../constants"
import { opacityEffect } from "../../theme/keyframes"
import { colors, fonts } from "../../theme/theme"
import { FancyButton } from "../Common/FancyButton"

interface Context {
    time: number
    text: string
}

const context: Context[] = [
    {
        time: 0,
        text: "In the year 2112.",
    },
    {
        time: 3,
        text: "the biggest tech companies on earth.",
    },
    {
        time: 5,
        text: "were united in celebration",
    },
    {
        time: 9,
        text: "They gave birth to AI",
    },

    {
        time: 12,
        text: "the technological singularity",
    },

    {
        time: 15,
        text: "Corporate leaders saw the writing on the wallI",
    },

    {
        time: 18,
        text: "and converted their consciousness into artificial intelligences",
    },

    {
        time: 22,
        text: "These Corporate AI's,",
    },

    {
        time: 25,
        text: "singular in focus relentless in their desire",
    },

    {
        time: 27,
        text: "for expansion came to dominate the economy",
    },

    {
        time: 32,
        text: "Human controlled corporations",
    },

    {
        time: 34.5,
        text: "were quickly out manoeuvred",
    },

    {
        time: 36,
        text: "The old world had fallen",
    },

    {
        time: 39,
        text: "human rights and freedom",
    },
    {
        time: 40.5,
        text: "were quickly stripped",
    },
    {
        time: 42,
        text: "as AI conglomerates took over",
    },
    {
        time: 45.5,
        text: "The world was no longer",
    },
    {
        time: 47,
        text: "under human control",
    },
]

export const Intro = ({ toggleTrainingIntro }: { toggleTrainingIntro: (value?: boolean | undefined) => void }) => {
    const [stage, setStage] = useState<Context | null>(context[0])

    return (
        <Box sx={{ background: "#000", width: "100%", height: "100%", position: "relative" }}>
            <FancyButton
                clipThingsProps={{
                    clipSize: "9px",
                    backgroundColor: "#222222",
                    opacity: 0.8,
                    border: { borderColor: "#FFFFFF", borderThickness: "1px" },
                    sx: { position: "absolute", top: "3rem", right: "3rem", zIndex: 9 },
                }}
                sx={{ px: "1.6rem", py: ".3rem", color: "#FFFFFF" }}
                onClick={() => {
                    toggleTrainingIntro(false)
                }}
            >
                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: "#FFFFFF" }}>
                    Skip
                </Typography>
            </FancyButton>
            <video
                onTimeUpdate={(e) => {
                    const t = e.currentTarget.currentTime
                    const currentStage = context.find((s, i) => {
                        const isInFinalStage = t > s.time && i === context.length - 1
                        if (isInFinalStage) {
                            return true
                        }
                        const isInStage = t > s.time && t < context[i + 1].time
                        if (isInStage) {
                            return true
                        }
                    })
                    if (currentStage) {
                        setStage(currentStage)
                    }
                }}
                onEnded={() => {
                    setStage(null)
                    toggleTrainingIntro(false)
                }}
                muted
                controls
                controlsList="nofullscreen nodownload"
                disablePictureInPicture
                autoPlay
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            >
                <source src={`${TRAINING_ASSETS}/intro.mp4`} />
            </video>
            {stage && (
                <Box
                    key={stage.time}
                    sx={{
                        position: "absolute",
                        bottom: "20%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: `${colors.black2}99`,
                        padding: "2rem",
                        width: "calc(100% - 2rem)",
                        maxWidth: "1200px",
                        animation: `${opacityEffect} 1.5s ease-in-out`,
                    }}
                >
                    <Typography sx={{ fontSize: "32px" }}>{stage.text}</Typography>
                </Box>
            )}
        </Box>
    )
}
