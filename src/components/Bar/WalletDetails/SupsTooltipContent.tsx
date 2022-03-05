import { Box, IconButton, Stack, Typography } from "@mui/material"
import { SvgClose, SvgSupToken } from "../../../assets"
import { MultiplierItem, SupsMultiplier, TransactionItem } from "../.."
import { Transaction } from "../../../types/passport"
import { colors } from "../../../theme/theme"
import { supFormatterNoFixed } from "../../../helpers"

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
    supsMultipliers: { [key: string]: SupsMultiplier }
    selfDestroyed: (key: string) => void
    multipliersCleaned: SupsMultiplier[]
    totalMultipliers: number
    transactions: Transaction[]
    userID: string
    onClose: () => void
}) => {
    const size = Object.keys(supsMultipliers).length
    return (
        <Stack spacing={1.5} sx={{ position: "relative", px: 1.3, py: 1 }}>
            <Box>
                <Typography sx={{ mb: 0.3, fontWeight: "bold", color: colors.text }} variant="h6">
                    TOTAL SUPS:
                </Typography>

                <Stack direction="row" alignItems="center">
                    <SvgSupToken size="16px" fill={colors.yellow} sx={{ pb: 0 }} />
                    <Typography sx={{ lineHeight: 1, color: "#FFFFFF" }} variant="body1">
                        {sups ? supFormatterNoFixed(sups) : "0.00"}
                    </Typography>
                </Stack>
            </Box>

            {size > 0 && (
                <Box>
                    <Typography sx={{ mb: 0.3, fontWeight: "bold", color: colors.text }} variant="h6">
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
                    <Typography sx={{ mb: 0.3, fontWeight: "bold", color: colors.text }} variant="h6">
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
