import { Box, Typography } from "@mui/material"
import React from "react"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechBarStats = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    const theme = useTheme()
    const { speed, max_hitpoints } = mech
    let rechargeRate = 0
    let capacity = 0

    if (mechDetails) {
        rechargeRate = mechDetails.power_core?.recharge_rate || 0
        capacity = mechDetails.power_core?.capacity || 0
    }

    const powerCore = mechDetails?.power_core
    const utilities = mechDetails?.utility
    const weapons = mechDetails?.weapons

    if (!mech) console.log({ speed, max_hitpoints, powerCore, utilities, weapons })

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
            <Box
                sx={{
                    height: "100%",
                    width: "26rem",
                    flexShrink: 0,
                    display: "grid",
                    gridTemplateColumns: "max-content 1fr max-content",
                    alignItems: "center",
                    gridColumnGap: ".8rem",
                    gridRowGap: ".8rem",
                    gridAutoRows: "min-content",
                }}
            >
                <BarStat primaryColor={theme.factionTheme.primary} label="HEALTH" current={800} total={1000} />
                <BarStat primaryColor={theme.factionTheme.primary} label="SPEED" current={20} total={50} unit="M/S" />
                <BarStat primaryColor={theme.factionTheme.primary} label="ARMOUR" current={500} total={1000} />
                <BarStat primaryColor={theme.factionTheme.primary} label="WEIGHT" current={200} total={1000} unit="KG" />
                <BarStat primaryColor={theme.factionTheme.primary} label="DAMAGE" current={800} total={1000} />
            </Box>
        </Box>
    )
}

const BarStatInner = ({
    primaryColor,
    label,
    current,
    total,
    unit,
}: {
    primaryColor: string
    label: string
    current: number
    total: number
    unit?: string
}) => {
    return (
        <>
            <Typography
                variant="caption"
                sx={{
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

            <Box sx={{ height: ".9rem", backgroundColor: "#FFFFFF25" }}>
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
        </>
    )
}

const BarStat = React.memo(BarStatInner)
