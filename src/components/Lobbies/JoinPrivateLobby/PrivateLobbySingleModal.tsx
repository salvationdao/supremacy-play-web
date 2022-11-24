import { useState } from "react"
import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
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
        <NiceModal open={true} onClose={onClose} sx={{ p: "1.8rem 2.5rem", height: "calc(100vh - 20rem)" }}>
            <CentralQueueItemTooltip battleLobby={battleLobby} displayAccessCode={accessCode} />
        </NiceModal>
    )
}
