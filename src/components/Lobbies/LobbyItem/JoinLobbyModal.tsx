import { Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { useAuth, useGlobalNotifications } from "../../../containers"
import { useGameServerCommandsFaction, useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { NewMechStruct } from "../../../types"
import { BattleLobby, PlayerQueueStatus } from "../../../types/battle_queue"
import { MechSelector } from "../../Common/Mech/MechSelector"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceModal } from "../../Common/Nice/NiceModal"

export const JoinLobbyModal = ({
    open,
    onClose,
    battleLobby,
    accessCode,
}: {
    open: boolean
    onClose: () => void
    battleLobby: BattleLobby
    accessCode?: string
}) => {
    const { factionID } = useAuth()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [selectedMechs, setSelectedMechs] = useState<NewMechStruct[]>([])
    const [error, setError] = useState("")

    const [playerQueueStatus, setPlayerQueueStatus] = useState<PlayerQueueStatus>({
        queue_limit: 10,
        total_queued: 0,
    })

    useGameServerSubscriptionSecuredUser<PlayerQueueStatus>(
        {
            URI: "/queue_status",
            key: GameServerKeys.PlayerQueueStatus,
        },
        (payload) => {
            setPlayerQueueStatus(payload)
        },
    )

    const queueLimit = useMemo(() => {
        // get player remaining queue limit
        let playerQueueLimit = playerQueueStatus.queue_limit - playerQueueStatus.total_queued
        if (playerQueueLimit <= 0) playerQueueLimit = 0

        // calc lobby remain slots
        let lobbyRemainSlots = battleLobby.each_faction_mech_amount - battleLobby.battle_lobbies_mechs.filter((blm) => blm.faction_id === factionID).length
        if (lobbyRemainSlots <= 0) lobbyRemainSlots = 0

        // get player maximum queue limit in lobby
        const lobbyQueueLimit = battleLobby.max_deploy_per_player

        return Math.min(playerQueueLimit, lobbyQueueLimit, lobbyRemainSlots)
    }, [
        battleLobby.battle_lobbies_mechs,
        battleLobby.each_faction_mech_amount,
        battleLobby.max_deploy_per_player,
        factionID,
        playerQueueStatus.queue_limit,
        playerQueueStatus.total_queued,
    ])

    const joinBattleLobby = useCallback(async () => {
        try {
            setError("")
            await send(GameServerKeys.JoinBattleLobby, {
                battle_lobby_id: battleLobby.id,
                mech_ids: selectedMechs.map((s) => s.id),
                access_code: accessCode,
            })
            newSnackbarMessage("Successfully added mech to battle lobby.", "success")
            setSelectedMechs([])
            onClose()
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to the join lobby, try again or contact support."
            setError(message)
            newSnackbarMessage(message, "error")
        }
    }, [send, battleLobby.id, selectedMechs, accessCode, newSnackbarMessage, onClose])

    return (
        <NiceModal open={open} onClose={onClose} sx={{ p: "1.8rem 2.5rem", height: "calc(100vh - 15rem)", width: "66rem" }}>
            <Stack spacing="1.5rem" height="100%">
                <Typography variant="h6" fontFamily={fonts.nostromoBlack}>
                    Join Lobby
                </Typography>

                <MechSelector selectedMechs={selectedMechs} setSelectedMechs={setSelectedMechs} limit={queueLimit} onlyDeployableMechs sx={{ flex: 1 }} />

                {/* Show errors */}
                {error && <Typography color={colors.red}>{error}</Typography>}

                {/* Bottom buttons */}
                <Stack direction="row" alignItems="stretch" spacing="1rem">
                    <NiceButton buttonColor={colors.red} sx={{ flex: 1, height: "100%" }} onClick={onClose}>
                        Cancel
                    </NiceButton>

                    <NiceButton buttonColor={colors.green} sx={{ flex: 1, height: "100%" }} onClick={joinBattleLobby} disabled={selectedMechs.length <= 0}>
                        Confirm
                    </NiceButton>
                </Stack>
            </Stack>
        </NiceModal>
    )
}
