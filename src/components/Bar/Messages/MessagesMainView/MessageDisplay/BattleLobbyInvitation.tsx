import { Stack, Typography } from "@mui/material"
import { useState } from "react"
import { useGameServerSubscriptionFaction } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { BattleLobby } from "../../../../../types/battle_queue"
import { TopUpModal } from "../../../../LeftDrawer/CentralQueue/CentralQueueItem"
import { CentralQueueItemTooltipRender } from "../../../../LeftDrawer/CentralQueue/CentralQueueItemTooltipRender"
import { JoinLobbyModal } from "../../../../Lobbies/LobbyItem/JoinLobbyModal"

interface BattleLobbyInvitationProps {
    message: string
    data: BattleLobby
}

export const BattleLobbyInvitation = ({ message, data }: BattleLobbyInvitationProps) => {
    const [battleLobby, setBattleLobby] = useState<BattleLobby>()
    const [showJoinLobbyModal, setShowJoinLobbyModal] = useState(false)

    // For sponsoring battle with more sups
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)

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
                        displayAccessCode={data.access_code}
                        width="48rem"
                        setShowJoinLobbyModal={setShowJoinLobbyModal}
                        setIsTopUpModalOpen={setIsTopUpModalOpen}
                    />
                )}
            </Stack>

            {showJoinLobbyModal && battleLobby && (
                <JoinLobbyModal
                    open={showJoinLobbyModal}
                    onClose={() => setShowJoinLobbyModal(false)}
                    battleLobby={battleLobby}
                    accessCode={data.access_code}
                />
            )}

            {isTopUpModalOpen && <TopUpModal lobbyID={data.id} onClose={() => setIsTopUpModalOpen(false)} />}
        </>
    )
}
