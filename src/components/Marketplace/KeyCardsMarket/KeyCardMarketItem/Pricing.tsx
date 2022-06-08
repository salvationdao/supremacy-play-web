import { Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useMemo } from "react"
import { SvgSupToken } from "../../../../assets"
import { numFormatter } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { MarketplaceBuyItem } from "../../../../types/marketplace"

export const Pricing = ({ isGridView, marketItem }: { isGridView: boolean; marketItem: MarketplaceBuyItem }) => {
    const { buyout_price } = marketItem
    const formattedPrice = useMemo(() => numFormatter(new BigNumber(buyout_price).shiftedBy(-18).toNumber()), [buyout_price])

    return (
        <Stack spacing={isGridView ? "" : ".6rem"}>
            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: colors.lightGrey }}>
                FIXED PRICE
            </Typography>

            <Stack direction="row" alignItems="center">
                <SvgSupToken size="1.7rem" fill={colors.yellow} />
                <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                    {formattedPrice}
                </Typography>
            </Stack>
        </Stack>
    )
}
