import { Box, Stack, Typography } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/styles'
import { useWallet } from '@ninjasoftware/passport-gamebar'
import BigNumber from 'bignumber.js'
import { useCallback, useState } from 'react'
import { ClipThing, FancyButton } from '..'
import { SvgSupToken } from '../../assets'
import { useGame, useWebsocket } from '../../containers'
import { supFormatter } from '../../helpers'
import HubKey from '../../keys'
import { colors } from '../../theme/theme'
import { FactionAbility } from '../../types'

interface VoteRequest {
    factionAbilityID: string
    pointSpend: BigNumber
}

const VotingButton = ({
    factionAbilityID,
    multiplier = 1,
    cost,
    color,
}: {
    factionAbilityID: string
    multiplier?: number
    cost: BigNumber
    color: string
}) => {
    const { send } = useWebsocket()
    const { battleState } = useGame()
    const { onWorldSups } = useWallet()

    const totalCost = cost.multipliedBy(multiplier)

    const isVotable =
        (battleState?.phase == 'FIRST_VOTE' || battleState?.phase == 'TIE') &&
        onWorldSups &&
        onWorldSups.isGreaterThanOrEqualTo(totalCost)

    const onVote = useCallback(async () => {
        try {
            const resp = await send<boolean, VoteRequest>(HubKey.SubmitFirstVote, {
                factionAbilityID,
                pointSpend: totalCost,
            })

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
            sx={{ pt: 0.4, pb: 0.3, minWidth: 56 }}
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
                {supFormatter(totalCost)}
            </Box>

            <Stack alignItems="center" direction="row" spacing={0.3}>
                <Typography
                    variant="caption"
                    sx={{
                        lineHeight: 1,
                        fontWeight: 'fontWeightBold',
                        fontFamily: 'Nostromo Regular Medium',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {`${multiplier} vote${multiplier === 1 ? '' : 's'}`}
                </Typography>
            </Stack>
        </FancyButton>
    )
}

export const FactionAbilityItem = ({ a }: { a: FactionAbility }) => {
    const { id, label, colour, imageUrl, supsCost } = a
    const theme = useTheme<Theme>()

    return (
        <Box>
            <ClipThing border={{ isFancy: true, borderColor: colour, borderThickness: '1.5px' }} clipSize="6px">
                <Box sx={{ backgroundColor: colors.darkNavy }}>
                    <Stack direction="row" sx={{ height: 67, minWidth: 180 }}>
                        <ClipThing
                            border={{ isFancy: true, borderColor: colour, borderThickness: '1px' }}
                            clipSize="6px"
                            fillHeight
                        >
                            <Box
                                sx={{
                                    backgroundColor: theme.factionTheme.background,
                                    height: '100%',
                                    width: 61,
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
                                    <Typography variant="body2" sx={{ color: 'grey !important', lineHeight: 1 }}>
                                        1 vote
                                    </Typography>
                                    <Typography variant="body2" sx={{ mx: 0.3, lineHeight: 1 }}>
                                        =
                                    </Typography>
                                    <SvgSupToken component="span" size="14px" fill={colors.yellow} />
                                    <Typography variant="body2" sx={{ lineHeight: 1 }}>
                                        {supFormatter(new BigNumber(supsCost))}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Stack direction="row" spacing={0.4} sx={{ mt: 0.6, width: '100%' }}>
                                <VotingButton factionAbilityID={id} color={colour} cost={new BigNumber(supsCost)} />
                                <VotingButton
                                    factionAbilityID={id}
                                    color={colour}
                                    cost={new BigNumber(supsCost)}
                                    multiplier={25}
                                />
                                <VotingButton
                                    factionAbilityID={id}
                                    color={colour}
                                    cost={new BigNumber(supsCost)}
                                    multiplier={100}
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </ClipThing>
        </Box>
    )
}
