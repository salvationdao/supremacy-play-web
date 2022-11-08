import { BattleLobby } from "../../../types/battle_queue"
import { Box, IconButton, Popover, Stack, Typography } from "@mui/material"
import { colors, fonts } from "../../../theme/theme"
import React, { useCallback, useState } from "react"
import { supFormatter } from "../../../helpers"
import { SvgChest, SvgSupToken } from "../../../assets"
import { InputField } from "../Common/InputField"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"

interface BattleLobbyPricePoolProps {
    battleLobby: BattleLobby
}

export const BattleLobbyPricePool = ({ battleLobby }: BattleLobbyPricePoolProps) => {
    const { factionTheme } = useTheme()
    const { first_faction_cut, second_faction_cut, third_faction_cut } = battleLobby
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
    const [topUpReward, setTopUpReward] = useState("0")
    const { send } = useGameServerCommandsUser("/user_commander")
    const [loading, setLoading] = useState(false)

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

    const onTopUp = useCallback(async () => {
        try {
            setLoading(true)
            await send<boolean>(GameServerKeys.TopUpBattleLobbyReward, {
                battle_lobby_id: battleLobby.id,
                amount: topUpReward,
            })
        } catch (e) {
            console.log(e)
        } finally {
            setTimeout(() => setLoading(false), 500)
            setTimeout(() => setAnchorEl(null), 650)
            setTopUpReward("0")
        }
    }, [battleLobby.id, send, topUpReward])

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

                <IconButton
                    size="small"
                    sx={{ cursor: "pointer" }}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        setAnchorEl(event.currentTarget)
                    }}
                >
                    <SvgChest size="1.5rem" fill={colors.gold} />
                </IconButton>
                <Popover
                    id={"top-up-reward-popover"}
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: "center",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    sx={{
                        ".MuiPaper-root": {
                            backgroundColor: factionTheme.background,
                            backgroundImage: "unset",
                            border: `${factionTheme.primary}99 2px solid`,
                            width: "35rem",
                        },
                    }}
                >
                    <Stack direction="column" sx={{ p: "1rem" }}>
                        <Typography variant="h6" fontFamily={fonts.nostromoBlack}>
                            Reminder:
                        </Typography>
                        <Typography variant="body1" sx={{ mb: "1rem" }}>
                            The provided sups will stay in the pool and be distributed after the battle is ended.
                        </Typography>
                        <InputField
                            variant="outlined"
                            label="Top Up Reward"
                            startAdornmentLabel={<SvgSupToken fill={colors.yellow} size="1.9rem" />}
                            border={`${factionTheme.primary} 2px solid`}
                            type="number"
                            value={topUpReward}
                            onChange={(e) => setTopUpReward(e.target.value)}
                            disabled={loading}
                            endAdornmentLabel={
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "4rem",
                                        backgroundColor: `${factionTheme.primary}`,
                                        px: "1rem",
                                        cursor: "pointer",
                                    }}
                                    onClick={loading ? undefined : onTopUp}
                                >
                                    <Typography variant="body2" fontFamily={fonts.nostromoBlack} sx={{ color: factionTheme.secondary }}>
                                        submit
                                    </Typography>
                                </Box>
                            }
                        />
                    </Stack>
                </Popover>
            </Stack>

            <Stack direction="row" alignItems="center" spacing=".4rem">
                <SvgSupToken size="1.5rem" fill={colors.gold} />
                <Typography variant="body2" fontFamily={fonts.nostromoHeavy} sx={{ lineHeight: "unset" }}>
                    {supFormatter(battleLobby.sups_pool, 2)}
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
