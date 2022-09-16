import { BattleLobby } from "../../types/battle_queue"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../hooks/useGameServer"
import { useState } from "react"
import { ConfirmModal } from "../Common/ConfirmModal"
import { QuickDeploy } from "../LeftDrawer/QuickDeploy/QuickDeploy"

interface BattleLobbyJoinModalProps {
    selectedBattleLobby: BattleLobby
    setSelectedBattleLobby: (value: BattleLobby | undefined) => void
}

export const BattleLobbyJoinModal = ({ selectedBattleLobby, setSelectedBattleLobby }: BattleLobbyJoinModalProps) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>()

    return (
        <ConfirmModal
            title={`JOIN BATTLE LOBBY #${selectedBattleLobby.number}`}
            disableConfirm={false}
            onConfirm={() => console}
            onClose={() => setSelectedBattleLobby(undefined)}
            isLoading={isLoading}
            error={""}
        >
            <QuickDeploy />
        </ConfirmModal>
    )
}
