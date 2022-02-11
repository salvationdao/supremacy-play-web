import { Stack, Typography } from '@mui/material'
import BigNumber from 'bignumber.js'
import { SvgPriceDownArrow, SvgPriceUpArrow, SvgSupToken } from '../../assets'
import { useGame } from '../../containers'
import { zoomEffect } from '../../theme/keyframes'
import { colors } from '../../theme/theme'

const ReUsedText = ({ caption, price, prevPrice }: { caption: string; price: BigNumber; prevPrice: BigNumber }) => {
    return (
        <Stack spacing={1.2} direction="row" alignItems="center" justifyContent="space-between" alignSelf="stretch">
            <Typography variant="body1" sx={{ lineHeight: 1, fontWeight: 'fontWeightBold' }}>
                {caption}
            </Typography>

            <Stack direction="row" alignItems="center" justifyContent="center">
                <SvgSupToken size="15.5px" fill={colors.yellow} />
                <Typography
                    key={price.toFixed()}
                    variant="body1"
                    sx={{ lineHeight: 1, animation: `${zoomEffect(1.05)} 300ms ease-out` }}
                >
                    {price.toFixed()}
                </Typography>

                {price.isGreaterThan(prevPrice) ? (
                    <SvgPriceUpArrow size="16px" fill={'#FF4A4A'} />
                ) : (
                    <SvgPriceDownArrow size="16px" fill={'#6fff4b'} />
                )}
            </Stack>
        </Stack>
    )
}

export const Prices = () => {
    const { factionVotePrice, prevFactionVotePrice } = useGame()

    return (
        <Stack spacing={0.5}>
            <ReUsedText caption="Cost to applause:" price={factionVotePrice} prevPrice={prevFactionVotePrice} />
        </Stack>
    )
}
