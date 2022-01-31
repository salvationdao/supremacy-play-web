import { Box, CardMedia, Stack, Typography } from '@mui/material'
import { useCallback } from 'react'
import { ClipThing, FancyButton } from '..'
import { SvgSupToken } from '../../assets'
import { useGame, useWebsocket } from '../../containers'
import HubKey from '../../keys'
import { colors } from '../../theme/theme'
import { FactionAbility } from '../../types'
import { useTheme } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import BigNumber from 'bignumber.js'
import { supFormatter } from '../../helpers'
import { useWallet } from '@ninjasoftware/passport-gamebar'

interface VoteRequest {
    factionAbilityID: string
    pointSpend: BigNumber
}

const VotingButton = ({
    factionAbilityID,
    amount,
    color,
}: {
    factionAbilityID: string
    amount: BigNumber
    color: string
}) => {
    const { send } = useWebsocket()
    const { battleState } = useGame()
    const { onWorldSups } = useWallet()

    const isVotable =
        (battleState?.phase == 'FIRST_VOTE' || battleState?.phase == 'TIE') &&
        onWorldSups &&
        onWorldSups.isGreaterThanOrEqualTo(amount)

    const onVote = useCallback(async () => {
        try {
            const resp = await send<boolean, VoteRequest>(HubKey.SubmitFirstVote, {
                factionAbilityID,
                pointSpend: amount,
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
            clipSx={{ flex: 1 }}
            backgroundColor={color}
            borderColor={color}
            onClick={onVote}
        >
            <Stack alignItems="center" direction="row" spacing={0.3}>
                <SvgSupToken size="15px" />
                <Typography
                    variant="caption"
                    sx={{ lineHeight: 1, fontWeight: 'fontWeightBold', fontFamily: 'Nostromo Regular Medium' }}
                >
                    {`${supFormatter(amount)}`}
                </Typography>
            </Stack>
        </FancyButton>
    )
}

export const FactionAbilityItem = ({ a }: { a: FactionAbility }) => {
    const { id, label, colour, imageUrl } = a
    const theme = useTheme<Theme>()
    return (
        <Box>
            <ClipThing border={{ isFancy: true, borderColor: colour, borderThickness: '1.5px' }} clipSize="6px">
                <Box sx={{ backgroundColor: colors.darkNavy }}>
                    <Stack direction="row" sx={{ height: 65, minWidth: 180 }}>
                        <ClipThing
                            border={{ isFancy: true, borderColor: colour, borderThickness: '1px' }}
                            clipSize="6px"
                            fillHeight
                        >
                            <Stack
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    backgroundColor: theme.factionTheme.background,
                                    height: '100%',
                                    width: 61,
                                }}
                            >
                                <CardMedia component="img" alt={label} height="100%" image={imageUrl} />
                            </Stack>
                        </ClipThing>

                        <Stack
                            spacing={1}
                            alignItems="flex-start"
                            sx={{ backgroundColor: colors.darkNavy, px: 2, py: 1.2 }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 'fontWeightBold',
                                    color: colour,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: 200,
                                }}
                            >
                                {label}
                            </Typography>

                            <Stack direction="row" spacing={0.4} sx={{ mt: 0.6, width: '100%' }}>
                                <VotingButton
                                    factionAbilityID={id}
                                    color={colour}
                                    amount={new BigNumber('1000000000000000000')}
                                />
                                <VotingButton
                                    factionAbilityID={id}
                                    color={colour}
                                    amount={new BigNumber('10000000000000000000')}
                                />
                                <VotingButton
                                    factionAbilityID={id}
                                    color={colour}
                                    amount={new BigNumber('100000000000000000000')}
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </ClipThing>
        </Box>
    )
}
