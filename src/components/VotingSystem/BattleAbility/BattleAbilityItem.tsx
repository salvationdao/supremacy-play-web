import { Box, Fade, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useMemo, useState } from "react"
import { BattleAbilityCountdown, ClipThing } from "../.."
import { BribeStageResponse, useGame, useAuth, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscription, useGameServerSubscriptionAbilityFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { BattleAbility as BattleAbilityType, BattleAbilityProgress, Faction } from "../../../types"
import { BattleAbilityTextTop } from "./BattleAbilityTextTop"
import { SupsBarStack } from "./SupsBarStack"
import { VotingButtons } from "./VotingButtons"

export interface BattleAbilityProgressBigNum {
    faction_id: string
    sups_cost: BigNumber
    current_sups: BigNumber
}

export const BattleAbilityItem = () => {
    const theme = useTheme()
    const { factionID } = useAuth()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { bribeStage, forceDisplay100Percentage } = useGame()
    const { getFaction } = useSupremacy()

    const [fadeEffect, toggleFadeEffect] = useToggle()
    const [battleAbility, setBattleAbility] = useState<BattleAbilityType>()
    const [battleAbilityProgress, setBattleAbilityProgress] = useState<BattleAbilityProgressBigNum[]>([])

    // Subscribe to battle ability updates
    useGameServerSubscriptionAbilityFaction<BattleAbilityType>(
        {
            URI: "",
            key: GameServerKeys.SubBattleAbility,
        },
        (payload) => {
            if (!payload) return
            setBattleAbility(payload)
            toggleFadeEffect()
        },
    )

    // Listen on the progress of the votes
    useGameServerSubscription<BattleAbilityProgress[] | undefined>(
        {
            URI: "/battle/live_data",
            key: GameServerKeys.SubBattleAbilityProgress,
        },
        (payload) => {
            if (!payload) return

            setBattleAbilityProgress(
                payload
                    .sort((a, b) => a.faction_id.localeCompare(b.faction_id))
                    .map((a) => ({
                        faction_id: a.faction_id,
                        sups_cost: new BigNumber(a.sups_cost).dividedBy("1000000000000000000"),
                        current_sups: new BigNumber(a.current_sups).dividedBy("1000000000000000000"),
                    })),
            )
        },
    )

    const onBribe = useCallback(
        async (amount: BigNumber, percentage: number) => {
            if (!battleAbility) return

            if (!send || percentage > 1 || percentage < 0) return

            try {
                await send<boolean, { ability_offering_id: string; percentage: number }>(GameServerKeys.BribeBattleAbility, {
                    ability_offering_id: battleAbility.ability_offering_id,
                    percentage: percentage,
                })
            } catch (e) {
                console.error(e)
            }
        },
        [battleAbility, send],
    )

    const isVoting = useMemo(
        () => bribeStage?.phase == "BRIBE" && battleAbilityProgress && battleAbilityProgress.length > 0,
        [battleAbilityProgress, bribeStage],
    )

    if (!battleAbility) {
        return (
            <Typography
                sx={{
                    mt: ".5rem",
                    lineHeight: 1,
                    color: colors.text,
                    opacity: 0.6,
                    fontWeight: "fontWeightBold",
                }}
            >
                LOADING BATTLE ABILITY...
            </Typography>
        )
    }

    return (
        <BattleAbilityItemInner
            key={battleAbility.ability_offering_id}
            bribeStage={bribeStage}
            battleAbility={battleAbility}
            isVoting={isVoting}
            fadeEffect={fadeEffect}
            getFaction={getFaction}
            currentFactionID={factionID}
            forceDisplay100Percentage={forceDisplay100Percentage}
            battleAbilityProgress={battleAbilityProgress}
            buttonColor={theme.factionTheme.primary}
            buttonTextColor={theme.factionTheme.secondary}
            onBribe={onBribe}
        />
    )
}

interface InnerProps {
    bribeStage?: BribeStageResponse
    battleAbility: BattleAbilityType
    isVoting: boolean
    fadeEffect: boolean
    currentFactionID?: string
    getFaction: (factionID: string) => Faction
    forceDisplay100Percentage: string
    battleAbilityProgress: BattleAbilityProgressBigNum[]
    buttonColor: string
    buttonTextColor: string
    onBribe: (c: BigNumber, ob: number) => void
}

const BattleAbilityItemInner = ({
    bribeStage,
    battleAbility,
    getFaction,
    currentFactionID,
    forceDisplay100Percentage,
    fadeEffect,
    isVoting,
    buttonColor,
    buttonTextColor,
    battleAbilityProgress,
    onBribe,
}: InnerProps) => {
    const { label, colour, image_url, description, cooldown_duration_second } = battleAbility
    const battleAbilityFactionProgress = battleAbilityProgress.find((a) => a.faction_id === currentFactionID)

    return (
        <Fade in={true}>
            <Stack spacing=".56rem">
                <BattleAbilityCountdown bribeStage={bribeStage} />

                <Stack key={fadeEffect.toString()} spacing="1.04rem">
                    <Fade in={true}>
                        <Box>
                            <ClipThing clipSize="6px" backgroundColor={`${colour || colors.darkNavy}`} opacity={0.12}>
                                <Stack
                                    spacing=".8rem"
                                    alignItems="flex-start"
                                    sx={{
                                        flex: 1,
                                        minWidth: "32.5rem",
                                        px: "1.6rem",
                                        pt: "1.12rem",
                                        pb: "1.28rem",
                                        opacity: isVoting ? 1 : 0.7,
                                    }}
                                >
                                    <BattleAbilityTextTop
                                        label={label}
                                        description={description}
                                        image_url={image_url}
                                        colour={colour}
                                        cooldown_duration_second={cooldown_duration_second}
                                    />

                                    <SupsBarStack
                                        battleAbilityProgress={battleAbilityProgress}
                                        getFaction={getFaction}
                                        forceDisplay100Percentage={forceDisplay100Percentage}
                                    />

                                    {battleAbilityFactionProgress && (
                                        <VotingButtons
                                            key={battleAbility.ability_offering_id}
                                            battleAbilityProgress={battleAbilityFactionProgress}
                                            buttonColor={buttonColor}
                                            buttonTextColor={buttonTextColor}
                                            isVoting={isVoting}
                                            onBribe={onBribe}
                                        />
                                    )}
                                </Stack>
                            </ClipThing>
                        </Box>
                    </Fade>
                </Stack>
            </Stack>
        </Fade>
    )
}
