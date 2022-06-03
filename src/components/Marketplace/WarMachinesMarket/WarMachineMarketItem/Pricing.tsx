import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgSupToken } from "../../../../assets"
import { numFormatter } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"

export const Pricing = ({ buyoutPrice, auctionPrice, buyout }: { buyoutPrice: string; auctionPrice: string; buyout: boolean; auction: boolean }) => {
    const formattedPrice = useMemo(() => numFormatter(buyout ? parseInt(buyoutPrice) : parseInt(auctionPrice)), [auctionPrice, buyout, buyoutPrice])

    return (
        <Stack spacing=".6rem">
            <Typography sx={{ fontFamily: fonts.nostromoBlack, color: colors.lightGrey }}>{buyout ? "FIXED PRICE" : "CURRENT BID"}</Typography>

            <Stack direction="row" alignItems="center">
                <SvgSupToken size="1.7rem" fill={colors.yellow} />
                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBold }}>
                    {formattedPrice}
                </Typography>
            </Stack>
        </Stack>
    )
}
