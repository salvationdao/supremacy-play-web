import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import Tooltip from "@mui/material/Tooltip"
import { SvgContentCopyIcon, SvgSupToken } from "../../../assets"
import moment from "moment"
import { useToggle } from "../../../hooks"
import { Transaction } from "../../../types/passport"
import { TooltipHelper } from "../.."
import { supFormatterNoFixed } from "../../../helpers"

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

    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{ px: 0.8, py: 0.15, backgroundColor: "#00000030", borderRadius: 1 }}
        >
            <TooltipHelper
                placement="left"
                text={transaction.description ? `  ${transaction.description.toUpperCase()}` : ""}
            >
                <Stack direction="row" alignItems="center">
                    <Typography sx={{ lineHeight: 1, color }}>{isCredit ? "+" : "-"}</Typography>
                    <SvgSupToken size="13px" fill={color} />
                    <Typography sx={{ lineHeight: 1, color }}>{supFormatterNoFixed(transaction.amount)}</Typography>
                </Stack>
            </TooltipHelper>

            <Typography
                variant="caption"
                sx={{
                    ml: "auto",
                    mr: 0.3,
                    lineHeight: 1,
                    color: "grey !important",
                }}
            >
                {moment(transaction.created_at).format("h:mm:ss A")}
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
                    <Box sx={{ px: 0.5, py: 0.2 }}>
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
                    tooltip: { sx: { maxWidth: 250, background: "#333333" } },
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
                        <SvgContentCopyIcon size="13px" />
                    </IconButton>
                </Box>
            </Tooltip>
        </Stack>
    )
}
