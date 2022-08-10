import { Box, Fade, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useMemo, useState } from "react"
import { BattleAbilityCountdown, ClipThing } from "../.."
import { BribeStageResponse, useAuth, useGame } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { shadeColor } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { useGameServerSubscription } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { BattleAbility as BattleAbilityType } from "../../../types"
import { BattleAbilityTextTop } from "./BattleAbilityTextTop"

export interface BattleAbilityProgressBigNum {
    faction_id: string
    sups_cost: BigNumber
    current_sups: BigNumber
}

export const BattleAbilityItem = () => {
    const theme = useTheme()
    const { bribeStage } = useGame()

    const [fadeEffect, toggleFadeEffect] = useToggle()
    const [battleAbility, setBattleAbility] = useState<BattleAbilityType>()

    // Subscribe to battle ability updates
    useGameServerSubscription<BattleAbilityType>(
        {
            URI: "/public/battle_ability",
            key: GameServerKeys.SubBattleAbility,
        },
        (payload) => {
            if (!payload) return
            setBattleAbility(payload)
            toggleFadeEffect()
        },
    )

    if (!battleAbility) {
        return null
    }

    return (
        <BattleAbilityItemInner
            key={battleAbility.ability_offering_id}
            bribeStage={bribeStage}
            battleAbility={battleAbility}
            fadeEffect={fadeEffect}
            buttonColor={theme.factionTheme.primary}
            buttonTextColor={theme.factionTheme.secondary}
        />
    )
}

interface InnerProps {
    bribeStage?: BribeStageResponse
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
        <Fade in={true}>
            <Box>
                <BattleAbilityCountdown bribeStage={bribeStage} />

                <Stack key={fadeEffect.toString()} spacing="1.04rem" sx={{ my: "1rem" }}>
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
                                    <BattleAbilityTextTop
                                        label={label}
                                        image_url={image_url}
                                        colour={colour}
                                        disableButton={!factionID || bribeStage?.phase !== "OPT_IN"}
                                    />

                                    <Typography>{description}</Typography>
                                </Stack>
                            </ClipThing>
                        </Box>
                    </Fade>
                </Stack>
            </Box>
        </Fade>
    )
}
