import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useHistory } from "react-router-dom"
import { FancyButton } from "../.."
import { WarMachineIconPNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { ItemType, ListingType } from "../../../types/marketplace"
import { ClipThing } from "../../Common/ClipThing"
import { AssetToSell } from "./AssetToSell/AssetToSell"
import { ItemTypeSelect } from "./ItemTypeSelect"
import { ListingTypeSelect } from "./ListingTypeSelect"
import { PricingInput } from "./PricingInput"

export interface AssetToSellStruct {
    id: string
    imageUrl: string
    videoUrl: string
    label: string
    description?: string
    tier?: string
}

export const itemTypes: {
    label: string
    value: ItemType
}[] = [
    { label: "War Machine", value: ItemType.WarMachine },
    { label: "Keycard", value: ItemType.Keycards },
    { label: "Mystery Crate", value: ItemType.MysteryCrate },
]

export const listingTypes: {
    label: string
    value: ListingType
}[] = [
    { label: "Buyout", value: ListingType.Buyout },
    { label: "Auction", value: ListingType.Auction },
    { label: "Dutch Auction", value: ListingType.DutchAuction },
]

export const SellItem = () => {
    const theme = useTheme()
    const history = useHistory()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [submitting, toggleSubmitting] = useToggle()
    const [submitError, setSubmitError] = useState<string>()

    // Form states
    const [itemType, setItemType] = useState<ItemType>()
    const [assetToSell, setAssetToSell] = useState<AssetToSellStruct>()
    const [listingType, setListingType] = useState<ListingType>()
    // Buyout
    const [buyoutPrice, setBuyoutPrice] = useState<string>("")
    // Auction
    const [reservePrice, setReservePrice] = useState<string>("")
    // Dutch auction
    const [startingPrice, setStartingPrice] = useState<string>("")
    const [dropRate, setDropRate] = useState<string>("")

    // Others
    const primaryColor = theme.factionTheme.primary

    const isFormReady = useCallback(() => {
        return itemType && assetToSell && listingType && (buyoutPrice || reservePrice || (startingPrice && dropRate))
    }, [assetToSell, buyoutPrice, dropRate, itemType, listingType, reservePrice, startingPrice])

    const submitHandler = useCallback(async () => {
        if (!isFormReady()) return

        const isKeycard = itemType === ItemType.Keycards

        const hasBuyout = listingType === ListingType.Buyout || (listingType === ListingType.Auction && !!buyoutPrice)
        const hasAuction = listingType === ListingType.Auction
        const hasDutchAuction = listingType === ListingType.DutchAuction

        let itemTypePayload: string = ""
        if (itemType === ItemType.WarMachine) {
            itemTypePayload = "mech"
        } else if (itemType === ItemType.MysteryCrate) {
            itemTypePayload = "mystery_crate"
        }

        try {
            toggleSubmitting(true)
            await send(isKeycard ? GameServerKeys.MarketplaceSalesKeycardCreate : GameServerKeys.MarketplaceSalesCreate, {
                item_type: itemTypePayload,
                item_id: assetToSell?.id,
                has_buyout: hasBuyout,
                has_auction: hasAuction,
                has_dutch_auction: hasDutchAuction,
                asking_price: hasBuyout ? buyoutPrice : hasDutchAuction ? startingPrice : undefined,
                auction_reserved_price: (hasAuction || hasDutchAuction) && reservePrice ? reservePrice : undefined,
                dutch_auction_drop_rate: hasDutchAuction && dropRate ? dropRate : undefined,
            })
            setSubmitError(undefined)
            history.push("/marketplace")
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to purchase item."
            setSubmitError(message)
            console.error(err)
        } finally {
            toggleSubmitting(false)
        }
    }, [assetToSell?.id, buyoutPrice, dropRate, history, isFormReady, itemType, listingType, reservePrice, send, startingPrice, toggleSubmitting])

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

                    <Stack alignItems="flex-end" spacing=".3rem" sx={{ ml: "auto" }}>
                        <FancyButton
                            loading={submitting}
                            disabled={!isFormReady()}
                            excludeCaret
                            clipThingsProps={{
                                clipSize: "9px",
                                backgroundColor: colors.green,
                                opacity: 1,
                                border: { isFancy: true, borderColor: colors.green, borderThickness: "2px" },
                                sx: { position: "relative" },
                            }}
                            sx={{ px: "4rem", py: ".6rem", color: "#FFFFFF" }}
                            onClick={submitHandler}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#FFFFFF",
                                    fontFamily: fonts.nostromoHeavy,
                                }}
                            >
                                SUBMIT
                            </Typography>
                        </FancyButton>

                        {submitError && (
                            <Typography
                                sx={{
                                    color: colors.red,
                                    fontWeight: "fontWeightBold",
                                }}
                            >
                                {submitError}
                            </Typography>
                        )}
                    </Stack>
                </Stack>
                <Box
                    sx={{
                        pointerEvents: submitting ? "none" : "unset",
                        opacity: submitting ? 0.4 : 1,
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
                        <Stack spacing="4rem" sx={{ px: "3rem", py: "1.8rem" }}>
                            {/* Item type select */}
                            <ItemTypeSelect itemType={itemType} setItemType={setItemType} setAssetToSell={setAssetToSell} setListingType={setListingType} />

                            {/* Asset to sell */}
                            <AssetToSell itemType={itemType} assetToSell={assetToSell} setAssetToSell={setAssetToSell} />

                            {/* Listing type select */}
                            <ListingTypeSelect itemType={itemType} listingType={listingType} setListingType={setListingType} />

                            {/* Pricing inputs */}
                            {(listingType === ListingType.Buyout || listingType === ListingType.Auction) && (
                                <PricingInput
                                    price={buyoutPrice}
                                    setPrice={setBuyoutPrice}
                                    question="Buyout Price"
                                    description="A buyer can pay this amount to immediately purchase your item."
                                    placeholder="Enter buyout price..."
                                />
                            )}

                            {listingType === ListingType.Auction && (
                                <>
                                    <PricingInput
                                        price={reservePrice}
                                        setPrice={setReservePrice}
                                        question="Reserve Price"
                                        description="Set a minimum price that you will allow the item to sell. The item will not sell if it doesn't meet the reserve price."
                                        placeholder="Enter reserve price..."
                                    />
                                </>
                            )}

                            {listingType === ListingType.DutchAuction && (
                                <>
                                    <PricingInput
                                        price={startingPrice}
                                        setPrice={setStartingPrice}
                                        question="Starting Price"
                                        description="The dutch auction will start at the set price and reduce every 24 hours until a user purchases the item."
                                        placeholder="Enter starting price..."
                                    />
                                    <PricingInput
                                        price={dropRate}
                                        setPrice={setDropRate}
                                        question="Drop Rate"
                                        description="This is the amount to reduce by every 24 hours."
                                        placeholder="Enter drop rate..."
                                    />
                                    <PricingInput
                                        price={reservePrice}
                                        setPrice={setReservePrice}
                                        question="Reserve Price"
                                        description="Set a minimum price that you will allow the item to sell. The item will not sell if it doesn't meet the reserve price."
                                        placeholder="Enter reserve price..."
                                    />
                                </>
                            )}
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
