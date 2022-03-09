import { Box, IconButton, Stack, Typography } from "@mui/material"
import { SvgClose, SvgSupToken } from "../../../assets"
import { MultiplierItem, SupsMultipliers, TransactionItem } from "../.."
import { Transaction } from "../../../types/passport"
import { colors } from "../../../theme/theme"
import { supFormatterNoFixed } from "../../../helpers"

export const SupsTooltipContent = ({
    sups,
    multipliers,
    transactions,
    userID,
    onClose,
}: {
    sups?: string
    multipliers?: SupsMultipliers
    transactions: Transaction[]
    userID: string
    onClose: () => void
}) => {
    return (
        <Stack spacing={1.5} sx={{ position: "relative", px: 1.3, py: 1 }}>
            <Box>
                <Typography sx={{ mb: 0.3, fontWeight: "bold", color: colors.offWhite }} variant="h6">
                    TOTAL SUPS:
                </Typography>

                <Stack direction="row" alignItems="center">
                    <SvgSupToken size="16px" fill={colors.yellow} sx={{ pb: 0 }} />
                    <Typography sx={{ lineHeight: 1 }} variant="body1">
                        {sups ? supFormatterNoFixed(sups) : "0.00"}
                    </Typography>
                </Stack>
            </Box>

            {multipliers && (
                <Box>
                    <Typography sx={{ mb: 0.3, fontWeight: "bold", color: colors.offWhite }} variant="h6">
                        MULTIPLIERS: {multipliers.total_multipliers}
                    </Typography>

                    <Stack spacing={0.4}>
                        {multipliers.multipliers.map((m, i) => (
                            <MultiplierItem key={i} multipliers={m} />
                        ))}
                    </Stack>
                </Box>
            )}

            {transactions.length > 0 && (
                <Box>
                    <Typography sx={{ mb: 0.3, fontWeight: "bold", color: colors.offWhite }} variant="h6">
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
