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
}

export const BattleAbilityItem = () => {
    const { state, send, subscribe, subscribeNetMessage } = useGameServerWebsocket()
    const { user, faction_id } = useGameServerAuth()
    const { bribeStage, factionsAll } = useGame()

    return (
        <BattleAbilityItemInner
            state={state}
            send={send}
            subscribe={subscribe}
            subscribeNetMessage={subscribeNetMessage}
            bribeStage={bribeStage}
            user={user}
            faction_id={faction_id}
            factionsAll={factionsAll}
        />
    )
}

const BattleAbilityItemInner = ({
    state,
    send,
    subscribe,
    subscribeNetMessage,
    bribeStage,
    user,
    faction_id,
    factionsAll,
}: BattleAbilityItemProps) => {
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

    const onBribe = (voteAmount: number) => {
        if (send) send<boolean, { amount: number }>(GameServerKeys.BribeBattleAbility, { amount: voteAmount }, true)
    }

    const isVoting = useMemo(
        () =>
            bribeStage?.phase == "BRIBE" &&
            battleAbilityProgress &&
            battleAbilityProgress.length > 0 &&
            battleAbilityProgress[0].sups_cost.isGreaterThanOrEqualTo(battleAbilityProgress[0].current_sups),
        [battleAbilityProgress, bribeStage],
    )

    if (!battleAbility || !battleAbilityProgress || battleAbilityProgress.length <= 0) return null

    const { label, colour, image_url, description, cooldown_duration_second } = battleAbility
    const buttonColor = user && user.faction ? user.faction.theme.primary : colour
    const buttonTextColor = user && user.faction ? user.faction.theme.secondary : "#FFFFFF"

    return (
        <Fade in={true}>
            <Stack spacing={0.7}>
                <BattleAbilityCountdown />

                <Stack key={fadeEffect} spacing={1.3}>
                    <Fade in={true}>
                        <Box>
                            <ClipThing clipSize="6px">
                                <Stack
                                    spacing={1}
                                    alignItems="flex-start"
                                    sx={{
                                        flex: 1,
                                        minWidth: 325,
                                        backgroundColor: `${colour || colors.darkNavy}15`,
                                        px: 2,
                                        pt: 1.4,
                                        pb: 1.6,
                                        opacity: isVoting ? 1 : 0.36,
                                    }}
                                >
                                    <Stack
                                        spacing={3}
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        alignSelf="stretch"
                                    >
                                        <TooltipHelper placement="right" text={description}>
                                            <Stack
                                                spacing={1}
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Box
                                                    sx={{
                                                        height: 19,
                                                        width: 19,
                                                        backgroundImage: `url(${httpProtocol()}://${GAME_SERVER_HOSTNAME}${image_url})`,
                                                        backgroundRepeat: "no-repeat",
                                                        backgroundPosition: "center",
                                                        backgroundSize: "cover",
                                                        backgroundColor: colour || "#030409",
                                                        border: `${colour} 1px solid`,
                                                        borderRadius: 0.6,
                                                        mb: 0.3,
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
                                                        maxWidth: 200,
                                                    }}
                                                >
                                                    {label}
                                                </Typography>
                                            </Stack>
                                        </TooltipHelper>

                                        <Stack
                                            spacing={0.3}
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <SvgCooldown component="span" size="13px" fill={"grey"} sx={{ pb: 0.4 }} />
                                            <Typography
                                                variant="body2"
                                                sx={{ lineHeight: 1, color: "grey !important" }}
                                            >
                                                {cooldown_duration_second}s
                                            </Typography>
                                        </Stack>
                                    </Stack>

                                    <Stack
                                        spacing={0.5}
                                        sx={{
                                            width: "100%",
                                            px: 1.5,
                                            py: 1.2,
                                            backgroundColor: "#00000030",
                                            borderRadius: 1,
                                        }}
                                    >
                                        {battleAbilityProgress &&
                                            battleAbilityProgress.length > 0 &&
                                            battleAbilityProgress.map((a) => {
                                                const primaryColor = factionsAll[a.faction_id].theme.primary
                                                return (
                                                    <Stack
                                                        key={a.faction_id}
                                                        spacing={1.2}
                                                        direction="row"
                                                        alignItems="center"
                                                    >
                                                        <Box
                                                            sx={{
                                                                height: 16,
                                                                width: 16,
                                                                backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${
                                                                    factionsAll[a.faction_id].logo_blob_id
                                                                })`,
                                                                backgroundRepeat: "no-repeat",
                                                                backgroundPosition: "center",
                                                                backgroundSize: "cover",
                                                                backgroundColor: primaryColor,
                                                                border: `${primaryColor} 1px solid`,
                                                                borderRadius: 0.6,
                                                                mb: 0.3,
                                                            }}
                                                        />
                                                        <ContributionBar
                                                            color={primaryColor}
                                                            initialTargetCost={a.sups_cost}
                                                            currentSups={a.current_sups}
                                                            supsCost={a.sups_cost}
                                                            hideRedBar
                                                        />

                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                            sx={{ minWidth: 90 }}
                                                        >
                                                            <Typography
                                                                key={`currentSups-${a.current_sups.toFixed()}`}
                                                                variant="body2"
                                                                sx={{
                                                                    lineHeight: 1,
                                                                    color: `${primaryColor} !important`,
                                                                    animation: `${zoomEffect(1.2)} 300ms ease-out`,
                                                                }}
                                                            >
                                                                {a.current_sups.toFixed(2)}
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
                                                                key={`supsCost-${a.sups_cost.toFixed()}`}
                                                                variant="body2"
                                                                sx={{
                                                                    lineHeight: 1,
                                                                    color: `${primaryColor} !important`,
                                                                    animation: `${zoomEffect(1.2)} 300ms ease-out`,
                                                                }}
                                                            >
                                                                {a.sups_cost.toFixed(2)}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    lineHeight: 1,
                                                                    color: `${primaryColor} !important`,
                                                                }}
                                                            >
                                                                &nbsp;SUP{a.sups_cost.eq(1) ? "" : "S"}
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                )
                                            })}
                                    </Stack>

                                    <Stack direction="row" spacing={0.4} sx={{ mt: 0.6, width: "100%" }}>
                                        <VotingButton
                                            color={buttonColor}
                                            textColor={buttonTextColor}
                                            amount={1}
                                            cost={1}
                                            isVoting={isVoting}
                                            onClick={() => onBribe(1)}
                                            Prefix={<SvgSupToken size="14px" fill={buttonTextColor} />}
                                        />
                                        <VotingButton
                                            color={buttonColor}
                                            textColor={buttonTextColor}
                                            amount={2}
                                            cost={2}
                                            isVoting={isVoting}
                                            onClick={() => onBribe(2)}
                                            Prefix={<SvgSupToken size="14px" fill={buttonTextColor} />}
                                        />
                                        <VotingButton
                                            color={buttonColor}
                                            textColor={buttonTextColor}
                                            amount={3}
                                            cost={3}
                                            isVoting={isVoting}
                                            onClick={() => onBribe(3)}
                                            Prefix={<SvgSupToken size="14px" fill={buttonTextColor} />}
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
