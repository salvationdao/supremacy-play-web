import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { getRarityDeets } from "../../../helpers"
import { MARKETPLACE_TABS } from "../../../pages"
import { fonts } from "../../../theme/theme"
import { MarketplaceBuyAuctionItem } from "../../../types/marketplace"
import { MarketItem } from "../Common/MarketItem/MarketItem"

interface WarMachineMarketItemProps {
    item: MarketplaceBuyAuctionItem
    isGridView: boolean
}

export const WeaponsMarketItem = ({ item, isGridView }: WarMachineMarketItemProps) => {
    const { weapon, collection_item } = item

    if (!weapon || !collection_item) return null

    const { label, avatar_url } = weapon
    const { tier } = collection_item

    return (
        <MarketItem item={item} imageUrl={avatar_url} backgroundImageUrl={avatar_url} isGridView={isGridView} linkSubPath={MARKETPLACE_TABS.Weapons}>
            <WeaponInfo isGridView={isGridView} label={label} tier={tier} />
        </MarketItem>
    )
}

const WeaponInfo = ({ isGridView, label, tier }: { isGridView: boolean; label: string; tier: string }) => {
    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])

    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    color: rarityDeets.color,
                }}
            >
                {rarityDeets.label}
            </Typography>

            <Typography
                sx={{
                    fontWeight: "fontWeightBold",
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {label}
            </Typography>
        </Stack>
    )
}
