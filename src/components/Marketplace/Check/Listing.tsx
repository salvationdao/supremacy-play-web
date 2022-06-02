import { useState, useEffect, useCallback } from "react"
import { useHistory, useParams, Redirect } from "react-router-dom"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { usePagination } from "../../../hooks"
import { Stack, Tabs, Tab, Box, Typography, TextField, InputAdornment, Alert, Pagination, Select, MenuItem, Modal, Skeleton } from "@mui/material"
import { ClipThing, FancyButton } from "../../"
import { colors, fonts } from "../../../theme/theme"
import { MarketplaceMechItem, ItemType, ItemTypeInfo, SortType } from "../../../types/marketplace"
import { SvgWallet, SvgSupToken } from "../../../assets"

import SearchIcon from "@mui/icons-material/Search"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked"
import { GameServerKeys } from "../../../keys"
import { getRarityDeets, truncate, snakeToSlug } from "../../../helpers"

interface Props {
    search: string
    rarities: string[]
    sort: SortType
    onSearchChange: React.Dispatch<React.SetStateAction<string>>
    onSortChange: React.Dispatch<React.SetStateAction<SortType>>
}

/**
 * Displays the Marketplace Sales Item Listing section.
 */
export const MarketplaceListing = (props: Props) => {
    const { search, rarities, sort } = props
    const { push, location } = useHistory()
    const { type } = useParams<{ type: string }>()

    // List
    const [assetList, setAssetList] = useState<MarketplaceMechItem[]>([])
    const [error, setError] = useState<string | null>(null)
    const [buyError, setBuyError] = useState<string | null>(null)
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { page, changePage, totalItems, setTotalItems, pageSize } = usePagination({ pageSize: 12, page: 1 })

    const listQuery = useCallback(async () => {
        try {
            // TODO: Handle alpha sort type
            let sortDir = "asc"
            switch (sort) {
                case SortType.AlphabeticalReverse:
                case SortType.NewestFirst:
                    sortDir = "desc"
            }

            const resp = await send<{ total: number; records: MarketplaceMechItem[] }>(GameServerKeys.MarketplaceSalesList, {
                page_number: page,
                page_size: pageSize,
                search: search,
                rarities: rarities,
                sort_dir: sortDir,
            })
            setTotalItems(resp.total)
            setAssetList(resp.records)
            setError(null)
        } catch (err) {
            setError(err as string)
        }
    }, [send, search, rarities, sort, page, pageSize, setTotalItems])

    useEffect(() => {
        listQuery()
    }, [listQuery])

    // Buying Item
    const [targetBuyItem, setTargetBuyItem] = useState<MarketplaceMechItem | null>(null)

    const confirmBuyCloseHandler = async (confirmBuy: boolean) => {
        if (!targetBuyItem) return
        if (!confirmBuy) {
            setTargetBuyItem(null)
            return
        }

        try {
            await send<{ total: number; records: MarketplaceMechItem[] }>(GameServerKeys.MarketplaceSalesBuy, {
                item_id: targetBuyItem.id,
            })
            setTargetBuyItem(null)
            setBuyError(null)
            listQuery()
        } catch (err) {
            setBuyError(err as string)
        }
    }

    // Render
    if (!type) {
        return <Redirect to={`/marketplace/${snakeToSlug(ItemType.WarMachine)}`} />
    }
    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: colors.red,
                borderThickness: "0.125rem",
            }}
            backgroundColor="#101019"
            sx={{
                flexGrow: 1,
                width: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "100%",
                }}
            >
                <Tabs
                    value={ItemTypeInfo.findIndex((t) => location.pathname === `/marketplace/${t.slug}`)}
                    onChange={(_, newValue) => {
                        const tab = ItemTypeInfo[newValue]
                        if (tab) {
                            push(`/marketplace/${tab?.slug}`)
                        }
                    }}
                    variant="fullWidth"
                >
                    {ItemTypeInfo.map((t, i) => (
                        <Tab
                            key={`listing-item-type-option-${i}`}
                            label={t.label}
                            value={i}
                            sx={{
                                flex: 1,
                                fontFamily: fonts.nostromoBlack,
                            }}
                        />
                    ))}
                </Tabs>
                <ClipThing
                    clipSize="10px"
                    border={{
                        borderColor: colors.red,
                        borderThickness: "0.125rem",
                    }}
                    backgroundColor="#101019"
                    sx={{
                        position: "relative",
                        flexGrow: 1,
                        marginLeft: "-0.125rem",
                        width: "calc(100% + 0.25rem)",
                        height: "calc(100% + 0.25rem)",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            overflowY: "auto",
                            p: "1rem",
                        }}
                    >
                        <ListSearchAndSortFilter {...props} />
                        {error && <Alert severity="error">{error}</Alert>}
                        {!error && <ListItems items={assetList} onBuyClick={(item) => setTargetBuyItem(item)} />}
                        <Pagination page={page} count={totalItems} color="primary" onChange={(_, newPageNumber) => changePage(newPageNumber)} />
                    </Box>
                </ClipThing>
            </Box>

            {targetBuyItem && <ConfirmBuyModal item={targetBuyItem} errorMessage={buyError} onClose={confirmBuyCloseHandler} />}
        </ClipThing>
    )
}

