import { Box, Divider, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { ClipThing } from "../.."
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { fonts } from "../../../theme/theme"
import { MysteryCrate } from "../../../types"
import { Filter } from "../Filter"

export const MysteryCrates = () => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("xxxxxxxxx")
    const [crates, setCrates] = useState<MysteryCrate>()

    // useEffect(() => {
    //     ;(async () => {
    //         try {
    //             const resp = await send<MysteryCrate[]>(GameServerKeys.XXXXXX, {
    //                 payload: something,
    //             })

    //             if (!resp) return
    //             setFactionsData(resp)
    //         } catch (e) {
    //             console.error(e)
    //         }
    //     })()
    // }, [send])

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
