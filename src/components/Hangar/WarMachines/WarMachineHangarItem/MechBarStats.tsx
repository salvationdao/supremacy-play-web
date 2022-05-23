import { Box, Stack, Typography } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechBarStats = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    const theme = useTheme()

    const { speed, max_hitpoints } = mech
    const powerCore = mechDetails?.power_core
    const utilities = mechDetails?.utility
    const weapons = mechDetails?.weapons

    console.log({ speed, max_hitpoints, powerCore, utilities, weapons })

    return (
        <Box
            sx={{
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                pr: ".8rem",
                py: ".16rem",
                direction: "ltr",
                scrollbarWidth: "none",
                "::-webkit-scrollbar": {
                    width: ".4rem",
                },
                "::-webkit-scrollbar-track": {
                    background: "#FFFFFF15",
                    borderRadius: 3,
                },
                "::-webkit-scrollbar-thumb": {
                    background: (theme) => theme.factionTheme.primary,
                    borderRadius: 3,
                },
            }}
        >
            <Stack spacing=".8rem" sx={{ height: "100%", width: "26rem", flexShrink: 0 }}>
                <BarStat primaryColor={theme.factionTheme.primary} label="HEALTH" current={800} total={1000} />
                <BarStat primaryColor={theme.factionTheme.primary} label="SPEED" current={20} total={50} unit="M/S" />
                <BarStat primaryColor={theme.factionTheme.primary} label="ARMOUR" current={500} total={1000} />
                <BarStat primaryColor={theme.factionTheme.primary} label="WEIGHT" current={200} total={1000} unit="KG" />
                <BarStat primaryColor={theme.factionTheme.primary} label="DAMAGE" current={800} total={1000} />
            </Stack>
        </Box>
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

            <Box sx={{ flex: 1, height: ".9rem", backgroundColor: "#FFFFFF25" }}>
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
