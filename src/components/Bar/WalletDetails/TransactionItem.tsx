import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import Tooltip from "@mui/material/Tooltip"
import { SvgContentCopyIcon, SvgSupToken } from "../../../assets"
import { useToggle } from "../../../hooks"
import { Transaction } from "../../../types/passport"
import { TooltipHelper } from "../.."
import { dateFormatter, supFormatterNoFixed } from "../../../helpers"

export const TransactionItem = ({ transaction, userID }: { transaction: Transaction; userID: string }) => {
    const isCredit = userID === transaction.credit
    const color = isCredit ? "#01FF70" : "#FF4136"
    const [copySuccess, toggleCopySuccess] = useToggle()

    useEffect(() => {
        if (copySuccess) {
            setTimeout(() => {
                toggleCopySuccess(false)
            }, 900)
        }
    }, [copySuccess])

    const tooltipText = transaction.description || transaction.sub_group || transaction.group

    return (
        <TooltipHelper placement="left" text={tooltipText ? `  ${tooltipText.toUpperCase()}` : ""}>
            <Stack
                direction="row"
                alignItems="center"
                sx={{ px: ".64rem", py: ".12rem", backgroundColor: "#00000030", borderRadius: 1 }}
            >
                <Stack direction="row" alignItems="center">
                    <Typography sx={{ lineHeight: 1, color }}>{isCredit ? "+" : "-"}</Typography>
                    <SvgSupToken size="1.3rem" fill={color} />
                    <Typography sx={{ lineHeight: 1, color }}>{supFormatterNoFixed(transaction.amount)}</Typography>
                </Stack>

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
                        zIndex: "9999999 !important",
                        ".MuiTooltip-popper": {
                            zIndex: "9999999 !important",
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
                            style: { filter: "drop-shadow(0 3px 3px #00000050)", zIndex: 999999, opacity: 0.92 },
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
                                    (err) => toggleCopySuccess(false),
                                )
                            }}
                        >
                            <SvgContentCopyIcon size="1.3rem" />
                        </IconButton>
                    </Box>
                </Tooltip>
            </Stack>
        </TooltipHelper>
    )
}
