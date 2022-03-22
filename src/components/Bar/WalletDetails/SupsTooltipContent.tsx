import { Box, IconButton, Stack, Typography } from "@mui/material"
import { SvgClose, SvgSupToken } from "../../../assets"
import { MultiplierItem, TransactionItem } from "../.."
import { Transaction } from "../../../types/passport"
import { colors } from "../../../theme/theme"
import { supFormatterNoFixed } from "../../../helpers"
import { Multiplier, MultipliersAll } from "../../../types"
import { useEffect, useState } from "react"

export const SupsTooltipContent = ({
    sups,
    multipliers,
    transactions,
    userID,
    onClose,
}: {
    sups?: string
    multipliers?: MultipliersAll
    transactions: Transaction[]
    userID: string
    onClose: () => void
}) => {
    const [multiplicative, setMultiplicative] = useState<Multiplier[]>([])
    const [multiplierList, setMultiplierList] = useState<Multiplier[]>([])
    const [, setTotalMultiplierValue] = useState(0)
    const [, setTotalMultiplicativeValue] = useState(0)

    useEffect(() => {
        if (!multipliers) {
            setMultiplicative([])
            setMultiplierList([])
            setTotalMultiplierValue(0)
            setTotalMultiplicativeValue(0)
            return
        }

        const m1 = multipliers.multipliers.filter((m) => !m.is_multiplicative)
        const m2 = multipliers.multipliers.filter((m) => m.is_multiplicative)
        setMultiplierList(m1)
        setMultiplicative(m2)

        const total1 = m1.reduce((acc, m) => acc + Math.round(parseFloat(m.value) * 10) / 10, 0)
        const total2 = m2.reduce((acc, m) => acc + Math.round(parseFloat(m.value) * 10) / 10, 0)
        setTotalMultiplierValue(total1)
        setTotalMultiplicativeValue(total2)
    }, [multipliers])

    return (
        <Stack spacing="1.2rem" sx={{ position: "relative", minWidth: "35rem", px: "2rem", py: "1.4rem" }}>
            <Box>
                <Typography sx={{ mb: ".24rem", fontWeight: "bold", color: colors.offWhite }} variant="h6">
                    TOTAL SUPS:
                </Typography>

                <Stack direction="row" alignItems="center">
                    <SvgSupToken size="1.6rem" fill={colors.yellow} sx={{ pb: ".3rem" }} />
                    <Typography sx={{ lineHeight: 1 }} variant="body1">
                        {sups ? supFormatterNoFixed(sups) : "0.00"}
                    </Typography>
                </Stack>
            </Box>

            {multipliers && (
                <Box>
                    <Typography
                        sx={{
                            mb: ".24rem",
                            fontWeight: "bold",
                            color: colors.offWhite,
                            span: { color: colors.yellow },
                        }}
                        variant="h6"
                    >
                        TOTAL MULTIPLIERS: <span>{multipliers.total_multipliers}</span>
                    </Typography>

                    <Stack spacing="1.2rem">
                        <Stack spacing=".2rem">
                            <Typography sx={{ color: "grey !important" }}>MULTIPLIERS</Typography>
                            <Stack spacing=".32rem">
                                {multiplierList.map((m, i) => (
                                    <MultiplierItem key={i} multiplier={m} />
                                ))}
                            </Stack>
                        </Stack>

                        {multiplicative && multiplicative.length > 0 && (
                            <Stack spacing=".2rem">
                                <Typography sx={{ color: "grey !important" }}>BONUSES</Typography>
                                <Stack spacing=".32rem">
                                    {multiplicative.map((m, i) => (
                                        <MultiplierItem key={i} multiplier={m} />
                                    ))}
                                </Stack>
                            </Stack>
                        )}
                    </Stack>
                </Box>
            )}

            {transactions.length > 0 && (
                <Box>
                    <Typography sx={{ mb: ".24rem", fontWeight: "bold", color: colors.offWhite }} variant="h6">
                        RECENT TRANSACTIONS:
                    </Typography>

                    <Stack spacing=".4rem">
                        {transactions.map((t, i) => (
                            <TransactionItem userID={userID} key={i} transaction={t} />
                        ))}
                    </Stack>
                </Box>
            )}

            <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: "-1rem", right: ".2rem" }}>
                <SvgClose size="1.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
            </IconButton>
        </Stack>
    )
}
