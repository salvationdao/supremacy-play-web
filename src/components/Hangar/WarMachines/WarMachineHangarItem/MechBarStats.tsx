import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechBarStats = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    const theme = useTheme()

    const health = mech.max_hitpoints
    const speed = mech.speed
    let powerCoreCapacity = 0
    let powerCoreRechargeRate = 0
    let totalShield = 0
    let totalShieldRechargeRate = 0

    if (mechDetails) {
        powerCoreCapacity = mechDetails.power_core?.capacity || 0
        powerCoreRechargeRate = mechDetails.power_core?.recharge_rate || 0

        mechDetails.utility?.forEach((utility) => {
            if (utility.shield) {
                totalShield += utility.shield.hitpoints
                totalShieldRechargeRate += utility.shield.recharge_rate
            }
        })
    }

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
            <Stack
                spacing=".7rem"
                sx={{
                    height: "100%",
                    width: "26rem",
                    flexShrink: 0,
                }}
            >
                <BarStat primaryColor={theme.factionTheme.primary} label="HEALTH" current={health} total={10000} />
                <BarStat primaryColor={theme.factionTheme.primary} label="SPEED" current={speed} total={10000} unit="M/S" />
                <BarStat primaryColor={theme.factionTheme.primary} label="Power Core CAPACITY" current={powerCoreCapacity} total={1000} />
                <BarStat primaryColor={theme.factionTheme.primary} label="Power Core REGEN" current={powerCoreRechargeRate} total={1000} unit="/S" />
                <BarStat primaryColor={theme.factionTheme.primary} label="SHIELD" current={totalShield} total={1000} />
                <BarStat primaryColor={theme.factionTheme.primary} label="SHIELD REGEN" current={totalShieldRechargeRate} total={1000} />
            </Stack>
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
    return useMemo(() => {
        if (!current) return null

        return (
            <Box>
                <Typography
                    variant="caption"
                    sx={{
                        lineHeight: 1,
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

                <Stack direction="row" alignItems="center" spacing=".6rem">
                    <Box sx={{ flex: 1, height: ".7rem", backgroundColor: "#FFFFFF25" }}>
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
                            width: "8rem",
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
            </Box>
        )
    }, [current, label, primaryColor, total, unit])
}

const BarStat = React.memo(BarStatInner)
