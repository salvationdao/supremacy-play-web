import { Box, Fade, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { BattleAbilityCountdown, ClipThing, TooltipHelper, VotingButton } from ".."
import { SvgCooldown, SvgApplause } from "../../assets"
import { GAME_SERVER_HOSTNAME, NullUUID } from "../../constants"
import { httpProtocol, useAuth, useGame, useWebsocket } from "../../containers"
import { useToggle } from "../../hooks"
import HubKey from "../../keys"
import { zoomEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"
import { BattleAbility as BattleAbilityType, NetMessageType } from "../../types"

const VotingBar = ({ isVoting, isCooldown }: { isVoting: boolean; isCooldown: boolean }) => {
    const { state, subscribeNetMessage } = useWebsocket()
    const { factionsColor } = useGame()

    // Array order is (Red Mountain, Boston, Zaibatsu). [[colorArray], [ratioArray]]
    const [voteRatio, setVoteRatio] = useState<[number, number, number]>([33, 33, 33])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeNetMessage) return
        return subscribeNetMessage<[number, number, number] | undefined>(
            NetMessageType.AbilityRightRatioTick,
            (payload) => {
                if (!payload) return
                setVoteRatio(payload)
            },
        )
    }, [state, subscribeNetMessage])

    useEffect(() => {
        setVoteRatio([33, 33, 33])
    }, [isCooldown])

    const subBar = useCallback(
        (color: string, ratio: number) => (
            <Box
                sx={{
                    position: "relative",
                    width: isCooldown ? "33.33%" : `${ratio}%`,
                    height: "100%",
                    transition: "all .25s",
                    opacity: isVoting ? 1 : 0.4,
                    backgroundColor: color,
                }}
            >
                <Typography
                    key={ratio}
                    variant="caption"
                    sx={{
                        position: "absolute",
                        top: -16,
                        left: "50%",
                        transform: "translateX(-50%)",
                        color,
                        fontWeight: "fontWeightBold",
                        animation: `${zoomEffect()} 300ms ease-out`,
                    }}
                >
                    {Math.round(ratio)}%
                </Typography>
            </Box>
        ),
        [isVoting, isCooldown],
    )

    return (
        <Box sx={{ width: "100%", px: 1.5, pt: 1, pb: 1.2, backgroundColor: "#00000050", borderRadius: 1 }}>
            <Stack
                direction="row"
                alignSelf="stretch"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 1.6, height: 5.5, px: 0.5 }}
            >
                {subBar(factionsColor?.redMountain || "#C24242", voteRatio[0])}
                {subBar(factionsColor?.boston || "#428EC1", voteRatio[1])}
                {subBar(factionsColor?.zaibatsu || "#FFFFFF", voteRatio[2])}
            </Stack>
        </Box>
    )
}

interface VoteRequest {
    voteAmount: number // 1, 10, 100
}

export const BattleAbility = () => {
    const { state, send, subscribe } = useWebsocket()
    const { factionID } = useAuth()
    const { votingState, factionVotePrice } = useGame()
    const [battleAbility, setBattleAbility] = useState<BattleAbilityType>()
    const [fadeEffect, toggleFadeEffect] = useToggle()

    const isVoting = votingState?.phase == "VOTE_ABILITY_RIGHT" || votingState?.phase == "NEXT_VOTE_WIN"
    const isCooldown = votingState?.phase == "VOTE_COOLDOWN"

    // Subscribe to the result of the vote
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !factionID || factionID === NullUUID) return
        return subscribe(HubKey.TriggerAbilityRightRatio, () => console.log(""), null)
    }, [state, subscribe, factionID])

    // Subscribe to battle ability updates
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !factionID || factionID === NullUUID) return
        return subscribe<BattleAbilityType>(
            HubKey.SubBattleAbility,
            (payload) => {
                setBattleAbility(payload)
                toggleFadeEffect()
            },
            null,
        )
    }, [state, subscribe, factionID])

    const onVote = useCallback(
        (voteAmount: number) => async () => {
            if (state !== WebSocket.OPEN) return
            try {
                const resp = await send<boolean, VoteRequest>(HubKey.SubmitVoteAbilityRight, { voteAmount })

                if (resp) {
                    return true
                } else {
                    throw new Error()
                }
            } catch (e) {
                return false
            }
        },
        [state],
    )

    if (!battleAbility) return null

    const { label, colour, imageUrl, description, cooldownDurationSecond } = battleAbility

    return (
        <Fade in={true}>
            <Stack spacing={0.7}>
                <BattleAbilityCountdown battleAbility={battleAbility} />

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
                                        opacity: isVoting ? 1 : 0.32,
                                    }}
                                >
                                    <Stack
                                        spacing={3}
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        alignSelf="stretch"
                                    >
                                        <TooltipHelper text={description}>
                                            <Stack
                                                spacing={1}
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Box
                                                    sx={{
                                                        height: 18,
                                                        width: 18,
                                                        backgroundImage: `url(${httpProtocol()}://${GAME_SERVER_HOSTNAME}${imageUrl})`,
                                                        backgroundRepeat: "no-repeat",
                                                        backgroundPosition: "center",
                                                        backgroundSize: "cover",
                                                        backgroundColor: colour || "#030409",
                                                        border: `${colour} 1px solid`,
                                                        borderRadius: 0.6,
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
                                            <SvgCooldown component="span" size="13px" fill={"grey"} sx={{ mb: 0.2 }} />
                                            <Typography
                                                variant="body2"
                                                sx={{ lineHeight: 1, color: "grey !important" }}
                                            >
                                                {cooldownDurationSecond}s
                                            </Typography>
                                        </Stack>
                                    </Stack>

                                    <VotingBar isVoting={isVoting} isCooldown={isCooldown} />

                                    <Stack direction="row" spacing={0.4} sx={{ mt: 0.6, width: "100%" }}>
                                        <VotingButton
                                            color={colour}
                                            amount={1}
                                            cost={factionVotePrice.multipliedBy(1).toNumber()}
                                            isVoting={isVoting}
                                            onClick={onVote(1)}
                                            Suffix={<SvgApplause size="14px" fill="#FFFFFF" />}
                                        />
                                        <VotingButton
                                            color={colour}
                                            amount={25}
                                            cost={factionVotePrice.multipliedBy(25).toNumber()}
                                            isVoting={isVoting}
                                            onClick={onVote(25)}
                                            Suffix={<SvgApplause size="14px" fill="#FFFFFF" />}
                                        />
                                        <VotingButton
                                            color={colour}
                                            amount={100}
                                            cost={factionVotePrice.multipliedBy(100).toNumber()}
                                            isVoting={isVoting}
                                            onClick={onVote(100)}
                                            Suffix={<SvgApplause size="14px" fill="#FFFFFF" />}
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
