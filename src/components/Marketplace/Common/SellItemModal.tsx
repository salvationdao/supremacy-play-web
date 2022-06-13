import React, { useEffect, useState } from "react"
import { Box, MenuItem, Modal, Pagination, Select, Stack, TextField, Typography, Alert, Skeleton, Tabs, Tab } from "@mui/material"
import { ClipThing } from "../../Common/ClipThing"
import { colors, fonts } from "../../../theme/theme"
import { usePagination } from "../../../hooks"
import { GameServerKeys } from "../../../keys"
import { MechBasic, MechDetails, Keycard, StorefrontMysteryCrate } from "../../../types"
import { SvgRobot, SvgSupToken } from "../../../assets"
import { FancyButton } from "../../Common/FancyButton"
import { ItemType, ItemTypeInfo, SaleType } from "../../../types/marketplace"
import { snakeToTitle } from "../../../helpers"
import { useGameServerCommandsUser, useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { SafePNG } from "../../../assets"

interface Props {
    onClose: () => void
}

interface GetAssetsResponse {
    mechs: MechBasic[]
    keycards: Keycard[]
    mystery_crates: StorefrontMysteryCrate[]
    total: number
}

/**
 * Sell Item Modal.
 */
export const SellItemModal = ({ onClose }: Props) => {
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // Item Type Selection
    const [selectedTab, setSelectedTab] = useState(0)
    const itemType = ItemTypeInfo[selectedTab]

    const [assetsList, setAssetsList] = useState<MechBasic[] | Keycard[] | StorefrontMysteryCrate[] | null>(null)
    const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
    const [saleType, setSaleType] = useState<SaleType>(SaleType.Buyout)
    const [askingPrice, setAskingPrice] = useState<string>("")
    const [auctionReservedPrice, setAuctionReservedPrice] = useState<string>("")
    const [dropRate, setDropRate] = useState<string>("")

    const askingPriceLabel = saleType === SaleType.DutchAuction ? "Starting Price" : "Buyout Price"

    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize } = usePagination({ pageSize: 12, page: 0 })
    const { state: stateUser, send: sendUser } = useGameServerCommandsUser("/user_commander")
    const { state: stateFaction, send: sendFaction } = useGameServerCommandsFaction("/faction_commander")

    useEffect(() => {
        setAskingPrice("")
        setAuctionReservedPrice("")
        setDropRate("")
    }, [saleType])

    useEffect(() => {
        // Force key cards to be Buyout types
        if (itemType.name === ItemType.Keycards) {
            setSaleType(SaleType.Buyout)
        }
    }, [itemType])

    /** Submit handler */
    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        if (stateFaction !== WebSocket.OPEN) return

        const isKeycard = itemType.name === ItemType.Keycards

        const hasBuyout = saleType === SaleType.Buyout || saleType === SaleType.AuctionOrBuyout
        const hasAuction = saleType === SaleType.Auction || saleType === SaleType.AuctionOrBuyout
        const hasDutchAuction = saleType === SaleType.DutchAuction

        let itemTypePayload: string | undefined = undefined
        if (itemType.name === ItemType.WarMachine) {
            itemTypePayload = "mech"
        } else if (itemType.name === ItemType.MysteryCrate) {
            itemTypePayload = "mystery_crate"
        }

        try {
            await sendFaction(isKeycard ? GameServerKeys.MarketplaceSalesKeycardCreate : GameServerKeys.MarketplaceSalesCreate, {
                item_type: itemTypePayload,
                item_id: selectedAsset,
                has_buyout: hasBuyout,
                has_auction: hasAuction,
                has_dutch_auction: hasDutchAuction,
                asking_price: (hasBuyout || hasDutchAuction) && askingPrice ? askingPrice : undefined,
                auction_reserved_price: (hasAuction || hasDutchAuction) && auctionReservedPrice ? auctionReservedPrice : undefined,
                dutch_auction_drop_rate: hasDutchAuction && dropRate ? dropRate : undefined,
            })
            onClose()
        } catch (err) {
            setErrorMessage(err as string)
        } finally {
            setSubmitting(false)
        }
    }

    // Get assets
    useEffect(() => {
        if (stateUser !== WebSocket.OPEN) return
        ;(async () => {
            const key = (() => {
                switch (itemType.name) {
                    case ItemType.MysteryCrate:
                        return GameServerKeys.GetPlayerMysteryCrates
                    case ItemType.Keycards:
                        return GameServerKeys.GetKeycards
                    default:
                        return GameServerKeys.GetMechs
                }
            })()

            try {
                const resp = await sendUser<
                    GetAssetsResponse,
                    {
                        page: number
                        page_size: number
                        exclude_opened: boolean
                        exclude_market_listed: boolean
                        exclude_market_locked: boolean
                    }
                >(key, {
                    page, // start with 0
                    page_size: pageSize,
                    exclude_opened: true,
                    exclude_market_listed: true,
                    exclude_market_locked: true,
                })
                if (!resp) return
                if (itemType.name === ItemType.WarMachine) {
                    setAssetsList(resp.mechs)
                } else if (itemType.name === ItemType.MysteryCrate) {
                    setAssetsList(resp.mystery_crates)
                } else {
                    setAssetsList(resp.keycards)
                }
                setTotalItems(resp.total)
            } catch (err) {
                console.error("failed to load items", err)
            }
        })()
    }, [sendUser, stateUser, itemType, page, pageSize, setTotalItems])

    // Render
    if (!itemType) {
        console.error("unable to determine selected item type from tab")
        return null
    }
    return (
        <Modal open onClose={() => onClose()}>
            <Stack
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "63rem",
                    maxWidth: "82rem",
                    boxShadow: 6,
                }}
            >
                <ClipThing
                    clipSize="0"
                    border={{
                        isFancy: true,
                        borderColor: "#FFFFFF",
                        borderThickness: ".15rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={colors.darkNavyBlue}
                >
                    <Box sx={{ position: "relative", px: "1rem", pt: "1.6rem" }}>
                        <Typography variant="h6" sx={{ mb: "1rem", px: "1rem", fontFamily: fonts.nostromoBlack }}>
                            SELL YOUR ASSETS
                        </Typography>
                    </Box>
                    <Stack
                        direction="row"
                        spacing=".96rem"
                        alignItems="center"
                        sx={{
                            position: "relative",
                            pl: "2rem",
                            pr: "4.8rem",
                            height: `${5}rem`,
                            background: `${colors.assetsBanner}65`,
                            boxShadow: 1.5,
                        }}
                    >
                        <SvgRobot size="2.3rem" fill={colors.text} sx={{ pb: ".56rem" }} />
                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                            SELECT ITEM
                        </Typography>
                    </Stack>
                    <Tabs
                        value={selectedTab}
                        onChange={(_, newValue) => {
                            setSelectedTab(newValue)
                        }}
                        variant="fullWidth"
                    >
                        {Object.values(ItemType).map((t, i) => (
                            <Tab
                                key={`listing-item-type-option-${i}`}
                                label={snakeToTitle(t)}
                                value={i}
                                sx={{
                                    flex: 1,
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            />
                        ))}
                    </Tabs>
                    <Typography variant="body2" sx={{ mt: "1.6rem", px: "1rem" }}>
                        <strong>DISPLAYING:</strong> {assetsList?.length || 0} of {totalItems}
                    </Typography>
                    <ClipThing
                        clipSize="10px"
                        border={{
                            borderColor: colors.auction,
                            borderThickness: "0.125rem",
                        }}
                        backgroundColor="#110815"
                        sx={{
                            m: "1rem",
                            p: "1rem",
                        }}
                    >
                        <Box
                            sx={{
                                overflowY: "auto",
                                height: "40vh",
                                "::-webkit-scrollbar": {
                                    height: ".3rem",
                                },
                                "::-webkit-scrollbar-track": {
                                    background: "#FFFFFF15",
                                    borderRadius: 3,
                                },
                                "::-webkit-scrollbar-thumb": {
                                    background: "#FFFFFF50",
                                    borderRadius: 3,
                                },
                            }}
                        >
                            {assetsList?.map((a, i) => (
                                <AssetItem
                                    key={`item-sell-index-${i}`}
                                    item={a}
                                    selected={selectedAsset === a.id}
                                    onSelected={(item) => setSelectedAsset(item.id)}
                                />
                            ))}
                        </Box>
                    </ClipThing>
                    {assetsList && totalPages > 1 && (
                        <Box
                            sx={{
                                px: "1rem",
                                py: ".5rem",
                                backgroundColor: "#00000050",
                            }}
                        >
                            <Pagination size="small" count={totalPages} page={page} onChange={(_, p) => changePage(p)} showFirstButton showLastButton />
                        </Box>
                    )}

                    {/* Sell Item Pricing Section */}
                    <Stack
                        direction="row"
                        spacing=".96rem"
                        alignItems="center"
                        sx={{
                            position: "relative",
                            pl: "2rem",
                            pr: "4.8rem",
                            mt: "1rem",
                            height: `${5}rem`,
                            background: `${colors.assetsBanner}65`,
                            boxShadow: 1.5,
                        }}
                    >
                        <SvgRobot size="2.3rem" fill={colors.text} sx={{ pb: ".56rem" }} />
                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                            SALE OPTIONS
                        </Typography>
                    </Stack>
                    <Box
                        component={"form"}
                        onSubmit={submitHandler}
                        sx={{
                            p: "1rem",
                        }}
                    >
                        {errorMessage && (
                            <Alert
                                severity="error"
                                sx={{
                                    alignItems: "center",
                                    mb: "1rem",
                                    ".MuiAlert-message": {
                                        pt: "1.12rem",
                                        fontSize: "1.3rem",
                                        fontWeight: "fontWeightBold",
                                        fontFamily: fonts.nostromoBold,
                                    },
                                }}
                            >
                                {errorMessage}
                            </Alert>
                        )}

                        {itemType.name !== ItemType.Keycards && (
                            <>
                                <Typography sx={{ lineHeight: 1, mb: "1rem", fontWeight: 600 }}>SALE TYPE:</Typography>
                                <Select
                                    sx={{
                                        borderRadius: 0.5,
                                        "&:hover": {
                                            backgroundColor: colors.darkNavy,
                                        },
                                        "& .MuiSelect-outlined": { px: ".8rem", pt: ".48rem", pb: 0 },
                                    }}
                                    fullWidth
                                    defaultValue={SaleType.Buyout}
                                    value={saleType}
                                    onChange={(e) => {
                                        setSaleType(e.target.value as SaleType)
                                    }}
                                    MenuProps={{
                                        variant: "menu",
                                        sx: {
                                            "&& .Mui-selected": {
                                                backgroundColor: colors.darkerNeonBlue,
                                            },
                                        },
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: colors.darkNavy,
                                                borderRadius: 0.5,
                                            },
                                        },
                                    }}
                                >
                                    {Object.values(SaleType).map((x) => {
                                        return (
                                            <MenuItem
                                                key={`sell-item-type-option-${x}`}
                                                value={x}
                                                sx={{
                                                    "&:hover": {
                                                        backgroundColor: colors.darkNavyBlue,
                                                    },
                                                }}
                                            >
                                                <Typography textTransform="uppercase" variant="body2">
                                                    {snakeToTitle(x)}
                                                </Typography>
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </>
                        )}

                        {saleType !== SaleType.Auction && (
                            <>
                                <Typography sx={{ lineHeight: 1, mt: "2rem", mb: "1rem", fontWeight: 600 }}>{askingPriceLabel.toUpperCase()}:</Typography>
                                <TextField
                                    placeholder={askingPriceLabel}
                                    type="number"
                                    hiddenLabel
                                    size="small"
                                    fullWidth
                                    value={askingPrice}
                                    onChange={(e) => setAskingPrice(e.currentTarget.value)}
                                    sx={{
                                        borderRadius: 1,
                                        boxShadow: 1,
                                        "& .MuiInputBase-root": {
                                            backgroundColor: "#49494970",
                                            fontFamily: fonts.nostromoBlack,
                                            pt: "1rem",
                                            pb: ".8rem",
                                        },
                                        "& .MuiInputBase-input": {
                                            pt: 0,
                                            pb: 0,
                                        },
                                        ".Mui-disabled": {
                                            WebkitTextFillColor: "unset",
                                            color: "#FFFFFF70",
                                        },
                                        ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: `${colors.globalChat} !important`,
                                        },
                                        textarea: {
                                            color: "#FFFFFF",
                                            overflow: "hidden",
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: <SvgSupToken size="1.9rem" fill={colors.yellow} sx={{ mr: ".2rem", pb: ".4rem" }} />,
                                    }}
                                />
                            </>
                        )}
                        {(saleType === SaleType.Auction || saleType === SaleType.AuctionOrBuyout || saleType === SaleType.DutchAuction) && (
                            <>
                                <Typography sx={{ lineHeight: 1, mt: "2rem", mb: "1rem", fontWeight: 600 }}>AUCTION RESERVED PRICE:</Typography>
                                <TextField
                                    placeholder="Auction Reserved Price"
                                    type="number"
                                    hiddenLabel
                                    size="small"
                                    fullWidth
                                    value={auctionReservedPrice}
                                    onChange={(e) => setAuctionReservedPrice(e.currentTarget.value)}
                                    sx={{
                                        borderRadius: 1,
                                        boxShadow: 1,
                                        "& .MuiInputBase-root": {
                                            backgroundColor: "#49494970",
                                            fontFamily: fonts.nostromoBlack,
                                            pt: "1rem",
                                            pb: ".8rem",
                                        },
                                        "& .MuiInputBase-input": {
                                            pt: 0,
                                            pb: 0,
                                        },
                                        ".Mui-disabled": {
                                            WebkitTextFillColor: "unset",
                                            color: "#FFFFFF70",
                                        },
                                        ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: `${colors.globalChat} !important`,
                                        },
                                        textarea: {
                                            color: "#FFFFFF",
                                            overflow: "hidden",
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: <SvgSupToken size="1.9rem" fill={colors.yellow} sx={{ mr: ".2rem", pb: ".4rem" }} />,
                                    }}
                                />
                            </>
                        )}
                        {saleType === SaleType.DutchAuction && (
                            <>
                                <Typography sx={{ lineHeight: 1, mt: "2rem", mb: "1rem", fontWeight: 600 }}>PRICE DROP RATE:</Typography>
                                <TextField
                                    placeholder="Price Drop Rate (every hour)"
                                    type="number"
                                    hiddenLabel
                                    size="small"
                                    fullWidth
                                    value={dropRate}
                                    onChange={(e) => setDropRate(e.currentTarget.value)}
                                    sx={{
                                        borderRadius: 1,
                                        boxShadow: 1,
                                        "& .MuiInputBase-root": {
                                            backgroundColor: "#49494970",
                                            fontFamily: fonts.nostromoBlack,
                                            pt: "1rem",
                                            pb: ".8rem",
                                        },
                                        "& .MuiInputBase-input": {
                                            pt: 0,
                                            pb: 0,
                                        },
                                        ".Mui-disabled": {
                                            WebkitTextFillColor: "unset",
                                            color: "#FFFFFF70",
                                        },
                                        ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: `${colors.globalChat} !important`,
                                        },
                                        textarea: {
                                            color: "#FFFFFF",
                                            overflow: "hidden",
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: <SvgSupToken size="1.9rem" fill={colors.yellow} sx={{ mr: ".2rem", pb: ".4rem" }} />,
                                    }}
                                />
                            </>
                        )}
                        <FancyButton
                            type={"submit"}
                            disabled={!selectedAsset}
                            loading={submitting}
                            clipThingsProps={{
                                clipSize: "7px",
                                sx: { mt: "2rem", ml: "auto !important", width: "33.33%", minWidth: "100px" },
                                backgroundColor: colors.auction,
                                border: {
                                    borderColor: colors.auction,
                                },
                            }}
                            sx={{
                                color: "white",
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            Sell Item
                        </FancyButton>
                    </Box>
                </ClipThing>
            </Stack>
        </Modal>
    )
}

/** Props for <AssetItem>. */
interface AssetItemProps {
    item: AssetItem
    selected: boolean
    onSelected: (item: AssetItem) => void
}

/** Display Asset Item. */
const AssetItem = ({ item, selected, onSelected }: AssetItemProps) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const [mechDetails, setMechDetails] = useState<MechDetails | null>(null)

    useEffect(() => {
        if (!isAssetMech(item)) return
        ;(async () => {
            try {
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: item.id,
                })
                if (!resp) return
                setMechDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [item, send])

    // Render
    const label = isAssetKeycard(item) ? item.blueprints.label : item.label

    let name: string | undefined = undefined
    if (isAssetMech(item)) {
        name = item.name
    } else if (isAssetKeycard(item)) {
        name = item.blueprints.label
    }

    let image_url: string | undefined = undefined
    if (isAssetMech(item)) {
        image_url = mechDetails?.chassis_skin?.image_url
    } else if (isAssetMysteryCrate(item)) {
        image_url = item.image_url || SafePNG
    } else {
        image_url = item.blueprints.image_url
    }

    return (
        <Box
            onClick={!selected ? () => onSelected(item) : undefined}
            sx={{
                p: ".4rem",
                borderRadius: 0.2,
                cursor: !selected ? "pointer" : "unset",
                backgroundColor: selected ? "#FFFFFF20" : "unset",
                ":hover": {
                    backgroundColor: "#FFFFFF20",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    position: "relative",
                    alignSelf: "stretch",
                    py: ".8rem",
                    boxShadow: "inset 0 0 8px 6px #00000055",
                    overflow: "hidden",
                    gap: "1rem",
                    borderRadius: 0.5,
                }}
            >
                {image_url && (
                    <Box
                        sx={{
                            width: "5.5rem",
                            height: "5.5rem",
                            overflow: "hidden",
                            backgroundImage: `url(${image_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "left",
                            backgroundSize: "contain",
                        }}
                    />
                )}
                {!image_url && <Skeleton variant="rectangular" width="5.5rem" height="5.5rem" />}
                <Typography
                    variant="caption"
                    sx={{
                        fontFamily: fonts.nostromoBold,
                        letterSpacing: ".1rem",
                        fontSize: "1rem",
                        lineHeight: 1.25,
                        mt: ".6rem",
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {name || label}
                </Typography>
            </Box>
        </Box>
    )
}

type AssetItem = MechBasic | Keycard | StorefrontMysteryCrate

const isAssetMech = (item: AssetItem): item is MechBasic => {
    return (item as MechBasic).max_hitpoints !== undefined
}

const isAssetKeycard = (item: AssetItem): item is Keycard => {
    return (item as Keycard).blueprint_keycard_id !== undefined
}

const isAssetMysteryCrate = (item: AssetItem): item is StorefrontMysteryCrate => {
    return !isAssetMech(item) && !isAssetKeycard(item)
}
