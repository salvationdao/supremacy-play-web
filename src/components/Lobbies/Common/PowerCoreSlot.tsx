import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo } from "react"
import { SvgPowerCore } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets } from "../../../helpers"
import { scaleUpKeyframes } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { PowerCore } from "../../../types"
import { NiceTooltip, TooltipPlacement } from "../../Common/Nice/NiceTooltip"

export interface PowerCoreSlotProps {
    powerCore: PowerCore
    tooltipPlacement: TooltipPlacement
    size?: string
}

export const PowerCoreSlot = ({ powerCore, tooltipPlacement, size }: PowerCoreSlotProps) => {
    const { factionTheme } = useTheme()

    const renderStat = useCallback((label: string, value: string | number) => {
        return (
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body2" fontFamily={fonts.nostromoMedium}>
                    {label}:
                </Typography>
                <Typography variant="body2" fontFamily={fonts.nostromoLight} sx={{ minWidth: "6rem" }}>
                    {value}
                </Typography>
            </Stack>
        )
    }, [])

    return useMemo(() => {
        if (!powerCore)
            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: size || "4rem",
                        width: size || "4rem",
                        border: `${colors.grey}80 2px solid`,
                        borderRadius: 0.6,
                        backgroundColor: `${factionTheme.background}`,
                        "&:hover": {
                            border: `${factionTheme.primary} 2px solid`,
                        },
                        opacity: "0.5",
                    }}
                >
                    <SvgPowerCore />
                </Box>
            )

        const rarity = getRarityDeets(powerCore?.tier || "")
        return (
            <NiceTooltip
                tooltipSx={{
                    maxWidth: "50rem",
                }}
                color={factionTheme.background}
                renderNode={
                    <Stack direction="column" sx={{ width: "30rem" }}>
                        <Stack direction="row" alignItems="center">
                            <Box
                                key={!powerCore.avatar_url ? powerCore.image_url : powerCore.avatar_url}
                                component="img"
                                src={!powerCore.avatar_url ? powerCore.image_url : powerCore.avatar_url}
                                sx={{
                                    width: "6rem",
                                    height: "6rem",
                                    objectFit: "cover",
                                    borderRadius: 0.6,
                                    animation: `${scaleUpKeyframes} .5s ease-out`,
                                }}
                            />
                            <Stack direction="column" sx={{ ml: "1rem" }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontFamily: fonts.nostromoHeavy,
                                        color: rarity.color,
                                    }}
                                >
                                    {rarity.label}
                                </Typography>
                                <Typography fontFamily={fonts.nostromoBlack}>{powerCore.label}</Typography>
                            </Stack>
                        </Stack>
                        {renderStat("CAPACITY", powerCore.capacity)}
                        {renderStat("MAX DRAW RATE", powerCore.max_draw_rate)}
                        {renderStat("RECHARGE RATE", powerCore.recharge_rate)}
                        {renderStat("ARMOUR", powerCore.armour)}
                        {renderStat("MAX HITPOINTS", powerCore.max_hitpoints)}
                    </Stack>
                }
                placement={tooltipPlacement}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: size || "4rem",
                        width: size || "4rem",
                        border: `${rarity.color}80 2px solid`,
                        borderRadius: 0.6,
                        backgroundColor: `${factionTheme.background}`,
                        "&:hover": {
                            border: `${factionTheme.primary} 2px solid`,
                        },
                    }}
                >
                    <Box
                        key={!powerCore.avatar_url ? powerCore.image_url : powerCore.avatar_url}
                        component="img"
                        src={!powerCore.avatar_url ? powerCore.image_url : powerCore.avatar_url}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 0.6,
                            animation: `${scaleUpKeyframes} .5s ease-out`,
                        }}
                    />
                </Box>
            </NiceTooltip>
        )
    }, [factionTheme.background, factionTheme.primary, powerCore, renderStat, size, tooltipPlacement])
}
