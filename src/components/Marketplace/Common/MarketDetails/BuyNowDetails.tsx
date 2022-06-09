import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../../.."
import { SvgClose, SvgSupToken, SvgWallet } from "../../../../assets"
import { useSnackbar } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { numberCommaFormatter, numFormatter, timeSinceInWords } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"

interface BuyNowDetailsProps {
    id: string
    itemName: string
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    priceLabel: string
    endAt: Date
    price: BigNumber
}

export const BuyNowDetails = ({ id, itemName, primaryColor, secondaryColor, backgroundColor, priceLabel, endAt, price }: BuyNowDetailsProps) => {
    const [confirmModalOpen, toggleConfirmModalOpen] = useToggle()

    const timeLeft = useMemo(() => timeSinceInWords(new Date(), endAt), [endAt])
    const formattedCommaPrice = useMemo(() => numberCommaFormatter(price.toNumber()), [price])
    const formattedPrice = useMemo(() => numFormatter(price.toNumber()), [price])

    return (
        <>
            <Stack spacing="2rem">
                <Stack>
                    <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                        {priceLabel}:
                    </Typography>
                    <ClipThing
                        clipSize="10px"
                        clipSlantSize="3px"
                        border={{
                            isFancy: true,
                            borderColor: primaryColor,
                            borderThickness: ".2rem",
                        }}
                        corners={{
                            topRight: true,
                            bottomLeft: true,
                        }}
                        backgroundColor={backgroundColor}
                        sx={{ alignSelf: "flex-start" }}
                    >
                        <Stack direction="row" alignItems="center" spacing=".2rem" sx={{ pl: "1.5rem", pr: "1.6rem", py: ".5rem" }}>
                            <SvgSupToken size="2.2rem" fill={colors.yellow} sx={{ mt: ".1rem" }} />
                            <Typography variant="h5" sx={{ fontWeight: "fontWeightBold" }}>
                                {formattedCommaPrice}
                            </Typography>
                        </Stack>
                    </ClipThing>
                </Stack>

                <Box>
                    <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                        TIME LEFT:
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "fontWeightBold" }}>
                        {timeLeft} <span style={{ opacity: 0.7, fontFamily: "inherit" }}>({endAt.toUTCString()})</span>
                    </Typography>
                </Box>

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
            </Stack>

            {confirmModalOpen && <ConfirmModal id={id} itemName={itemName} formattedPrice={formattedPrice} onClose={() => toggleConfirmModalOpen(false)} />}
        </>
    )
}

const ConfirmModal = ({ id, itemName, formattedPrice, onClose }: { id: string; itemName: string; formattedPrice: string; onClose: () => void }) => {
    const { newSnackbarMessage } = useSnackbar()
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(false)
    const [buyError, setBuyError] = useState<string>()

    const confirmBuy = useCallback(async () => {
        try {
            setIsLoading(true)
            const resp = await send(GameServerKeys.MarketplaceSalesBuy, {
                id,
            })

            if (!resp) return
            newSnackbarMessage("Successfully purchased war machine.", "success")
            onClose()
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to purchase item."
            setBuyError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
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
                            Do you wish to purchase <strong>{itemName}</strong> for <span>{formattedPrice}</span> SUPS?
                        </Typography>
                        <Stack direction="row" spacing="1rem" sx={{ pt: ".4rem" }}>
                            <FancyButton
                                loading={isLoading}
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
                                        {formattedPrice})
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
