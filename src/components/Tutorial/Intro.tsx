import { Box, Typography } from "@mui/material"
import { useRef, useState } from "react"
import { TRAINING_ASSETS } from "../../constants"
import { opacityEffect } from "../../theme/keyframes"
import { fonts } from "../../theme/theme"
import { FancyButton } from "../Common/FancyButton"

interface Context {
    time: number
    text: string
}

const context: Context[] = [
    { time: 0, text: "In the year 2112, the biggest tech companies on earth were united in celebration." },
    { time: 7.5, text: "They gave birth to AI. The technological singularity." },
    { time: 15, text: "Corporate leaders saw the writing on the wall and converted their consciousness into artificial intelligences." },
    { time: 22, text: "These Corporate AI's, singular in focus relentless in their desire for expansion came to dominate the economy." },
    { time: 32, text: "Human controlled corporations were quickly out manoeuvred." },
    { time: 36, text: "The old world had fallen. Human rights and freedom were quickly stripped." },
    { time: 42, text: "As AI conglomerates took over, the world was no longer under human control." },
]
const searchParams = new URLSearchParams(window.location.search)

export const Intro = ({ toggleTrainingIntro }: { toggleTrainingIntro: (value?: boolean | undefined) => void }) => {
    const [stage, setStage] = useState<Context | null>(context[0])
    const videoRef = useRef<HTMLVideoElement>(null)

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
                ref={videoRef}
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
                controls
                controlsList="nofullscreen nodownload"
                disablePictureInPicture
                autoPlay
                muted={searchParams.get("muted") === "false" ? false : true}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            >
                <source src={`${TRAINING_ASSETS}/intro2.mp4`} />
            </video>
            {stage && (
                <Box
                    key={stage.time}
                    sx={{
                        position: "absolute",
                        bottom: "10%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "2rem",
                        width: "calc(100% - 2rem)",
                        maxWidth: "1200px",
                        animation: `${opacityEffect} 1.5s ease-in-out`,
                    }}
                >
                    <Typography sx={{ textShadow: "2px 2px black", fontSize: "32px" }}>{stage.text}</Typography>
                </Box>
            )}
        </Box>
    )
}
