import { Stack, Typography } from "@mui/material"
import { useState } from "react"
import { SvgInfoCircular } from "../../../assets"
import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { NiceModal } from "../../Common/Nice/NiceModal"
import { CentralQueueItemTooltip } from "../CentralQueue/CentralQueueItemTooltip"

export const PrivateLobbySingleModal = ({
    battleLobby: _battleLobby,
    accessCode,
    onClose,
}: {
    battleLobby: BattleLobby
    accessCode: string
    onClose: () => void
}) => {
    const [battleLobby, setBattleLobby] = useState<BattleLobby>(_battleLobby)

    useGameServerSubscriptionFaction<BattleLobby>(
        {
            URI: `/private_battle_lobby/${accessCode}`,
            key: GameServerKeys.SubPrivateBattleLobby,
        },
        (payload) => {
            if (!payload) return
            setBattleLobby(payload)
        },
    )

    return (
        <NiceModal open={true} onClose={onClose} sx={{ p: "1.8rem 2.5rem", maxHeight: "calc(100vh - 20rem)" }}>
            <Stack>
                <Typography variant="h6" fontFamily={fonts.nostromoBlack} mb=".6rem">
                    Private Lobby
                </Typography>

                <Typography variant="h6" sx={{ color: colors.neonBlue, fontWeight: "bold", mb: "1.3rem" }}>
                    <SvgInfoCircular inline size="1.8rem" fill={colors.neonBlue} /> Deploy your mechs in order to join the private lobby
                </Typography>

                <CentralQueueItemTooltip battleLobby={battleLobby} displayAccessCode={accessCode} width="100%" />
            </Stack>
        </NiceModal>
    )
}
