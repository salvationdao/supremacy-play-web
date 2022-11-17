import { Box, Stack, Typography } from "@mui/material"
import { MutableRefObject, useCallback, useRef, useState } from "react"
import { SvgSupToken } from "../../../assets"
import { supFormatter } from "../../../helpers"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NicePopover } from "../../Common/Nice/NicePopover"
import { NiceTextField } from "../../Common/Nice/NiceTextField"

export const PrizePool = ({ lobby }: { lobby: BattleLobby }) => {
    const { first_faction_cut, second_faction_cut, third_faction_cut } = lobby
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const popoverRef = useRef(null)

    return (
        <>
            {/* Reward pool */}
            <Box>
                <Typography variant="body2" gutterBottom fontFamily={fonts.nostromoBold}>
                    REWARD POOL
                </Typography>

                <Stack direction="row" alignItems="center" spacing="1.4rem">
                    <Typography>
                        <SvgSupToken inline size="1.7rem" fill={colors.gold} />
                        {supFormatter(lobby.sups_pool, 2)}
                    </Typography>

                    {/* Top up */}
                    <NiceButton buttonColor={colors.gold} sx={{ p: ".1rem 1rem", opacity: 0.84 }} ref={popoverRef} onClick={() => setIsPopoverOpen(true)}>
                        <Typography fontFamily={fonts.nostromoBold} variant="subtitle2" color={colors.gold}>
                            INCREASE
                        </Typography>
                    </NiceButton>
                </Stack>
            </Box>

            {/* Reward distribution */}
            <Box>
                <Typography variant="body2" gutterBottom fontFamily={fonts.nostromoBold}>
                    DISTRIBUTION
                </Typography>
                <Stack direction="row" alignItems="center" spacing="1rem">
                    <DistributionValue color={colors.gold} rank={1} value={first_faction_cut} />
                    <DistributionValue color={colors.silver} rank={2} value={second_faction_cut} />
                    <DistributionValue color={colors.bronze} rank={3} value={third_faction_cut} />
                </Stack>
            </Box>

            {isPopoverOpen && <TopUpPopover open={isPopoverOpen} onClose={() => setIsPopoverOpen(false)} popoverRef={popoverRef} lobbyID={lobby.id} />}
        </>
    )
}

const DistributionValue = ({ color, rank, value }: { color: string; rank: number; value: string }) => {
    return (
        <Stack direction="row" alignItems="center" spacing="1rem">
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                    backgroundColor: color,
                }}
            >
                <Typography variant="body2" sx={{ color: "#000000A9", fontFamily: fonts.nostromoBold }}>
                    {rank}
                </Typography>
            </Stack>

            <Typography>{(parseFloat(value) * 100).toFixed(1)}%</Typography>
        </Stack>
    )
}

const TopUpPopover = ({ open, onClose, popoverRef, lobbyID }: { open: boolean; onClose: () => void; popoverRef: MutableRefObject<null>; lobbyID: string }) => {
    const [topUpReward, setTopUpReward] = useState(0)
    const { send } = useGameServerCommandsUser("/user_commander")
    const [isLoading, setIsLoading] = useState(false)

    const onTopUp = useCallback(async () => {
        try {
            setIsLoading(true)
            await send<boolean>(GameServerKeys.TopUpBattleLobbyReward, {
                battle_lobby_id: lobbyID,
                amount: topUpReward,
            })
        } catch (e) {
            console.log(e)
        } finally {
            setTimeout(() => setIsLoading(false), 500)
            setTimeout(() => onClose(), 650)
            setTopUpReward(0)
        }
    }, [lobbyID, onClose, send, topUpReward])

    return (
        <NicePopover
            open={open}
            anchorEl={popoverRef.current}
            onClose={onClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
        >
            <Stack direction="column" sx={{ p: "1rem 1.3rem", width: "35rem" }}>
                <Typography variant="h6" fontFamily={fonts.nostromoBlack}>
                    NOTE:
                </Typography>

                <Typography variant="body1" sx={{ mb: "1rem" }}>
                    The provided sups will stay in the pool and be distributed after the battle ends.
                </Typography>

                <Stack direction="row" alignItems="center" spacing="1rem">
                    <NiceTextField
                        primaryColor={colors.green}
                        value={topUpReward}
                        type="number"
                        onChange={(value) => {
                            const valueNumber = parseFloat(value)
                            setTopUpReward(valueNumber)
                        }}
                        placeholder="Top up amount"
                        InputProps={{
                            startAdornment: <SvgSupToken fill={colors.yellow} size="1.9rem" />,
                        }}
                        disabled={isLoading}
                    />

                    <NiceButton sheen={{ autoSheen: true }} loading={isLoading} buttonColor={colors.green} corners onClick={onTopUp}>
                        <Typography variant="subtitle1" fontFamily={fonts.nostromoBold}>
                            Confirm
                        </Typography>
                    </NiceButton>
                </Stack>
            </Stack>
        </NicePopover>
    )
}
