import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/styles'
import { Box, Stack, Typography } from '@mui/material'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useState } from 'react'
import { ClipThing, VotingButton } from '..'
import { useGame, useWebsocket } from '../../containers'
import HubKey from '../../keys'
import { zoomEffect } from '../../theme/keyframes'
import { colors } from '../../theme/theme'
import { FactionAbility, FactionAbilityTargetPrice } from '../../types'

const ContributionBar = ({ isVoting, isCooldown }: { isVoting: boolean; isCooldown: boolean }) => {
    const { factionsColor } = useGame()

    // Array order is (Red Mountain, Boston, Zaibatsu). [[colorArray], [ratioArray]]
    const [voteRatio, setVoteRatio] = useState<[number, number, number]>([33, 33, 33])

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

interface FactionAbilityContributeRequest {
    factionAbilityID: string
    amount: BigNumber
}

interface FactionAbilityItemProps {
    factionAbility: FactionAbility
    pricing: FactionAbilityTargetPrice
}

export const FactionAbilityItem = ({ factionAbility, pricing }: FactionAbilityItemProps) => {
    const { send } = useWebsocket()
    const theme = useTheme<Theme>()

    const factionAbilityID = factionAbility.id
    const currentSups = new BigNumber(pricing.currentSups).dividedBy('1000000000000000000')
    const supsCost = new BigNumber(pricing.supsCost).dividedBy('1000000000000000000')
    const isVoting = supsCost.isGreaterThanOrEqualTo(currentSups)

    const onContribute = useCallback(
        (amount: number) => async () => {
            try {
                const resp = await send<boolean, FactionAbilityContributeRequest>(HubKey.FactionAbilityContribute, {
                    factionAbilityID,
                    amount: new BigNumber(amount),
                })

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

    const { label, colour, imageUrl } = factionAbility

    return (
        <Box>
            <ClipThing
                border={{ isFancy: true, borderColor: theme.factionTheme.primary, borderThickness: '1.5px' }}
                clipSize="6px"
            >
                <Box sx={{ backgroundColor: colors.darkNavy }}>
                    <Stack direction="row" sx={{ height: 118, minWidth: 180 }}>
                        <ClipThing
                            border={{ isFancy: true, borderColor: theme.factionTheme.primary, borderThickness: '1px' }}
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

                                <Stack direction="row" alignItems="center" justifyContent="center">
                                    <Typography
                                        key={`currentSups-${currentSups}.toFixed()}`}
                                        variant="body2"
                                        sx={{
                                            lineHeight: 1,
                                            color: `${colour} !important`,
                                            animation: `${zoomEffect(1.5)} 300ms ease-out`,
                                        }}
                                    >
                                        {currentSups.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ lineHeight: 1, color: `${colour} !important` }}>
                                        &nbsp;/&nbsp;
                                    </Typography>
                                    <Typography
                                        key={`supsCost-${supsCost.toFixed()}`}
                                        variant="body2"
                                        sx={{
                                            lineHeight: 1,
                                            color: `${colour} !important`,
                                            animation: `${zoomEffect(1.5)} 300ms ease-out`,
                                        }}
                                    >
                                        {supsCost.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ lineHeight: 1, color: `${colour} !important` }}>
                                        &nbsp;SUPS
                                    </Typography>
                                </Stack>
                            </Stack>

                            {/* <ContributionBar /> */}

                            <Stack direction="row" spacing={0.4} sx={{ mt: 0.6, width: '100%' }}>
                                <VotingButton
                                    color={colour}
                                    amount={1}
                                    cost={1}
                                    isVoting={isVoting}
                                    onClick={onContribute(1)}
                                    suffix="SUP"
                                    disableHover
                                />
                                <VotingButton
                                    color={colour}
                                    amount={25}
                                    cost={25}
                                    isVoting={isVoting}
                                    onClick={onContribute(25)}
                                    suffix="SUP"
                                    disableHover
                                />
                                <VotingButton
                                    color={colour}
                                    amount={100}
                                    cost={100}
                                    isVoting={isVoting}
                                    onClick={onContribute(100)}
                                    suffix="SUP"
                                    disableHover
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </ClipThing>
        </Box>
    )
}
