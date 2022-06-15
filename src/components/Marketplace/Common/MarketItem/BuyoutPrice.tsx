import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgSupToken } from "../../../../assets"
import { colors, fonts } from "../../../../theme/theme"

export const BuyoutPrice = ({
    isGridView,
    formattedPrice,
    formattedDropPrice,
}: {
    isGridView: boolean
    formattedPrice: string
    formattedDropPrice?: string
}) => {
    const primaryColor = useMemo(() => (formattedDropPrice ? colors.dutchAuction : colors.buyout), [formattedDropPrice])

    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: colors.lightGrey }}>
                BUYOUT PRICE
            </Typography>

            <Stack direction="row" alignItems="center" flexWrap="wrap">
                {formattedPrice && <SvgSupToken size="1.7rem" fill={primaryColor} />}
                <Typography variant="caption" sx={{ color: formattedPrice ? primaryColor : colors.lightGrey, fontFamily: fonts.nostromoBlack }}>
                    {formattedPrice || "N/A"}
                </Typography>

                {formattedDropPrice && (
                    <Stack direction="row" alignItems="center" sx={{ flexShrink: 0, transform: "scale(.95)", fontStyle: "italic" }}>
                        <Typography variant="caption" sx={{ color: primaryColor, fontFamily: fonts.nostromoBold }}>
                            &nbsp;-&nbsp;
                        </Typography>
                        <SvgSupToken size="1.5rem" fill={primaryColor} sx={{ transform: "skew(-20deg)" }} />
                        <Typography variant="caption" sx={{ color: primaryColor, fontFamily: fonts.nostromoBold }}>
                            {formattedDropPrice}/MIN
                        </Typography>
                    </Stack>
                )}
            </Stack>
        </Stack>
    )
}
