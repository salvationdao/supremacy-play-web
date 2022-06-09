import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { SafePNG } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { consolidateMarketItemDeets, MarketItemDeets } from "../../../../helpers"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MarketplaceBuyAuctionItem } from "../../../../types/marketplace"
import { ClipThing } from "../../../Common/ClipThing"
import { AuctionDetails } from "../../Common/MarketDetails/AuctionDetails"
import { BuyNowDetails } from "../../Common/MarketDetails/BuyNowDetails"
import { Dates } from "../../Common/MarketDetails/Dates"
import { ImagesPreview } from "../../Common/MarketDetails/ImagesPreview"
import { ListingType } from "../../Common/MarketDetails/ListingType"
import { Owner } from "../../Common/MarketDetails/Owner"

export const MysteryCrateMarketDetails = ({ id }: { id: string }) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [loadError, setLoadError] = useState<string>()
    const [marketItem, setMarketItem] = useState<MarketplaceBuyAuctionItem>()

    const marketItemDeets = useMemo(() => (marketItem ? consolidateMarketItemDeets(marketItem, theme) : undefined), [marketItem, theme])

    // Get listing details
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<MarketplaceBuyAuctionItem>(GameServerKeys.MarketplaceSalesGet, {
                    id,
                })

                if (!resp) return
                setMarketItem(resp)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get listing details."
                setLoadError(message)
                console.error(err)
            }
        })()
    }, [id, send])

    const content = useMemo(() => {
        const validStruct = !marketItem || (marketItem.mystery_crate && marketItem.owner)

        if (loadError || !validStruct) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
                        spacing="1.5rem"
                    >
                        <Typography
                            sx={{
                                color: colors.red,
                                fontFamily: fonts.nostromoBold,
                                textAlign: "center",
                            }}
                        >
                            {loadError ? loadError : "Failed to load listing details."}
                        </Typography>
                    </Stack>
                </Stack>
            )
        }

        if (!marketItem || !marketItemDeets) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        return <WarMachineMarketDetailsInner marketItem={marketItem} marketItemDeets={marketItemDeets} primaryColor={theme.factionTheme.primary} />
    }, [loadError, marketItem, marketItemDeets, theme.factionTheme.primary])

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: marketItemDeets?.primaryColor || theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={marketItemDeets?.backgroundColor || theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ height: "100%" }}>{content}</Stack>
        </ClipThing>
    )
}

const WarMachineMarketDetailsInner = ({
    marketItem,
    marketItemDeets,
    primaryColor,
}: {
    marketItem: MarketplaceBuyAuctionItem
    marketItemDeets: MarketItemDeets
    primaryColor: string
}) => {
    const listingDetails = useMemo(() => {
        const { buyout, auction, dutch_auction } = marketItem
        if (auction) {
            return (
                <AuctionDetails
                    id={marketItem.id}
                    itemName={marketItem.mystery_crate?.label || "MYSTERY CRATE"}
                    buyNowPrice={marketItem.buyout_price}
                    auctionCurrentPrice={marketItem.auction_current_price}
                    auctionBidCount={marketItem.total_bids}
                    auctionLastBid={marketItem.last_bid}
                />
            )
        }

        if (buyout || dutch_auction) {
            return (
                <BuyNowDetails
                    id={marketItem.id}
                    itemName={marketItem.mystery_crate?.label || "MYSTERY CRATE"}
                    buyNowPrice={marketItem.buyout_price}
                    dutchAuctionDropRate={marketItem.dutch_auction_drop_rate}
                    createdAt={marketItem.created_at}
                />
            )
        }
    }, [marketItem])

    const { owner, mystery_crate, created_at, end_at } = marketItem

    return (
        <Box
            sx={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                mr: "1rem",
                my: "1.2rem",
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
                    background: (theme) => theme.factionTheme.primary,
                    borderRadius: 3,
                },
            }}
        >
            <Box
                sx={{
                    maxHeight: 0,
                    px: "5rem",
                    py: "2.8rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(50rem, 1fr))",
                    gap: "3.5rem",
                    justifyContent: "center",
                }}
            >
                <ImagesPreview
                    media={[
                        {
                            imageUrl: marketItem?.collection_item?.image_url || SafePNG,
                            videoUrl: marketItem?.collection_item?.animation_url || SafePNG,
                        },
                    ]}
                    primaryColor={marketItemDeets.primaryColor}
                />

                <Stack spacing="2rem">
                    <Box>
                        <Typography gutterBottom variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBold }}>
                            MYSTERY CRATE
                        </Typography>

                        <Typography variant="h4" sx={{ fontFamily: fonts.nostromoBlack }}>
                            {mystery_crate?.label || "MYSTERY CRATE"}
                        </Typography>
                    </Box>

                    <ListingType
                        primaryColor={marketItemDeets.primaryColor}
                        listingTypeLabel={marketItemDeets.listingTypeLabel}
                        icon={<marketItemDeets.Icon fill={marketItemDeets.primaryColor} />}
                    />

                    <Owner owner={owner} />

                    <Dates createdAt={created_at} endAt={end_at} />

                    {listingDetails}
                </Stack>
            </Box>
        </Box>
    )
}
