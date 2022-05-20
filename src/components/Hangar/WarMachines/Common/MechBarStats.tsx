import { Box, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { SvgPowerCore } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechBarStats = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    const theme = useTheme()

    return (
        <Stack spacing=".8rem" sx={{ height: "100%", width: "26rem", flexShrink: 0 }}>
            <BarStat primaryColor={theme.factionTheme.primary} label="ENERGY" current={800} total={1000} />
            <BarStat primaryColor={theme.factionTheme.primary} label="ARMOUR" current={500} total={1000} />
            <BarStat primaryColor={theme.factionTheme.primary} label="SPEED" current={20} total={50} unit="M/S" />
            <BarStat primaryColor={theme.factionTheme.primary} label="WEIGHT" current={200} total={1000} unit="KG" />
            <BarStat primaryColor={theme.factionTheme.primary} label="DAMAGE" current={800} total={1000} />
        </Stack>
    )
}

const BarStat = ({ primaryColor, label, current, total, unit }: { primaryColor: string; label: string; current: number; total: number; unit?: string }) => {
    return (
        <Stack direction="row" spacing=".8rem" alignItems="center">
            <Typography
                variant="caption"
                sx={{
                    width: "6.5rem",
                    textAlign: "end",
                    fontSize: "1.1rem",
                    fontFamily: fonts.nostromoBlack,
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

            <Box sx={{ flex: 1, height: "1rem", backgroundColor: "#FFFFFF25" }}>
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
                variant="caption"
                sx={{
                    width: "5rem",
                    fontSize: "1.1rem",
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
                {unit}
            </Typography>
        </Stack>
    )
}
