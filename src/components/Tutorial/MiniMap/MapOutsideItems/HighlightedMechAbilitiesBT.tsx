import { Box, Fade, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { useAuth, useTraining } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useInterval } from "../../../../hooks"
import { glowEffect, zoomEffect } from "../../../../theme/keyframes"
import {
    BattleAbilityStages,
    GameAbility,
    LocationSelectType,
    MechAbilitiesHighlight,
    MechAbilityStages,
    TrainingLocationSelects,
    WarMachineState,
} from "../../../../types"
import { ClipThing } from "../../../Common/ClipThing"
import { MoveCommandBT } from "../../WarMachine/WarMachineItem/MoveCommandBT"
import { TruncateTextLines } from "../../../../theme/styles"

const trainingGameAbilities: GameAbility[] = [
    {
        id: "4fc7e90a-bf5f-4cb4-a8ed-2b48860554b8",
        game_client_ability_id: 2,
        label: "REPAIR",
        colour: "#23AE3C",
        image_url: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/ability-repair.jpg",
        sups_cost: "70000000000000000000",
        description: "Support your Syndicate with a well-timed repair.",
        text_colour: "#FFFFFF",
        current_sups: "0",
        location_select_type: LocationSelectType.LocationSelect,
        identity: "",
        ability_offering_id: "",
    },
    {
        id: "cf5218ec-42c6-41df-8e2c-aa0b4e89bad6",
        game_client_ability_id: 5,
        label: "OVERCHARGE",
        colour: "#FFFFFF",
        image_url: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/ability-overcharge.jpg",
        sups_cost: "20584764066757779948",
        description: "Consume your remaining shield for an explosive defence mechanism.",
        text_colour: "#000000",
        current_sups: "0",
        location_select_type: LocationSelectType.LocationSelect,
        identity: "",
        ability_offering_id: "",
    },
]

export const HighlightedMechAbilitiesBT = () => {
    const { warMachines, highlightedMechParticipantID, isTargeting, trainingStage } = useTraining()

    const highlightedMech = useMemo(() => {
        return warMachines?.find((m) => m.participantID === highlightedMechParticipantID)
    }, [highlightedMechParticipantID, warMachines])

    if (isTargeting || !highlightedMechParticipantID || !highlightedMech || trainingStage in BattleAbilityStages) {
        return null
    }

    return <HighlightedMechAbilitiesInner key={highlightedMechParticipantID} warMachine={highlightedMech} />
}

const HighlightedMechAbilitiesInner = ({ warMachine }: { warMachine: WarMachineState }) => {
    const { userID } = useAuth()
    const { trainingStage } = useTraining()
    const theme = useTheme()
    const { participantID, ownedByID } = warMachine
    return (
        <Fade in>
            <ClipThing
                clipSize="8px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: "2px",
                }}
                corners={{ bottomLeft: true }}
                opacity={0.3}
                backgroundColor={theme.factionTheme.background}
                sx={{
                    position: "absolute",
                    top: "3.5rem",
                    right: ".4rem",
                    animation: trainingStage in MechAbilitiesHighlight ? `${glowEffect(theme.factionTheme.primary)} 4s infinite` : "unset",
                }}
            >
                <Stack
                    spacing=".8rem"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    sx={{ p: ".8rem .9rem", width: "15rem" }}
                >
                    {trainingGameAbilities.map((ga) => {
                        return <AbilityItem key={ga.id} hash={warMachine.hash} participantID={participantID} ability={ga} />
                    })}

                    {userID === ownedByID && <MoveCommandBT isAlive={warMachine.health > 0} warMachine={warMachine} smallVersion />}
                </Stack>
            </ClipThing>
        </Fade>
    )
}

const AbilityItem = ({ ability }: { hash: string; participantID: number; ability: GameAbility }) => {
    const { colour, image_url, label } = ability
    const { repairTime, trainingStage, setTrainingStage } = useTraining()
    const [remainSeconds, setRemainSeconds] = useState(label === "REPAIR" ? repairTime : 0)
    const ready = useMemo(() => remainSeconds === 0, [remainSeconds])

    useInterval(() => {
        if (trainingStage in TrainingLocationSelects) return
        setRemainSeconds((rs) => {
            if (rs === 0) {
                return 0
            }
            return rs - 1
        })
    }, 1000)

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing=".4rem"
            sx={{
                position: "relative",
                height: "3rem",
                width: "100%",
                opacity: ready ? 1 : 0.6,
                pointerEvents: ready ? "all" : "none",
            }}
        >
            {/* Image */}
            <Box
                sx={{
                    flexShrink: 0,
                    width: "3rem",
                    height: "100%",
                    cursor: trainingStage === MechAbilityStages.OverchargeMA ? "pointer" : "unset",
                    background: `url(${image_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    border: `${colour} 1.5px solid`,
                    animation: trainingStage === MechAbilityStages.OverchargeMA && label === "OVERCHARGE" ? `${zoomEffect(1.25)} 2s infinite` : "unset",
                    ":hover": ready
                        ? {
                              borderWidth: trainingStage === MechAbilityStages.OverchargeMA ? "3px" : "1.5px",
                              transform: trainingStage === MechAbilityStages.OverchargeMA ? "scale(1.04)" : "unset",
                          }
                        : undefined,
                }}
                onClick={() => {
                    if (trainingStage !== MechAbilityStages.OverchargeMA) return
                    setRemainSeconds(30)
                    setTrainingStage(MechAbilityStages.OverchargeActionMA)
                }}
            />

            <Typography
                variant="body2"
                sx={{
                    pt: ".4rem",
                    lineHeight: 1,
                    fontWeight: "fontWeightBold",
                    ...TruncateTextLines(1),
                }}
            >
                {ready ? label : `${remainSeconds}s`}
            </Typography>
        </Stack>
    )
}
