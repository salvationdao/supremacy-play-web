import { Modal, Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { GAME_BAR_HEIGHT } from "../../constants"
import { useTraining } from "../../containers"
import { CompletedTraining, TrainingLobby } from "../../types"
import { TOP_BAR_HEIGHT } from "../BigDisplay/MiniMap/MiniMap"

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
        <Modal open={true}>
            <Stack
                gap="1rem"
                alignItems="center"
                sx={{
                    position: "absolute",
                    top: `calc(50% - ${GAME_BAR_HEIGHT + TOP_BAR_HEIGHT}rem)`,
                    left: "50%",
                    transform: "translateX(-50%)",
                    p: "4em",
                    zIndex: 9999,
                }}
            >
                <Typography variant="h2">{text}</Typography>
                <Typography sx={{ fontSize: "3rem", textTransform: "uppercase" }}>Training Completed</Typography>
            </Stack>
        </Modal>
    )
}
