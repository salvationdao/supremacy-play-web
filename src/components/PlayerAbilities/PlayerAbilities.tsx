import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { SocketState, useGameServerAuth, useGameServerWebsocket } from "../../containers"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { PlayerAbilityCard } from "./PlayerAbilityCard"

export const PlayerAbilities = () => {
    const { user } = useGameServerAuth()
    const { state, send, subscribe } = useGameServerWebsocket()
    const [playerAbilityIDs, setPlayerAbilityIDs] = useState<string[]>([])

    useEffect(() => {
        if (state !== SocketState.OPEN || !send || !subscribe || !user) return

        const fetchSaleAbilities = async () => {
            const resp = await send<{ total: number; ability_ids: string[] }>(GameServerKeys.PlayerAbilitiesList, {
                filter: {
                    items: [
                        {
                            column: "owner_id",
                            operator: "=",
                            value: user.id,
                        },
                    ],
                },
            })
            setPlayerAbilityIDs(resp.ability_ids)
        }

        fetchSaleAbilities()

        return subscribe(GameServerKeys.TriggerSaleAbilitiesListUpdated, () => fetchSaleAbilities())
    }, [state, send, subscribe, user])

    return (
        <Box>
            <Stack direction="row" spacing=".48rem" alignItems="center" marginBottom="1rem">
                <Typography
                    sx={{
                        lineHeight: 1,
                        color: colors.text,
                        fontWeight: "fontWeightBold",
                        textTransform: "uppercase",
                    }}
                >
                    Player Abilities
                </Typography>
            </Stack>
            {playerAbilityIDs.length > 0 ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: ".5rem",
                    }}
                >
                    {playerAbilityIDs.map((s) => (
                        <PlayerAbilityCard key={s} abilityID={s} />
                    ))}
                </Box>
            ) : (
                <Typography
                    sx={{
                        px: "1.28rem",
                        pt: "1.28rem",
                        mb: ".56rem",
                        color: colors.grey,
                        userSelect: "text !important",
                        opacity: 0.8,
                    }}
                >
                    There are currently no abilities on sale.
                </Typography>
            )}
        </Box>
    )
}
