import { Stack, Typography } from "@mui/material"
import { NiceModal } from "../../Common/Nice/NiceModal"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { FactionPass } from "../../../types/faction_passes"
import { useAuth } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"
import moment from "moment"
import { SvgNext } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { supFormatter } from "../../../helpers"
import { PaymentType } from "./FactionPassOption"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { Elements, PaymentElement, useElements } from "@stripe/react-stripe-js"
import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js"
import { STRIPE_PUBLISHABLE_KEY } from "../../../constants"

interface FactionPassBuyModalProps {
    open: boolean
    onClose: () => void
    factionPass: FactionPass
    onSupPurchaseConfirm: (paymentType: PaymentType) => void
    error: string
}

interface StripePaymentDetail {
    client_secret: string
    payment_intent_id: string
}

export const FactionPassBuyModal = ({ open, onClose, factionPass, onSupPurchaseConfirm, error }: FactionPassBuyModalProps) => {
    const { factionPassExpiryDate } = useAuth()
    const { factionTheme } = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(false)

    const currentExpiryDate = useMemo(() => {
        if (!factionPassExpiryDate) return "--/--/----, --:--"
        return moment(factionPassExpiryDate).format("DD/MM/YYYY, HH:mm")
    }, [factionPassExpiryDate])

    const newExpiryDate = useMemo(() => {
        let startDate = new Date()
        if (factionPassExpiryDate) startDate = factionPassExpiryDate

        return moment(startDate).add(factionPass.last_for_days, "d").format("DD/MM/YYYY, HH:mm")
    }, [factionPass.last_for_days, factionPassExpiryDate])

    const [stripePromise, setStripePromise] = useState<Stripe | null>(null)
    useEffect(() => {
        loadStripe(STRIPE_PUBLISHABLE_KEY).then((_stripPromise) => setStripePromise(_stripPromise))
    }, [])

    const [stripePaymentDetail, setStripePaymentDetail] = useState<StripePaymentDetail>()
    useGameServerSubscriptionFaction<StripePaymentDetail>(
        {
            URI: `/faction_pass/${factionPass.id}/stripe_payment_intent`,
            key: GameServerKeys.SubFactionPassStripePaymentIntent,
        },
        (payload) => {
            setStripePaymentDetail(payload)
        },
    )

    const supsPrice = useMemo(() => supFormatter(factionPass.sups_price, 3), [factionPass.sups_price])
    // const ethPrice = useMemo(() => supFormatter(factionPass.eth_price_wei, 3), [factionPass.eth_price_wei])
    // const usdPrice = useMemo(() => factionPass.usd_price, [factionPass.usd_price])

    const handleStripeSubmit = useCallback(
        async (_elements: StripeElements | null, _stripe: Stripe | null) => {
            try {
                if (!_stripe || !_elements || !stripePaymentDetail) return
                setIsLoading(true)
                const data = await send(GameServerKeys.ClaimFactionPassStripePayment, {
                    payment_intent_id: stripePaymentDetail.payment_intent_id,
                })

                if (!data) return

                await _stripe.confirmPayment({
                    elements: _elements,
                    confirmParams: {
                        return_url: `${origin}/faction-pass/buy`,
                    },
                })
            } catch (err) {
                console.error(typeof err === "string" ? err : "Unable to process payments.")
            } finally {
                setIsLoading(false)
            }
        },
        [send, stripePaymentDetail],
    )

    return (
        <NiceModal open={open} onClose={onClose} sx={{ minWidth: "35rem" }}>
            <Stack direction="column" sx={{ p: "1rem" }} spacing={2}>
                <Typography color={factionTheme.primary} fontFamily={fonts.nostromoBlack}>
                    Buy {factionPass.label} Pass
                </Typography>

                <Stack direction="column" flex={1}>
                    <Typography fontFamily={fonts.rajdhaniBold} sx={{ opacity: 0.5 }}>
                        Expiry Date
                    </Typography>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography fontFamily={fonts.rajdhaniBold}>{currentExpiryDate}</Typography>
                        <SvgNext />
                        <Typography fontFamily={fonts.rajdhaniBold}>{newExpiryDate}</Typography>
                    </Stack>
                </Stack>
                <Stack direction="column" spacing={1}>
                    {stripePromise && stripePaymentDetail && (
                        <Elements
                            stripe={stripePromise}
                            options={{
                                clientSecret: stripePaymentDetail.client_secret,
                                appearance: {
                                    theme: "night",
                                    variables: {
                                        fontFamily: fonts.rajdhaniBold,
                                        fontWeightNormal: "500",
                                        borderRadius: "1.5px",
                                        colorBackground: factionTheme.background,
                                        colorPrimary: factionTheme.primary,
                                        colorPrimaryText: "#1A1B25",
                                        colorText: "white",
                                        colorTextPlaceholder: colors.grey,
                                        colorIconTab: "white",
                                        colorLogo: "dark",
                                        spacingUnit: "3.4px",
                                    },
                                    rules: {
                                        ".Label": {
                                            marginBottom: "10px",
                                        },
                                    },
                                },
                            }}
                        >
                            <StripPayment onSubmit={handleStripeSubmit} stripePromise={stripePromise} />
                        </Elements>
                    )}

                    <NiceButton loading={isLoading} buttonColor={factionTheme.primary} onClick={() => onSupPurchaseConfirm(PaymentType.SUPS)}>
                        {supsPrice} Sups Purchase
                    </NiceButton>
                    {/*    <NiceButton buttonColor={factionTheme.primary} onClick={() => onSupPurchaseConfirm(PaymentType.ETH)}>*/}
                    {/*        {ethPrice} ETH Purchase*/}
                    {/*    </NiceButton>*/}
                    {/*    <NiceButton buttonColor={factionTheme.primary}>{usdPrice} USD Purchase</NiceButton>*/}
                </Stack>
                {error && (
                    <Typography color={colors.red} variant="caption">
                        {error}
                    </Typography>
                )}
            </Stack>
        </NiceModal>
    )
}

interface StripePaymentProps {
    stripePromise: Stripe
    onSubmit: (_elements: StripeElements | null, _stripe: Stripe | null) => void
}

const StripPayment = ({ onSubmit, stripePromise }: StripePaymentProps) => {
    const { factionTheme } = useTheme()
    const elements = useElements()

    return (
        <Stack spacing={2}>
            <PaymentElement />
            <NiceButton onClick={() => onSubmit(elements, stripePromise)} buttonColor={factionTheme.primary}>
                PURCHASE
            </NiceButton>
        </Stack>
    )
}
