import { Stack, Typography } from "@mui/material"
import React, { useCallback, useMemo } from "react"
import { SvgUserDiamond2 } from "../../../assets"
import { FactionIDs } from "../../../constants"
import { useAuth, useGlobalNotifications } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { fonts } from "../../../theme/theme"
import { BattleLobby, BattleLobbySupporter } from "../../../types/battle_queue"
import { NiceButton } from "../../Common/Nice/NiceButton"

const NUMBER_SUPPORTERS_REQUIRED = 5
const SIZE = "2rem"

export const Supporters = React.memo(function Supporters({ battleLobby }: { battleLobby: BattleLobby }) {
    const theme = useTheme()
    const { factionID } = useAuth()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { newSnackbarMessage } = useGlobalNotifications()

    const optIn = useCallback(async () => {
        try {
            await send(GameServerKeys.JoinBattleLobbySupporter, { battle_lobby_id: battleLobby.id, access_code: battleLobby.access_code })
            newSnackbarMessage("Successfully joined as a battle supporter.", "success")
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to opt in to support battle."
            console.error(message)
            newSnackbarMessage(message, "error")
        }
    }, [send, battleLobby.id, battleLobby.access_code, newSnackbarMessage])

    const { supporters, isAlreadySet } = useMemo(() => {
        let supporters: BattleLobbySupporter[] = []
        let isAlreadySet = false // This means battle already started, supporters are set and fixed

        if (factionID === FactionIDs.BC) {
            isAlreadySet = battleLobby.selected_bc_supporters.length > 0
            supporters = isAlreadySet ? battleLobby.selected_bc_supporters : battleLobby.opted_in_bc_supporters
        } else if (factionID === FactionIDs.RM) {
            isAlreadySet = battleLobby.selected_rm_supporters.length > 0
            supporters = isAlreadySet ? battleLobby.selected_rm_supporters : battleLobby.opted_in_rm_supporters
        } else if (factionID === FactionIDs.ZHI) {
            isAlreadySet = battleLobby.selected_zai_supporters.length > 0
            supporters = isAlreadySet ? battleLobby.selected_zai_supporters : battleLobby.opted_in_zai_supporters
        }

        return {
            supporters,
            isAlreadySet,
        }
    }, [
        battleLobby.opted_in_bc_supporters,
        battleLobby.opted_in_rm_supporters,
        battleLobby.opted_in_zai_supporters,
        battleLobby.selected_bc_supporters,
        battleLobby.selected_rm_supporters,
        battleLobby.selected_zai_supporters,
        factionID,
    ])

    return (
        <Stack direction="row" alignItems="center" spacing=".9rem">
            {supporters.map((mech, i) => {
                return <SvgUserDiamond2 key={`mech-${mech.id}-${i}`} fill={theme.factionTheme.primary} size={`calc(${SIZE} - .3rem)`} />
            })}

            {/* Empty slots */}
            {NUMBER_SUPPORTERS_REQUIRED - supporters.length > 0 &&
                !isAlreadySet &&
                new Array(NUMBER_SUPPORTERS_REQUIRED - supporters.length).fill(0).map((_, index) => {
                    return (
                        <NiceButton
                            key={`empty-slot-${index}`}
                            buttonColor={theme.factionTheme.primary}
                            sx={{
                                width: `calc(${SIZE} - 1px)`,
                                height: `calc(${SIZE} - 1px)`,
                                p: 0,
                            }}
                            onClick={optIn}
                        >
                            <Typography lineHeight={1} fontFamily={fonts.nostromoBold}>
                                +
                            </Typography>
                        </NiceButton>
                    )
                })}
        </Stack>
    )
})
