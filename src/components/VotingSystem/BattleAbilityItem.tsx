import { Box, Fade, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import BigNumber from "bignumber.js"
import { BattleAbilityCountdown, ClipThing, ContributionBar, TooltipHelper, VotingButton } from ".."
import { SvgCooldown, SvgSupToken } from "../../assets"
import { GAME_SERVER_HOSTNAME, NullUUID, PASSPORT_SERVER_HOST_IMAGES } from "../../constants"
import {
    httpProtocol,
    useGameServerAuth,
    useGame,
    useGameServerWebsocket,
    BribeStageResponse,
    WebSocketProperties,
    FactionsAll,
} from "../../containers"
import { useToggle } from "../../hooks"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { BattleAbility as BattleAbilityType, BattleAbilityProgress, NetMessageType, User } from "../../types"
import { zoomEffect } from "../../theme/keyframes"

interface BattleAbilityProgressBigNum {
    faction_id: string
    sups_cost: BigNumber
    current_sups: BigNumber
}

interface BattleAbilityItemProps extends Partial<WebSocketProperties> {
    bribeStage?: BribeStageResponse
    user?: User
    faction_id?: string
    factionsAll: FactionsAll
    forceDisplay100Percentage: string
}

export const BattleAbilityItem = () => {
    const { state, send, subscribe, subscribeNetMessage } = useGameServerWebsocket()
    const { user, faction_id } = useGameServerAuth()
    const { bribeStage, factionsAll, forceDisplay100Percentage } = useGame()

    const [fadeEffect, toggleFadeEffect] = useToggle()
    const [battleAbility, setBattleAbility] = useState<BattleAbilityType>()
    const [battleAbilityProgress, setBattleAbilityProgress] = useState<BattleAbilityProgressBigNum[]>([])

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

    // Trigger the subscribe to the progress bars net message
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !faction_id || faction_id === NullUUID) return
        return subscribe(GameServerKeys.TriggerBattleAbilityProgressUpdated, () => null, null)
    }, [state, subscribe, faction_id])

    // Listen on the progress of the votes
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeNetMessage) return
        return subscribeNetMessage<BattleAbilityProgress[] | undefined>(
            NetMessageType.BattleAbilityProgressTick,
            (payload) => {
                if (!payload) return
                // Put own faction progress first, then convert string to big number and set state
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
    }, [state, subscribeNetMessage])

    const onBribe = (voteAmount: string) => {
        if (send) send<boolean, { amount: string }>(GameServerKeys.BribeBattleAbility, { amount: voteAmount })
    }

    const isVoting = useMemo(
        () =>
            bribeStage?.phase == "BRIBE" &&
            battleAbilityProgress &&
            battleAbilityProgress.length > 0 &&
            battleAbilityProgress[0].sups_cost.isGreaterThanOrEqualTo(battleAbilityProgress[0].current_sups),
        [battleAbilityProgress, bribeStage],
    )

    if (!battleAbility || !battleAbilityProgress || battleAbilityProgress.length <= 0) {
        return (
            <Typography
                sx={{
                    mt: ".5rem",
                    lineHeight: 1,
                    color: colors.text,
                    fontWeight: "fontWeightBold",
                }}
            >
                LOADING BATTLE ABILITY...
            </Typography>
        )
    }

    const { label, colour, image_url, description, cooldown_duration_second } = battleAbility
    const buttonColor = user && user.faction ? user.faction.theme.primary : colour
    const buttonTextColor = user && user.faction ? user.faction.theme.secondary : "#FFFFFF"

    return (
        <BattleAbilityItemInner
            isVoting={isVoting}
            fadeEffect={fadeEffect}
            factionsAll={factionsAll}
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
    fadeEffect: string
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
    onBribe: (ob: string) => void
}

const BattleAbilityItemInner = ({
    factionsAll,
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
    return (
        <Fade in={true}>
            <Stack spacing=".56rem">
                <BattleAbilityCountdown />

                <Stack key={fadeEffect} spacing="1.04rem">
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
                                    <Stack
                                        spacing="2.4rem"
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        alignSelf="stretch"
                                    >
                                        <TooltipHelper placement="right" text={description}>
                                            <Stack
                                                spacing=".8rem"
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Box
                                                    sx={{
                                                        height: "1.9rem",
                                                        width: "1.9rem",
                                                        backgroundImage: `url(${httpProtocol()}://${GAME_SERVER_HOSTNAME}${image_url})`,
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
                                                    variant="body1"
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

                                        <Stack
                                            spacing=".24rem"
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <SvgCooldown
                                                component="span"
                                                size="1.3rem"
                                                fill={"grey"}
                                                sx={{ pb: ".32rem" }}
                                            />
                                            <Typography
                                                variant="body2"
                                                sx={{ lineHeight: 1, color: "grey !important" }}
                                            >
                                                {cooldown_duration_second}s
                                            </Typography>
                                        </Stack>
                                    </Stack>

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
                                        {battleAbilityProgress &&
                                            battleAbilityProgress.length > 0 &&
                                            battleAbilityProgress.map((a) => {
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
                                            })}
                                    </Stack>

                                    <Stack direction="row" spacing={0.4} sx={{ mt: ".48rem", width: "100%" }}>
                                        <VotingButton
                                            color={buttonColor}
                                            textColor={buttonTextColor}
                                            amount={"0.1"}
                                            cost={"0.1"}
                                            isVoting={isVoting}
                                            onClick={() => onBribe("0.1")}
                                            Prefix={<SvgSupToken size="1.4rem" fill={buttonTextColor} />}
                                        />
                                        <VotingButton
                                            color={buttonColor}
                                            textColor={buttonTextColor}
                                            amount={"1"}
                                            cost={"1"}
                                            isVoting={isVoting}
                                            onClick={() => "1"}
                                            Prefix={<SvgSupToken size="1.4rem" fill={buttonTextColor} />}
                                        />
                                        <VotingButton
                                            color={buttonColor}
                                            textColor={buttonTextColor}
                                            amount={"10"}
                                            cost={"10"}
                                            isVoting={isVoting}
                                            onClick={() => onBribe("10")}
                                            Prefix={<SvgSupToken size="1.4rem" fill={buttonTextColor} />}
                                        />
                                    </Stack>
                                </Stack>
                            </ClipThing>
                        </Box>
                    </Fade>
                </Stack>
            </Stack>
        </Fade>
    )
}

interface SupsBarProps {
    forceDisplay100Percentage: string
    faction_id: string
    factionsAll: FactionsAll
    sups_cost: BigNumber
    current_sups: BigNumber
}

const SupsBar = ({ forceDisplay100Percentage, factionsAll, faction_id, sups_cost, current_sups }: SupsBarProps) => {
    const primaryColor = factionsAll[faction_id].theme.primary

    return (
        <Stack key={faction_id} spacing=".96rem" direction="row" alignItems="center">
            <Box
                sx={{
                    height: "1.6rem",
                    width: "1.6rem",
                    backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[faction_id].logo_blob_id})`,
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