/**
 * Display search and sort options for listing page.
 */
const ListSearchAndSortFilter = (props: Props) => {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", padding: "1rem 0.5rem" }}>
            <TextField
                placeholder="Search"
                type="text"
                hiddenLabel
                size="small"
                value={props.search}
                onChange={(e) => props.onSearchChange(e.currentTarget.value)}
                sx={{
                    borderRadius: 1,
                    boxShadow: 1,
                    width: "33.33%",
                    maxWidth: "500px",
                    minWidth: "250px",
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
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                    }}
                >
                    Sort
                </Typography>
                <Select
                    value={props.sort}
                    onChange={(e) => props.onSortChange(e.target.value as SortType)}
                    sx={{
                        ml: "1rem",
                        width: "150px",
                    }}
                >
                    <MenuItem value={SortType.OldestFirst}>Oldest First</MenuItem>
                    <MenuItem value={SortType.NewestFirst}>Newest First</MenuItem>
                    <MenuItem value={SortType.Alphabetical}>Name: Alphabetical</MenuItem>
                    <MenuItem value={SortType.AlphabeticalReverse}>Name: Alphabetical (reverse)</MenuItem>
                </Select>
            </Box>
        </Box>
    )
}

/** Props for <ListItems>. */
interface ListItemsProps {
    items: MarketplaceMechItem[]
    onBuyClick: (item: MarketplaceMechItem) => void
}

/**
 * Displays a list of items for sale.
 */
const ListItems = ({ items, onBuyClick }: ListItemsProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexGrow: 1,
                flexDirection: "column",
                rowGap: "1rem",
                p: "0.5rem",
            }}
        >
            {items.map((i) => (
                <ListItem key={`item-${i.id}`} item={i} onBuyClick={() => onBuyClick(i)} />
            ))}
            {items.length === 0 && <Typography sx={{ textAlign: "center" }}>No items found.</Typography>}
        </Box>
    )
}

/** Props for <ListItem>. */
interface ListItemProps {
    item: MarketplaceMechItem
    onBuyClick: () => void
}

/**
 * Displays a single listed item for sale.
 */
