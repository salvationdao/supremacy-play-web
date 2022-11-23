import { Stack } from "@mui/material"
import { useCallback } from "react"
import { useAuth, useGlobalNotifications } from "../../../../containers"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { BattleLobbiesMech } from "../../../../types/battle_queue"
import { MechCardWeaponAndStats } from "../../../Common/Mech/MechCardWeaponAndStats"
import { NiceButton } from "../../../Common/Nice/NiceButton"

export const MyFactionMechCard = ({ mech, isLocked }: { mech: BattleLobbiesMech; isLocked: boolean }) => {
    const { userID } = useAuth()
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

    return (
        <Stack justifyContent="center" spacing="1rem">
            <MechCardWeaponAndStats mech={{ ...mech, owner: mech.queued_by || mech.owner }} sx={{ height: "unset" }} />

            <NiceButton disabled={isLocked || mech.queued_by?.id !== userID} onClick={() => leaveLobby(mech.id)} buttonColor={colors.darkGrey}>
                Leave
            </NiceButton>
        </Stack>
    )
}
