import { Stack, Typography } from "@mui/material"
import { SvgSupToken } from "../../../../assets"
import { colors, fonts } from "../../../../theme/theme"

export const Pricing = ({ isGridView, formattedPrice, priceLabel }: { isGridView: boolean; formattedPrice: string; priceLabel: string }) => {
    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: colors.lightGrey }}>
                {priceLabel}
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
