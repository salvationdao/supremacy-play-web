import { Box, IconButton, Stack, Typography } from "@mui/material"
import { SvgClose, SvgSupToken } from "../../../assets"
import { MultiplierItem, TransactionItem } from "../.."
import { Transaction } from "../../../types/passport"
import { colors } from "../../../theme/theme"
import { supFormatterNoFixed } from "../../../helpers"
import { MultipliersAll } from "../../../types"

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
    return (
        <Stack spacing="1.2rem" sx={{ position: "relative", px: "1.04rem", py: ".8rem" }}>
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
                    <Typography sx={{ mb: ".24rem", fontWeight: "bold", color: colors.offWhite }} variant="h6">
                        MULTIPLIERS: {multipliers.total_multipliers}
                    </Typography>

                    <Stack spacing=".32rem">
                        {multipliers.multipliers.map((m, i) => (
                            <MultiplierItem key={i} multiplier={m} />
                        ))}
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

            <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: "-1.2rem", right: "-.4rem" }}>
                <SvgClose size="1.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
            </IconButton>
        </Stack>
    )
}
