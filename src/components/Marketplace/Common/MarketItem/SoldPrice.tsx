import { Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useMemo } from "react"
import { SvgSupToken } from "../../../../assets"
import { numFormatter } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"

export const SoldPrice = ({ isGridView, soldFor }: { isGridView?: boolean; soldFor: string }) => {
    const formattedPrice = useMemo(() => {
        return numFormatter(new BigNumber(soldFor).shiftedBy(-18).toNumber())
    }, [soldFor])

    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography variant="subtitle2" sx={{ fontFamily: fonts.nostromoBlack, color: colors.grey }}>
                SOLD FOR
            </Typography>

            <Stack direction="row" alignItems="center" flexWrap="wrap">
                <SvgSupToken size="1.7rem" fill={colors.marketSold} />
                <Typography sx={{ color: colors.marketSold, fontWeight: "fontWeightBold" }}>{formattedPrice}</Typography>
            </Stack>
        </Stack>
    )
}
