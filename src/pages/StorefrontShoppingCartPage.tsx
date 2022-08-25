import { useState, useCallback } from "react"
import { useMutation } from "react-fetching-library"
import { useHistory } from "react-router-dom"
import { Box, CircularProgress, Stack, TextField, Typography } from "@mui/material"
import { HangarBg, SvgBack } from "../assets"
import { fonts, colors, siteZIndex } from "../theme/theme"
import { ClipThing, FancyButton } from "../components"
import { useFiat } from "../containers/fiat"
import { ShoppingCartTable } from "../components/Bar/ShoppingCart/ShoppingCartListing/ShoppingCartTable"
import { useTheme } from "../containers/theme"
import { PageHeader } from "../components/Common/PageHeader"
import { SetupCheckout } from "../fetching"
import { loadStripe } from "@stripe/stripe-js"
import { STRIPE_PUBLISHABLE_KEY } from "../constants"
import { StripeTextFieldCVC, StripeTextFieldExpiry, StripeTextFieldNumber } from "../components/Stripe/StripeElements"
import { CardNumberElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js"
import { StripeGenericChangeEvent } from "../components/Stripe/StripeInput"

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

export const StorefrontShoppingCartPage = () => {
    const history = useHistory()

    const goBack = useCallback(() => {
        history.goBack()
    }, [history])

    return (
        <Elements stripe={stripePromise}>
            <Stack
                alignItems="center"
                sx={{
                    height: "100%",
                    zIndex: siteZIndex.RoutePage,
                    backgroundImage: `url(${HangarBg})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    boxShadow: `inset 0 0 50px 60px #00000090`,
                }}
            >
                <Stack spacing=".6rem" sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "132rem" }}>
                    <FancyButton
                        clipThingsProps={{
                            clipSize: "9px",
                            corners: { topLeft: true },
                            opacity: 1,
                            sx: { position: "relative", alignSelf: "flex-start", opacity: 0.5, ":hover": { opacity: 1 } },
                        }}
                        sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                        onClick={goBack}
                    >
                        <Stack spacing=".6rem" direction="row" alignItems="center">
                            <SvgBack size="1.4rem" fill={"#FFFFFF"} />
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#FFFFFF",
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                GO BACK
                            </Typography>
                        </Stack>
                    </FancyButton>

                    <Stack direction="row" spacing={1}>
                        <PaymentSection />
                        <ShoppingCartSection />
                    </Stack>
                </Stack>
            </Stack>
        </Elements>
    )
}

const PaymentSection = () => {
    const { shoppingCart } = useFiat()
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    if (!shoppingCart || shoppingCart.items.length === 0) {
        return null
    }
    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: primaryColor,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={backgroundColor}
            sx={{ height: "100%", flex: 1 }}
        >
            <Stack sx={{ height: "100%" }}>
                <PageHeader title="PAYMENT" />
                <Box sx={{ p: "1rem" }}>
                    <PaymentForm />
                </Box>
            </Stack>
        </ClipThing>
    )
}

const PaymentForm = () => {
    const theme = useTheme()
    const { loading } = useFiat()
    const { mutate } = useMutation(SetupCheckout)

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
    const backgroundColor = theme.factionTheme.background

    const [submitting, setSubmitting] = useState(false)
    const [receiptEmail, setReceiptEmail] = useState("")

    const setupCheckout = useCallback(async () => {
        try {
            const { payload: secretToken, error } = await mutate({
                email_address: receiptEmail,
            })

            if (error || !secretToken) {
                return
            }
            return secretToken
        } catch (err) {
            const message = typeof err === "string" ? err : "Unable to start checkout, please try again."
            console.error(message)
        }
    }, [mutate, receiptEmail])

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
        <form onSubmit={submitHandler}>
            <Box sx={{ p: "1rem " }}>
                {loading && (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                            <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                        </Stack>
                    </Stack>
                )}
                {!loading && (
                    <>
                        {" "}
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
                    </>
                )}
            </Box>

            <Box sx={{ borderTop: `1px solid ${primaryColor}70` }}>
                <Box sx={{ maxWidth: "250px", width: "66.66%", mx: "auto" }}>
                    <FancyButton
                        type={"submit"}
                        loading={submitting}
                        disabled={loading}
                        clipThingsProps={{
                            clipSize: "5px",
                            backgroundColor: colors.blue,
                            opacity: 1,
                            border: { isFancy: true, borderColor: colors.blue, borderThickness: "1.5px" },
                            sx: { position: "relative", height: "100%", mt: "1rem" },
                        }}
                        sx={{ px: "1.6rem", py: "1.1rem" }}
                    >
                        <Typography variant={"body1"} sx={{ fontFamily: fonts.nostromoBlack, color: colors.offWhite }}>
                            COMPLETE ORDER
                        </Typography>
                    </FancyButton>
                </Box>
            </Box>
        </form>
    )
}

const ShoppingCartSection = () => {
    const { loading, shoppingCart } = useFiat()
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: primaryColor,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={backgroundColor}
            sx={{ height: "100%", flex: 1 }}
        >
            <Stack sx={{ height: "100%", p: "1rem" }}>
                <ShoppingCartTable fullPage shoppingCart={shoppingCart} loading={loading} primaryColor={primaryColor} backgroundColor={backgroundColor} />
            </Stack>
        </ClipThing>
    )
}
