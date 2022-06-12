import { Box, CircularProgress, IconButton, Modal, Pagination, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { ClipThing } from "../.."
import { KeycardPNG, SafePNG, SvgClose } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets } from "../../../helpers"
import { usePagination } from "../../../hooks"
import { useGameServerCommandsFaction, useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { Keycard, MechBasic, MechDetails, StorefrontMysteryCrate } from "../../../types"
import { ItemType } from "../../../types/marketplace"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { AssetToSellStruct, itemTypes } from "./SellItem"

interface GetAssetsResponse {
    mechs: MechBasic[]
    keycards: Keycard[]
    mystery_crates: StorefrontMysteryCrate[]
    total: number
}

export const AssetChooseModal = ({
    open,
    itemType,
    setAssetToSell,
    onClose,
}: {
    open: boolean
    itemType: ItemType
    setAssetToSell: React.Dispatch<React.SetStateAction<AssetToSellStruct | undefined>>
    onClose: () => void
}) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [ownedAssets, setOwnedAssets] = useState<MechBasic[] | Keycard[] | StorefrontMysteryCrate[]>()
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, setPageSize } = usePagination({ pageSize: 10, page: 1 })

    const itemTypeLabel = useMemo(() => itemTypes.find((i) => i.value === itemType)?.label, [itemType])
    const question = itemTypeLabel ? `Choose a ${itemTypeLabel}` : "Choose an item type"

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    // Get assets
    useEffect(() => {
        ;(async () => {
            let key = ""
            if (itemType === ItemType.WarMachine) {
                key = GameServerKeys.GetMechs
            } else if (itemType === ItemType.MysteryCrate) {
                key = GameServerKeys.GetPlayerMysteryCrates
            } else {
                key = GameServerKeys.GetKeycards
            }

            try {
                setIsLoading(true)
                const resp = await send<GetAssetsResponse>(key, {
                    page, // Starts with 0
                    page_size: pageSize,
                    exclude_opened: true,
                    exclude_market_listed: true,
                    exclude_market_locked: true,
                })

                if (!resp) return

                if (itemType === ItemType.WarMachine) {
                    setOwnedAssets(resp.mechs)
                } else if (itemType === ItemType.MysteryCrate) {
                    setOwnedAssets(resp.mystery_crates)
                } else {
                    setOwnedAssets(resp.keycards)
                }
                setTotalItems(resp.total)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get owned assets."
                setLoadError(message)
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [send, itemType, page, pageSize, setTotalItems])

    return (
        <Modal open={open} onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "75rem",
                    maxWidth: "calc(100vw - 18rem)",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: primaryColor,
                        borderThickness: ".3rem",
                    }}
                    corners={{
                        topLeft: true,
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={backgroundColor}
                >
                    <Stack
                        sx={{
                            position: "relative",
                            height: "96rem",
                            maxHeight: "calc(100vh - 18rem)",
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                px: "2.5rem",
                                pt: "2.4rem",
                                pb: "1.6rem",
                                borderBottom: `${primaryColor}70 1.5px solid`,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                {question}
                            </Typography>
                        </Box>

                        <TotalAndPageSizeOptions
                            countItems={ownedAssets?.length}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            changePage={changePage}
                        />

                        {loadError && (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                                    <Typography
                                        sx={{
                                            color: colors.red,
                                            fontFamily: fonts.nostromoBold,
                                            textAlign: "center",
                                        }}
                                    >
                                        {loadError}
                                    </Typography>
                                </Stack>
                            </Stack>
                        )}

                        {isLoading && !loadError && (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                                    <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                                </Stack>
                            </Stack>
                        )}

                        {!isLoading && !loadError && ownedAssets && ownedAssets.length > 0 && (
                            <Box
                                sx={{
                                    flex: 1,
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    ml: "1rem",
                                    mr: ".5rem",
                                    pr: ".5rem",
                                    my: "1rem",
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
                                    <Stack>
                                        {ownedAssets.map((a) => {
                                            return <OwnedAssetItem key={a.id} ownedAssetItem={a} setAssetToSell={setAssetToSell} onClose={onClose} />
                                        })}
                                    </Stack>
                                </Box>
                            </Box>
                        )}

                        {!isLoading && !loadError && ownedAssets && ownedAssets.length <= 0 && (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem" }}>
                                    <Typography
                                        sx={{
                                            px: "1.28rem",
                                            pt: "1.28rem",
                                            color: colors.grey,
                                            fontFamily: fonts.nostromoBold,
                                            userSelect: "text !important",
                                            opacity: 0.9,
                                            textAlign: "center",
                                        }}
                                    >
                                        {`You don't own any ${itemTypeLabel}s.`}
                                    </Typography>
                                </Stack>
                            </Stack>
                        )}

                        {totalPages > 1 && (
                            <Box
                                sx={{
                                    px: "1rem",
                                    py: ".7rem",
                                    borderTop: `${primaryColor}70 1.5px solid`,
                                    backgroundColor: "#00000070",
                                }}
                            >
                                <Pagination
                                    size="medium"
                                    count={totalPages}
                                    page={page}
                                    sx={{
                                        ".MuiButtonBase-root": { borderRadius: 0.8, fontFamily: fonts.nostromoBold },
                                        ".Mui-selected": {
                                            color: secondaryColor,
                                            backgroundColor: `${primaryColor} !important`,
                                        },
                                    }}
                                    onChange={(e, p) => changePage(p)}
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        )}
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}

const OwnedAssetItem = ({
    ownedAssetItem,
    setAssetToSell,
    onClose,
}: {
    ownedAssetItem: AssetItem
    setAssetToSell: React.Dispatch<React.SetStateAction<AssetToSellStruct | undefined>>
    onClose: () => void
}) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    useEffect(() => {
        if (!isAssetMech(ownedAssetItem)) return
        ;(async () => {
            try {
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: ownedAssetItem.id,
                })
                if (!resp) return
                setMechDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [ownedAssetItem, send])

    // Render
    let assetToSell: AssetToSellStruct
    if (isAssetMech(ownedAssetItem)) {
        const mech = ownedAssetItem as MechBasic
        assetToSell = {
            imageUrl: mechDetails?.chassis_skin?.large_image_url || "",
            videoUrl: mechDetails?.chassis_skin?.animation_url || "",
            label: mech?.name || mech?.label,
            tier: mech?.tier,
        }
    } else if (isAssetMysteryCrate(ownedAssetItem)) {
        const crate = ownedAssetItem as StorefrontMysteryCrate
        assetToSell = {
            imageUrl: crate.large_image_url || SafePNG,
            videoUrl: crate.animation_url || "",
            label: crate.label,
            description: crate.description,
        }
    } else if (isAssetKeycard(ownedAssetItem)) {
        const keycard = ownedAssetItem as Keycard
        assetToSell = {
            imageUrl: keycard.blueprints.image_url || KeycardPNG,
            videoUrl: keycard.blueprints.animation_url,
            label: keycard.blueprints.label,
            description: keycard.blueprints.description,
        }
    } else {
        return null
    }

    const rarityDeets = assetToSell.tier ? getRarityDeets(assetToSell.tier) : undefined

    return (
        <Stack
            direction="row"
            spacing="1.5rem"
            alignItems="flex-start"
            sx={{ position: "relative", py: "1rem", cursor: "pointer", ":hover": { backgroundColor: "#FFFFFF15" } }}
            onClick={() => {
                setAssetToSell(assetToSell)
                onClose()
            }}
        >
            <Box
                component="video"
                sx={{
                    height: "7rem",
                    width: "7rem",
                    overflow: "hidden",
                    objectFit: "contain",
                    objectPosition: "center",
                    borderRadius: 1,
                    border: "#FFFFFF18 2px solid",
                    boxShadow: "inset 0 0 12px 6px #00000040",
                    background: `radial-gradient(#FFFFFF20 10px, #00000080)`,
                }}
                loop
                muted
                autoPlay
                poster={`${assetToSell.imageUrl}`}
            >
                {<source src={assetToSell.videoUrl} type="video/mp4" />}
            </Box>

            <Stack spacing=".2rem">
                {rarityDeets && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: rarityDeets.color,
                            fontFamily: fonts.nostromoBlack,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {rarityDeets.label}
                    </Typography>
                )}
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {assetToSell.label}
                </Typography>
                <Typography
                    sx={{
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {assetToSell.description}
                </Typography>
            </Stack>
        </Stack>
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
