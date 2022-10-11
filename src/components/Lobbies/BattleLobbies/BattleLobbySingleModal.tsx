import React, { useEffect, useState } from "react"
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
    stage_order: 0,
    access_code: "",
    sups_pool: "0",

    battle_lobbies_mechs: [],
    opted_in_bc_supporters: [],
    opted_in_rm_supporters: [],
    opted_in_zai_supporters: [],
    selected_bc_supporters: [],
    selected_rm_supporters: [],
    selected_zai_supporters: [],
}

interface BattleLobbySingleModalProps {
    setAccessCode?: React.Dispatch<React.SetStateAction<string>>
    accessCode?: string
    showingLobby?: BattleLobby
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}
export const BattleLobbySingleModal = ({ setAccessCode, accessCode, showingLobby, setOpen }: BattleLobbySingleModalProps) => {
    const [isLoading, setIsLoading] = useState(!showingLobby)

    const [lobby, setLobby] = useState<BattleLobby>(lobbyPlaceholder)

    useEffect(() => {
        if (!showingLobby) return
        setLobby(showingLobby)
    }, [showingLobby])

    useGameServerSubscriptionFaction<BattleLobby>(
        {
            URI: `/private_battle_lobby/${accessCode}`,
            key: GameServerKeys.SubPrivateBattleLobby,
            ready: !!accessCode && !!setAccessCode,
        },
        (payload) => {
            if (!payload) return
            setLobby(payload)
            setIsLoading(false)
        },
    )

    return (
        <ConfirmModal
            title={accessCode ? "ACCESS PRIVATE LOBBY" : "LOBBY"}
            omitButtons
            onClose={() => {
                if (setAccessCode) setAccessCode("")
                if (setOpen) setOpen(false)
            }}
            isLoading={isLoading}
            width="160rem"
            omitHeader
            innerSx={{
                px: 0,
                py: 0,
            }}
        >
            <BattleLobbyItem battleLobby={lobby} omitClip disabled={isLoading} accessCode={accessCode} />
        </ConfirmModal>
    )
}
