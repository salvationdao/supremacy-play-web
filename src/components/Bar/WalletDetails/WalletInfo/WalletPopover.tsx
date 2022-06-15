import { Box, IconButton, Popover, Stack, Switch, Typography } from "@mui/material"
import { SvgClose, SvgSupToken } from "../../../../assets"
import { ClipThing, TransactionItem } from "../../.."
import { Transaction } from "../../../../types"
import { colors, siteZIndex } from "../../../../theme/theme"
import { supFormatterNoFixed } from "../../../../helpers"
import { useEffect, MutableRefObject } from "react"
import BigNumber from "bignumber.js"
import { useToggle } from "../../../../hooks"
import { TimeElapsed } from "./TimeElapsed"
import { useTheme } from "../../../../containers/theme"

export const WalletPopover = ({
    open,
    sups,
    transactions,
    supsEarned,
    userID,
    onClose,
    popoverRef,
    startTime,
}: {
    open: boolean
    sups?: string
    transactions: Transaction[]
    supsSpent: MutableRefObject<BigNumber>
    supsEarned: MutableRefObject<BigNumber>
    userID: string
    onClose: () => void
    popoverRef: MutableRefObject<null>
    startTime: Date
}) => {
    const theme = useTheme()
    const [localOpen, toggleLocalOpen] = useToggle(open)
    const [hideBattleTxs, toggleHideBattleTxs] = useToggle()

    useEffect(() => {
        if (!localOpen) {
            const timeout = setTimeout(() => {
                onClose()
            }, 300)

            return () => clearTimeout(timeout)
        }
    }, [localOpen, onClose])

    return (
        <Popover
            open={localOpen}
            anchorEl={popoverRef.current}
            onClose={() => toggleLocalOpen(false)}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            sx={{
                mt: ".8rem",
                zIndex: siteZIndex.Popover,
                ".MuiPaper-root": {
                    mt: ".8rem",
                    background: "none",
                    boxShadow: 0,
                },
            }}
        >
            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: true,
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                backgroundColor={theme.factionTheme.background}
                sx={{ height: "100%" }}
            >
                <Stack spacing="1.2rem" sx={{ position: "relative", minWidth: "35rem", px: "2rem", pt: "1.6rem", pb: "2rem" }}>
                    <Box>
                        <Typography sx={{ mb: ".24rem", fontWeight: "bold", color: colors.offWhite }} variant="h6">
                            CURRENT SESSION:
                        </Typography>

                        <Stack spacing=".5rem">
                            <Stack direction="row" alignItems="center">
                                <Typography sx={{ lineHeight: 1, mr: ".3rem" }}>• TIME ELAPSED:</Typography>
                                <Typography sx={{ lineHeight: 1, color: colors.neonBlue }}>
                                    <TimeElapsed startTime={startTime} />
                                </Typography>
                            </Stack>

                            <Stack direction="row" alignItems="center">
                                <Typography sx={{ lineHeight: 1, mr: ".3rem" }}>• SUPS EARNED:</Typography>
                                <SvgSupToken size="1.4rem" fill={colors.supsCredit} sx={{ pb: ".1rem" }} />
                                <Typography
                                    sx={{
                                        lineHeight: 1,
                                        color: colors.supsCredit,
                                    }}
                                >
                                    {supFormatterNoFixed(supsEarned.current.toString(), 4)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Box>

                    <Box>
                        <Typography sx={{ mb: ".24rem", fontWeight: "bold", color: colors.offWhite }} variant="h6">
                            TOTAL SUPS:
                        </Typography>

                        <Stack direction="row" alignItems="center">
                            <SvgSupToken size="1.4rem" fill={colors.yellow} sx={{ pb: ".1rem" }} />
                            <Typography sx={{ lineHeight: 1 }}>{sups ? supFormatterNoFixed(sups, 18) : "0.00"}</Typography>
                        </Stack>
                    </Box>

                    {transactions.length > 0 && (
                        <Box>
                            <Typography sx={{ fontWeight: "bold", color: colors.offWhite }} variant="h6">
                                RECENT TRANSACTIONS:
                            </Typography>

                            <Stack direction="row" alignItems="center" sx={{ mt: "-.5rem", opacity: 0.7, ":hover": { opacity: 1 } }}>
                                <Typography variant="body2">Hide battle transactions:</Typography>
                                <Switch
                                    size="small"
                                    checked={hideBattleTxs}
                                    onClick={() => toggleHideBattleTxs()}
                                    sx={{
                                        transform: "scale(.5)",
                                        ".Mui-checked": { color: (theme) => `${theme.factionTheme.primary} !important` },
                                        ".Mui-checked+.MuiSwitch-track": {
                                            backgroundColor: (theme) => `${theme.factionTheme.primary}50 !important`,
                                        },
                                    }}
                                />
                            </Stack>

                            <Stack spacing=".3rem">
                                {transactions
                                    .slice(0, 5)
                                    .filter(
                                        (t) =>
                                            !hideBattleTxs ||
                                            (!t.description.toLowerCase().includes("spoil") && !t.description.toLowerCase().includes("battle contri")),
                                    )

                                    .map((t, i) => (
                                        <TransactionItem userID={userID} key={i} transaction={t} />
                                    ))}
                            </Stack>
                        </Box>
                    )}

                    <IconButton size="small" onClick={() => toggleLocalOpen(false)} sx={{ position: "absolute", top: "-1rem", right: ".2rem" }}>
                        <SvgClose size="1.9rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </Stack>
            </ClipThing>
        </Popover>
    )
}
