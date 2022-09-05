import { Box, Fade, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { ClipThing } from "../../.."
import { useAuth, useTraining } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { shadeColor } from "../../../../helpers"
import { BattleAbility as BattleAbilityType, BribeStage } from "../../../../types"
import { TrainingBribeStageResponse } from "../../TrainingBattleAbility"
import { BattleAbilityTextTopBT } from "./BattleAbilityTextTopBT"

export const trainingAirStrike: BattleAbilityType = {
    colour: "#173DD1",
    cooldown_duration_second: 10,
    description: "Rain fury on the arena with a targeted airstrike.",
    id: "f95edd26-0bd2-4b4d-ae04-50bfc137e261",
    image_url: "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/ability-airstrike.jpg",
    label: "AIRSTRIKE",
    text_colour: "#FFFFFF",
    ability_offering_id: "",
}

export const BattleAbilityItemBT = () => {
    const theme = useTheme()
    const { bribeStage } = useTraining()

    return (
        <BattleAbilityItemInner
            key={trainingAirStrike.ability_offering_id}
            bribeStage={bribeStage}
            battleAbility={trainingAirStrike}
            fadeEffect={true}
            buttonColor={theme.factionTheme.primary}
            buttonTextColor={theme.factionTheme.secondary}
        />
    )
}

interface InnerProps {
    bribeStage?: TrainingBribeStageResponse
    battleAbility: BattleAbilityType
    fadeEffect: boolean
    buttonColor: string
    buttonTextColor: string
}

const BattleAbilityItemInner = ({ bribeStage, battleAbility, fadeEffect }: InnerProps) => {
    const { label, colour, image_url, description } = battleAbility
    const { factionID } = useAuth()

    const backgroundColor = useMemo(() => shadeColor(colour, -75), [colour])

    return (
        <Stack key={fadeEffect.toString()} spacing="1.04rem">
            <Fade in={true}>
                <Box>
                    <ClipThing
                        clipSize="6px"
                        border={{
                            borderColor: colour,
                            borderThickness: ".3rem",
                        }}
                        backgroundColor={backgroundColor}
                        opacity={0.7}
                    >
                        <Stack
                            spacing=".8rem"
                            alignItems="flex-start"
                            sx={{
                                flex: 1,
                                minWidth: "32.5rem",
                                px: "1.6rem",
                                pt: "1.12rem",
                                pb: "1.28rem",
                            }}
                        >
                            <BattleAbilityTextTopBT
                                label={label}
                                image_url={image_url}
                                colour={colour}
                                disableButton={!factionID || bribeStage?.phase !== BribeStage.OptIn}
                            />

                            <Typography>{description}</Typography>
                        </Stack>
                    </ClipThing>
                </Box>
            </Fade>
        </Stack>
    )
}
