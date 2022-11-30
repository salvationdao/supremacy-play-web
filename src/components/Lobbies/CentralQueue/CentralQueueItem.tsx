import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { SvgContentCopyIcon, SvgLock, SvgMeteor, SvgSupToken, SvgUserDiamond } from "../../../assets"
import { useAuth } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { supFormatter } from "../../../helpers"
import { pulseEffect } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { AllGameMapsCombined } from "../../Common/AllGameMapsCombined"
import { NiceTooltip } from "../../Common/Nice/NiceTooltip"
import { TypographyTruncated } from "../../Common/TypographyTruncated"
import { JoinLobbyModal } from "../LobbyItem/JoinLobbyModal"
import { CentralQueueItemTooltipRender } from "./CentralQueueItemTooltipRender"
import { Supporters } from "./Supporters"

export const CentralQueueItem = ({ battleLobby }: { battleLobby: BattleLobby }) => {
    const { factionID } = useAuth()
    const { factionTheme } = useTheme()
    const [showJoinLobbyModal, setShowJoinLobbyModal] = useState(false)

    const displayAccessCode = useMemo(() => battleLobby.access_code, [battleLobby.access_code])

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
                            navigator.clipboard.writeText(displayAccessCode)
                        }}
                    >
                        <SvgContentCopyIcon inline size="1.3rem" />
                    </IconButton>
                </Stack>
            )
        }

        return (
            <Stack direction="row" alignItems="center" sx={{ height: "3rem", px: "1.5rem", backgroundColor: "#00000036" }}>
                <Typography fontWeight="bold" color={colors.grey}>
                    SCHEDULED TIME: {battleLobby.will_not_start_until ? battleLobby.will_not_start_until.toLocaleString() : "when room is full"}
                </Typography>
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
                    />
                }
                color={factionTheme.primary}
            >
                <Box
                    sx={{
                        width: "100%",
                        border: `${factionTheme.primary}38 1px solid`,
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
                                <Typography>
                                    Reward Pool:
                                    <SvgSupToken fill={colors.gold} size="1.6rem" inline />
                                    {supFormatter(battleLobby.sups_pool, 2)}
                                </Typography>

                                <Typography sx={{ color: battleLobby.battle_lobbies_mechs.length < 9 ? "#FFFFFF" : colors.green }}>
                                    <SvgUserDiamond inline size="1.8rem" />{" "}
                                    <span style={{ color: battleLobby.battle_lobbies_mechs.length < 9 ? colors.orange : "inherit" }}>
                                        {battleLobby.battle_lobbies_mechs.length}
                                    </span>
                                    /9
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
        </>
    )
}
