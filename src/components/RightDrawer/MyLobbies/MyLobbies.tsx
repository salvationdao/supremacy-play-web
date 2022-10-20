import { Box, Stack, Typography } from "@mui/material"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { BattleLobby } from "../../../types/battle_queue"
import { useMemo, useState } from "react"
import FlipMove from "react-flip-move"
import { PlayerInvolvedLobbyCard } from "../../Lobbies/BattleLobbies/PlayerInvolvedLobbyCard"

export const MyLobbies = () => {
    const { factionTheme } = useTheme()
    const [involvedLobbies, setInvolvedLobbies] = useState<BattleLobby[]>([])
    useGameServerSubscriptionSecuredUser<BattleLobby[]>(
        {
            URI: "/involved_battle_lobbies",
            key: GameServerKeys.SubInvolvedBattleLobbiesUpdate,
        },
        (payload) => {
            if (!payload) return
            setInvolvedLobbies((prev) => {
                if (prev.length === 0) return payload.filter((bl) => !bl.ended_at && !bl.deleted_at).sort((a, b) => (a.stage_order > b.stage_order ? 1 : -1))

                const list = prev.map((bl) => payload.find((p) => p.id === bl.id) || bl)

                payload.forEach((p) => {
                    // if already exists
                    if (list.some((b) => b.id === p.id)) {
                        return
                    }
                    // otherwise, push to the list
                    list.push(p)
                })

                return list.filter((bl) => !bl.ended_at && !bl.deleted_at).sort((a, b) => (a.stage_order > b.stage_order ? 1 : -1))
            })
        },
    )

    const content = useMemo(() => {
        return (
            <Box sx={{ direction: "ltr", height: 0 }}>
                <FlipMove>
                    {involvedLobbies.map((battleLobby) => {
                        return (
                            <Box
                                key={`battle-lobby-${battleLobby.id}`}
                                sx={{
                                    "&:not(:last-child)": {
                                        mb: ".8rem",
                                    },
                                }}
                            >
                                <PlayerInvolvedLobbyCard battleLobby={battleLobby} />
                            </Box>
                        )
                    })}
                </FlipMove>
            </Box>
        )
    }, [involvedLobbies])

    return (
        <>
            <Stack sx={{ position: "relative", height: "100%", backgroundColor: factionTheme.background }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        height: "5rem",
                        backgroundColor: factionTheme.primary,
                        borderBottom: `${factionTheme.primary} 2px solid`,
                    }}
                >
                    <Typography color={factionTheme.secondary} fontFamily={fonts.nostromoBlack}>
                        My Lobbies
                    </Typography>
                </Stack>

                <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
                    <Box
                        flex={1}
                        sx={{
                            overflowY: "auto",
                            overflowX: "hidden",
                            direction: "ltr",

                            "::-webkit-scrollbar": {
                                width: ".4rem",
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: factionTheme.primary,
                                borderRadius: 3,
                            },
                        }}
                    >
                        {content}
                    </Box>
                </Stack>
            </Stack>
        </>
    )
}
