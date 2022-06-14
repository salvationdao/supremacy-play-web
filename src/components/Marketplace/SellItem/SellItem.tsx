import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { FancyButton } from "../.."
import { SvgSupToken, WarMachineIconPNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useToggle, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Keycard, MechBasic, MysteryCrate } from "../../../types"
import { ItemType } from "../../../types/marketplace"
import { ClipThing } from "../../Common/ClipThing"
import { AssetToSell } from "./AssetToSell/AssetToSell"
import { ItemTypeSelect } from "./ItemTypeSelect"
import { PricingInput } from "./PricingInput"

export interface AssetToSellStruct {
    id: string
    mech?: MechBasic
    keycard?: Keycard
    mysteryCrate?: MysteryCrate
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
    const history = useHistory()
    const query = useUrlQuery()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [submitting, toggleSubmitting] = useToggle()
    const [submitError, setSubmitError] = useState<string>()

    // Form states
    const [itemType, setItemType] = useState<ItemType | undefined>(query.get("item-type") as ItemType)
    const [assetToSell, setAssetToSell] = useState<AssetToSellStruct | undefined>({ id: query.get("asset-id") || "" })
    // Buyout
    const [buyoutPrice, setBuyoutPrice] = useState<string>("")
    // Auction
    const [reservePrice, setReservePrice] = useState<string>("")
    // Dutch auction
    const [startingPrice, setStartingPrice] = useState<string>("")
    const [dropRate, setDropRate] = useState<string>("")

    // Others
    const [listingFee, setListingFee] = useState<number>(10)
    const primaryColor = theme.factionTheme.primary

    useEffect(() => {
        let fee = 10
        if (reservePrice) fee += 5
        if (buyoutPrice && itemType !== ItemType.Keycards) fee += 5
        setListingFee(fee)
    }, [buyoutPrice, reservePrice, dropRate, itemType])

    const isFormReady = useCallback(() => {
        return itemType && assetToSell && (buyoutPrice || startingPrice)
    }, [assetToSell, buyoutPrice, itemType, startingPrice])

    const submitHandler = useCallback(async () => {
        if (!isFormReady()) return

        const isKeycard = itemType === ItemType.Keycards

        let itemTypePayload: string = ""
        if (itemType === ItemType.WarMachine) {
            itemTypePayload = "mech"
        } else if (itemType === ItemType.MysteryCrate) {
            itemTypePayload = "mystery_crate"
        }

        try {
            toggleSubmitting(true)
            setSubmitError(undefined)
            await send(isKeycard ? GameServerKeys.MarketplaceSalesKeycardCreate : GameServerKeys.MarketplaceSalesCreate, {
                item_type: itemTypePayload,
                item_id: assetToSell?.id,
                asking_price: buyoutPrice ? buyoutPrice : undefined,
                dutch_auction_drop_rate: !isKeycard && dropRate ? dropRate : undefined,
                auction_current_price: !isKeycard && startingPrice ? startingPrice : undefined,
                auction_reserved_price: !isKeycard && reservePrice ? reservePrice : undefined,
            })
            history.push("/marketplace")
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to purchase item."
            setSubmitError(message)
            console.error(err)
        } finally {
            toggleSubmitting(false)
        }
    }, [assetToSell?.id, buyoutPrice, dropRate, history, isFormReady, itemType, reservePrice, send, startingPrice, toggleSubmitting])

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

                {submitError && (
                    <Typography
                        sx={{
                            pt: "2rem",
                            px: "5rem",
                            color: colors.red,
                            fontWeight: "fontWeightBold",
                            userSelect: "text",
                        }}
                    >
                        {submitError}
                    </Typography>
                )}

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
                            <ItemTypeSelect itemType={itemType} setItemType={setItemType} setAssetToSell={setAssetToSell} />

                            {/* Asset to sell */}
                            <AssetToSell itemType={itemType} assetToSell={assetToSell} setAssetToSell={setAssetToSell} />

                            {/* Pricing inputs */}
                            {itemType !== ItemType.Keycards && (
                                <PricingInput
                                    price={startingPrice}
                                    setPrice={setStartingPrice}
                                    question="Auction Starting Price"
                                    description="This will allow buyers to bid on your item as an auction."
                                    placeholder="Enter auction starting price..."
                                />
                            )}

                            <PricingInput
                                price={buyoutPrice}
                                setPrice={setBuyoutPrice}
                                question="Buyout Price"
                                description="A buyer can pay this amount to immediately purchase your item."
                                placeholder="Enter buyout price..."
                            />

                            {itemType !== ItemType.Keycards && (
                                <>
                                    <PricingInput
                                        price={dropRate}
                                        setPrice={setDropRate}
                                        question="Price Drop / min (Optional)"
                                        description="The buyout price will reduce by this amount every minute until a buyer purchases the item."
                                        placeholder="Enter price drop..."
                                    />
                                    <PricingInput
                                        price={reservePrice}
                                        setPrice={setReservePrice}
                                        question="Reserve Price (Optional)"
                                        description="Set a minimum price that you are willing to sell the item. The item will not sell if it's lower than the reserve price."
                                        placeholder="Enter reserve price..."
                                    />
                                </>
                            )}
                        </Stack>
                    </Box>
                </Box>

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        px: "5rem",
                        py: "2rem",
                        backgroundColor: "#00000070",
                        borderTop: (theme) => `${theme.factionTheme.primary}70 1.5px solid`,
                    }}
                >
                    <Stack>
                        <Stack direction="row" alignItems="center">
                            <Typography sx={{ fontFamily: fonts.nostromoBlack, mr: ".8rem" }}>LISTING FEE:</Typography>
                            <SvgSupToken size="2.2rem" fill={colors.yellow} />
                            <Typography sx={{ fontFamily: fonts.nostromoBold }}>{listingFee}</Typography>
                        </Stack>

                        <Typography sx={{ color: colors.lightNeonBlue }}>There will be a 30% fee on the final sale value of your item.</Typography>
                    </Stack>

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
                </Stack>
            </Stack>
        </ClipThing>
    )
}
