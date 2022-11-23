import { Box, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { SvgQueue, SvgSupToken, SvgUserDiamond2 } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { supFormatter } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { AllGameMapsCombined } from "../../Common/AllGameMapsCombined"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceTooltip } from "../../Common/Nice/NiceTooltip"
import { BattleLobbySingleModal } from "../BattleLobbies/BattleLobbySingleModal"
import { LobbyItemTooltip } from "./LobbyItemTooltip"

export const LobbyItem = ({ battleLobby }: { battleLobby: BattleLobby }) => {
    const { factionTheme } = useTheme()

    const [showLobbyModal, setShowLobbyModal] = useState(false)

    const lobbyStatus = useMemo(() => {
        let textColor = colors.orange
        let text = "PENDING"

        if (battleLobby.assigned_to_battle_id) {
            textColor = colors.orange
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

    return (
        <>
            <NiceTooltip placement="left-start" renderNode={<LobbyItemTooltip battleLobby={battleLobby} />} color={factionTheme.primary}>
                <NiceButton onClick={() => setShowLobbyModal(true)} sx={{ width: "100%", p: 0, border: `${factionTheme.primary}38 1px solid` }}>
                    <Stack direction="row" alignItems="stretch" width="100%" position="relative">
                        <Stack alignItems="stretch" spacing=".4rem" sx={{ flex: 1, p: "1rem 1.5rem" }}>
                            <Stack direction="row" justifyContent="space-between">
                                {/* Lobby name */}
                                <Stack direction="row" spacing=".5rem" alignItems="baseline">
                                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{battleLobby.name}</Typography>
                                    {lobbyStatus}
                                </Stack>

                                <Typography sx={{ fontFamily: fonts.nostromoBold }}>
                                    <SvgQueue inline size="1.4rem" />
                                    {battleLobby.stage_order}
                                </Typography>
                            </Stack>

                            <Stack direction="row" justifyContent="space-between">
                                <Typography>
                                    Reward Pool:
                                    <SvgSupToken fill={colors.gold} size="1.6rem" inline />
                                    {supFormatter(battleLobby.sups_pool, 2)}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: battleLobby.battle_lobbies_mechs.length < 9 ? colors.lightGrey : colors.green,
                                        fontWeight: "bold",
                                    }}
                                >
                                    <SvgUserDiamond2 inline size="1.8rem" /> {battleLobby.battle_lobbies_mechs.length}/9
                                </Typography>
                            </Stack>
                        </Stack>

                        {/* Background map image */}
                        <Box
                            sx={{
                                position: "absolute",
                                m: "0 !important",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: `url(${battleLobby.game_map?.background_url})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                opacity: 0.42,
                                zIndex: -2,
                            }}
                        >
                            {!battleLobby.game_map && <AllGameMapsCombined sx={{ height: "100%", width: "100%", opacity: 0.5 }} />}
                        </Box>
                    </Stack>
                </NiceButton>
            </NiceTooltip>

            {showLobbyModal && <BattleLobbySingleModal showingLobby={battleLobby} setOpen={setShowLobbyModal} />}
        </>
    )
}
