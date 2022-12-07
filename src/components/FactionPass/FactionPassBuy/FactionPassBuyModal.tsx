import { Box, Typography } from "@mui/material"
import { Elements, PaymentElement, useElements } from "@stripe/react-stripe-js"
import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js"
import moment from "moment"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { SvgCreditCard, SvgEthereum, SvgSupToken } from "../../../assets"
import { STRIPE_PUBLISHABLE_KEY } from "../../../constants"
import { useAuth } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { supFormatter } from "../../../helpers"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { FactionPass } from "../../../types/faction_passes"
import { ConfirmModal } from "../../Common/Deprecated/ConfirmModal"
import { PaymentType } from "./FactionPassOption"

interface FactionPassBuyFiatModalProps {
    onClose: () => void
    factionPass: FactionPass
    paymentType: PaymentType
}

interface StripePaymentDetail {
    client_secret: string
    payment_intent_id: string
}

export const FactionPassBuyModal = ({ onClose, factionPass, paymentType }: FactionPassBuyFiatModalProps) => {
    const { factionPassExpiryDate } = useAuth()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>()
    const [overrideOnConfirm, setOverrideOnConfirm] = useState<() => Promise<void>>() // If stripe, then setState to new onConfirm logic

    // Dates
    const currentExpiryDate = useMemo(() => {
        if (!factionPassExpiryDate) return moment().format("YYYY-MM-DD")
        return moment(factionPassExpiryDate).format("YYYY-MM-DD")
    }, [factionPassExpiryDate])

    const newExpiryDate = useMemo(() => {
        let startDate = new Date()
        if (factionPassExpiryDate) startDate = factionPassExpiryDate

        return moment(startDate).add(factionPass.last_for_days, "d").format("YYYY-MM-DD")
    }, [factionPass.last_for_days, factionPassExpiryDate])

    const { icon, unit } = useMemo(() => {
        switch (paymentType) {
            case PaymentType.ETH:
                return { icon: <SvgEthereum inline sx={{ ml: ".3rem" }} />, unit: "ETH" }
            case PaymentType.Stripe:
                return { icon: <SvgCreditCard inline sx={{ ml: ".3rem" }} />, unit: "USD" }
            case PaymentType.SUPS:
                return { icon: <SvgSupToken fill={colors.gold} inline />, unit: "SUPS" }
        }
    }, [paymentType])

    // Buy
    const buyFactionPass = useCallback(
        async (paymentType: PaymentType) => {
            try {
                setIsLoading(true)
                setError(undefined)

                const resp = await send<boolean>(GameServerKeys.PurchaseFactionPassWithSups, {
                    faction_pass_id: factionPass.id,
                    payment_type: paymentType,
                })
                if (!resp) return

                onClose()
            } catch (err) {
                console.error(err)
                setError(typeof err === "string" ? err : "Unable to Process payment.")
            } finally {
                setIsLoading(false)
            }
        },
        [factionPass.id, onClose, send],
    )

    return (
        <ConfirmModal
            title="Confirm Purchase"
            onConfirm={overrideOnConfirm || (() => buyFactionPass(paymentType))}
            onClose={onClose}
            isLoading={isLoading}
            error={error}
            width="50rem"
        >
            <Typography variant="h6">
                Purchase {factionPass.label} PASS for
                {icon}
                {supFormatter(factionPass.sups_price, 3)} {unit}?
                <br />
                Valid from <span style={{ color: colors.neonBlue }}>{currentExpiryDate}</span> to{" "}
                <span style={{ color: colors.neonBlue }}>{newExpiryDate}</span>
            </Typography>

            {paymentType === PaymentType.Stripe && (
                <StripePayment
                    factionPass={factionPass}
                    setIsLoading={setIsLoading}
                    onClose={onClose}
                    setError={setError}
                    setOverrideOnConfirm={setOverrideOnConfirm}
                />
            )}
        </ConfirmModal>
    )
}

const StripePayment = React.memo(function StripePayment({
    factionPass,
    setIsLoading,
    onClose,
    setError,
    setOverrideOnConfirm,
}: {
    factionPass: FactionPass
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    onClose: () => void
    setError: React.Dispatch<React.SetStateAction<string | undefined>>
    setOverrideOnConfirm: React.Dispatch<React.SetStateAction<(() => Promise<void>) | undefined>>
}) {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const [stripePromise, setStripePromise] = useState<Stripe | null>(null)
    useEffect(() => {
        setIsLoading(true)
        loadStripe(STRIPE_PUBLISHABLE_KEY).then((_stripPromise) => {
            setStripePromise(_stripPromise)
            setIsLoading(false)
        })
    }, [setIsLoading])

    const stripePaymentDetail = useGameServerSubscriptionFaction<StripePaymentDetail>({
        URI: `/faction_pass/${factionPass.id}/stripe_payment_intent`,
        key: GameServerKeys.SubFactionPassStripePaymentIntent,
    })

    const handleStripeSubmit = useCallback(
        async (_elements: StripeElements | null, _stripe: Stripe | null) => {
            try {
                if (!_stripe || !_elements || !stripePaymentDetail) return
                setIsLoading(true)
                setError(undefined)

                const data = await send(GameServerKeys.ClaimFactionPassStripePayment, {
                    payment_intent_id: stripePaymentDetail.payment_intent_id,
                })

                if (!data) return
                const stripeError = await _stripe.confirmPayment({
                    elements: _elements,
                    confirmParams: {
                        return_url: `${origin}/faction-pass/dashboard`,
                    },
                })

                if (stripeError) {
                    setError(stripeError.error.message)
                    return
                }

                onClose()
            } catch (err) {
                console.error(err)
                setError(typeof err === "string" ? err : "Unable to Process payment.")
            } finally {
                setIsLoading(false)
            }
        },
        [onClose, send, setError, setIsLoading, stripePaymentDetail],
    )

    if (!stripePromise || !stripePaymentDetail) {
        return null
    }

    return (
        <Box sx={{ pb: "1rem" }}>
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
                            colorBackground: theme.factionTheme.u800,
                            colorPrimary: theme.factionTheme.primary,
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
                <StripPaymentInner stripePromise={stripePromise} handleStripeSubmit={handleStripeSubmit} setOverrideOnConfirm={setOverrideOnConfirm} />
            </Elements>
        </Box>
    )
})

const StripPaymentInner = ({
    stripePromise,
    handleStripeSubmit,
    setOverrideOnConfirm,
}: {
    stripePromise: Stripe
    handleStripeSubmit: (_elements: StripeElements | null, _stripe: Stripe | null) => Promise<void>
    setOverrideOnConfirm: React.Dispatch<React.SetStateAction<(() => Promise<void>) | undefined>>
}) => {
    const elements = useElements()

    useEffect(() => {
        setOverrideOnConfirm(() => {
            return async () => await handleStripeSubmit(elements, stripePromise)
        })
    }, [elements, handleStripeSubmit, setOverrideOnConfirm, stripePromise])

    return <PaymentElement />
}
