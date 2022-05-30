import { Box, Divider, Stack, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { ClipThing } from "../.."
import { useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { usePagination } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { fonts } from "../../../theme/theme"
import { MysteryCrate } from "../../../types"
import { Filter } from "../Filter"

export const MysteryCrates = () => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("xxxxxxxxx")
    const theme = useTheme()
    const [crates, setCrates] = useState<MysteryCrate[]>()
    const [isLoading, setIsLoading] = useState(true)
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, setPageSize } = usePagination({ pageSize: 10, page: 1 })

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<MysteryCrate[]>(GameServerKeys.GetMysteryCrates, {
                    page,
                    page_size: pageSize,
                })

                if (!resp) return
                setCrates(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [send])

    return (
        <Stack direction="row" spacing="1rem" sx={{ height: "100%" }}>
            <Filter />

            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: true,
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                opacity={0.7}
                backgroundColor={theme.factionTheme.background}
                sx={{ flex: 1, height: "100%", width: "45rem" }}
            >
                <Stack spacing="2rem" sx={{ position: "relative", height: "100%", px: "2.68em", py: "2.2rem" }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                            MYSTERY CRATES
                        </Typography>
                        <Typography>Gear up for the battle areana with a variety of War Machines and Weapons.</Typography>
                    </Box>
                    <Divider />
                    <Stack>aAAAAAAAAAA</Stack>
                </Stack>
            </ClipThing>
        </Stack>
    )
}
