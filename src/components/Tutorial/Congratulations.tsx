import { Box, Fade, Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { GAME_BAR_HEIGHT } from "../../constants"
import { useTraining } from "../../containers"
import { colors, fonts, theme } from "../../theme/theme"
import { CompletedTraining, TrainingLobby } from "../../types"
import { TOP_BAR_HEIGHT } from "../BigDisplay/MiniMap/MiniMap"
import { ClipThing } from "../Common/ClipThing"
import { FancyButton } from "../Common/FancyButton"

export enum TrainingAbility {
    Battle = "battle",
    Player = "player",
    Mech = "mech",
}

export const Congratulations = ({ ability }: { ability: TrainingAbility }) => {
    const { completed, setCompleted, setTrainingStage } = useTraining()

    let text = "All"
    let nextStage: TrainingLobby = TrainingLobby.Signup
    let nextStageText = "Sign up"

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
            nextStage = TrainingLobby.MechAbility
            nextStageText = "Mech Ability"
            break
        case TrainingAbility.Mech:
            text = "Mech Ability"
            nextStage = TrainingLobby.PlayerAbility
            nextStageText = "Player Ability"
            break
        case TrainingAbility.Player:
            text = "Player Ability"
            nextStage = TrainingLobby.BattleAbility
            nextStageText = "Battle Ability"
            break
        default:
            break
    }

    // If all abilities are completed
    if (Object.values(completed).every((c) => c)) {
        text = "All"
        nextStage = TrainingLobby.Signup
        nextStageText = "Join the Battle Arena"
    }

    return (
        <Fade in={true} timeout={500}>
            <ClipThing
                clipSize="8px"
                border={{
                    borderThickness: ".25rem",
                    borderColor: theme.factionTheme.primary,
                }}
                backgroundColor={theme.factionTheme.background}
                opacity={0.8}
                sx={{
                    position: "absolute",
                    top: `calc(50% - ${GAME_BAR_HEIGHT + TOP_BAR_HEIGHT}rem)`,
                    left: "50%",
                    transform: "translateX(-50%)",
                    p: "4em",
                }}
            >
                <Stack gap="1rem" alignItems="center">
                    <Typography variant="h2">Congratulations</Typography>
                    <Typography sx={{ fontSize: "3rem" }}>You have completed {text} training!</Typography>
                    <Box
                        sx={{
                            mt: "1rem",
                            width: "100%",
                            display: "flex",
                            gap: "1rem",
                            alignItems: "stretch",
                            "& button": {
                                height: "100%",
                                "& *": {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                },
                            },
                        }}
                    >
                        <FancyButton
                            fullWidth
                            clipThingsProps={{
                                clipSize: "7px",
                                sx: {
                                    width: "100%",
                                    height: "100%",
                                },
                            }}
                            sx={{
                                width: "100%",
                                height: "100%",
                                px: "1.2rem",
                                fontSize: "1.4rem",
                                fontFamily: fonts.nostromoBlack,
                                backgroundColor: colors.grey,
                                "&:hover": {
                                    backgroundColor: `${colors.grey}99`,
                                    color: "white",
                                },
                            }}
                            onClick={() => {
                                setTrainingStage(TrainingLobby.All)
                            }}
                        >
                            Go to Lobby
                        </FancyButton>
                        <FancyButton
                            fullWidth
                            clipThingsProps={{
                                clipSize: "7px",
                                sx: {
                                    width: "100%",
                                },
                            }}
                            sx={{
                                width: "100%",
                                px: "1.2rem",
                                fontSize: "1.4rem",
                                fontFamily: fonts.nostromoBlack,
                                backgroundColor: colors.green,
                                "&:hover": {
                                    backgroundColor: `${colors.green}99`,
                                    color: "white",
                                },
                            }}
                            onClick={() => {
                                setTrainingStage(nextStage)
                            }}
                        >
                            Learn {nextStageText}
                        </FancyButton>{" "}
                    </Box>
                </Stack>
            </ClipThing>
        </Fade>
    )
}
