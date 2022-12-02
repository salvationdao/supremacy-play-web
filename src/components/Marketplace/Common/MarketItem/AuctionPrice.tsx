import { Stack, Typography } from "@mui/material"
import { SvgSupToken } from "../../../../assets"
import { colors } from "../../../../theme/theme"
import { General } from "./General"

export const AuctionPrice = ({ isGridView, formattedPrice, totalBids }: { isGridView?: boolean; formattedPrice: string; totalBids?: number }) => {
    return (
        <General isGridView={isGridView} title="BID PRICE">
            <Stack direction="row" alignItems="center" flexWrap="wrap">
                {formattedPrice && <SvgSupToken size="1.7rem" fill={colors.auction} />}
                <Typography sx={{ color: formattedPrice ? colors.auction : colors.lightGrey, fontWeight: "bold" }}>{formattedPrice || "N/A"}</Typography>

                {formattedPrice && !!totalBids && (
                    <Stack direction="row" alignItems="center" sx={{ flexShrink: 0, transform: "scale(.95)", fontStyle: "italic" }}>
                        <Typography sx={{ color: colors.auction, fontWeight: "bold" }}>
                            &nbsp;({totalBids} BID{totalBids === 1 ? "" : "S"})
                        </Typography>
                    </Stack>
                )}
            </Stack>
        </General>
    )
}
