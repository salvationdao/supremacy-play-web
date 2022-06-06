import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { ClipThing, FancyButton } from "../../.."
import { SvgClose, SvgSupToken, SvgWallet } from "../../../../assets"
import { useSnackbar } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"
import { MarketplaceMechItem } from "../../../../types/marketplace"

export const BuyoutDetails = ({ marketItem }: { marketItem: MarketplaceMechItem }) => {
    const theme = useTheme()
    const [confirmModalOpen, toggleConfirmModalOpen] = useToggle()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary

    return (
        <>
            <FancyButton
                excludeCaret
                clipThingsProps={{
                    clipSize: "9px",
                    backgroundColor: primaryColor,
                    opacity: 1,
                    border: { isFancy: true, borderColor: primaryColor, borderThickness: "2px" },
                    sx: { position: "relative", width: "18rem" },
                }}
                sx={{ py: ".7rem", color: secondaryColor }}
                onClick={() => toggleConfirmModalOpen(true)}
            >
                <Stack direction="row" spacing=".9rem" alignItems="center" justifyContent="center">
                    <SvgWallet size="1.9rem" fill={secondaryColor} />

                    <Typography
                        variant="body2"
                        sx={{
                            flexShrink: 0,
                            color: secondaryColor,
                            fontFamily: fonts.nostromoBlack,
                        }}
                    >
                        BUY NOW
                    </Typography>
                </Stack>
            </FancyButton>

            {confirmModalOpen && <ConfirmModal marketItem={marketItem} onClose={() => toggleConfirmModalOpen(false)} />}
        </>
    )
}

const ConfirmModal = ({ marketItem, onClose }: { marketItem: MarketplaceMechItem; onClose: () => void }) => {
    const { newSnackbarMessage } = useSnackbar()
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [buyError, setBuyError] = useState<string>()

    const { id, buyout_price, mech } = marketItem

    const confirmBuy = useCallback(async () => {
        try {
            const resp = await send(GameServerKeys.MarketplaceSalesBuy, {
                item_id: id,
            })

            if (!resp) return
            newSnackbarMessage("Successfully purchased item.")
            onClose()
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to purchase item."
            setBuyError(message)
            console.error(err)
        }
    }, [id, newSnackbarMessage, onClose, send])

    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "48rem",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".2rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={theme.factionTheme.background}
                >
                    <Stack
                        spacing="1.2rem"
                        sx={{
                            position: "relative",
                            px: "2.5rem",
                            py: "2.4rem",
                            span: {
                                color: colors.neonBlue,
                                fontWeight: "fontWeightBold",
                            },
                        }}
                    >
                        <Typography variant="h5" sx={{ lineHeight: 1, fontFamily: fonts.nostromoBlack }}>
                            CONFIRMATION
                        </Typography>
                        <Typography variant="h6">
                            Do you wish to purchase <strong>{mech?.name || mech?.label}</strong> for <span>{buyout_price}</span> SUPS?
                        </Typography>
                        <Stack direction="row" spacing="1rem" sx={{ pt: ".4rem" }}>
                            <FancyButton
                                excludeCaret
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: colors.green,
                                    border: { borderColor: colors.green, borderThickness: "2px" },
                                    sx: { flex: 2, position: "relative" },
                                }}
                                sx={{ pt: 0, pb: 0, minWidth: "5rem" }}
                                onClick={confirmBuy}
                            >
                                <Stack direction="row" justifyContent="center">
                                    <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                        CONFIRM (
                                    </Typography>
                                    <SvgSupToken size="1.8rem" />
                                    <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                        {buyout_price})
                                    </Typography>
                                </Stack>
                            </FancyButton>

                            <FancyButton
                                excludeCaret
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: colors.red,
                                    border: { borderColor: colors.red, borderThickness: "2px" },
                                    sx: { flex: 2, position: "relative" },
                                }}
                                sx={{ pt: 0, pb: 0, minWidth: "5rem" }}
                                onClick={onClose}
                            >
                                <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                    CANCEL
                                </Typography>
                            </FancyButton>
                        </Stack>

                        {buyError && (
                            <Typography
                                sx={{
                                    mt: ".3rem",
                                    color: "red",
                                }}
                            >
                                {buyError}
                            </Typography>
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
