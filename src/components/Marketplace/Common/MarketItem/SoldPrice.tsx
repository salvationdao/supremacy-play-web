import { Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useMemo } from "react"
import { SvgSupToken } from "../../../../assets"
import { numFormatter } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"

export const SoldPrice = ({ isGridView, soldFor }: { isGridView: boolean; soldFor: string }) => {
    const formattedPrice = useMemo(() => {
        return numFormatter(new BigNumber(soldFor).shiftedBy(-18).toNumber())
    }, [soldFor])

    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: colors.lightGrey }}>
                SOLD FOR
            </Typography>

            <Stack direction="row" alignItems="center" flexWrap="wrap">
                <SvgSupToken size="1.7rem" fill={colors.green} />
                <Typography variant="caption" sx={{ color: colors.green, fontFamily: fonts.nostromoBlack }}>
                    {formattedPrice}
                </Typography>
            </Stack>
        </Stack>
    )
}
