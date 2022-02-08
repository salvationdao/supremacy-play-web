import { Box, Fade, Stack, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { BattleAbilityCountdown, ClipThing, VotingButton } from '..'
import { SvgCooldown } from '../../assets'
import { NullUUID } from '../../constants'
import { useAuth, useGame, useWebsocket } from '../../containers'
import { useToggle } from '../../hooks'
import HubKey from '../../keys'
import { zoomEffect } from '../../theme/keyframes'
import { colors } from '../../theme/theme'
import { BattleAbility as BattleAbilityType, NetMessageType } from '../../types'

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
                    position: 'relative',
                    width: isCooldown ? '33.33%' : `${ratio}%`,
                    height: '100%',
                    transition: 'all .25s',
                    opacity: isVoting ? 1 : 0.4,
                    backgroundColor: color,
                }}
            >
                <Typography
                    key={ratio}
                    variant="caption"
                    sx={{
                        position: 'absolute',
                        top: -16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color,
                        fontWeight: 'fontWeightBold',
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
        <Box sx={{ width: '100%', px: 1.5, py: 1, pb: 1.2, backgroundColor: '#00000050', borderRadius: 1 }}>
            <Stack
                direction="row"
                alignSelf="stretch"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 1.6, height: 5.5, px: 0.5 }}
            >
                {subBar(factionsColor?.redMountain || '#C24242', voteRatio[0])}
                {subBar(factionsColor?.boston || '#428EC1', voteRatio[1])}
                {subBar(factionsColor?.zaibatsu || '#FFFFFF', voteRatio[2])}
            </Stack>
        </Box>
    )
}

interface VoteRequest {
    voteAmount: number // 1, 10, 100
}

export const BattleAbility = () => {
    const { state, send, subscribe } = useWebsocket()
    const { user } = useAuth()
    const { votingState, factionVotePrice } = useGame()
    const [battleAbility, setBattleAbility] = useState<BattleAbilityType>()
    const [fadeEffect, toggleFadeEffect] = useToggle()

    const userID = user?.id
    const factionID = user?.factionID
    const isVoting = votingState?.phase == 'VOTE_ABILITY_RIGHT' || votingState?.phase == 'NEXT_VOTE_WIN'
    const isCooldown = votingState?.phase == 'VOTE_COOLDOWN'

    // Subscribe to battle ability updates
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID || userID === '' || !factionID || factionID === NullUUID)
            return
        return subscribe<BattleAbilityType>(
            HubKey.SubBattleAbility,
            (payload) => {
                setBattleAbility(payload)
                toggleFadeEffect()
            },
            null,
        )
    }, [state, subscribe, userID, factionID])

    const onVote = useCallback(
        (voteAmount: number) => async () => {
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
        [],
    )

    if (!battleAbility) return null

    const { label, colour, imageUrl, cooldownDurationSecond } = battleAbility

    return (
        <Fade in={true}>
            <Stack spacing={0.3}>
                <BattleAbilityCountdown battleAbility={battleAbility} />

                <Stack key={fadeEffect} spacing={1.3}>
                    <Fade in={true}>
                        <Box sx={{ opacity: isVoting ? 1 : 0.5 }}>
                            <ClipThing
                                border={{ isFancy: true, borderColor: colour, borderThickness: '1.5px' }}
                                clipSize="6px"
                            >
                                <Box sx={{ backgroundColor: colors.darkNavy }}>
                                    <Stack direction="row" sx={{ height: 118, minWidth: 180 }}>
                                        <ClipThing
                                            border={{ isFancy: true, borderColor: colour, borderThickness: '1px' }}
                                            clipSize="6px"
                                            fillHeight
                                        >
                                            <Box
                                                sx={{
                                                    backgroundColor: colour,
                                                    height: '100%',
                                                    width: 95,
                                                    backgroundImage: `url(${imageUrl})`,
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center',
                                                    backgroundSize: 'cover',
                                                }}
                                            />
                                        </ClipThing>

                                        <Stack
                                            spacing={1}
                                            alignItems="flex-start"
                                            sx={{ flex: 1, backgroundColor: colors.darkNavy, px: 2, py: 1.2 }}
                                        >
                                            <Stack
                                                spacing={1.2}
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                                alignSelf="stretch"
                                            >
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 'fontWeightBold',
                                                        fontFamily: 'Nostromo Regular Medium',
                                                        color: colour,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: 200,
                                                    }}
                                                >
                                                    {label}
                                                </Typography>

                                                <Stack
                                                    spacing={0.3}
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <SvgCooldown component="span" size="13.2px" fill={'grey'} />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ lineHeight: 1, color: 'grey !important' }}
                                                    >
                                                        {cooldownDurationSecond}s
                                                    </Typography>
                                                </Stack>
                                            </Stack>

                                            <VotingBar isVoting={isVoting} isCooldown={isCooldown} />

                                            <Stack direction="row" spacing={0.4} sx={{ mt: 0.6, width: '100%' }}>
                                                <VotingButton
                                                    color={colour}
                                                    amount={1}
                                                    cost={factionVotePrice.multipliedBy(1).toNumber()}
                                                    isVoting={isVoting}
                                                    onClick={onVote(1)}
                                                    suffix="VOTE"
                                                />
                                                <VotingButton
                                                    color={colour}
                                                    amount={25}
                                                    cost={factionVotePrice.multipliedBy(25).toNumber()}
                                                    isVoting={isVoting}
                                                    onClick={onVote(25)}
                                                    suffix="VOTE"
                                                />
                                                <VotingButton
                                                    color={colour}
                                                    amount={100}
                                                    cost={factionVotePrice.multipliedBy(100).toNumber()}
                                                    isVoting={isVoting}
                                                    onClick={onVote(100)}
                                                    suffix="VOTE"
                                                />
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </ClipThing>
                        </Box>
                    </Fade>
                </Stack>
            </Stack>
        </Fade>
    )
}
