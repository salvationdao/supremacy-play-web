import { Box, Pagination, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { SocketState, useGameServerAuth, useGameServerWebsocket } from "../../containers"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { PlayerAbilityCard } from "./PlayerAbilityCard"

export const PlayerAbilities = () => {
    const { user } = useGameServerAuth()
    const { state, send, subscribe } = useGameServerWebsocket()
    const [playerAbilityIDs, setPlayerAbilityIDs] = useState<string[]>([])

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(8)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        if (state !== SocketState.OPEN || !send || !subscribe || !user) return

        const fetchSaleAbilities = async () => {
            const resp = await send<{ total: number; ability_ids: string[] }>(GameServerKeys.PlayerAbilitiesList, {
                page_size: pageSize,
                page: currentPage - 1,
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
            setTotalPages(Math.ceil(resp.total / pageSize))
        }

        fetchSaleAbilities()

        return subscribe(GameServerKeys.TriggerSaleAbilitiesListUpdated, () => fetchSaleAbilities())
    }, [state, send, subscribe, user, currentPage, pageSize])

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
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gridTemplateRows: "repeat(2, 1fr)",
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
