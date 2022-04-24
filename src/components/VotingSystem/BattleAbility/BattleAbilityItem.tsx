import { Box, Fade, Stack, Typography } from "@mui/material"
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
    const { state, send, subscribe, subscribeNetMessage } = useGameServerWebsocket()
    const { user, factionID } = useGameServerAuth()
    const { bribeStage, forceDisplay100Percentage } = useGame()
    const { factionsAll } = useSupremacy()

    const [fadeEffect, toggleFadeEffect] = useToggle()
    const [battleAbility, setBattleAbility] = useState<BattleAbilityType>()
    const [battleAbilityProgress, setBattleAbilityProgress] = useState<BattleAbilityProgressBigNum[]>([])

    const progressPayload = useRef<{ [key: string]: BattleAbilityProgress }>()

    // Subscribe to battle ability updates
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !factionID) return
        return subscribe<BattleAbilityType>(
            GameServerKeys.SubBattleAbility,
            (payload) => {
                setBattleAbility(payload)
                toggleFadeEffect()
            },
            null,
        )
    }, [state, subscribe, factionID])

    // DO NOT REMOVE THIS! Trigger the subscribe to the progress bars net message
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !factionID) return
        return subscribe(GameServerKeys.TriggerBattleAbilityProgressUpdated, () => null, null)
    }, [state, subscribe, factionID])

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
        (amount: BigNumber, votePercentage: number) => {
            if (!battleAbility) return
            setBattleAbilityProgress((baps) => {
                return baps.map((bap) => {
                    if (bap.faction_id === factionID) {
                        return { ...bap, amount: amount.plus(bap.current_sups) }
                    }
                    return bap
                })
            })
            if (send)
                send<boolean, { ability_offering_id: string; percentage: number }>(GameServerKeys.BribeBattleAbility, {
                    ability_offering_id: battleAbility.ability_offering_id,
                    percentage: votePercentage,
                })
        },
        [send, battleAbility],
    )

    const isVoting = useMemo(
        () =>
            bribeStage?.phase == "BRIBE" &&
            battleAbilityProgress &&
            battleAbilityProgress.length > 0 &&
            battleAbilityProgress[0].sups_cost.isGreaterThanOrEqualTo(battleAbilityProgress[0].current_sups),
        [battleAbilityProgress, bribeStage],
    )

    const buttonColor = useMemo(() => (user && user.faction ? user.faction.theme.primary : battleAbility ? battleAbility.colour : colors.neonBlue), [user])
    const buttonTextColor = useMemo(() => (user && user.faction ? user.faction.theme.secondary : "#FFFFFF"), [user])

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
            bribeStage={bribeStage}
            battleAbility={battleAbility}
            isVoting={isVoting}
            fadeEffect={fadeEffect}
            factionsAll={factionsAll}
            currentFactionID={factionID}
            forceDisplay100Percentage={forceDisplay100Percentage}
            battleAbilityProgress={battleAbilityProgress}
            buttonColor={buttonColor}
            buttonTextColor={buttonTextColor}
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
    const battleAbilityFactionProcess = battleAbilityProgress.find((a) => a.faction_id === currentFactionID)

    return (
        <Fade in={true}>
            <Stack spacing=".56rem">
                <BattleAbilityCountdown bribeStage={bribeStage} />

                <Stack key={fadeEffect.toString()} spacing="1.04rem">
                    <Fade in={true}>
                        <Box>
                            <ClipThing clipSize="6px">
                                <Stack
                                    spacing=".8rem"
                                    alignItems="flex-start"
                                    sx={{
                                        flex: 1,
                                        minWidth: "32.5rem",
                                        backgroundColor: `${colour || colors.darkNavy}15`,
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

                                    {battleAbilityFactionProcess && (
                                        <VotingButtons
                                            battleAbilityProcess={battleAbilityFactionProcess}
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
