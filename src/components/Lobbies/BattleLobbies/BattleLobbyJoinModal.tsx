import { Stack } from "@mui/material"
import { useCallback, useState } from "react"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { LobbyMech } from "../../../types"
import { BattleLobby } from "../../../types/battle_queue"
import { ConfirmModal } from "../../Common/Deprecated/ConfirmModal"
import { MechSelector } from "../Common/MechSelector"

interface BattleLobbyJoinModalProps {
    battleLobby: BattleLobby
    onJoin: () => void
    onClose: () => void
    accessCode?: string
}

export const BattleLobbyJoinModal = ({ battleLobby, onJoin, onClose, accessCode }: BattleLobbyJoinModalProps) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [error, setError] = useState("")
    const [selectedMechs, setSelectedMechs] = useState<LobbyMech[]>([])

    const joinBattleLobby = useCallback(
        async (battleLobbyID: string) => {
            try {
                await send(GameServerKeys.JoinBattleLobby, {
                    battle_lobby_id: battleLobbyID,
                    mech_ids: selectedMechs.map((s) => s.id),
                    access_code: accessCode,
                })
                setSelectedMechs([])
                onJoin()
            } catch (err) {
                setError(typeof err === "string" ? err : "Failed to the join battle lobby.")
            }
        },
        [onJoin, selectedMechs, send, accessCode],
    )
    return (
        <ConfirmModal
            title={`JOIN BATTLE LOBBY - ${battleLobby.name}`}
            disableConfirm={!selectedMechs.length}
            onConfirm={() => joinBattleLobby(battleLobby.id || "")}
            onClose={() => {
                setSelectedMechs([])
                onClose()
            }}
            isLoading={false}
            error={error}
            width="75rem"
        >
            <Stack height="70vh">
                <MechSelector selectedMechs={selectedMechs} setSelectedMechs={setSelectedMechs} battleLobby={battleLobby} keepOnSelect />
            </Stack>
        </ConfirmModal>
    )
}
