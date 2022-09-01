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
        text: "In the year 2149,Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
        time: 7,
        text: "2nd stage Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
        time: 14,
        text: "3rdnd stage 2149,Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
        time: 20,
        text: "Last stage 2149,Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
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
