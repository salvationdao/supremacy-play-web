import { Box, Stack, Typography } from "@mui/material"
import { supFormatter } from "../../../helpers"
import { colors } from "../../../theme"
import { SvgSupToken } from "../../../assets"
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
}: {
    sups?: string
    supsMultipliers: Map<string, SupsMultiplier>
    selfDestroyed: (key: string) => void
    multipliersCleaned: SupsMultiplier[]
    totalMultipliers: number
    transactions: Transaction[]
    userID: string
}) => {
    console.log(transactions)
    return (
        <Stack spacing={1.5} sx={{ px: 1.3, py: 1 }}>
            <Box>
                <Typography sx={{ fontFamily: "Share Tech", fontWeight: "bold", color: colors.textBlue }} variant="h6">
                    TOTAL SUPS:
                </Typography>

                <Stack direction="row" alignItems="center" spacing={0.4} sx={{ mt: 0.4 }}>
                    <SvgSupToken size="14px" fill={colors.yellow} />
                    <Typography sx={{ fontFamily: "Share Tech", lineHeight: 1 }} variant="body2">
                        {sups ? supFormatter(sups, 18) : "0.0000"}
                    </Typography>
                </Stack>
            </Box>

            {supsMultipliers.size > 0 && (
                <Box>
                    <Typography
                        sx={{ fontFamily: "Share Tech", fontWeight: "bold", color: colors.textBlue }}
                        variant="h6"
                    >
                        MULTIPLIERS: {`${totalMultipliers}x`}
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
                        sx={{ fontFamily: "Share Tech", fontWeight: "bold", color: colors.textBlue }}
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
        </Stack>
    )
}
