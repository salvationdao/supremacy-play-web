import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Masonry } from "@mui/lab"
import { useMediaQuery, Stack, Box, Typography, CircularProgress, TextField } from "@mui/material"
import { Elements, useElements, useStripe, CardNumberElement } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { STRIPE_PUBLISHABLE_KEY } from "../../../../constants"
import { useTheme } from "../../../../containers/theme"
import { colors, fonts } from "../../../../theme/theme"
import { SafePNG, SvgWallet } from "../../../../assets"
import { ClipThing } from "../../../Common/ClipThing"
import { ImagesPreview } from "../../../Marketplace/Common/MarketDetails/ImagesPreview"
import { FiatProduct } from "../../../../types/fiat"
import { useGameServerCommandsFaction, useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { FancyButton } from "../../../Common/FancyButton"
import { StripeTextFieldCVC, StripeTextFieldExpiry, StripeTextFieldNumber } from "../../../Stripe/StripeElements"
import { generatePriceText } from "../../../../helpers"
import { StripeGenericChangeEvent } from "../../../Stripe/StripeInput"

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

interface Props {
    id: string
}

export const PackageStoreCheckout = ({ id }: Props) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const [product, setProduct] = useState<FiatProduct>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const primaryColor = theme.factionTheme.primary

    useEffect(() => {
        ;(async () => {
            try {
                setIsLoading(true)
                const resp = await send<FiatProduct>(GameServerKeys.FiatProductGet, { id })
                if (!resp) return
                setLoadError(undefined)
                setProduct(resp)
            } catch (err) {
                let message = "Failed to get package."
                if (typeof err === "string") {
                    message = err
                } else if (err instanceof Error) {
                    message = err.message
                }
                setLoadError(message)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [id, send])

    const content = useMemo(() => {
        if (loadError) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
                        spacing="1.5rem"
                    >
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
            )
        }

        if (!product || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                    </Stack>
                </Stack>
            )
        }
        return <PackageStoreCheckoutInner product={product} />
    }, [isLoading, loadError, product, primaryColor])

    return (
        <Elements stripe={stripePromise}>
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: theme.factionTheme.primary,
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
                <Stack sx={{ height: "100%" }}>{content}</Stack>
            </ClipThing>
        </Elements>
    )
}

interface PackageStoreCheckoutInnerProps {
    product: FiatProduct
}

const PackageStoreCheckoutInner = ({ product }: PackageStoreCheckoutInnerProps) => {
    const theme = useTheme()
    const below780 = useMediaQuery("(max-width:780px)")
    const primaryColor = theme.factionTheme.primary

    return (
        <Stack sx={{ height: "100%" }}>
            <Box
                sx={{
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
                    <Box
                        sx={{
                            pt: "2rem",
                            pb: "3.8rem",
                            px: "3rem",
                        }}
                    >
                        <Masonry columns={below780 ? 1 : 2} spacing={4}>
                            <ImagesPreview
                                media={[
                                    {
                                        imageUrl: SafePNG,
                                    },
                                ]}
                                primaryColor={primaryColor}
                            />

                            <Stack spacing="2rem" sx={{ pb: "1rem", minHeight: "65rem" }}>
                                <Box>
                                    <Typography gutterBottom variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBold }}>
                                        STARTER PACKAGES
                                    </Typography>

                                    <Typography variant="h4" sx={{ fontFamily: fonts.nostromoBlack }}>
                                        {product.name}
                                    </Typography>
                                </Box>

                                <Stack spacing="2rem">
                                    <Box>
                                        <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                                            PRICE:
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: "fontWeightBold", span: { color: colors.lightNeonBlue } }}>
                                            {generatePriceText(product.price_dollars, product.price_cents)}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>

                            <PaymentForm />
                        </Masonry>
                    </Box>
                </Box>
            </Box>
        </Stack>
    )
}

