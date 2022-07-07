import { useState, useEffect, useMemo } from "react"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { getRarityDeets } from "../../../../helpers"
import { useMediaQuery, CircularProgress, Stack, Typography, Box } from "@mui/material"
import { ItemType, MarketplaceBuyAuctionItem } from "../../../../types/marketplace"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { ClipThing } from "../../../Common/ClipThing"
import { Masonry } from "@mui/lab"
import { ImagesPreview } from "../../Common/MarketDetails/ImagesPreview"
import { UserInfo } from "../../Common/MarketDetails/UserInfo"
import { SoldDetails } from "../../Common/MarketDetails/SoldDetails"
import { BuyNowDetails } from "../../Common/MarketDetails/BuyNowDetails"
import { AuctionDetails } from "../../Common/MarketDetails/AuctionDetails"
import { Dates } from "../../Common/MarketDetails/Dates"
import { ManageListing } from "../../Common/MarketDetails/ManageListing"
import { WeaponStatsDetails } from "./WeaponStatsDetails"
import { Weapon } from "../../../../types"

export const WeaponMarketDetails = ({ id }: { id: string }) => {
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
    useEffect(() => {
        ;(async () => {
            try {
                if (!marketItem || !marketItem.weapon?.id) return
                const resp = await send<Weapon>(GameServerKeys.GetWeaponDetails, {
                    weapon_id: marketItem.weapon.id,
                })

                if (!resp) return
                setWeaponDetails(resp)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get weapon details."
                setLoadError(message)
                console.error(err)
            }
        })()
    }, [marketItem, send])

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
                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                    </Stack>
                </Stack>
            )
        }

        return <WeaponMarketDetailsInner marketItem={marketItem} weaponDetails={weaponDetails} primaryColor={primaryColor} />
    }, [loadError, marketItem, weaponDetails, primaryColor])

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
            <Stack sx={{ height: "100%" }}>{content}</Stack>
        </ClipThing>
    )
}

interface WeaponMarketDetailsInnerProps {
    marketItem: MarketplaceBuyAuctionItem
    weaponDetails?: Weapon
    primaryColor: string
}

const WeaponMarketDetailsInner = ({ marketItem, weaponDetails, primaryColor }: WeaponMarketDetailsInnerProps) => {
    const below780 = useMediaQuery("(max-width:780px)")
    const [isTimeEnded, toggleIsTimeEnded] = useToggle()
    const rarityDeets = useMemo(() => getRarityDeets(marketItem.collection_item?.tier || ""), [marketItem.collection_item?.tier])

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
                <Box
                    sx={{
                        pt: "2rem",
                        pb: "3.8rem",
                        px: "3rem",
                    }}
                >
                    <Masonry columns={below780 ? 1 : 2} spacing={4}>
                        <ImagesPreview
                            media={[
                                {
                                    imageUrl: weaponDetails?.image_url,
                                    videoUrl: weaponDetails?.animation_url,
                                },
                            ]}
                            primaryColor={primaryColor}
                        />

                        <Stack spacing="2rem" sx={{ pb: "1rem", minHeight: "65rem" }}>
                            <Box>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    sx={{ color: primaryColor, fontFamily: fonts.nostromoBold, span: { color: rarityDeets.color, fontFamily: "inherit" } }}
                                >
                                    WEAPON | <span>{rarityDeets.label}</span>
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
