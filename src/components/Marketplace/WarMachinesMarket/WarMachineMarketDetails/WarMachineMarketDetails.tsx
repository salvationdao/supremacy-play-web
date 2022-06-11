import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { consolidateMarketItemDeets, getRarityDeets, MarketItemDeets } from "../../../../helpers"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"
import { MarketplaceBuyAuctionItem } from "../../../../types/marketplace"
import { ClipThing } from "../../../Common/ClipThing"
import { AuctionDetails } from "../../Common/MarketDetails/AuctionDetails"
import { BuyNowDetails } from "../../Common/MarketDetails/BuyNowDetails"
import { Dates } from "../../Common/MarketDetails/Dates"
import { ImagesPreview, MarketMedia } from "../../Common/MarketDetails/ImagesPreview"
import { ListingType } from "../../Common/MarketDetails/ListingType"
import { Owner } from "../../Common/MarketDetails/Owner"
import { MechStatsDetails } from "./MechStatsDetails"

export const WarMachineMarketDetails = ({ id }: { id: string }) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [loadError, setLoadError] = useState<string>()
    const [marketItem, setMarketItem] = useState<MarketplaceBuyAuctionItem>()
    const [mechDetails, setMechDetails] = useState<MechDetails>()

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

    // Get mech details
    useEffect(() => {
        ;(async () => {
            try {
                if (!marketItem || !marketItem.mech?.id) return
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: marketItem.mech.id,
                })

                if (!resp) return
                setMechDetails(resp)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get war machine details."
                setLoadError(message)
                console.error(err)
            }
        })()
    }, [marketItem, send])

    const content = useMemo(() => {
        const validStruct = !marketItem || (marketItem.mech && marketItem.owner)

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

        return (
            <WarMachineMarketDetailsInner
                marketItem={marketItem}
                mechDetails={mechDetails}
                marketItemDeets={marketItemDeets}
                primaryColor={marketItemDeets?.primaryColor || theme.factionTheme.primary}
                backgroundColor={marketItemDeets?.backgroundColor || theme.factionTheme.background}
            />
        )
    }, [loadError, marketItem, marketItemDeets, mechDetails, theme.factionTheme.background, theme.factionTheme.primary])

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
    mechDetails,
    marketItemDeets,
    primaryColor,
    backgroundColor,
}: {
    marketItem: MarketplaceBuyAuctionItem
    mechDetails?: MechDetails
    marketItemDeets: MarketItemDeets
    primaryColor: string
    backgroundColor: string
}) => {
    const rarityDeets = useMemo(() => getRarityDeets(marketItem.collection_item?.tier || ""), [marketItem.collection_item?.tier])

    const media: MarketMedia[] = useMemo(() => {
        const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
        if (!skin) return []

        const avatarUrl = skin.avatar_url // avatar
        const imageUrl = skin.image_url // poster for card_animation_url
        const cardAnimationUrl = skin.card_animation_url // smaller one, transparent bg
        const largeImageUrl = skin.large_image_url // poster for animation_url
        const animationUrl = skin.animation_url // big one

        return [
            {
                imageUrl: largeImageUrl,
                videoUrl: animationUrl,
            },
            {
                imageUrl: imageUrl,
                videoUrl: cardAnimationUrl,
            },
            {
                imageUrl: avatarUrl,
            },
        ]
    }, [mechDetails])

    const listingDetails = useMemo(() => {
        const { buyout, auction, dutch_auction } = marketItem
        if (auction) {
            return (
                <AuctionDetails
                    id={marketItem.id}
                    itemName={marketItem.mech?.name || marketItem.mech?.label || "WAR MACHINE"}
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
                    itemName={marketItem.mech?.name || marketItem.mech?.label || "WAR MACHINE"}
                    buyNowPrice={marketItem.buyout_price}
                    dutchAuctionDropRate={marketItem.dutch_auction_drop_rate}
                    createdAt={marketItem.created_at}
                />
            )
        }
    }, [marketItem])

    const { owner, mech, created_at, end_at } = marketItem

    return (
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
            <Box
                sx={{
                    pt: "2rem",
                    pb: "3.8rem",
                    px: "3rem",
                    maxHeight: 0,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(50rem, 1fr))",
                    gap: "3.5rem",
                    justifyContent: "center",
                }}
            >
                <ImagesPreview media={media} primaryColor={marketItemDeets.primaryColor} />

                <Stack spacing="2rem">
                    <Box>
                        <Typography
                            gutterBottom
                            variant="h5"
                            sx={{ color: primaryColor, fontFamily: fonts.nostromoBold, span: { color: rarityDeets.color, fontFamily: "inherit" } }}
                        >
                            WAR MACHINE | <span>{rarityDeets.label}</span>
                        </Typography>

                        <Typography variant="h4" sx={{ fontFamily: fonts.nostromoBlack }}>
                            {mech?.name || mech?.label}
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

                <MechStatsDetails mechDetails={mechDetails} primaryColor={primaryColor} backgroundColor={backgroundColor} />
            </Box>
        </Box>
    )
}
