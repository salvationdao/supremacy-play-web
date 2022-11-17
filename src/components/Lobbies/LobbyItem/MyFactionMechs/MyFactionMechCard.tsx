import { useCallback } from "react"
import { useGlobalNotifications } from "../../../../containers"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { BattleLobbiesMech } from "../../../../types/battle_queue"

export const MyFactionMechCard = ({ mech }: { mech: BattleLobbiesMech }) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { newSnackbarMessage } = useGlobalNotifications()

    const leaveLobby = useCallback(
        async (mechID: string) => {
            try {
                await send(GameServerKeys.LeaveBattleLobby, {
                    mech_ids: [mechID],
                })

                newSnackbarMessage("Successfully removed mech from lobby.", "success")
            } catch (err) {
                newSnackbarMessage(typeof err === "string" ? err : "Failed to leave lobby, try again or contact support.", "error")
            }
        },
        [newSnackbarMessage, send],
    )

    return null
}
