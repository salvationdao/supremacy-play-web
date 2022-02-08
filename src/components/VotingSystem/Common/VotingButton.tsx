import { Box, Stack, Typography } from '@mui/material'
import { useWallet } from '@ninjasoftware/passport-gamebar'
import { FancyButton } from '../..'
import { SvgSupToken } from '../../../assets'

interface VotingButtonProps {
    amount: number
    cost: number
    color: string
    isVoting: boolean
    onClick: () => Promise<boolean>
    suffix: string
    disableHover?: boolean
}

export const VotingButton = ({ amount, cost, color, isVoting, onClick, suffix, disableHover }: VotingButtonProps) => {
    const { onWorldSups } = useWallet()

    const isVotable = isVoting && onWorldSups && onWorldSups.dividedBy(1000000000000000000).isGreaterThanOrEqualTo(cost)

    return (
        <FancyButton
            disabled={!isVotable}
            excludeCaret
            clipSize="4px"
            sx={{ pt: 0.4, pb: 0.3, minWidth: 92 }}
            clipSx={{ flex: 1, position: 'relative' }}
            backgroundColor={color}
            borderColor={color}
            onClick={onClick}
        >
            {!disableHover && (
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
                    {cost.toFixed(6)}
                </Box>
            )}

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
                    {`${amount} ${suffix}${amount === 1 ? '' : 's'}`}
                </Typography>
            </Stack>
        </FancyButton>
    )
}
