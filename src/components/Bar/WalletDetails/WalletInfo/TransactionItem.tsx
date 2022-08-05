import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useEffect, useMemo } from "react"
import { TooltipHelper } from "../../.."
import { SvgContentCopyIcon, SvgSupToken } from "../../../../assets"
import { dateFormatter, supFormatterNoFixed } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { colors } from "../../../../theme/theme"
import { Transaction } from "../../../../types"

export const TransactionItem = ({ transaction, userID }: { transaction: Transaction; userID: string }) => {
    const [copySuccess, toggleCopySuccess] = useToggle()

    useEffect(() => {
        if (copySuccess) {
            const timeout = setTimeout(() => {
                toggleCopySuccess(false)
            }, 900)

            return () => clearTimeout(timeout)
        }
    }, [copySuccess, toggleCopySuccess])

    const isCredit = useMemo(() => userID === transaction.credit, [userID, transaction])
    const color = useMemo(() => (isCredit ? colors.supsCredit : colors.supsDebit), [isCredit])
    const tooltipText = useMemo(() => transaction.description || transaction.sub_group || transaction.group, [transaction])

    return (
        <Stack direction="row" alignItems="center" sx={{ px: ".64rem", py: ".06rem", border: `#FFFFFF30 1px dashed`, borderRadius: 0.2 }}>
            <TooltipHelper placement="left" text={tooltipText ? `  ${tooltipText.toUpperCase()}` : ""}>
                <Stack direction="row" alignItems="center" sx={{ mr: ".6rem", flex: 1 }}>
                    <Typography sx={{ lineHeight: 1, color }}>{isCredit ? "+" : "-"}</Typography>
                    <SvgSupToken size="1.3rem" fill={color} />
                    <Typography sx={{ lineHeight: 1, color }}>{supFormatterNoFixed(transaction.amount, 4)}</Typography>
                </Stack>
            </TooltipHelper>

            <Typography
                variant="caption"
                sx={{
                    ml: "auto",
                    mr: ".24rem",
                    lineHeight: 1,
                    color: "grey !important",
                }}
            >
                {dateFormatter(transaction.created_at, true)}
            </Typography>

            <TooltipHelper open={copySuccess} placement="right" text="Copied!">
                <Box>
                    <IconButton
                        size="small"
                        sx={{ opacity: 0.6, ":hover": { opacity: 1 } }}
                        onClick={() => {
                            navigator.clipboard.writeText(transaction.transaction_reference).then(
                                () => toggleCopySuccess(true),
                                () => toggleCopySuccess(false),
                            )
                        }}
                    >
                        <SvgContentCopyIcon size="1.3rem" />
                    </IconButton>
                </Box>
            </TooltipHelper>
        </Stack>
    )
}