const PaymentForm = () => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")

    const elements = useElements()
    const stripe = useStripe()

    const [validations, setValidations] = useState({
        cardNumberComplete: false,
        expiredComplete: false,
        cvcComplete: false,
        cardNumberError: undefined,
        expiredError: undefined,
        cvcError: undefined,
    })

    const stripeElementChangeHandler = useCallback((fieldName: string) => {
        return ({ complete, error }: StripeGenericChangeEvent) => {
            setValidations((prev) => {
                return {
                    ...prev,
                    [`${fieldName}Complete`]: complete,
                    [`${fieldName}Error`]: error?.message,
                }
            })
        }
    }, [])

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = "#FFFFFF"
    const backgroundColor = theme.factionTheme.background

    const [submitting, setSubmitting] = useState(false)
    const [receiptEmail, setReceiptEmail] = useState("")

    const setupCheckout = useCallback(async () => {
        try {
            const secretToken = await send<string>(GameServerKeys.FiatCheckoutSetup, {
                email_address: receiptEmail,
            })
            if (!secretToken) {
                return
            }
            return secretToken
        } catch (err) {
            const message = typeof err === "string" ? err : "Unable to start checkout, please try again."
            console.error(message)
        }
    }, [send, receiptEmail])

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!elements || !stripe || !validations.cardNumberComplete || !validations.expiredComplete || !validations.cvcComplete) return

        const cardElement = elements.getElement(CardNumberElement)
        if (!cardElement) return

        try {
            setSubmitting(true)
            const paymentIntentSecret = await setupCheckout()
            if (!paymentIntentSecret) {
                return
            }

            const resp = await stripe.confirmCardPayment(paymentIntentSecret, {
                payment_method: {
                    card: cardElement,
                },
            })
            if (resp.error) {
                console.error("Payment Failed", resp.error)
            }
        } catch (err) {
            const message = typeof err === "string" ? err : "Unable to start checkout, please try again."
            console.error("Payment Failed (Exception)", message, err)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Stack spacing="3rem">
            <Typography variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                PAYMENT FORM
            </Typography>
            <form onSubmit={submitHandler}>
                <Typography variant="body2" sx={{ color: colors.offWhite, fontFamily: fonts.nostromoBlack }}>
                    Card Number
                </Typography>
                <ClipThing
                    clipSize="5px"
                    clipSlantSize="2px"
                    opacity={0.9}
                    border={{
                        borderColor: primaryColor,
                        borderThickness: "1px",
                    }}
                    backgroundColor={backgroundColor}
                    sx={{ mb: "1rem", mt: "0.5rem" }}
                >
                    <Stack sx={{ height: "100%" }}>
                        <StripeTextFieldNumber
                            variant="outlined"
                            hiddenLabel
                            fullWidth
                            placeholder="Enter keywords..."
                            label={undefined}
                            error={!!validations.cardNumberError}
                            labelErrorMessage={validations.cardNumberError}
                            onChange={stripeElementChangeHandler("cardNumber")}
                            sx={{
                                backgroundColor: "unset",
                                ".MuiOutlinedInput-input": {
                                    px: "1.5rem",
                                    py: ".5rem",
                                    height: "unset",
                                    "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                        WebkitAppearance: "none",
                                    },
                                    borderRadius: 0.5,
                                    border: `${primaryColor}50 2px solid`,
                                    ":hover, :focus, :active": { backgroundColor: "#00000080", border: `${primaryColor}99 2px solid` },
                                },
                                ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                            }}
                        />
                    </Stack>
                </ClipThing>

                <Typography variant="body2" sx={{ color: colors.offWhite, fontFamily: fonts.nostromoBlack }}>
                    Card Expiry
                </Typography>
                <ClipThing
                    clipSize="5px"
                    clipSlantSize="2px"
                    opacity={0.9}
                    border={{
                        borderColor: primaryColor,
                        borderThickness: "1px",
                    }}
                    backgroundColor={backgroundColor}
                    sx={{ mb: "1rem", mt: "0.5rem" }}
                >
                    <Stack sx={{ height: "100%" }}>
                        <StripeTextFieldExpiry
                            variant="outlined"
                            hiddenLabel
                            fullWidth
                            placeholder="Enter keywords..."
                            label={undefined}
                            error={!!validations.expiredError}
                            labelErrorMessage={validations.expiredError}
                            onChange={stripeElementChangeHandler("expired")}
                            sx={{
                                backgroundColor: "unset",
                                ".MuiOutlinedInput-input": {
                                    px: "1.5rem",
                                    py: ".5rem",
                                    height: "unset",
                                    "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                        WebkitAppearance: "none",
                                    },
                                    borderRadius: 0.5,
                                    border: `${primaryColor}50 2px solid`,
                                    ":hover, :focus, :active": { backgroundColor: "#00000080", border: `${primaryColor}99 2px solid` },
                                },
                                ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                            }}
                        />
                    </Stack>
                </ClipThing>

                <Typography variant="body2" sx={{ color: colors.offWhite, fontFamily: fonts.nostromoBlack }}>
                    CVC
                </Typography>
                <ClipThing
                    clipSize="5px"
                    clipSlantSize="2px"
                    opacity={0.9}
                    border={{
                        borderColor: primaryColor,
                        borderThickness: "1px",
                    }}
                    backgroundColor={backgroundColor}
                    sx={{ mb: "1rem", mt: "0.5rem" }}
                >
                    <Stack sx={{ height: "100%" }}>
                        <StripeTextFieldCVC
                            variant="outlined"
                            hiddenLabel
                            fullWidth
                            placeholder="Enter keywords..."
                            label={undefined}
                            error={!!validations.cvcError}
                            labelErrorMessage={validations.cvcError}
                            onChange={stripeElementChangeHandler("cvc")}
                            sx={{
                                backgroundColor: "unset",
                                ".MuiOutlinedInput-input": {
                                    px: "1.5rem",
                                    py: ".5rem",
                                    height: "unset",
                                    "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                        WebkitAppearance: "none",
                                    },
                                    borderRadius: 0.5,
                                    border: `${primaryColor}50 2px solid`,
                                    ":hover, :focus, :active": { backgroundColor: "#00000080", border: `${primaryColor}99 2px solid` },
                                },
                                ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                            }}
                        />
                    </Stack>
                </ClipThing>

                <Typography variant="body2" sx={{ color: colors.offWhite, fontFamily: fonts.nostromoBlack }}>
                    Email Receipt
                </Typography>
                <ClipThing
                    clipSize="5px"
                    clipSlantSize="2px"
                    opacity={0.9}
                    border={{
                        borderColor: primaryColor,
                        borderThickness: "1px",
                    }}
                    backgroundColor={backgroundColor}
                    sx={{ mb: "1rem", mt: "0.5rem" }}
                >
                    <Stack sx={{ height: "100%" }}>
                        <TextField
                            variant="outlined"
                            hiddenLabel
                            fullWidth
                            placeholder="Email receipt to"
                            sx={{
                                backgroundColor: "unset",
                                ".MuiOutlinedInput-input": {
                                    px: "1.5rem",
                                    py: ".5rem",
                                    height: "unset",
                                    "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                        WebkitAppearance: "none",
                                    },
                                    borderRadius: 0.5,
                                    border: `${primaryColor}50 2px solid`,
                                    ":hover, :focus, :active": { backgroundColor: "#00000080", border: `${primaryColor}99 2px solid` },
                                },
                                ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                            }}
                            value={receiptEmail}
                            onChange={(e) => setReceiptEmail(e.target.value)}
                        />
                    </Stack>
                </ClipThing>

                <FancyButton
                    type={"submit"}
                    loading={submitting}
                    clipThingsProps={{
                        clipSize: "9px",
                        backgroundColor: primaryColor,
                        opacity: 1,
                        border: { isFancy: true, borderColor: primaryColor, borderThickness: "2px" },
                        sx: { position: "relative", width: "18rem" },
                    }}
                    sx={{ py: ".7rem", color: secondaryColor }}
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
            </form>
        </Stack>
    )
}
