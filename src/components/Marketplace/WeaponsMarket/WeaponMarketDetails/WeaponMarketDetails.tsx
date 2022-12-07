import { Masonry } from "@mui/lab"
import { Box, CircularProgress, Stack, Typography, useMediaQuery } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { HangarBg } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"
import { Weapon } from "../../../../types"
import { ItemType, MarketplaceBuyAuctionItem } from "../../../../types/marketplace"
import { ClipThing } from "../../../Common/Deprecated/ClipThing"
import { AuctionDetails } from "../../Common/MarketDetails/AuctionDetails"
import { BuyNowDetails } from "../../Common/MarketDetails/BuyNowDetails"
import { Dates } from "../../Common/MarketDetails/Dates"
import { ImagesPreview, MarketMedia } from "../../Common/MarketDetails/ImagesPreview"
import { ManageListing } from "../../Common/MarketDetails/ManageListing"
import { SoldDetails } from "../../Common/MarketDetails/SoldDetails"
import { UserInfo } from "../../Common/MarketDetails/UserInfo"
import { WeaponStatsDetails } from "./WeaponStatsDetails"

export const WeaponMarketDetails = () => {
    const { id } = useParams<{ id: string }>()
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [loadError, setLoadError] = useState<string>()
    const [marketItem, setMarketItem] = useState<MarketplaceBuyAuctionItem>()
    const [weaponDetails, setWeaponDetails] = useState<Weapon>()

    const primaryColor = useMemo(
        () => (marketItem?.sold_at ? colors.marketSold : theme.factionTheme.primary),
        [marketItem?.sold_at, theme.factionTheme.primary],
    )

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

    // Get weapon details
    useGameServerSubscriptionFaction<Weapon>(
        {
            URI: `/weapon/${marketItem?.weapon?.id}/details`,
            key: GameServerKeys.GetWeaponDetails,
            ready: !!marketItem?.weapon?.id,
        },
        (payload) => {
            if (!payload) return
            setWeaponDetails(payload)
        },
    )

    const content = useMemo(() => {
        const validStruct = !marketItem || (marketItem.weapon && marketItem.owner)
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

        if (!marketItem) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress />
                    </Stack>
                </Stack>
            )
        }

        return <WeaponMarketDetailsInner marketItem={marketItem} weaponDetails={weaponDetails} primaryColor={primaryColor} />
    }, [loadError, marketItem, weaponDetails, primaryColor])

    return (
        <Box
            alignItems="center"
            sx={{
                height: "100%",
                p: "1rem",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
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
                backgroundColor={theme.factionTheme.u800}
                sx={{ height: "100%" }}
            >
                <Stack sx={{ height: "100%" }}>{content}</Stack>
            </ClipThing>
        </Box>
    )
}

const WeaponMarketDetailsInner = ({
    marketItem,
    weaponDetails,
    primaryColor,
}: {
    marketItem: MarketplaceBuyAuctionItem
    weaponDetails?: Weapon
    primaryColor: string
}) => {
    const below780 = useMediaQuery("(max-width:780px)")
    const [isTimeEnded, toggleIsTimeEnded] = useToggle()

    const media: MarketMedia[] = useMemo(() => {
        const skin = weaponDetails?.weapon_skin
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
    }, [weaponDetails])

    const { id, owner, weapon, created_at, end_at, sold_at, sold_for, sold_to } = marketItem

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
            }}
        >
            <Box sx={{ direction: "ltr", height: 0 }}>
                <Box
                    sx={{
                        pt: "2rem",
                        pb: "3.8rem",
                        px: "3rem",
                    }}
                >
                    <Masonry columns={below780 ? 1 : 2} spacing={4}>
                        <ImagesPreview media={media} primaryColor={primaryColor} />

                        <Stack spacing="2rem" sx={{ pb: "1rem", minHeight: "65rem" }}>
                            <Box>
                                <Typography gutterBottom variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBold }}>
                                    WEAPON
                                </Typography>

                                <Typography variant="h4" sx={{ fontFamily: fonts.nostromoBlack }}>
                                    {weapon?.label}
                                </Typography>
                            </Box>

                            <UserInfo marketUser={owner} title="OWNED BY:" />

                            <Dates createdAt={created_at} endAt={end_at} onTimeEnded={() => toggleIsTimeEnded(true)} soldAt={sold_at} />

                            {sold_to && <UserInfo marketUser={sold_to} title="SOLD TO:" primaryColor={colors.marketSold} />}

                            {sold_for && <SoldDetails soldFor={sold_for} />}

                            {!sold_for && marketItem.buyout_price && (
                                <BuyNowDetails
                                    id={marketItem.id}
                                    itemType={ItemType.Weapon}
                                    owner={marketItem.owner}
                                    itemName={weapon?.label || "WEAPON"}
                                    buyNowPrice={marketItem.buyout_price}
                                    dutchAuctionDropRate={marketItem.dutch_auction_drop_rate}
                                    reservePrice={marketItem.auction_reserved_price}
                                    createdAt={marketItem.created_at}
                                    isTimeEnded={isTimeEnded}
                                />
                            )}

                            {!sold_for && marketItem.auction_current_price && (
                                <AuctionDetails
                                    id={marketItem.id}
                                    itemType={ItemType.Weapon}
                                    owner={marketItem.owner}
                                    itemName={weapon?.label || "WEAPON"}
                                    buyNowPrice={marketItem.buyout_price}
                                    dutchAuctionDropRate={marketItem.dutch_auction_drop_rate}
                                    createdAt={marketItem.created_at}
                                    auctionCurrentPrice={marketItem.auction_current_price}
                                    auctionBidCount={marketItem.total_bids}
                                    auctionLastBid={marketItem.last_bid}
                                    isTimeEnded={isTimeEnded}
                                />
                            )}

                            <ManageListing id={id} owner={owner} isTimeEnded={isTimeEnded} />
                        </Stack>

                        <WeaponStatsDetails weaponDetails={weaponDetails} />
                    </Masonry>
                </Box>
            </Box>
        </Box>
    )
}
