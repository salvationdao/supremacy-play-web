import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useEffect, useMemo } from "react"
import Tooltip from "@mui/material/Tooltip"
import { SvgContentCopyIcon, SvgSupToken } from "../../../../assets"
import { useToggle } from "../../../../hooks"
import { Transaction } from "../../../../types"
import { TooltipHelper } from "../../.."
import { dateFormatter, supFormatterNoFixed } from "../../../../helpers"
import { colors, siteZIndex } from "../../../../theme/theme"

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
                <Stack direction="row" alignItems="center" sx={{ mr: ".6rem" }}>
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

            <Tooltip
                arrow
                placement="right"
                open={copySuccess}
                sx={{
                    zIndex: `${siteZIndex.Tooltip} !important`,
                    ".MuiTooltip-popper": {
                        zIndex: `${siteZIndex.Tooltip} !important`,
                    },
                }}
                title={
                    <Box sx={{ px: ".4rem", py: ".16rem" }}>
                        <Typography variant="body1" sx={{ textAlign: "center" }}>
                            Copied!
                        </Typography>
                    </Box>
                }
                componentsProps={{
                    popper: {
                        style: { filter: "drop-shadow(0 3px 3px #00000050)", zIndex: `${siteZIndex.Tooltip} !important`, opacity: 0.92 },
                    },
                    arrow: { sx: { color: "#333333" } },
                    tooltip: { sx: { maxWidth: "25rem", background: "#333333" } },
                }}
            >
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
            </Tooltip>
        </Stack>
    )
}
