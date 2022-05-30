import { Box, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useAuth } from "../../containers/auth"
import { useGameServerCommandsUser, useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { PlayerAbilityCard } from "./PlayerAbilityCard"

const columns = 5
const rows = 2
const pageSize = columns * rows

export const PlayerAbilities = () => {
    const { userID } = useAuth()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [playerAbilityIDs, setPlayerAbilityIDs] = useState<string[]>([])

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const fetchSaleAbilities = useCallback(async () => {
        if (!userID) return
        ;(async () => {
            try {
                const resp = await send<{ total: number; ability_ids: string[] }>(GameServerKeys.PlayerAbilitiesList, {
                    page_size: pageSize,
                    page: currentPage - 1,
                    filter: {
                        items: [
                            {
                                column: "owner_id",
                                operator: "=",
                                value: userID,
                            },
                        ],
                    },
                })

                if (!resp) return
                setPlayerAbilityIDs(resp.ability_ids)
                setTotalPages(Math.ceil(resp.total / pageSize))
            } catch (e) {
                console.error(e)
            }
        })()
    }, [currentPage, send, userID])

    useEffect(() => {
        fetchSaleAbilities()
    })

    useGameServerSubscription(
        {
            URI: "/public/live_data",
            key: GameServerKeys.TriggerSaleAbilitiesListUpdated,
        },
        () => fetchSaleAbilities(),
    )

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
            <Box marginBottom="1rem">
                {playerAbilityIDs.length > 0 ? (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${columns}, 1fr)`,
                            gridTemplateRows: `repeat(${rows}, 1fr)`,
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
            <Pagination
                count={totalPages}
                color="primary"
                page={currentPage}
                onChange={(_, p) => {
                    setCurrentPage(p)
                }}
            />
        </Box>
    )
}
