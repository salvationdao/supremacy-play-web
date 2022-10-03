import { Fade, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useMemo, useState } from "react"
import { ClipThing } from "../../.."
import { BribeStageResponse, useAuth, useGame } from "../../../../containers"
import { useArena } from "../../../../containers/arena"
import { useTheme } from "../../../../containers/theme"
import { shadeColor } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { useGameServerSubscription } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { BattleAbility as BattleAbilityType, BribeStage } from "../../../../types"
import { BattleAbilityTextTop } from "./BattleAbilityTextTop"

export interface BattleAbilityProgressBigNum {
    faction_id: string
    sups_cost: BigNumber
    current_sups: BigNumber
}

export const BattleAbilityItem = () => {
    const theme = useTheme()
    const { bribeStage } = useGame()
    const { currentArenaID } = useArena()

    const [fadeEffect, toggleFadeEffect] = useToggle()
    const [battleAbility, setBattleAbility] = useState<BattleAbilityType>()

    // Subscribe to battle ability updates
    useGameServerSubscription<BattleAbilityType>(
        {
            URI: `/public/arena/${currentArenaID}/battle_ability`,
            key: GameServerKeys.SubBattleAbility,
            ready: !!currentArenaID,
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
        <Stack spacing=".8rem">
            <Stack key={fadeEffect.toString()} spacing="1.04rem">
                <Fade in={true}>
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
                                disableButton={!factionID || bribeStage?.phase !== BribeStage.OptIn}
                            />

                            <Typography>{description}</Typography>
                        </Stack>
                    </ClipThing>
                </Fade>
            </Stack>
        </Stack>
    )
}
