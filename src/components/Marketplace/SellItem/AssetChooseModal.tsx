import { Box, IconButton, Modal, Pagination, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { ClipThing } from "../.."
import { SvgClose } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { usePagination } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { fonts, siteZIndex } from "../../../theme/theme"
import { Keycard, MechBasic, StorefrontMysteryCrate } from "../../../types"
import { ItemType } from "../../../types/marketplace"
import { TotalAndPageSizeOptions } from "../TotalAndPageSizeOptions"
import { AssetToSellStruct } from "./SellItem"

interface GetAssetsResponse {
    mechs: MechBasic[]
    keycards: Keycard[]
    mystery_crates: StorefrontMysteryCrate[]
    total: number
}

export const AssetChooseModal = ({
    open,
    question,
    itemType,
    setAssetToSell,
    onClose,
}: {
    open: boolean
    question: string
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

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    // Get assets
    useEffect(() => {
        ;(async () => {
            let key = GameServerKeys.GetMechs
            switch (itemType) {
                case ItemType.MysteryCrate:
                    key = GameServerKeys.GetPlayerMysteryCrates
                    break
                case ItemType.Keycards:
                    key = GameServerKeys.GetKeycards
                    break
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
                    width: "70rem",
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
                            // px: "2.5rem",
                            // py: "2.4rem",
                            maxHeight: "calc(100vh - 5rem)",
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
