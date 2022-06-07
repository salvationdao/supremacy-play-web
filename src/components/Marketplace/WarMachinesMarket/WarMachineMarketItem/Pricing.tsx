import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgSupToken } from "../../../../assets"
import { numFormatter } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"

export const Pricing = ({
    isGridView,
    buyoutPrice,
    auctionPrice,
    buyout,
}: {
    isGridView: boolean
    buyoutPrice: string
    auctionPrice: string
    buyout: boolean
    auction: boolean
}) => {
    const formattedPrice = useMemo(() => numFormatter(parseInt(buyout ? buyoutPrice : auctionPrice)), [auctionPrice, buyout, buyoutPrice])

    return (
        <Stack spacing={isGridView ? "" : ".6rem"}>
            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: colors.lightGrey }}>
                {buyout ? "FIXED PRICE" : "CURRENT BID"}
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
