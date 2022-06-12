import { Box, Stack, Typography } from "@mui/material"
import { ReactNode, useState } from "react"
import { WarMachineIconPNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { fonts } from "../../../theme/theme"
import { ItemType } from "../../../types/marketplace"
import { ClipThing } from "../../Common/ClipThing"
import { AssetToSell } from "./AssetToSell"
import { ItemTypeSelect } from "./ItemTypeSelect"

export interface AssetToSellStruct {
    imageUrl: string
    label: string
    subtitle: ReactNode
}

export const itemTypes: {
    label: string
    value: ItemType
}[] = [
    { label: "War Machine", value: ItemType.WarMachine },
    { label: "Keycard", value: ItemType.Keycards },
    { label: "Mystery Crate", value: ItemType.MysteryCrate },
]

export const SellItem = () => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    // Form states
    const [itemType, setItemType] = useState<ItemType>()
    const [assetToSell, setAssetToSell] = useState<AssetToSellStruct>()

    // Others
    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

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
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                        px: "2rem",
                        py: "2.2rem",
                        backgroundColor: "#00000070",
                        borderBottom: (theme) => `${theme.factionTheme.primary}70 1.5px solid`,
                    }}
                >
                    <Box
                        sx={{
                            alignSelf: "flex-start",
                            flexShrink: 0,
                            mr: "1.6rem",
                            width: "7rem",
                            height: "5.2rem",
                            background: `url(${WarMachineIconPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    />
                    <Box sx={{ mr: "2rem" }}>
                        <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                            SELL AN ITEM
                        </Typography>
                        <Typography sx={{ fontSize: "1.85rem" }}>Put your asset on the marketplace.</Typography>
                    </Box>
                </Stack>
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
                        <Stack spacing="3rem" sx={{ px: "3rem", py: "1.8rem" }}>
                            {/* Item type select */}
                            <ItemTypeSelect itemType={itemType} setItemType={setItemType} />

                            {/* Asset to sell */}
                            <AssetToSell itemType={itemType} assetToSell={assetToSell} setAssetToSell={setAssetToSell} />
                        </Stack>
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
