import { Stack } from "@mui/material"
import React, { useState } from "react"
import { ConfirmModal } from "../../Common/ConfirmModal"
import { BattleLobby } from "../../../types/battle_queue"
import { BattleLobbyItem } from "./BattleLobbyItem"
import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"

const lobbyPlaceholder: BattleLobby = {
    id: "",
    name: "PRIVATE LOBBY",
    host_by_id: "",
    number: 0,
    entry_fee: "0",
    first_faction_cut: "0.75",
    second_faction_cut: "0.25",
    third_faction_cut: "0",
    each_faction_mech_amount: 3,
    generated_by_system: true,
    created_at: new Date(),
    ready_at: new Date(),

    host_by: {
        id: "",
        username: "",
        faction_id: "",
        gid: 0,
        rank: "NEW_RECRUIT",
        features: [],
    },
    is_private: true,
    battle_lobbies_mechs: [],
    opted_in_bc_supporters: [],
    opted_in_rm_supporters: [],
    opted_in_zai_supporters: [],
    selected_bc_supporters: [],
    selected_rm_supporters: [],
    selected_zai_supporters: [],
}

interface BattleLobbyPrivateAccessModalProps {
    setAccessCode: React.Dispatch<React.SetStateAction<string>>
    accessCode: string
}
export const BattleLobbyPrivateAccessModal = ({ setAccessCode, accessCode }: BattleLobbyPrivateAccessModalProps) => {
    const [isLoading, setIsLoading] = useState(true)

    const [lobby, setLobby] = useState<BattleLobby>(lobbyPlaceholder)

    useGameServerSubscriptionFaction<BattleLobby>(
        {
            URI: `/private_battle_lobby/${accessCode}`,
            key: GameServerKeys.SubPrivateBattleLobby,
        },
        (payload) => {
            if (!payload) return

            console.log(payload)
            setLobby(payload)
            setIsLoading(false)
        },
    )

    return (
        <ConfirmModal title={`ACCESS PRIVATE LOBBY`} omitButtons onClose={() => setAccessCode("")} isLoading={isLoading} width="150rem" omitCancel>
            <Stack direction="column">
                <BattleLobbyItem battleLobby={lobby} omitClip disabled={isLoading} accessCode={accessCode} />
            </Stack>
        </ConfirmModal>
    )
}
