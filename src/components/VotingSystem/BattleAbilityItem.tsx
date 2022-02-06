import { Box, Stack, Typography } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/styles'
import { useWallet } from '@ninjasoftware/passport-gamebar'
import { useCallback, useEffect, useState } from 'react'
import { ClipThing, FancyButton } from '..'
import { SvgCooldown, SvgSupToken } from '../../assets'
import { useGame, useWebsocket } from '../../containers'
import HubKey from '../../keys'
import { zoomEffect } from '../../theme/keyframes'
import { colors } from '../../theme/theme'
import { BattleAbility, NetMessageType } from '../../types'

interface VoteRequest {
    voteAmount: number // 1, 10, 100
}

const VotingButton = ({ voteAmount, color }: { voteAmount: number; color: string }) => {
    const { send } = useWebsocket()
    const { votingState, factionVotePrice } = useGame()
    const { onWorldSups } = useWallet()
    const totalCost = factionVotePrice.multipliedBy(voteAmount)

    const isVotable =
        (votingState?.phase == 'VOTE_ABILITY_RIGHT' || votingState?.phase == 'NEXT_VOTE_WIN') &&
        onWorldSups &&
        onWorldSups.dividedBy(1000000000000000000).isGreaterThanOrEqualTo(totalCost)

    const onVote = useCallback(async () => {
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
    }, [])

    return (
        <FancyButton
            disabled={!isVotable}
            excludeCaret
            clipSize="4px"
            sx={{ pt: 0.4, pb: 0.3, minWidth: 92 }}
            clipSx={{ flex: 1, position: 'relative' }}
            backgroundColor={color}
            borderColor={color}
            onClick={onVote}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, .9)',
                    color: 'white',
                    opacity: 0,
                    transition: 'opacity .2s ease-out',
                    ':hover': {
                        opacity: 1,
                    },
                }}
            >
                <SvgSupToken size="15px" />
                {totalCost.toFixed(6)}
            </Box>

            <Stack alignItems="center" direction="row" spacing={0.3}>
                <Typography
                    variant="caption"
                    sx={{
                        lineHeight: 1,
                        fontWeight: 'fontWeightBold',
                        fontFamily: 'Nostromo Regular Medium',
                        whiteSpace: 'nowrap',
                        color: '#FFFFFF',
                    }}
                >
                    {`${voteAmount} vote${voteAmount === 1 ? '' : 's'}`}
                </Typography>
            </Stack>
        </FancyButton>
    )
}

const VotingBar = ({ isVoting }: { isVoting: boolean }) => {
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

    const subBar = useCallback(
        (color: string, ratio: number) => (
            <Box
                sx={{
                    position: 'relative',
                    width: isVoting ? `${ratio}%` : '33.33%',
                    height: '100%',
                    backgroundColor: color,
                    transition: 'all .25s',
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
                        animation: `${zoomEffect} 300ms ease-out`,
                    }}
                >
                    {Math.round(ratio)}%
                </Typography>
            </Box>
        ),
        [isVoting],
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

export const BattleAbilityItem = ({ battleAbility, isVoting }: { battleAbility: BattleAbility; isVoting: boolean }) => {
    const { label, colour, imageUrl, cooldownDurationSecond } = battleAbility
    const theme = useTheme<Theme>()

    return (
        <Box>
            <ClipThing border={{ isFancy: true, borderColor: colour, borderThickness: '1.5px' }} clipSize="6px">
                <Box sx={{ backgroundColor: colors.darkNavy }}>
                    <Stack direction="row" sx={{ height: 118, minWidth: 180 }}>
                        <ClipThing
                            border={{ isFancy: true, borderColor: colour, borderThickness: '1px' }}
                            clipSize="6px"
                            fillHeight
                        >
                            <Box
                                sx={{
                                    backgroundColor: theme.factionTheme.background,
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

                                <Stack spacing={0.3} direction="row" alignItems="center" justifyContent="center">
                                    <SvgCooldown component="span" size="13.2px" fill={'grey'} />
                                    <Typography variant="body2" sx={{ lineHeight: 1, color: 'grey !important' }}>
                                        {cooldownDurationSecond}s
                                    </Typography>
                                </Stack>
                            </Stack>

                            <VotingBar isVoting={isVoting} />

                            <Stack direction="row" spacing={0.4} sx={{ mt: 0.6, width: '100%' }}>
                                <VotingButton color={colour} voteAmount={1} />
                                <VotingButton color={colour} voteAmount={25} />
                                <VotingButton color={colour} voteAmount={100} />
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </ClipThing>
        </Box>
    )
}
