import { Box, Modal, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../../.."
import { SafePNG, SvgArrow, SvgSupToken } from "../../../../assets"
import { useGlobalNotifications } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { numberCommaFormatter, supFormatterNoFixed } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"
import { MysteryCrate, OpenCrateResponse, RewardResponse, StorefrontMysteryCrate } from "../../../../types"
import { ClaimedRewards } from "../../../Claims/ClaimedRewards"
import { ConfirmModal } from "../../../Common/ConfirmModal"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { OpeningCrate } from "../../../Hangar/MysteryCratesHangar/MysteryCratesHangar"

interface MysteryCrateStoreItemProps {
    enlargedView?: boolean
    crate: StorefrontMysteryCrate
    setOpeningCrate: React.Dispatch<React.SetStateAction<OpeningCrate | undefined>>
    setOpenedRewards: React.Dispatch<React.SetStateAction<OpenCrateResponse | undefined>>
    setFutureCratesToOpen: React.Dispatch<React.SetStateAction<(StorefrontMysteryCrate | MysteryCrate)[]>>
}

export const MysteryCrateStoreItem = ({ enlargedView, crate, setOpeningCrate, setOpenedRewards, setFutureCratesToOpen }: MysteryCrateStoreItemProps) => {
    const theme = useTheme()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mysteryCrate, setMysteryCrate] = useState<StorefrontMysteryCrate>(crate)
    const [rewards, setRewards] = useState<RewardResponse[]>()

    // Buying
    const [confirmModalOpen, toggleConfirmModalOpen] = useToggle()
    const [isLoading, setIsLoading] = useState(false)
    const [buyError, setBuyError] = useState<string>()
    const [quantity, setQuantity] = useState(1)

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    const priceStr = useMemo(() => (quantity * parseFloat(mysteryCrate.price)).toString(), [quantity, mysteryCrate.price])
    const formattedPrice = useMemo(() => supFormatterNoFixed(priceStr, 2), [priceStr])
    const singleCratePrice = useMemo(() => supFormatterNoFixed(mysteryCrate.price, 2), [mysteryCrate.price])

    useGameServerSubscriptionFaction<StorefrontMysteryCrate>(
        {
            URI: `/crate/${crate.id}`,
            key: GameServerKeys.SubMysteryCrate,
        },
        (payload) => {
            if (!payload) return
            setMysteryCrate(payload)
        },
    )

    const addToCart = useCallback(async () => {
        const errMsg = "Failed to add item to the shopping cart."
        try {
            setIsLoading(true)
            const resp = await send<boolean>(GameServerKeys.FiatShoppingCartItemAdd, {
                product_id: mysteryCrate.fiat_product_id,
                quantity,
            })

            if (!resp) {
                setBuyError(errMsg)
            }

            newSnackbarMessage(`Successfully added ${quantity} ${mysteryCrate.mystery_crate_type} crate to shopping cart.`, "success")
        } catch (err) {
            setBuyError(typeof err === "string" ? err : errMsg)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [send, newSnackbarMessage, mysteryCrate.mystery_crate_type, quantity])

    const confirmBuy = useCallback(async () => {
        try {
            setIsLoading(true)
            const resp = await send<RewardResponse[]>(GameServerKeys.PurchaseMysteryCrate, {
                type: mysteryCrate.mystery_crate_type,
                quantity,
            })

            if (!resp) return
            setRewards(resp)

            const futureCratesToOpen: StorefrontMysteryCrate[] = []
            resp.forEach((r) => {
                if (r.mystery_crate) futureCratesToOpen.push(r.mystery_crate)
            })
            setFutureCratesToOpen(futureCratesToOpen)

            newSnackbarMessage(`Successfully purchased ${quantity} ${mysteryCrate.mystery_crate_type} crate.`, "success")
            toggleConfirmModalOpen(false)
            setBuyError(undefined)
        } catch (err) {
            setBuyError(typeof err === "string" ? err : "Failed to purchase item.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [send, mysteryCrate.mystery_crate_type, quantity, setFutureCratesToOpen, newSnackbarMessage, toggleConfirmModalOpen])

    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    transition: "all .15s",
                    ":hover": {
                        transform: "translateY(-.4rem)",
                    },
                }}
            >
                <ClipThing
                    clipSize="12px"
                    border={{
                        borderColor: primaryColor,
                        borderThickness: enlargedView ? ".3rem" : ".2rem",
                    }}
                    opacity={0.9}
                    backgroundColor={backgroundColor}
                    sx={{ height: "100%" }}
                >
                    <Stack spacing={enlargedView ? "2.5rem" : "1.5rem"} sx={{ height: "100%", p: enlargedView ? "3rem" : "1.5rem" }}>
                        <Box sx={{ position: "relative" }}>
                            <Box
                                sx={{
                                    height: enlargedView ? "39rem" : "25rem",
                                }}
                            >
                                <MediaPreview
                                    imageUrl={mysteryCrate.image_url || mysteryCrate.avatar_url || SafePNG}
                                    videoUrls={[mysteryCrate.animation_url, mysteryCrate.card_animation_url]}
                                    objectFit="cover"
                                />
                            </Box>

                            <Stack
                                alignItems="flex-start"
                                sx={{
                                    position: "absolute",
                                    left: enlargedView ? "1.4rem" : ".5rem",
                                    bottom: enlargedView ? ".6rem" : ".2rem",
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing=".1rem">
                                    <SvgSupToken size={enlargedView ? "2.6rem" : "1.9rem"} fill={colors.yellow} />
                                    <Typography sx={{ fontSize: enlargedView ? "2.2rem" : "1.9rem", fontFamily: fonts.nostromoBlack }}>
                                        {singleCratePrice}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Box
                                sx={{
                                    position: "absolute",
                                    right: enlargedView ? "1.4rem" : ".5rem",
                                    bottom: enlargedView ? ".6rem" : ".2rem",
                                    px: ".6rem",
                                    py: ".5rem",
                                    backgroundColor: "#00000095",
                                }}
                            >
                                <Typography
                                    sx={{
                                        lineHeight: 1,
                                        fontSize: enlargedView ? "1.5rem" : "1.22rem",
                                        fontFamily: fonts.nostromoBlack,
                                        span: {
                                            color: mysteryCrate.amount_sold >= mysteryCrate.amount ? colors.red : colors.neonBlue,
                                        },
                                    }}
                                >
                                    {numberCommaFormatter(mysteryCrate.amount)} LIMITED SUPPLY
                                </Typography>
                            </Box>
                        </Box>

                        <Stack alignItems={enlargedView ? "center" : "flex-start"} spacing="1rem" sx={{ flex: 1, px: ".4rem", py: ".3rem", flexShrink: 0 }}>
                            <Typography
                                gutterBottom
                                variant={enlargedView ? "h4" : "h6"}
                                sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack, textAlign: enlargedView ? "center" : "start" }}
                            >
                                {mysteryCrate.label}
                            </Typography>

                            <Typography sx={{ fontSize: enlargedView ? "2.1rem" : "1.6rem", textAlign: enlargedView ? "center" : "start" }}>
                                {mysteryCrate.description}
                            </Typography>

                            <Stack
                                direction="row"
                                spacing="2rem"
                                alignItems="stretch"
                                justifyContent="center"
                                sx={{
                                    mt: "auto !important",
                                    mx: "auto",
                                    width: "100%",
                                    pt: "1.8rem",
                                }}
                            >
                                <ClipThing
                                    clipSize="5px"
                                    clipSlantSize="2px"
                                    border={{
                                        borderColor: primaryColor,
                                        borderThickness: "1.5px",
                                    }}
                                    opacity={0.9}
                                    backgroundColor={backgroundColor}
                                    sx={{ height: "100%", width: "15rem" }}
                                >
                                    <Stack direction="row" justifyContent="space-between">
                                        <TextField
                                            variant="outlined"
                                            hiddenLabel
                                            onWheel={(event) => {
                                                event.currentTarget.getElementsByTagName("input")[0]?.blur()
                                            }}
                                            sx={{
                                                backgroundColor: "#00000090",
                                                ".MuiOutlinedInput-input": {
                                                    px: "1.5rem",
                                                    py: "1.5rem",
                                                    fontSize: "2rem",
                                                    height: "unset",
                                                    "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                                        WebkitAppearance: "none",
                                                    },
                                                    appearance: "textfield",
                                                },
                                                ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                                            }}
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => {
                                                const newAmount = parseInt(e.target.value)
                                                setQuantity(newAmount)
                                            }}
                                        />
                                        <Stack
                                            sx={{
                                                height: "5rem",
                                                p: "1em",
                                                "& svg:active": {
                                                    transform: "scale(1.5)",
                                                    transition: "all .2s",
                                                },
                                            }}
                                        >
                                            <SvgArrow
                                                size="1.5rem"
                                                sx={{ cursor: "pointer", zIndex: 1 }}
                                                fill={primaryColor}
                                                onClick={() => {
                                                    setQuantity(quantity + 1)
                                                }}
                                            />
                                            <SvgArrow
                                                size="1.5rem"
                                                sx={{ transform: "rotate(180deg)", cursor: "pointer" }}
                                                fill={primaryColor}
                                                onClick={() => {
                                                    if (quantity > 1) setQuantity(quantity - 1)
                                                }}
                                            />
                                        </Stack>
                                    </Stack>
                                </ClipThing>

                                <FancyButton
                                    onClick={() => toggleConfirmModalOpen(true)}
                                    clipThingsProps={{
                                        clipSize: "5px",
                                        backgroundColor: primaryColor,
                                        opacity: 1,
                                        border: { isFancy: true, borderColor: primaryColor, borderThickness: "1.5px" },
                                        sx: { position: "relative", width: enlargedView ? "50%" : "100%", height: "100%" },
                                    }}
                                    sx={{ px: "1.6rem", py: enlargedView ? "1.1rem" : ".6rem" }}
                                >
                                    <Typography
                                        variant={enlargedView ? "body1" : "caption"}
                                        sx={{ fontFamily: fonts.nostromoBlack, color: theme.factionTheme.secondary }}
                                    >
                                        Buy Now
                                    </Typography>
                                </FancyButton>
                                <FancyButton
                                    onClick={() => addToCart()}
                                    clipThingsProps={{
                                        clipSize: "5px",
                                        backgroundColor: colors.green,
                                        opacity: 1,
                                        border: { isFancy: true, borderColor: primaryColor, borderThickness: "1.5px" },
                                        sx: { position: "relative", width: enlargedView ? "50%" : "100%", height: "100%" },
                                    }}
                                    sx={{ px: "1.6rem", py: enlargedView ? "1.1rem" : ".6rem" }}
                                >
                                    <Typography
                                        variant={enlargedView ? "body1" : "caption"}
                                        sx={{ fontFamily: fonts.nostromoBlack, color: theme.factionTheme.secondary }}
                                    >
                                        Add to Cart
                                    </Typography>
                                </FancyButton>
                            </Stack>
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>

            {confirmModalOpen && (
                <ConfirmModal
                    title="CONFIRMATION"
                    onConfirm={confirmBuy}
                    onClose={() => {
                        setBuyError(undefined)
                        toggleConfirmModalOpen(false)
                    }}
                    isLoading={isLoading}
                    error={buyError}
                    confirmSuffix={
                        <Stack direction="row" sx={{ ml: ".4rem" }}>
                            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                (
                            </Typography>
                            <SvgSupToken size="1.8rem" />
                            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                {formattedPrice})
                            </Typography>
                        </Stack>
                    }
                >
                    <Typography variant="h6">
                        Do you wish to purchase {quantity} x <strong>{mysteryCrate.mystery_crate_type}</strong> crate for <span>{formattedPrice}</span> SUPS?
                    </Typography>
                </ConfirmModal>
            )}

            {rewards && (
                <PurchaseSuccessModal
                    rewards={rewards}
                    onClose={() => setRewards(undefined)}
                    setOpeningCrate={setOpeningCrate}
                    setOpenedRewards={setOpenedRewards}
                />
            )}
        </>
    )
}

const PurchaseSuccessModal = ({
    rewards,
    onClose,
    setOpeningCrate,
    setOpenedRewards,
}: {
    rewards: RewardResponse[] | undefined
    onClose: () => void
    setOpeningCrate: React.Dispatch<React.SetStateAction<OpeningCrate | undefined>>
    setOpenedRewards: React.Dispatch<React.SetStateAction<OpenCrateResponse | undefined>>
}) => {
    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    outline: "none",
                }}
            >
                <Box sx={{ position: "relative" }}>
                    {rewards && <ClaimedRewards rewards={rewards} onClose={onClose} setOpeningCrate={setOpeningCrate} setOpenedRewards={setOpenedRewards} />}
                </Box>
            </Box>
        </Modal>
    )
}
