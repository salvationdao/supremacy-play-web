import { Stack, Typography } from "@mui/material"
import { useState } from "react"
import { useGameServerSubscriptionFaction } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { BattleLobby } from "../../../../../types/battle_queue"
import { CentralQueueItemTooltipRender } from "../../../../Lobbies/CentralQueue/CentralQueueItemTooltipRender"
import { JoinLobbyModal } from "../../../../Lobbies/LobbyItem/JoinLobbyModal"

interface BattleLobbyInvitationProps {
    message: string
    data: BattleLobby
}

export const BattleLobbyInvitation = ({ message, data }: BattleLobbyInvitationProps) => {
    const [battleLobby, setBattleLobby] = useState<BattleLobby>()
    const [showJoinLobbyModal, setShowJoinLobbyModal] = useState(false)

    useGameServerSubscriptionFaction<BattleLobby>(
        {
            URI: `/battle_lobby/${data.id}`,
            key: GameServerKeys.SubBattleLobby,
        },
        (payload) => {
            if (!payload) return
            setBattleLobby(payload)
        },
    )

    return (
        <>
            <Stack spacing="3rem" sx={{ px: "1rem", pt: "1rem", pb: "3rem" }}>
                <Typography variant="h6">{message}</Typography>

                {battleLobby && (
                    <CentralQueueItemTooltipRender
                        battleLobby={battleLobby}
                        displayAccessCode={battleLobby.access_code}
                        width="100%"
                        setShowJoinLobbyModal={setShowJoinLobbyModal}
                    />
                )}
            </Stack>

            {showJoinLobbyModal && battleLobby && (
                <JoinLobbyModal
                    open={showJoinLobbyModal}
                    onClose={() => setShowJoinLobbyModal(false)}
                    battleLobby={battleLobby}
                    accessCode={battleLobby.access_code}
                />
            )}
        </>
    )
}
