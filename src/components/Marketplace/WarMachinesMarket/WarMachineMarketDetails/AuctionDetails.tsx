import { Box, IconButton, InputAdornment, Modal, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { ClipThing, FancyButton } from "../../.."
import { SvgClose, SvgSupToken, SvgHammer } from "../../../../assets"
import { useSnackbar } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"
import { MarketplaceMechItem } from "../../../../types/marketplace"

export const AuctionDetails = ({ marketItem }: { marketItem: MarketplaceMechItem }) => {
    const currentBid = parseInt(marketItem.auction_current_price)
    const [bidPrice, setBidPrice] = useState<number>()
    const [confirmModalOpen, toggleConfirmModalOpen] = useToggle()

    const primaryColor = colors.orange
    const secondaryColor = "#FFFFFF"

    return (
        <>
            <Box>
                <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                    PLACE YOUR BID:
                </Typography>

                <Stack direction="row" spacing="1.5rem" alignItems="center">
                    <TextField
                        variant="outlined"
                        hiddenLabel
                        placeholder={(currentBid + 1).toString()}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SvgSupToken fill={colors.yellow} size="2.4rem" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            backgroundColor: "#00000090",
                            ".MuiOutlinedInput-root": { borderRadius: 0.5, border: `${primaryColor}99 2px dashed` },
                            ".MuiOutlinedInput-input": {
                                px: "1.5rem",
                                py: ".8rem",
                                fontSize: "2.2rem",
                                height: "unset",
                                "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                    "-webkit-appearance": "none",
                                },
                            },
                            ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                        }}
                        type="number"
                        value={bidPrice}
                        onChange={(e) => {
                            const value = parseInt(e.target.value)
                            setBidPrice(value)
                        }}
                    />
                    <FancyButton
                        excludeCaret
                        disabled={!bidPrice || bidPrice <= 0}
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
                            <SvgHammer size="1.9rem" fill={secondaryColor} />

                            <Typography
                                variant="body2"
                                sx={{
                                    flexShrink: 0,
                                    color: secondaryColor,
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                PLACE BID
                            </Typography>
                        </Stack>
                    </FancyButton>
                </Stack>
            </Box>

            {confirmModalOpen && bidPrice && <ConfirmModal marketItem={marketItem} bidPrice={bidPrice} onClose={() => toggleConfirmModalOpen(false)} />}
        </>
    )
}

const ConfirmModal = ({ marketItem, bidPrice, onClose }: { marketItem: MarketplaceMechItem; bidPrice: number; onClose: () => void }) => {
    const { newSnackbarMessage } = useSnackbar()
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [bidError, setBidError] = useState<string>()

    const { id, mech } = marketItem

    const confirmBid = useCallback(async () => {
        try {
            const resp = await send(GameServerKeys.MarketplaceSalesBid, {
                id,
                amount: bidPrice.toString(),
            })

            if (!resp) return
            newSnackbarMessage("Successfully placed your bid.")
            onClose()
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to purchase item."
            setBidError(message)
            console.error(err)
        }
    }, [bidPrice, id, newSnackbarMessage, onClose, send])

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
                            Do you wish to place a bid of <span>{bidPrice}</span> SUPS on <strong>{mech?.name || mech?.label}</strong>?
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
                                onClick={confirmBid}
                            >
                                <Stack direction="row" justifyContent="center">
                                    <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                        CONFIRM (
                                    </Typography>
                                    <SvgSupToken size="1.8rem" />
                                    <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                        {bidPrice})
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

                        {bidError && (
                            <Typography
                                sx={{
                                    mt: ".3rem",
                                    color: "red",
                                }}
                            >
                                {bidError}
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
