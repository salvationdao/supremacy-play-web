import { Avatar, AvatarGroup, Stack, Typography } from "@mui/material"
import React, { useCallback, useMemo } from "react"
import { FactionIDs } from "../../../constants"
import { useAuth, useGlobalNotifications, useSupremacy } from "../../../containers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { pulseEffect } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby, BattleLobbySupporter } from "../../../types/battle_queue"
import { NiceButton } from "../../Common/Nice/NiceButton"

const NUMBER_SUPPORTERS_REQUIRED = 5
const SIZE = "2rem"

export const Supporters = React.memo(function Supporters({
    battleLobby,
    factionID,
    size = SIZE,
}: {
    battleLobby: BattleLobby
    factionID: string
    size?: string
}) {
    const { userID, factionID: userFactionID } = useAuth()
    const { getFaction } = useSupremacy()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { newSnackbarMessage } = useGlobalNotifications()

    const faction = useMemo(() => getFaction(factionID), [factionID, getFaction])

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

    const { supporters, isAlreadySet, isAlreadySupporting, hasMechDeployed } = useMemo(() => {
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

        const isAlreadySupporting = supporters.some((supporter) => supporter.id === userID)
        const hasMechDeployed = battleLobby.battle_lobbies_mechs.some((mech) => mech.queued_by?.id === userID)

        return {
            supporters,
            isAlreadySet,
            isAlreadySupporting,
            hasMechDeployed,
        }
    }, [battleLobby, factionID, userID])

    return (
        <Stack direction="row" alignItems="center" spacing="1rem">
            <AvatarGroup
                max={5}
                spacing={-7}
                sx={{
                    ".MuiAvatar-root": {
                        width: `calc(${size} - .3rem)`,
                        height: `calc(${size} - .3rem)`,
                        border: `${colors.grey}AA 1px solid`,
                        backgroundColor: colors.grey,
                        borderRadius: 0.2,
                    },
                }}
            >
                {/* Actual slots */}
                {supporters.map((supporter, i) => {
                    return (
                        <Avatar
                            key={`supporter-${supporter.id}-${i}`}
                            alt="Supporter"
                            src={faction.logo_url}
                            sx={{
                                border: supporter.id === userID ? `${colors.gold} 1px solid !important` : `${faction.palette.primary}AA 1px solid !important`,
                                backgroundColor: supporter.id === userID ? `${colors.gold}50 !important` : `${faction.palette.primary}50 !important`,
                            }}
                        />
                    )
                })}

                {/* Empty slots */}
                {NUMBER_SUPPORTERS_REQUIRED - supporters.length > 0 &&
                    new Array(NUMBER_SUPPORTERS_REQUIRED - supporters.length).fill(0).map((_, i) => {
                        return (
                            <Avatar
                                key={`empty-supporter-${i}`}
                                alt="Empty supporter"
                                src={faction.logo_url}
                                sx={{
                                    filter: "grayscale(1)",
                                    opacity: 0.5,
                                }}
                            />
                        )
                    })}
            </AvatarGroup>

            {!isAlreadySet && !isAlreadySupporting && !hasMechDeployed && userFactionID === factionID && (
                <NiceButton
                    buttonColor={faction.palette.primary}
                    sx={{
                        width: `calc(${size} - 1px)`,
                        height: `calc(${size} - 1px)`,
                        p: 0,
                        animation: `${pulseEffect} 3s infinite`,
                    }}
                    onClick={optIn}
                >
                    <Typography lineHeight={1} fontFamily={fonts.nostromoBold}>
                        +
                    </Typography>
                </NiceButton>
            )}
        </Stack>
    )
})
