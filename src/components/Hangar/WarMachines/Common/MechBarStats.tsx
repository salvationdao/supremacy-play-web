import { Box, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { SvgPowerCore } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechBarStats = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    const theme = useTheme()

    return (
        <Stack sx={{ height: "100%", width: "26rem", flexShrink: 0 }}>
            <BarStat primaryColor={theme.factionTheme.primary} label="SPEED" current={800} total={1000} />
        </Stack>
    )
}

const BarStat = ({ primaryColor, label, current, total }: { primaryColor: string; label: string; current: number; total: number }) => {
    return (
        <Stack direction="row">
            <Typography
                sx={{
                    width: "8rem",
                    textAlign: "end",
                    fontFamily: fonts.nostromoBold,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {label}
            </Typography>

            <Box sx={{ flex: 1, backgroundColor: "#FFFFFF20" }}>
                <Box
                    sx={{
                        width: `${(100 * current) / total}%`,
                        height: "100%",
                        backgroundColor: primaryColor,
                        transition: "all .15s",
                    }}
                />
            </Box>

            <Typography
                sx={{
                    width: "8rem",
                    fontFamily: fonts.nostromoBold,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {current}
            </Typography>
        </Stack>
    )
}
