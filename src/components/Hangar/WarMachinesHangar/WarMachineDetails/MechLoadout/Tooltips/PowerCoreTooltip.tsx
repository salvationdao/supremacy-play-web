import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { SvgPowerCore } from "../../../../../../assets"
import { useTheme } from "../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../helpers"
import { useGameServerSubscriptionFaction } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { colors, fonts } from "../../../../../../theme/theme"
import { PowerCore } from "../../../../../../types"
import { NiceBoxThing } from "../../../../../Common/Nice/NiceBoxThing"

export interface PowerCoreTooltipProps {
    id: string
    compareTo?: PowerCore
}

export const PowerCoreTooltip = ({ id, compareTo }: PowerCoreTooltipProps) => {
    const theme = useTheme()
    const [powerCore, setPowerCore] = useState<PowerCore>()

    useGameServerSubscriptionFaction<PowerCore>(
        {
            URI: `/power_core/${id}/details`,
            key: GameServerKeys.GetPowerCoreDetails,
        },
        (payload) => {
            if (!payload) return
            setPowerCore(payload)
        },
    )

    const content = useMemo(() => {
        if (!powerCore) {
            return (
                <Stack
                    sx={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress size="2rem" />
                </Stack>
            )
        }

        const rarity = getRarityDeets(powerCore.tier)
        return (
            <>
                <Stack
                    sx={{
                        p: "2rem",
                        background: `linear-gradient(to right, ${theme.factionTheme.background}, ${rarity.color}22)`,
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBold,
                            fontSize: "1.6rem",
                        }}
                    >
                        {powerCore.label}
                    </Typography>
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography>{powerCore.label}</Typography>
                        <Typography
                            sx={{
                                color: rarity.color,
                            }}
                        >
                            {rarity.label}
                        </Typography>
                    </Stack>
                </Stack>
                <Box
                    component="img"
                    src={powerCore.image_url || powerCore.avatar_url}
                    sx={{
                        width: "100%",
                        height: "100%",
                        maxHeight: 140,
                        p: "2rem",
                        objectFit: "contain",
                        borderBottom: `1px solid ${rarity.color}`,
                    }}
                />
                <Stack p="2rem">
                    <PowerCoreStats powerCore={powerCore} compareTo={compareTo} />
                </Stack>
            </>
        )
    }, [compareTo, powerCore, theme.factionTheme.background])

    return (
        <NiceBoxThing
            border={{
                color: powerCore ? getRarityDeets(powerCore.tier).color : theme.factionTheme.primary,
                thickness: "very-lean",
            }}
            background={{
                colors: [theme.factionTheme.background],
            }}
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: 250,
                width: 280,
            }}
        >
            {content}
        </NiceBoxThing>
    )
}

interface PowerCoreStatsProps {
    powerCore: PowerCore
    compareTo?: PowerCore
}

const PowerCoreStats = ({ powerCore, compareTo }: PowerCoreStatsProps) => {
    const renderStat = (icon: React.ReactNode, label: string, stat: string | number, compareStat?: string | number, unit?: string, nonNumeric?: boolean) => {
        let comparison = <></>
        let color = "white"
        if (typeof compareStat !== "undefined") {
            if (nonNumeric && stat !== compareStat) {
                comparison = <>→ {compareStat}</>
            } else if (stat !== compareStat) {
                let rawStat = 0
                let rawCompareStat = 0
                if (typeof stat === "string") {
                    rawStat = parseFloat(stat)
                } else {
                    rawStat = stat
                }
                if (typeof compareStat === "string") {
                    rawCompareStat = parseFloat(compareStat)
                } else {
                    rawCompareStat = compareStat
                }

                const difference = rawCompareStat - rawStat
                if (difference > 0) {
                    color = colors.green
                    comparison = (
                        <Box component="span" ml=".5rem">
                            (+{difference}
                            {unit})
                        </Box>
                    )
                } else if (difference < 0) {
                    color = colors.red
                    comparison = (
                        <Box component="span" ml=".5rem">
                            ({difference}
                            {unit})
                        </Box>
                    )
                }
            }
        }
        return (
            <Stack direction="row">
                {icon}
                <Typography ml=".5rem" textTransform="uppercase">
                    {label}
                </Typography>
                <Typography ml="auto" fontWeight="fontWeightBold">
                    <Box component="span" color={color}>
                        {stat}
                        {unit}
                    </Box>
                    {comparison}
                </Typography>
            </Stack>
        )
    }

    return (
        <>
            {renderStat(<SvgPowerCore />, "Size", powerCore.size, compareTo?.size, undefined, true)}
            {renderStat(<SvgPowerCore />, "Capacity", powerCore.capacity, compareTo?.capacity)}
            {renderStat(<SvgPowerCore />, "Recharge Rate", powerCore.recharge_rate, compareTo?.recharge_rate, "/sec")}
            {renderStat(<SvgPowerCore />, "Weapon Share", powerCore.weapon_share, compareTo?.weapon_share, "%")}
            {renderStat(<SvgPowerCore />, "Movement Share", powerCore.movement_share, compareTo?.movement_share, "%")}
            {renderStat(<SvgPowerCore />, "Utility Share", powerCore.utility_share, compareTo?.utility_share, "%")}
        </>
    )
}