const ListItem = ({ item, onBuyClick }: ListItemProps) => {
    const rarity = item.collection ? getRarityDeets(item.collection.tier) : null

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: colors.red,
                borderThickness: "0.125rem",
            }}
            backgroundColor="#110815"
            sx={{
                p: "1rem",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    columnGap: "2rem",
                    justifyContent: "space-between",
                }}
            >
                {item.collection && (
                    <Box
                        sx={{
                            width: "73px",
                            height: "64px",
                            backgroundImage: item.collection ? `url(${item.collection.image_url})` : undefined,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    />
                )}
                {!item.collection && <Skeleton variant="rectangular" width={73} height={64} />}

                <Stack spacing={"0.5rem"} sx={{ flexGrow: 1 }}>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        {item.mech?.name || item.mech?.label || "Unknown Asset Name"}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontFamily: fonts.nostromoMedium,
                            color: rarity?.color,
                        }}
                    >
                        {rarity ? rarity.label : "???"}
                    </Typography>
                    <Stack direction={"row"} sx={{ color: "white" }} spacing={"0.5rem"}>
                        <RadioButtonCheckedIcon sx={{ color: colors.red }} />
                        <RadioButtonUncheckedIcon sx={{ color: colors.red }} />
                        <RadioButtonUncheckedIcon sx={{ color: colors.red }} />
                        <RadioButtonUncheckedIcon sx={{ color: colors.red }} />
                        <HighlightOffIcon sx={{ color: colors.lightGrey }} />
                        <HighlightOffIcon sx={{ color: colors.lightGrey }} />
                        <HighlightOffIcon sx={{ color: colors.lightGrey }} />
                        <HighlightOffIcon sx={{ color: colors.lightGrey }} />
                    </Stack>
                </Stack>

                <Stack>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        Seller
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontFamily: fonts.nostromoMedium,
                        }}
                    >
                        {item.owner?.username || "System"}
                    </Typography>
                    {item.owner && (
                        <Typography
                            sx={{
                                fontSize: "12px",
                                fontFamily: fonts.nostromoLight,
                            }}
                        >
                            {truncate(item.owner?.public_address, 10)}
                        </Typography>
                    )}
                </Stack>

                <Stack>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontFamily: fonts.nostromoBlack,
                            marginBottom: "1rem",
                        }}
                    >
                        Offer Ends In
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontFamily: fonts.nostromoMedium,
                        }}
                    >
                        1D 2H 16M 12S
                    </Typography>
                </Stack>

                <Stack>
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontFamily: fonts.nostromoBlack,
                            marginBottom: "1rem",
                            textAlign: "center",
                        }}
                    >
                        Fixed Price
                    </Typography>
                    <Stack
                        direction="row"
                        sx={{
                            mr: ".3rem",
                            px: ".7rem",
                            py: ".6rem",
                            cursor: "pointer",
                            borderRadius: 1,
                            ":active": {
                                opacity: 0.8,
                            },
                        }}
                    >
                        <SvgSupToken size="1.9rem" fill={colors.yellow} sx={{ mr: ".2rem", pb: ".4rem" }} />
                        <Typography sx={{ fontFamily: fonts.nostromoBold, lineHeight: 1 }}>{item.buyout_price}</Typography>
                    </Stack>
                </Stack>

                <Box sx={{ my: "auto" }}>
                    <FancyButton
                        onClick={onBuyClick}
                        clipThingsProps={{
                            clipSize: "10px",
                            backgroundColor: "#368E43",
                        }}
                        size="small"
                    >
                        <Stack direction={"row"} sx={{ mx: "10px" }}>
                            <SvgWallet size={"1.5rem"} />
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    fontFamily: fonts.nostromoBlack,
                                    marginLeft: "1rem",
                                }}
                            >
                                Buy Now
                            </Typography>
                        </Stack>
                    </FancyButton>
                </Box>

                {/* <FancyButton
                    clipThingsProps={{
                        clipSize: "10px",
                        backgroundColor: "#000000",
                        border: {
                            borderColor: "white",
                            borderThickness: "0.125rem",
                        },
                    }}
                    size="small"
                >
                    <Stack direction={"row"} sx={{ mx: "10px" }}>
                        <SvgHammer size={"1.5rem"} />
                        <Typography
                            sx={{
                                fontSize: "12px",
                                fontFamily: fonts.nostromoBlack,
                                marginLeft: "1rem",
                            }}
                        >
                            Place Bid
                        </Typography>
                    </Stack>
                </FancyButton> */}
            </Box>
        </ClipThing>
    )
}

/** Props for <ConfirmBuyModal>. */
interface ConfirmBuyModalProps {
    item: MarketplaceMechItem
    errorMessage: string | null
    onClose: (confirmed: boolean) => void
}

/**
 * Displays a modal that asks whether to buy selected item.
 */
const ConfirmBuyModal = ({ item, errorMessage, onClose }: ConfirmBuyModalProps) => {
    return (
        <Modal open onClose={() => onClose(false)}>
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
                            Confirm Buy
                        </Typography>
                        <Typography sx={{ px: "1rem" }}>
                            Are you sure you want to buy <strong>{item.mech?.label || item.mech?.name}?</strong>
                        </Typography>
                    </Box>

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
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: "1rem" }}>
                        <FancyButton
                            onClick={() => onClose(false)}
                            clipThingsProps={{
                                clipSize: "7px",
                                sx: { mt: "2rem", width: "calc(50% - 0.5rem)", minWidth: "100px" },
                                backgroundColor: colors.darkNavy,
                                border: {
                                    borderColor: colors.darkNavy,
                                },
                            }}
                            sx={{
                                color: "white",
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            Cancel
                        </FancyButton>
                        <FancyButton
                            onClick={() => onClose(true)}
                            clipThingsProps={{
                                clipSize: "7px",
                                sx: { mt: "2rem", width: "calc(50% - 0.5rem)", minWidth: "100px" },
                                backgroundColor: "#368E43",
                                border: {
                                    borderColor: "#368E43",
                                },
                            }}
                            sx={{
                                color: "white",
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            Buy Now
                        </FancyButton>
                    </Box>
                </ClipThing>
            </Stack>
        </Modal>
    )
}
