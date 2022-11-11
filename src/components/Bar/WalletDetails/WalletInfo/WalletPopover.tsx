import { Box, IconButton, Popover, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { MutableRefObject, useEffect } from "react"
import { TransactionItem } from "../../.."
import { SvgClose, SvgExternalLink, SvgSupToken } from "../../../../assets"
import { IS_TESTING_MODE, PASSPORT_WEB } from "../../../../constants"
import { useTheme } from "../../../../containers/theme"
import { supFormatter } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"
import { Transaction } from "../../../../types"
import { NiceBoxThing } from "../../../Common/Nice/NiceBoxThing"
import { TimeElapsed } from "./TimeElapsed"

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
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
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
            <NiceBoxThing border={{ color: theme.factionTheme.primary }} background={{ color: [theme.factionTheme.background] }} sx={{ height: "100%" }}>
                <Stack spacing="2rem" sx={{ position: "relative", minWidth: "35rem", maxHeight: "90vh", px: "2rem", pt: "1.6rem", pb: "2rem" }}>
                    <Box>
                        <Typography sx={{ mb: "1rem", fontFamily: fonts.nostromoBlack, color: theme.factionTheme.primary }}>CURRENT SESSION</Typography>

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
                                    {supFormatter(supsEarned.current.toString(), 4)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Box>

                    <Box>
                        <Typography sx={{ mb: "1rem", fontFamily: fonts.nostromoBlack, color: theme.factionTheme.primary }}>
                            TOTAL {IS_TESTING_MODE ? "V" : ""}SUPS
                        </Typography>

                        <Stack direction="row" alignItems="center">
                            <SvgSupToken size="1.4rem" fill={IS_TESTING_MODE ? colors.red : colors.yellow} sx={{ pb: ".1rem" }} />
                            <Typography sx={{ lineHeight: 1 }}>{sups ? supFormatter(sups, 18) : "0.00"}</Typography>
                        </Stack>
                    </Box>

                    {transactions.length > 0 && (
                        <Box>
                            <Stack direction="row" alignItems="center" spacing=".8rem" sx={{ mb: ".2rem" }}>
                                <Typography sx={{ fontFamily: fonts.nostromoBlack, color: theme.factionTheme.primary }}>TRANSACTIONS (24HRS)</Typography>

                                <a href={`${PASSPORT_WEB}transactions`} target="_blank" rel="noreferrer">
                                    <SvgExternalLink size="1.2rem" sx={{ opacity: 0.7, ":hover": { opacity: 1 } }} />
                                </a>
                            </Stack>

                            <Stack spacing=".3rem">
                                {transactions.slice(0, 5).map((t, i) => (
                                    <TransactionItem userID={userID} key={i} transaction={t} />
                                ))}
                            </Stack>
                        </Box>
                    )}

                    <IconButton size="small" onClick={() => toggleLocalOpen(false)} sx={{ position: "absolute", top: "-2rem", right: ".2rem" }}>
                        <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </Stack>
            </NiceBoxThing>
        </Popover>
    )
}
