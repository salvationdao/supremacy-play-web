import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { ClipThing } from "../.."
import { useTheme } from "../../../containers/theme"
import { getRarityDeets } from "../../../helpers"
import { MarketplaceMechItem } from "../../../types/marketplace"

interface WarMachineMarketItemProps {
    item: MarketplaceMechItem
}

export const WarMachineMarketItem = ({ item }: WarMachineMarketItemProps) => {
    const theme = useTheme()
    const rarityDeets = useMemo(() => getRarityDeets(item.collection?.tier || ""), [item.collection?.tier])

    const { end_at, buyout_price, owner, collection, mech } = item

    if (!mech || !collection || !owner) return null

    const { username, public_address } = owner
    const { tier, image_url: collectionImageUrl } = collection
    const { name, label, image_url } = mech

    // tier
    tier
    rarityDeets.label
    rarityDeets.color

    // mech
    name || label

    // owner
    username
    public_address

    // item
    end_at
    buyout_price

    return (
        <Box sx={{ position: "relative", overflow: "visible" }}>
            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: true,
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".2rem",
                }}
                opacity={0.7}
                backgroundColor={theme.factionTheme.background}
            >
                <Stack spacing="1.2rem" direction="row" sx={{ height: "100%", px: "1rem", py: "1rem" }}>
                    <Box
                        sx={{
                            flexShrink: 0,
                            width: "7rem",
                            height: "5.2rem",
                            background: `url(${image_url || collectionImageUrl})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    />
                </Stack>
            </ClipThing>
        </Box>
    )
}

export const WarMachineMarketItemLoadingSkeleton = () => {
    return <Stack>Loading...</Stack>
}
