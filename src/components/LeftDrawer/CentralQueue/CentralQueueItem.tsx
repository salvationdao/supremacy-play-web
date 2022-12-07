import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { SvgContentCopyIcon, SvgLock, SvgMeteor, SvgSupToken, SvgUserDiamond } from "../../../assets"
import { useAuth, useGlobalNotifications } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { supFormatter } from "../../../helpers"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { pulseEffect } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { AllGameMapsCombined } from "../../Common/AllGameMapsCombined"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceModal } from "../../Common/Nice/NiceModal"
import { NiceTextField } from "../../Common/Nice/NiceTextField"
import { NiceTooltip } from "../../Common/Nice/NiceTooltip"
import { TypographyTruncated } from "../../Common/TypographyTruncated"
import { JoinLobbyModal } from "../../Lobbies/LobbyItem/JoinLobbyModal"
import { CentralQueueItemTooltipRender } from "./CentralQueueItemTooltipRender"
import { Supporters } from "./Supporters"

export const CentralQueueItem = ({ battleLobby, isInvolved }: { battleLobby: BattleLobby; isInvolved?: boolean }) => {
    const { factionID } = useAuth()
    const theme = useTheme()
    const [showJoinLobbyModal, setShowJoinLobbyModal] = useState(false)

    // For sponsoring battle with more sups
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)

    const displayAccessCode = useMemo(() => battleLobby.access_code, [battleLobby.access_code])

    const maxMechsTotal = battleLobby.each_faction_mech_amount * 3

    const lobbyStatus = useMemo(() => {
        let textColor = colors.lightGrey
        let text = "WAITING..."

        if (battleLobby.assigned_to_battle_id) {
            textColor = colors.red
            text = "BATTLE"
        } else if (battleLobby.ready_at) {
            textColor = colors.green
            text = "READY"
        }

        return (
            <Typography variant="body2" color={textColor} fontWeight="bold">
                {text}
            </Typography>
        )
    }, [battleLobby.assigned_to_battle_id, battleLobby.ready_at])

    const bottomSection = useMemo(() => {
        // If it's ready, then allow people to join as supporter
        if (battleLobby.ready_at) {
            return (
                <Stack direction="row" alignItems="center" sx={{ height: "3rem", px: "1.5rem", backgroundColor: "#00000036" }}>
                    <Typography fontWeight="bold">
                        <SvgMeteor inline size="1.6rem" />
                        SUPPORTERS:
                    </Typography>
                    <Supporters battleLobby={battleLobby} factionID={factionID} />
                </Stack>
            )
        }

        // Battle in progress
        if (battleLobby.assigned_to_battle_id) {
            return (
                <Stack direction="row" alignItems="center" spacing=".4rem" sx={{ height: "3rem", backgroundColor: "#00000036" }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            px: "1.5rem",
                            fontFamily: fonts.nostromoBlack,
                            color: colors.red,
                            textAlign: "center",
                            animation: `${pulseEffect} 4.5s infinite`,
                        }}
                    >
                        Battle in progress...
                    </Typography>
                </Stack>
            )
        }

        // Display invite friend message
        if (displayAccessCode) {
            return (
                <Stack direction="row" alignItems="center" spacing=".4rem" sx={{ height: "3rem", pl: "1.5rem", pr: ".5rem", backgroundColor: "#00000036" }}>
                    <Typography color={colors.neonBlue}>Invite friends to the battle!</Typography>

                    <Box flex={1} />

                    <Typography>{displayAccessCode}</Typography>

                    <IconButton
                        size="small"
                        sx={{ opacity: 0.6, ":hover": { opacity: 1 } }}
                        onClick={() => {
                            navigator.clipboard.writeText(`${location.origin}/lobbies?code=${displayAccessCode}`)
                        }}
                    >
                        <SvgContentCopyIcon inline size="1.3rem" />
                    </IconButton>
                </Stack>
            )
        }

        return (
            <Stack direction="row" alignItems="center" spacing=".8rem" sx={{ height: "3rem", px: "1.5rem", backgroundColor: "#00000036" }}>
                <TypographyTruncated fontWeight="bold" sx={{ color: battleLobby.will_not_start_until ? colors.orange : colors.grey }}>
                    SCHEDULED TIME: {battleLobby.will_not_start_until ? battleLobby.will_not_start_until.toLocaleString() : "when room is full"}
                </TypographyTruncated>

                <Box flex={1} />

                <NiceButton
                    sx={{
                        p: ".2rem .6rem",
                        border: `${colors.neonBlue} 1px solid`,
                        opacity: 0.8,

                        ":hover": {
                            opacity: 1,
                        },
                    }}
                    onClick={() => {
                        navigator.clipboard.writeText(`${location.origin}/lobbies?join=${battleLobby.id}`)
                    }}
                >
                    <Typography variant="body2" color={colors.neonBlue} lineHeight={1}>
                        Invite Link
                    </Typography>
                </NiceButton>
            </Stack>
        )
    }, [battleLobby, displayAccessCode, factionID])

    return (
        <>
            <NiceTooltip
                placement="left"
                enterDelay={450}
                enterNextDelay={700}
                renderNode={
                    <CentralQueueItemTooltipRender
                        battleLobby={battleLobby}
                        displayAccessCode={displayAccessCode}
                        setShowJoinLobbyModal={setShowJoinLobbyModal}
                        setIsTopUpModalOpen={setIsTopUpModalOpen}
                    />
                }
                color={theme.factionTheme.primary}
            >
                <Box
                    sx={{
                        width: "100%",
                        border: isInvolved ? `${colors.gold}65 1px solid` : `${theme.factionTheme.primary}38 1px solid`,
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="stretch"
                        sx={{
                            position: "relative",
                            width: "100%",
                            zIndex: 1,
                        }}
                    >
                        <Stack
                            alignItems="stretch"
                            spacing=".4rem"
                            sx={{
                                flex: 1,
                                p: "1rem 1.5rem",
                            }}
                        >
                            <Stack direction="row" justifyContent="space-between" spacing="1.5rem">
                                {/* Lobby name */}
                                <TypographyTruncated variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                    {displayAccessCode && <SvgLock inline size="1.6rem" fill={colors.orange} />}{" "}
                                    {battleLobby.name || `Lobby #${battleLobby.number}`}
                                </TypographyTruncated>

                                {lobbyStatus}
                            </Stack>

                            <Stack direction="row" justifyContent="space-between">
                                {/* Reward */}
                                <Typography>
                                    Reward Pool:
                                    <SvgSupToken fill={colors.gold} size="1.6rem" inline />
                                    {supFormatter(battleLobby.sups_pool, 2)}
                                </Typography>

                                {/* Player count */}
                                <Typography sx={{ color: battleLobby.battle_lobbies_mechs.length < maxMechsTotal ? "#FFFFFF" : colors.green }}>
                                    <SvgUserDiamond inline size="1.8rem" />{" "}
                                    <span style={{ color: battleLobby.battle_lobbies_mechs.length < maxMechsTotal ? colors.orange : "inherit" }}>
                                        {battleLobby.battle_lobbies_mechs.length}
                                    </span>
                                    /{maxMechsTotal}
                                </Typography>
                            </Stack>
                        </Stack>

                        {/* Background map image */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                m: "0 !important",
                                background: `url(${battleLobby.game_map?.background_url})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                opacity: 0.36,
                                zIndex: -1,
                            }}
                        >
                            {!battleLobby.game_map && <AllGameMapsCombined sx={{ height: "100%", width: "100%", opacity: 0.38 }} />}
                        </Box>
                    </Stack>

                    {bottomSection}
                </Box>
            </NiceTooltip>

            {showJoinLobbyModal && (
                <JoinLobbyModal
                    open={showJoinLobbyModal}
                    onClose={() => setShowJoinLobbyModal(false)}
                    battleLobby={battleLobby}
                    accessCode={displayAccessCode}
                />
            )}

            {isTopUpModalOpen && <TopUpModal lobbyID={battleLobby.id} onClose={() => setIsTopUpModalOpen(false)} />}
        </>
    )
}

export const TopUpModal = ({ lobbyID, onClose }: { lobbyID: string; onClose: () => void }) => {
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
        <NiceModal open onClose={onClose}>
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
        </NiceModal>
    )
}
