import { Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"

interface BattleLobbyItemProps {
    battleLobby: BattleLobby
    omitClip?: boolean
    disabled?: boolean
    accessCode?: string
}

const propsAreEqual = (prevProps: BattleLobbyItemProps, nextProps: BattleLobbyItemProps) => {
    return (
        prevProps.accessCode === prevProps.accessCode &&
        prevProps.disabled === nextProps.disabled &&
        prevProps.battleLobby.id === nextProps.battleLobby.id &&
        prevProps.battleLobby.ready_at === nextProps.battleLobby.ready_at &&
        prevProps.battleLobby.ended_at === nextProps.battleLobby.ended_at &&
        prevProps.battleLobby.deleted_at === nextProps.battleLobby.deleted_at &&
        prevProps.battleLobby.assigned_to_battle_id === nextProps.battleLobby.assigned_to_battle_id &&
        prevProps.battleLobby.assigned_to_arena_id === nextProps.battleLobby.assigned_to_arena_id &&
        prevProps.battleLobby.fill_at === nextProps.battleLobby.fill_at &&
        prevProps.battleLobby.expires_at === nextProps.battleLobby.expires_at &&
        prevProps.battleLobby.battle_lobbies_mechs === nextProps.battleLobby.battle_lobbies_mechs
    )
}

export const BattleLobbyItem = React.memo(function BattleLobbyItem({ battleLobby, accessCode }: BattleLobbyItemProps) {
    const displayedAccessCode = useMemo(() => battleLobby.access_code || accessCode, [accessCode, battleLobby.access_code])

    return (
        <>
            <Stack
                spacing="1rem"
                sx={{
                    p: "2rem",
                }}
            >
                {displayedAccessCode && (
                    <Stack
                        direction="column"
                        spacing={1}
                        sx={{
                            justifyContent: "center",
                            marginBottom: "1rem",
                        }}
                    >
                        <Typography variant="body2" fontFamily={fonts.nostromoHeavy}>
                            Battle Supporters
                        </Typography>
                    </Stack>
                )}
            </Stack>
        </>
    )
}, propsAreEqual)
