import { Box, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useMemo } from "react"
import { ClipThing } from "../../.."
import { SvgSupToken } from "../../../../assets"
import { numberCommaFormatter, shadeColor } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"

export const SoldDetails = ({ soldFor }: { soldFor: string }) => {
    const soldBackgroundColor = useMemo(() => shadeColor(colors.green, -95), [])
    const formattedCommaPrice = useMemo(() => numberCommaFormatter(new BigNumber(soldFor).shiftedBy(-18).toNumber()), [soldFor])

    return (
        <Box>
            <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                SOLD FOR:
            </Typography>

            <Stack>
                <ClipThing
                    clipSize="10px"
                    clipSlantSize="3px"
                    border={{
                        isFancy: true,
                        borderColor: colors.green,
                        borderThickness: ".2rem",
                    }}
                    corners={{
                        topRight: true,
                        bottomLeft: true,
                    }}
                    backgroundColor={soldBackgroundColor}
                    sx={{ alignSelf: "flex-start" }}
                >
                    <Stack direction="row" alignItems="center" spacing=".2rem" sx={{ pl: "1.5rem", pr: "1.6rem", py: ".5rem" }}>
                        <SvgSupToken size="2.2rem" fill={colors.yellow} sx={{ mt: ".1rem" }} />
                        <Typography variant="h5" sx={{ fontWeight: "fontWeightBold" }}>
                            {formattedCommaPrice}
                        </Typography>
                    </Stack>
                </ClipThing>
            </Stack>
        </Box>
    )
}
