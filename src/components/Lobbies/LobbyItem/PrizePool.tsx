import { Box, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import React, { MutableRefObject, useCallback, useRef, useState } from "react"
import { SvgChest2, SvgEmptySet, SvgFirstPlace, SvgLeaderboard, SvgSecondPlace, SvgSupToken, SvgThirdPlace, SvgWrapperProps } from "../../../assets"
import { useGlobalNotifications } from "../../../containers"
import { supFormatter } from "../../../helpers"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NicePopover } from "../../Common/Nice/NicePopover"
import { NiceTextField } from "../../Common/Nice/NiceTextField"

export const PrizePool = React.memo(function PrizePool({ battleLobby }: { battleLobby: BattleLobby }) {
    const { sups_pool, first_faction_cut, second_faction_cut, third_faction_cut, entry_fee } = battleLobby
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const popoverRef = useRef(null)

    return (
        <>
            {/* Reward pool */}
            <Box>
                <Typography variant="body2" gutterBottom fontFamily={fonts.nostromoBold}>
                    <SvgEmptySet inline /> ENTRY FEE
                </Typography>

                <Typography whiteSpace="nowrap">
                    <SvgSupToken inline size="2rem" fill={colors.gold} />
                    {supFormatter(entry_fee, 2)}
                </Typography>
            </Box>

            {/* Reward pool */}
            <Box>
                <Typography variant="body2" gutterBottom fontFamily={fonts.nostromoBold}>
                    <SvgChest2 inline /> REWARD POOL
                </Typography>

                <Stack direction="row" alignItems="center" spacing="1.8rem">
                    <Typography whiteSpace="nowrap">
                        <SvgSupToken inline size="2rem" fill={colors.gold} />
                        {supFormatter(sups_pool, 2)}
                    </Typography>

                    {/* Top up */}
                    <NiceButton buttonColor={colors.gold} sx={{ p: ".1rem .6rem", opacity: 0.84 }} ref={popoverRef} onClick={() => setIsPopoverOpen(true)}>
                        <Typography fontFamily={fonts.nostromoBold} variant="subtitle2" color={colors.gold}>
                            SPONSOR
                        </Typography>
                    </NiceButton>
                </Stack>
            </Box>

            {/* Reward distribution */}
            <Box>
                <Typography variant="body2" gutterBottom fontFamily={fonts.nostromoBold}>
                    <SvgLeaderboard inline /> DISTRIBUTION
                </Typography>

                <Stack direction="row" alignItems="center" spacing="1rem">
                    <DistributionValue
                        Icon={SvgFirstPlace}
                        value={new BigNumber(sups_pool).shiftedBy(-18).multipliedBy(parseFloat(first_faction_cut)).toFixed(0)}
                        color={colors.gold}
                    />
                    <DistributionValue
                        Icon={SvgSecondPlace}
                        value={new BigNumber(sups_pool).shiftedBy(-18).multipliedBy(parseFloat(second_faction_cut)).toFixed(0)}
                        color={colors.silver}
                    />
                    <DistributionValue
                        Icon={SvgThirdPlace}
                        value={new BigNumber(sups_pool).shiftedBy(-18).multipliedBy(parseFloat(third_faction_cut)).toFixed(0)}
                        color={colors.bronze}
                    />
                </Stack>
            </Box>

            {isPopoverOpen && <TopUpPopover open={isPopoverOpen} onClose={() => setIsPopoverOpen(false)} popoverRef={popoverRef} lobbyID={battleLobby.id} />}
        </>
    )
})

const DistributionValue = ({ Icon, value, color }: { Icon: React.VoidFunctionComponent<SvgWrapperProps>; value: string; color: string }) => {
    return (
        <Box sx={{ p: ".4rem .5rem", backgroundColor: `${color}10`, boxShadow: 0.4, borderRadius: 0.5 }}>
            <Typography whiteSpace="nowrap">
                <Icon inline size="2.4rem" />
                <SvgSupToken inline fill={colors.gold} size="1.7rem" />
                {value}
            </Typography>
        </Box>
    )
}

const TopUpPopover = ({ open, onClose, popoverRef, lobbyID }: { open: boolean; onClose: () => void; popoverRef: MutableRefObject<null>; lobbyID: string }) => {
    const [topUpReward, setTopUpReward] = useState(1)
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [isLoading, setIsLoading] = useState(false)

    const onTopUp = useCallback(async () => {
        try {
            setIsLoading(true)
            await send<boolean>(GameServerKeys.TopUpBattleLobbyReward, {
                battle_lobby_id: lobbyID,
                amount: topUpReward,
            })
            newSnackbarMessage("Successfully added to reward pool.", "success")
        } catch (err) {
            console.log(err)
            newSnackbarMessage(typeof err === "string" ? err : "Failed to add to reward pool, try again or contact support", "error")
        } finally {
            setTimeout(() => setIsLoading(false), 500)
            setTimeout(() => onClose(), 650)
            setTopUpReward(0)
        }
    }, [lobbyID, newSnackbarMessage, onClose, send, topUpReward])

    return (
        <NicePopover
            open={open}
            anchorEl={popoverRef.current}
            onClose={onClose}
            anchorOrigin={{
                vertical: "center",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "center",
                horizontal: "left",
            }}
        >
            <Stack direction="column" sx={{ p: "1rem 1.3rem", width: "35rem" }}>
                <Typography variant="h6" fontFamily={fonts.nostromoBlack} mb=".4rem">
                    NOTE
                </Typography>

                <Typography variant="body1" sx={{ mb: "1rem" }}>
                    The provided sups will stay in the pool and be distributed after the battle ends.
                </Typography>

                <Stack direction="row" alignItems="center" spacing="1rem">
                    <NiceTextField
                        primaryColor={colors.green}
                        value={topUpReward}
                        type="number"
                        defaultValue={1}
                        onChange={(value) => {
                            const valueNumber = parseFloat(value)
                            setTopUpReward(valueNumber)
                        }}
                        placeholder="Enter amount..."
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
