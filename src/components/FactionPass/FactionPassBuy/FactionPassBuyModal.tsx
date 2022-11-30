import { Stack, Typography } from "@mui/material"
import { NiceModal } from "../../Common/Nice/NiceModal"
import React, { useMemo } from "react"
import { FactionPass } from "../../../types/faction_passes"
import { useAuth } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"
import moment from "moment"
import { SvgNext } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { supFormatter } from "../../../helpers"
import { PaymentType } from "./FactionPassOption"

interface FactionPassBuyModalProps {
    open: boolean
    onClose: () => void
    factionPass: FactionPass
    onSupPurchaseConfirm: (paymentType: PaymentType) => void
    error: string
}

export const FactionPassBuyModal = ({ open, onClose, factionPass, onSupPurchaseConfirm, error }: FactionPassBuyModalProps) => {
    const { factionPassExpiryDate } = useAuth()
    const { factionTheme } = useTheme()

    const currentExpiryDate = useMemo(() => {
        if (!factionPassExpiryDate) return "--/--/----, --:--"
        return moment(factionPassExpiryDate).format("DD/MM/YYYY, HH:mm")
    }, [factionPassExpiryDate])

    const newExpiryDate = useMemo(() => {
        let startDate = new Date()
        if (factionPassExpiryDate) startDate = factionPassExpiryDate

        return moment(startDate).add(factionPass.last_for_days, "d").format("DD/MM/YYYY, HH:mm")
    }, [factionPass.last_for_days, factionPassExpiryDate])

    const supsPrice = useMemo(() => supFormatter(factionPass.sups_price, 3), [factionPass.sups_price])
    const ethPrice = useMemo(() => supFormatter(factionPass.eth_price_wei, 3), [factionPass.eth_price_wei])
    const usdPrice = useMemo(() => factionPass.usd_price, [factionPass.usd_price])

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
                    <NiceButton buttonColor={factionTheme.primary} onClick={() => onSupPurchaseConfirm(PaymentType.SUPS)}>
                        {supsPrice} Sups Purchase
                    </NiceButton>
                    <NiceButton buttonColor={factionTheme.primary} onClick={() => onSupPurchaseConfirm(PaymentType.ETH)}>
                        {ethPrice} ETH Purchase
                    </NiceButton>
                    <NiceButton buttonColor={factionTheme.primary} onClick={() => onSupPurchaseConfirm(PaymentType.Stripe)}>
                        {usdPrice} USD Purchase
                    </NiceButton>
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
