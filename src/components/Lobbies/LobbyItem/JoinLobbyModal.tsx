import { Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { NewMechStruct } from "../../../types"
import { BattleLobby } from "../../../types/battle_queue"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceModal } from "../../Common/Nice/NiceModal"
import { MechSelector } from "../MechSelector"
import { FactionLobbySlots, NUMBER_MECHS_REQUIRED } from "./LobbyItem"

export const JoinLobbyModal = ({
    open,
    onClose,
    myFactionLobbySlots,
    lobby,
    accessCode,
}: {
    open: boolean
    onClose: () => void
    lobby: BattleLobby
    myFactionLobbySlots: FactionLobbySlots
    accessCode?: string
}) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [selectedMechs, setSelectedMechs] = useState<NewMechStruct[]>([])
    const [error, setError] = useState("")

    const joinBattleLobby = useCallback(async () => {
        try {
            await send(GameServerKeys.JoinBattleLobby, {
                battle_lobby_id: lobby.id,
                mech_ids: selectedMechs.map((s) => s.id),
                access_code: accessCode,
            })
            setSelectedMechs([])
            onClose()
        } catch (err) {
            setError(typeof err === "string" ? err : "Failed to the join lobby, try again or contact support.")
        }
    }, [send, lobby.id, selectedMechs, accessCode, onClose])

    return (
        <NiceModal open={open} onClose={onClose} sx={{ p: "1.8rem 2.5rem", maxHeight: "calc(100vh - 15rem)", width: "50rem" }}>
            <Stack spacing="1.5rem">
                <Typography variant="h6" fontFamily={fonts.nostromoBlack}>
                    Join Lobby
                </Typography>

                <MechSelector
                    selectedMechs={selectedMechs}
                    setSelectedMechs={setSelectedMechs}
                    limit={NUMBER_MECHS_REQUIRED - myFactionLobbySlots.mechSlots.length}
                />

                {/* Show errors */}
                {error && <Typography color={colors.red}>{error}</Typography>}

                {/* Bottom buttons */}
                <Stack direction="row" alignItems="stretch" spacing="1rem">
                    <NiceButton buttonColor={colors.red} sx={{ flex: 1, height: "100%" }} onClick={onClose}>
                        Cancel
                    </NiceButton>

                    <NiceButton buttonColor={colors.green} sx={{ flex: 1, height: "100%" }} onClick={joinBattleLobby}>
                        Confirm
                    </NiceButton>
                </Stack>
            </Stack>
        </NiceModal>
    )
}
