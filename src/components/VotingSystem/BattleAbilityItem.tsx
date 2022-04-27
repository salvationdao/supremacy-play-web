import { Box, Fade, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { BattleAbilityCountdown, ClipThing, ContributionBar, TooltipHelper, VotingButton } from ".."
import { SvgCooldown, SvgSupToken } from "../../assets"
import { NullUUID, PASSPORT_SERVER_HOST_IMAGES, VOTING_OPTION_COSTS } from "../../constants"
import { FactionsAll, useGame, useGameServerAuth, useGameServerWebsocket } from "../../containers"
import { useToggle } from "../../hooks"
import { GameServerKeys } from "../../keys"
import { zoomEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"
import { BattleAbility as BattleAbilityType, BattleAbilityProgress, NetMessageType } from "../../types"

interface BattleAbilityProgressBigNum {
    faction_id: string
    sups_cost: BigNumber
    current_sups: BigNumber
}

// interface BattleAbilityItemProps extends Partial<WebSocketProperties> {
//     bribeStage?: BribeStageResponse
//     user?: User
//     faction_id?: string
//     factionsAll: FactionsAll
//     forceDisplay100Percentage: string
// }

export const BattleAbilityItem = () => {
    const { state, send, subscribe, subscribeNetMessage } = useGameServerWebsocket()
    const { user, faction_id } = useGameServerAuth()
    const { bribeStage, factionsAll, forceDisplay100Percentage } = useGame()

    const [fadeEffect, toggleFadeEffect] = useToggle()
    const [battleAbility, setBattleAbility] = useState<BattleAbilityType>()
    const [battleAbilityProgress, setBattleAbilityProgress] = useState<BattleAbilityProgressBigNum[]>([])

    const progressPayload = useRef<{ [key: string]: BattleAbilityProgress }>()

    // Subscribe to battle ability updates
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !faction_id || faction_id === NullUUID) return
        return subscribe<BattleAbilityType>(
            GameServerKeys.SubBattleAbility,
            (payload) => {
                setBattleAbility(payload)
                toggleFadeEffect()
            },
            null,
        )
    }, [state, subscribe, faction_id])

    // DO NOT REMOVE THIS! Trigger the subscribe to the progress bars net message
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !faction_id || faction_id === NullUUID) return
        return subscribe(GameServerKeys.TriggerBattleAbilityProgressUpdated, () => null, null)
    }, [state, subscribe, faction_id])

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
                    if (bap.faction_id === faction_id) {
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

    const { label, colour, image_url, description, cooldown_duration_second } = battleAbility

    return (
        <BattleAbilityItemInner
            isVoting={isVoting}
            fadeEffect={fadeEffect}
            factionsAll={factionsAll}
            currentFactionID={faction_id}
            colour={colour}
            description={description}
            forceDisplay100Percentage={forceDisplay100Percentage}
            image_url={image_url}
            label={label}
            cooldown_duration_second={cooldown_duration_second}
            battleAbilityProgress={battleAbilityProgress}
            buttonColor={buttonColor}
            buttonTextColor={buttonTextColor}
            onBribe={onBribe}
        />
    )
}

interface InnerProps {
    isVoting: boolean
    fadeEffect: boolean
    currentFactionID?: string
    factionsAll: FactionsAll
    colour: string
    description: string
    forceDisplay100Percentage: string
    image_url: string
    label: string
    cooldown_duration_second: number
    battleAbilityProgress: BattleAbilityProgressBigNum[]
    buttonColor: string
    buttonTextColor: string
    onBribe: (c: BigNumber, ob: number) => void
}

