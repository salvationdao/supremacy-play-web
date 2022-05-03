import { Box, Fade, Stack, Theme, Typography, useTheme } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { BattleAbilityCountdown, ClipThing } from "../.."
import { BribeStageResponse, FactionsAll, useGame, useGameServerAuth, useGameServerWebsocket, useSupremacy } from "../../../containers"
import { useToggle } from "../../../hooks"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { BattleAbility as BattleAbilityType, BattleAbilityProgress, NetMessageType } from "../../../types"
import { BattleAbilityTextTop } from "./BattleAbilityTextTop"
import { SupsBarStack } from "./SupsBarStack"
import { VotingButtons } from "./VotingButtons"

export interface BattleAbilityProgressBigNum {
    faction_id: string
    sups_cost: BigNumber
    current_sups: BigNumber
}

export const BattleAbilityItem = () => {
    const theme = useTheme<Theme>()
    const { state, send, subscribe, subscribeNetMessage } = useGameServerWebsocket()
    const { factionID } = useGameServerAuth()
    const { bribeStage, forceDisplay100Percentage } = useGame()
    const { factionsAll } = useSupremacy()

    const [fadeEffect, toggleFadeEffect] = useToggle()
    const [battleAbility, setBattleAbility] = useState<BattleAbilityType>()
    const [battleAbilityProgress, setBattleAbilityProgress] = useState<BattleAbilityProgressBigNum[]>([])

    const progressPayload = useRef<{ [key: string]: BattleAbilityProgress }>()

    // Subscribe to battle ability updates
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<BattleAbilityType>(
            GameServerKeys.SubBattleAbility,
            (payload) => {
                setBattleAbility(payload)
                toggleFadeEffect()
            },
            null,
        )
    }, [state, subscribe, factionID, toggleFadeEffect])

    // DO NOT REMOVE THIS! Trigger the subscribe to the progress bars net message
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe(GameServerKeys.TriggerBattleAbilityProgressUpdated, () => null, null)
    }, [state, subscribe])

    // Listen on the progress of the votes
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeNetMessage) return
        return subscribeNetMessage<BattleAbilityProgress[] | undefined>(NetMessageType.BattleAbilityProgressTick, (payload) => {
            if (!payload) return

            // Put own faction progress first, then convert string to big number and set state
            let unchanged = true
            const pp: { [key: string]: BattleAbilityProgress } = {}

            for (let i = 0; i < payload.length; i++) {
                const fid = payload[i].faction_id
                pp[fid] = payload[i]
                if (!progressPayload.current) {
                    unchanged = false
                } else if (progressPayload.current && progressPayload.current[fid] && payload[i].current_sups !== progressPayload.current[fid].current_sups) {
                    unchanged = false
                } else if (progressPayload.current && progressPayload.current[fid] && payload[i].sups_cost !== progressPayload.current[fid].sups_cost) {
                    unchanged = false
                }
            }

            if (!unchanged) {
                progressPayload.current = pp

                setBattleAbilityProgress(
                    payload
                        .sort((a, b) => a.faction_id.localeCompare(b.faction_id))
                        .map((a) => ({
                            faction_id: a.faction_id,
                            sups_cost: new BigNumber(a.sups_cost).dividedBy("1000000000000000000"),
                            current_sups: new BigNumber(a.current_sups).dividedBy("1000000000000000000"),
                        })),
                )
            }
        })
    }, [state, subscribeNetMessage])

    const onBribe = useCallback(
        async (amount: BigNumber, percentage: number) => {
            if (!battleAbility) return

            if (!send || percentage > 1 || percentage < 0) return

            const resp = await send<boolean, { ability_offering_id: string; percentage: number }>(GameServerKeys.BribeBattleAbility, {
                ability_offering_id: battleAbility.ability_offering_id,
                percentage: percentage,
            })

            if (resp) {
                setBattleAbilityProgress((baps) =>
                    baps.map((bap) => {
                        if (bap.faction_id === factionID) {
                            bap.current_sups = bap.current_sups.plus(amount)
                        }
                        return bap
                    }),
                )
            }
        },
        [battleAbility, send, factionID],
    )

    const isVoting = useMemo(
        () =>
            bribeStage?.phase == "BRIBE" &&
            battleAbilityProgress &&
            battleAbilityProgress.length > 0 &&
            battleAbilityProgress[0].sups_cost.isGreaterThan(battleAbilityProgress[0].current_sups),
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
            factionsAll={factionsAll}
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
    factionsAll: FactionsAll
    forceDisplay100Percentage: string
    battleAbilityProgress: BattleAbilityProgressBigNum[]
    buttonColor: string
    buttonTextColor: string
    onBribe: (c: BigNumber, ob: number) => void
}

const BattleAbilityItemInner = ({
    bribeStage,
    battleAbility,
    factionsAll,
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
                                        factionsAll={factionsAll}
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
