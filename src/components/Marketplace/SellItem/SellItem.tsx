import { Box, Stack, Typography } from "@mui/material"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { fonts } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"

export const SellItem = () => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const primaryColor = theme.factionTheme.primary

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: primaryColor,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ height: "100%" }}>
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        ml: "2rem",
                        mr: "1rem",
                        pr: "1rem",
                        my: "2rem",
                        direction: "ltr",
                        scrollbarWidth: "none",
                        "::-webkit-scrollbar": {
                            width: ".4rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                            borderRadius: 3,
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: primaryColor,
                            borderRadius: 3,
                        },
                    }}
                >
                    <Box sx={{ direction: "ltr", height: 0 }}>
                        <Box sx={{ px: "3rem", py: "2rem" }}>
                            <Typography variant="h4" sx={{ fontFamily: fonts.nostromoHeavy }}>
                                SELL AN ITEM
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Stack>
        </ClipThing>
    )
}

/**
 * What they're selling:
 * - war machines
 * - keycards
 * - mystery crates
 *
 * List the items and they choose
 *
 * Listing type:
 * - buyout					price
 * - auction				reserve price
 * - auction or buyout		price, reserve price
 * - dutch auction			starting price, reserve price, drop rate
 */