const BattleAbilityItemInner = ({
    factionsAll,
    currentFactionID,
    forceDisplay100Percentage,
    fadeEffect,
    isVoting,
    description,
    colour,
    image_url,
    label,
    buttonColor,
    buttonTextColor,
    cooldown_duration_second,
    battleAbilityProgress,
    onBribe,
}: InnerProps) => {
    const battleAbilityFactionProcess = battleAbilityProgress.find((a) => a.faction_id === currentFactionID)

    return (
        <Fade in={true}>
            <Stack spacing=".56rem">
                <BattleAbilityCountdown />

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

interface BattleAbilityTextTopProps {
    label: string
    description: string
    image_url: string
    colour: string
    cooldown_duration_second: number
}
const BattleAbilityTextTop = ({ label, description, image_url, colour, cooldown_duration_second }: BattleAbilityTextTopProps) => (
    <Stack spacing="2.4rem" direction="row" alignItems="center" justifyContent="space-between" alignSelf="stretch">
        <TooltipHelper placement="right" text={description}>
            <Stack spacing=".8rem" direction="row" alignItems="center" justifyContent="center">
                <Box
                    sx={{
                        height: "1.9rem",
                        width: "1.9rem",
                        backgroundImage: `url(${image_url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundColor: colour || "#030409",
                        border: `${colour} 1px solid`,
                        borderRadius: 0.6,
                        mb: ".24rem",
                    }}
                />
                <Typography
                    sx={{
                        lineHeight: 1,
                        fontWeight: "fontWeightBold",
                        fontFamily: "Nostromo Regular Bold",
                        color: colour,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "20rem",
                    }}
                >
                    {label}
                </Typography>
            </Stack>
        </TooltipHelper>

        <Stack spacing=".24rem" direction="row" alignItems="center" justifyContent="center">
            <SvgCooldown component="span" size="1.3rem" fill={"grey"} sx={{ pb: ".32rem" }} />
            <Typography variant="body2" sx={{ lineHeight: 1, color: "grey !important" }}>
                {cooldown_duration_second}s
            </Typography>
        </Stack>
    </Stack>
)

interface SupsBarProps {
    forceDisplay100Percentage: string
    faction_id: string
    factionsAll: FactionsAll
    sups_cost: BigNumber
    current_sups: BigNumber
}

const SupsBar = ({ forceDisplay100Percentage, factionsAll, faction_id, sups_cost, current_sups }: SupsBarProps) => {
    const primaryColor = factionsAll[faction_id]?.theme.primary

    return (
        <Stack key={faction_id} spacing=".96rem" direction="row" alignItems="center">
            <Box
                sx={{
                    height: "1.6rem",
                    width: "1.6rem",
                    backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[faction_id]?.logo_blob_id})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundColor: primaryColor,
                    border: `${primaryColor} 1px solid`,
                    borderRadius: 0.6,
                    mb: ".24rem",
                }}
            />
            <ContributionBar
                color={primaryColor}
                initialTargetCost={sups_cost}
                currentSups={current_sups}
                supsCost={sups_cost}
                hideRedBar
                forceHundredPercent={forceDisplay100Percentage === faction_id}
            />

            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ minWidth: "11rem" }}>
                <Typography
                    key={`currentSups-${current_sups.toFixed()}`}
                    variant="body2"
                    sx={{
                        lineHeight: 1,
                        color: `${primaryColor} !important`,
                        animation: `${zoomEffect(1.2)} 300ms ease-out`,
                    }}
                >
                    {forceDisplay100Percentage === faction_id ? sups_cost.toFixed(2) : current_sups.toFixed(2)}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        lineHeight: 1,
                        color: `${primaryColor} !important`,
                    }}
                >
                    &nbsp;/&nbsp;
                </Typography>
                <Typography
                    key={`supsCost-${sups_cost.toFixed()}`}
                    variant="body2"
                    sx={{
                        lineHeight: 1,
                        color: `${primaryColor} !important`,
                        animation: `${zoomEffect(1.2)} 300ms ease-out`,
                    }}
                >
                    {sups_cost.toFixed(2)}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        lineHeight: 1,
                        color: `${primaryColor} !important`,
                    }}
                >
                    &nbsp;SUP{sups_cost.eq(1) ? "" : "S"}
                </Typography>
            </Stack>
        </Stack>
    )
}

interface SubsBarStackProps {
    battleAbilityProgress: BattleAbilityProgressBigNum[]
    factionsAll: FactionsAll
    forceDisplay100Percentage: string
}

const SupsBarStack = ({ battleAbilityProgress, factionsAll, forceDisplay100Percentage }: SubsBarStackProps) => {
    const progressBar = useMemo(() => {
        if (!battleAbilityProgress || !Array.isArray(battleAbilityProgress) || battleAbilityProgress.length === 0) {
            return null
        }
        return battleAbilityProgress.map((a) => {
            return (
                <SupsBar
                    key={a.faction_id}
                    forceDisplay100Percentage={forceDisplay100Percentage}
                    factionsAll={factionsAll}
                    faction_id={a.faction_id}
                    sups_cost={a.sups_cost}
                    current_sups={a.current_sups}
                />
            )
        })
    }, [factionsAll, battleAbilityProgress, forceDisplay100Percentage])

    return (
        <Stack
            spacing=".4rem"
            sx={{
                width: "100%",
                px: "1.2rem",
                py: ".96rem",
                backgroundColor: "#00000030",
                borderRadius: 1,
            }}
        >
            {progressBar}
        </Stack>
    )
}

interface VotingButtonsProps {
    buttonColor: string
    buttonTextColor: string
    isVoting: boolean
    battleAbilityProcess: BattleAbilityProgressBigNum
    onBribe: (a: BigNumber, b: number) => void
}

const VotingButtons = ({ buttonColor, buttonTextColor, isVoting, battleAbilityProcess, onBribe }: VotingButtonsProps) => {
    const voteCosts = VOTING_OPTION_COSTS.map((voteCost) => {
        const cost = battleAbilityProcess.sups_cost.multipliedBy(voteCost.percentage / 100)
        return {
            cost: cost.isLessThan(voteCost.minCost) ? voteCost.minCost : cost,
            percentage: voteCost.percentage,
        }
    })

    return (
        <Stack direction="row" spacing=".4rem" sx={{ mt: ".48rem", width: "100%" }}>
            {voteCosts.map((c) => (
                <VotingButton
                    key={`battle-ability-vote-cost-button-${c.percentage}`}
                    color={buttonColor}
                    textColor={buttonTextColor}
                    percentage={c.percentage.toString()}
                    cost={c.cost.toFixed(3)}
                    isVoting={isVoting}
                    onClick={() => onBribe(c.cost, c.percentage)}
                    Prefix={<SvgSupToken size="1.5rem" fill={buttonTextColor} sx={{ pb: ".2rem" }} />}
                />
            ))}
        </Stack>
    )
}
