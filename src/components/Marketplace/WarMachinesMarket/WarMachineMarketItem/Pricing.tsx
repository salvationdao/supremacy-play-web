import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgSupToken } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { consolidateMarketItemDeets, numFormatter } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { MarketplaceMechItem } from "../../../../types/marketplace"

export const Pricing = ({ isGridView, marketItem }: { isGridView: boolean; marketItem: MarketplaceMechItem }) => {
    const theme = useTheme()
    const marketItemDeets = useMemo(() => consolidateMarketItemDeets(marketItem, theme), [marketItem, theme])
    const formattedPrice = useMemo(() => numFormatter(marketItemDeets.price.toNumber()), [marketItemDeets.price])

    return (
        <Stack spacing={isGridView ? "" : ".6rem"}>
            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: colors.lightGrey }}>
                {marketItemDeets.priceLabel}
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
