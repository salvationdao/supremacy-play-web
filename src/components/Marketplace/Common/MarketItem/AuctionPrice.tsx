import { Stack, Typography } from "@mui/material"
import { SvgSupToken } from "../../../../assets"
import { colors, fonts } from "../../../../theme/theme"

export const AuctionPrice = ({ isGridView, formattedPrice, totalBids }: { isGridView: boolean; formattedPrice: string; totalBids: number }) => {
    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: colors.lightGrey }}>
                BID PRICE
            </Typography>

            <Stack direction="row" alignItems="center" flexWrap="wrap">
                {formattedPrice && <SvgSupToken size="1.7rem" fill={colors.auction} />}
                <Typography sx={{ color: formattedPrice ? colors.auction : colors.lightGrey, fontWeight: "fontWeightBold" }}>
                    {formattedPrice || "N/A"}
                </Typography>

                {formattedPrice && (
                    <Stack direction="row" alignItems="center" sx={{ flexShrink: 0, transform: "scale(.95)", fontStyle: "italic" }}>
                        <Typography sx={{ color: colors.auction, fontWeight: "fontWeightBold" }}>
                            &nbsp;({totalBids} BID{totalBids === 1 ? "" : "S"})
                        </Typography>
                    </Stack>
                )}
            </Stack>
        </Stack>
    )
}
