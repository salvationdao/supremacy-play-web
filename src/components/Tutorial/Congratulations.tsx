import { Box, LinearProgress, Modal, Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import Confetti from "react-confetti"
import { GAME_BAR_HEIGHT, PASSPORT_SIGNUP } from "../../constants"
import { useDimension, useTraining } from "../../containers"
import { opacityEffect } from "../../theme/keyframes"
import { colors, fonts } from "../../theme/theme"
import { CompletedTraining } from "../../types"
import { TOP_BAR_HEIGHT } from "../BigDisplay/MiniMapNew/MiniMapNew"
import { FancyButton } from "../Common/FancyButton"

export enum TrainingAbility {
    Battle = "battle",
    Player = "player",
    Mech = "mech",
}

export const Congratulations = ({ ability, open }: { ability: TrainingAbility; open: boolean }) => {
    const { completed, setCompleted } = useTraining()
    const { gameUIDimensions } = useDimension()

    let text = "Congratulations"
    let isCompleted = false

    useEffect(() => {
        switch (ability) {
            case TrainingAbility.Battle:
                setCompleted((prevState) => {
                    return {
                        ...prevState,
                        [CompletedTraining.BattleAbility]: true,
                    }
                })
                break
            case TrainingAbility.Mech:
                setCompleted((prevState) => {
                    return {
                        ...prevState,
                        [CompletedTraining.MechAbility]: true,
                    }
                })
                break
            case TrainingAbility.Player:
                setCompleted((prevState) => {
                    return {
                        ...prevState,
                        [CompletedTraining.PlayerAbility]: true,
                    }
                })
                break
            default:
                break
        }
    }, [ability, setCompleted])

    switch (ability) {
        case TrainingAbility.Battle:
            text = "Battle Ability"

            break
        case TrainingAbility.Mech:
            text = "Mech Ability"
            break
        case TrainingAbility.Player:
            text = "Player Ability"
            break
        default:
            break
    }

    // If all abilities are completed
    if (Object.values(completed).every((c) => c)) {
        text = "Congratulations"
        isCompleted = true
    }

    return (
        <Modal
            closeAfterTransition
            open={open}
            BackdropProps={{
                style: {
                    backgroundColor: "rgba(0,0,0,0.7)",
                    transitionDuration: "2s",
                },
            }}
        >
            <Box>
                {isCompleted && (
                    <Confetti
                        numberOfPieces={600}
                        initialVelocityX={1}
                        initialVelocityY={1}
                        width={gameUIDimensions.width}
                        tweenDuration={20000}
                        height={gameUIDimensions.height}
                        recycle={false}
                    />
                )}
                <Stack
                    gap="1rem"
                    alignItems="center"
                    sx={{
                        position: "absolute",
                        top: `calc(50% - ${GAME_BAR_HEIGHT + 2 * TOP_BAR_HEIGHT}rem)`,
                        left: "50%",
                        transform: "translateX(-50%)",
                        p: "4em",
                        zIndex: 9999,
                        animation: `${opacityEffect} 2s cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: "8rem",
                            whiteSpace: "nowrap",
                            fontFamily: fonts.nostromoBlack,
                            WebkitTextStrokeWidth: "1px",
                            WebkitTextStrokeColor: colors.black2,
                            textShadow: `1px 3px ${colors.black2}`,
                            color: isCompleted ? colors.gold : "white",
                        }}
                    >
                        {text}
                    </Typography>
                    {!isCompleted ? (
                        <Typography sx={{ fontSize: "5rem", textTransform: "uppercase", fontFamily: fonts.nostromoBlack, color: colors.green }}>
                            Training Completed
                        </Typography>
                    ) : (
                        <Typography
                            sx={{ fontSize: "4rem", textTransform: "uppercase", fontFamily: fonts.nostromoBlack, textAlign: "center", whiteSpace: "nowrap" }}
                        >
                            You have completed battle training
                        </Typography>
                    )}
                    {!isCompleted && (
                        <LinearProgress
                            sx={{
                                width: "90%",
                                height: "10px",
                                mt: "4rem",
                                backgroundColor: `${colors.gold}15`,
                                ".MuiLinearProgress-bar": { backgroundColor: `${colors.gold}` },
                                opacity: 0,
                                animation: `${opacityEffect} 3s`,
                                animationDelay: "2s",
                            }}
                        />
                    )}
                    {isCompleted && (
                        <FancyButton
                            clipThingsProps={{
                                clipSize: "6px",
                                backgroundColor: colors.neonBlue,
                                opacity: 1,
                                border: { borderColor: colors.neonBlue, borderThickness: "1px" },
                                sx: { position: "relative", mx: "2rem" },
                            }}
                            sx={{ px: "2em", py: 0, color: colors.darkestNeonBlue }}
                            href={PASSPORT_SIGNUP}
                        >
                            <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBold, color: colors.darkestNeonBlue, fontSize: "4rem" }}>
                                Start Playing
                            </Typography>
                        </FancyButton>
                    )}
                </Stack>
            </Box>
        </Modal>
    )
}
