import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useTheme } from "../../../containers/theme"
import { consolidateMarketItemDeets, getRarityDeets, MarketItemDeets } from "../../../helpers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MechDetails } from "../../../types"
import { MarketplaceBuyAuctionItem } from "../../../types/marketplace"
import { ClipThing } from "../../Common/ClipThing"
import { AuctionDetails } from "../Common/MarketDetails/AuctionDetails"
import { BuyNowDetails } from "../Common/MarketDetails/BuyNowDetails"
import { Dates } from "../Common/MarketDetails/Dates"
import { ImagesPreview, MarketMedia } from "../Common/MarketDetails/ImagesPreview"
import { ListingType } from "../Common/MarketDetails/ListingType"
import { Owner } from "../Common/MarketDetails/Owner"

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
                        <Box sx={{ pt: "2rem", pb: "3.8rem", px: "3rem" }}>
                            <Box sx={{ height: "1000rem", width: "30rem", backgroundColor: "red" }}></Box>
                        </Box>
                    </Box>
                </Box>
            </Stack>

            {/* <Box
                sx={{
                    height: "100%",
                    overflowY: "auto",
                    overflowX: "hidden",
                    mr: "1rem",
                    mt: "1.2rem",
                    mb: "3rem",
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
                <Box
                    sx={{
                        maxHeight: 0,
                        px: "5rem",
                        py: "2.8rem",
                    }}
                >
                    <Box sx={{ height: "1000rem", width: "30rem", backgroundColor: "red" }}></Box>
                </Box>
            </Box> */}
        </ClipThing>
    )
}
