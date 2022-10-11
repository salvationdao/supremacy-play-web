import { BattleLobby } from "../../../types/battle_queue"
import { Box, IconButton, Stack, Typography } from "@mui/material"
import { colors, fonts } from "../../../theme/theme"
import React, { useCallback } from "react"
import { TooltipHelper } from "../../Common/TooltipHelper"
import { supFormatterNoFixed } from "../../../helpers"
import { SvgChest, SvgSupToken } from "../../../assets"

interface BattleLobbyPricePoolProps {
    battleLobby: BattleLobby
}

export const BattleLobbyPricePool = ({ battleLobby }: BattleLobbyPricePoolProps) => {
    const { first_faction_cut, second_faction_cut, third_faction_cut } = battleLobby

    const distributionValue = useCallback((backgroundColor: string, rank: number, value: string) => {
        return (
            <Stack direction="row" alignItems="center" spacing=".5rem">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "2rem",
                        width: "2rem",
                        borderRadius: "50%",
                        backgroundColor: backgroundColor,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: `${colors.darkerNavy}99`,
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        {rank}
                    </Typography>
                </Box>
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: fonts.nostromoMedium,
                    }}
                >
                    {(parseFloat(value) * 100).toFixed(1)}
                </Typography>
            </Stack>
        )
    }, [])

    return (
        <Stack direction="column" spacing={0.6} sx={{ py: ".25rem" }}>
            <Stack direction="row" alignItems="center" spacing=".4rem">
                <Typography
                    variant="body2"
                    fontFamily={fonts.nostromoHeavy}
                    sx={{
                        color: colors.grey,
                        lineHeight: "unset",
                    }}
                >
                    REWARD POOL:
                </Typography>

                <TooltipHelper placement="top-start" text="Top up reward">
                    <Box sx={{ cursor: "pointer" }}>
                        <SvgChest size="1.5rem" fill={colors.gold} />
                    </Box>
                </TooltipHelper>
            </Stack>

            <Stack direction="row" alignItems="center" spacing=".4rem">
                <SvgSupToken size="1.5rem" fill={colors.gold} />
                <Typography variant="body2" fontFamily={fonts.nostromoHeavy} sx={{ lineHeight: "unset" }}>
                    {supFormatterNoFixed(battleLobby.sups_pool, 2)}
                </Typography>
            </Stack>

            <Stack direction="column">
                <Typography
                    variant="body2"
                    fontFamily={fonts.nostromoHeavy}
                    sx={{
                        color: colors.grey,
                    }}
                >
                    Distribution:
                </Typography>
                <Stack direction="row" spacing="1rem">
                    {distributionValue(colors.gold, 1, first_faction_cut)}
                    {distributionValue(colors.silver, 2, second_faction_cut)}
                    {distributionValue(colors.bronze, 3, third_faction_cut)}
                </Stack>
            </Stack>
        </Stack>
    )
}
