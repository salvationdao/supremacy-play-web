import { Stack, Typography } from "@mui/material"
import { useState } from "react"
import { SvgInfoCircular } from "../../../assets"
import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { NiceModal } from "../../Common/Nice/NiceModal"
import { CentralQueueItemTooltipRender } from "../CentralQueue/CentralQueueItemTooltipRender"
import { JoinLobbyModal } from "../LobbyItem/JoinLobbyModal"

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
    const [showJoinLobbyModal, setShowJoinLobbyModal] = useState(false)

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
        <>
            <NiceModal open={true} onClose={onClose} backdropColor="rgba(0,0,0,.8)" sx={{ p: "1.8rem 2.5rem", maxHeight: "calc(100vh - 20rem)" }}>
                <Stack>
                    <Typography variant="h6" fontFamily={fonts.nostromoBlack} mb=".6rem">
                        Private Lobby
                    </Typography>

                    <Typography variant="h6" sx={{ color: colors.neonBlue, fontWeight: "bold", mb: "1.3rem" }}>
                        <SvgInfoCircular inline size="1.8rem" fill={colors.neonBlue} /> Deploy your mechs in order to join the private lobby
                    </Typography>

                    <CentralQueueItemTooltipRender
                        battleLobby={battleLobby}
                        displayAccessCode={accessCode}
                        width="100%"
                        setShowJoinLobbyModal={setShowJoinLobbyModal}
                    />
                </Stack>
            </NiceModal>

            {showJoinLobbyModal && (
                <JoinLobbyModal open={showJoinLobbyModal} onClose={() => setShowJoinLobbyModal(false)} battleLobby={battleLobby} accessCode={accessCode} />
            )}
        </>
    )
}
