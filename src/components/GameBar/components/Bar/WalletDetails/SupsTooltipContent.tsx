import { Box, IconButton, Stack, Typography } from "@mui/material"
import { supFormatter } from "../../../helpers"
import { colors } from "../../../theme"
import { SvgClose, SvgSupToken } from "../../../assets"
import { Transaction } from "../../../types"
import { MultiplierItem, SupsMultiplier, TransactionItem } from "../.."

export const SupsTooltipContent = ({
    sups,
    supsMultipliers,
    selfDestroyed,
    multipliersCleaned,
    totalMultipliers,
    transactions,
    userID,
    onClose,
}: {
    sups?: string
    supsMultipliers: {[key: string]:  SupsMultiplier}
    selfDestroyed: (key: string) => void
    multipliersCleaned: SupsMultiplier[]
    totalMultipliers: number
    transactions: Transaction[]
    userID: string
    onClose: () => void
}) => {
    const size = Object.keys(supsMultipliers).length;
    return (
        <Stack spacing={1.5} sx={{ position: "relative", px: 1.3, py: 1 }}>
            <Box>
                <Typography
                    sx={{ mb: 0.3, fontFamily: "Share Tech", fontWeight: "bold", color: colors.textBlue }}
                    variant="h6"
                >
                    TOTAL SUPS:
                </Typography>

                <Stack direction="row" alignItems="center" spacing={0.4} sx={{ mt: 0.4 }}>
                    <SvgSupToken size="14px" fill={colors.yellow} />
                    <Typography sx={{ fontFamily: "Share Tech", lineHeight: 1 }} variant="body2">
                        {sups ? supFormatter(sups, 18) : "0.0000"}
                    </Typography>
                </Stack>
            </Box>

            {size > 0 && (
                <Box>
                    <Typography
                        sx={{ mb: 0.3, fontFamily: "Share Tech", fontWeight: "bold", color: colors.textBlue }}
                        variant="h6"
                    >
                        MULTIPLIERS: {`${totalMultipliers.toFixed(2)}x`}
                    </Typography>

                    <Stack spacing={0.4}>
                        {multipliersCleaned.map((sm, i) => (
                            <MultiplierItem key={i} supsMultiplier={sm} selfDestroyed={selfDestroyed} />
                        ))}
                    </Stack>
                </Box>
            )}

            {transactions.length > 0 && (
                <Box>
                    <Typography
                        sx={{ mb: 0.3, fontFamily: "Share Tech", fontWeight: "bold", color: colors.textBlue }}
                        variant="h6"
                    >
                        RECENT TRANSACTIONS:
                    </Typography>

                    <Stack spacing={0.5}>
                        {transactions.map((t, i) => (
                            <TransactionItem userID={userID} key={i} transaction={t} />
                        ))}
                    </Stack>
                </Box>
            )}

            <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: -12, right: -4 }}>
                <SvgClose size="16px" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
            </IconButton>
        </Stack>
    )
}
