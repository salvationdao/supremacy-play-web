import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgSupToken } from "../../../../assets"
import { colors } from "../../../../theme/theme"
import { General } from "./General"

export const BuyoutPrice = ({
    isGridView,
    formattedPrice,
    formattedDropPrice,
}: {
    isGridView?: boolean
    formattedPrice: string
    formattedDropPrice?: string
}) => {
    const primaryColor = useMemo(() => (formattedDropPrice ? colors.dutchAuction : colors.buyout), [formattedDropPrice])

    return (
        <General isGridView={isGridView} title="BUYOUT PRICE">
            <Stack direction="row" alignItems="center" flexWrap="wrap">
                {formattedPrice && <SvgSupToken size="1.7rem" fill={primaryColor} />}
                <Typography sx={{ color: formattedPrice ? primaryColor : colors.lightGrey, fontWeight: "fontWeightBold" }}>
                    {formattedPrice || "N/A"}
                </Typography>

                {formattedDropPrice && (
                    <Stack direction="row" alignItems="center" sx={{ flexShrink: 0, transform: "scale(.95)", fontStyle: "italic" }}>
                        <Typography sx={{ color: primaryColor, fontWeight: "fontWeightBold" }}>&nbsp;-&nbsp;</Typography>
                        <SvgSupToken size="1.5rem" fill={primaryColor} sx={{ transform: "skew(-20deg)" }} />
                        <Typography sx={{ color: primaryColor, fontWeight: "fontWeightBold" }}>{formattedDropPrice}/MIN</Typography>
                    </Stack>
                )}
            </Stack>
        </General>
    )
}
