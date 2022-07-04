import { Box, CircularProgress, IconButton, Modal, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing } from "../../.."
import { SvgClose } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { usePagination } from "../../../../hooks"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"
import { Keycard, MechBasic, MysteryCrate, Weapon } from "../../../../types"
import { ItemType } from "../../../../types/marketplace"
import { PageHeader } from "../../../Common/PageHeader"
import { TotalAndPageSizeOptions } from "../../../Common/TotalAndPageSizeOptions"
import { AssetToSellStruct, itemTypes } from "../SellItem"
import { AssetToSellItem } from "./AssetToSellItem"

interface GetAssetsResponse {
    mechs: MechBasic[]
    keycards: Keycard[]
    weapons: Weapon[]
    mystery_crates: MysteryCrate[]
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
    const [ownedAssets, setOwnedAssets] = useState<AssetToSellStruct[]>()
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({ pageSize: 5, page: 1 })

    const itemTypeLabel = useMemo(() => itemTypes.find((i) => i.value === itemType)?.label, [itemType])
    const question = itemTypeLabel ? `Choose a ${itemTypeLabel}` : "Choose an item type"

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    const getItems = useCallback(async () => {
        let key = ""
        if (itemType === ItemType.WarMachine) {
            key = GameServerKeys.GetMechs
        } else if (itemType === ItemType.Weapon) {
            key = GameServerKeys.GetWeapons
        } else if (itemType === ItemType.MysteryCrate) {
            key = GameServerKeys.GetPlayerMysteryCrates
        } else {
            key = GameServerKeys.GetPlayerKeycards
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
                setOwnedAssets(
                    resp.mechs.map((mech) => ({
                        id: mech.id,
                        mech: mech,
                    })),
                )
            } else if (itemType === ItemType.Weapon) {
                setOwnedAssets(
                    resp.weapons.map((weapon) => ({
                        id: weapon.id,
                        weapon: weapon,
                    })),
                )
            } else if (itemType === ItemType.MysteryCrate) {
                setOwnedAssets(
                    resp.mystery_crates.map((crate) => ({
                        id: crate.id,
                        mysteryCrate: crate,
                    })),
                )
            } else {
                setOwnedAssets(
                    resp.keycards.map((keycard) => ({
                        id: keycard.id,
                        keycard: keycard,
                    })),
                )
            }
            setTotalItems(resp.total)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to get owned assets."
            setLoadError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [send, itemType, page, pageSize, setTotalItems])

    useEffect(() => {
        getItems()
    }, [getItems])

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
                    sx={{ position: "relative" }}
                    backgroundColor={backgroundColor}
                >
                    <Stack
                        sx={{
                            position: "relative",
                            height: "65rem",
                            maxHeight: "calc(100vh - 18rem)",
                            overflow: "hidden",
                        }}
                    >
                        <PageHeader title={question}></PageHeader>

                        <TotalAndPageSizeOptions
                            countItems={ownedAssets?.length}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            changePageSize={changePageSize}
                            changePage={changePage}
                            manualRefresh={getItems}
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
                                        {ownedAssets.map((ownedAsset) => {
                                            return (
                                                <AssetToSellItem
                                                    key={ownedAsset.id}
                                                    itemType={itemType}
                                                    assetToSell={ownedAsset}
                                                    onClick={() => {
                                                        setAssetToSell(ownedAsset)
                                                        onClose()
                                                    }}
                                                    orientation="horizontal"
                                                />
                                            )
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
