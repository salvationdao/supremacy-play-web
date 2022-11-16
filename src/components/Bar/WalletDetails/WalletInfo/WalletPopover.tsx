import { Box, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { MutableRefObject, useEffect } from "react"
import { TransactionItem } from "../../.."
import { SvgExternalLink, SvgSupToken } from "../../../../assets"
import { IS_TESTING_MODE, PASSPORT_WEB } from "../../../../constants"
import { useTheme } from "../../../../containers/theme"
import { supFormatter } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { colors, fonts } from "../../../../theme/theme"
import { Transaction } from "../../../../types"
import { NicePopover } from "../../../Common/Nice/NicePopover"
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
        <NicePopover
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
        >
            <Stack spacing="2rem" sx={{ position: "relative", minWidth: "30rem", maxHeight: "90vh", p: "1rem 1.6rem" }}>
                <Box>
                    <Typography sx={{ mb: "1rem", fontFamily: fonts.nostromoBlack }}>CURRENT SESSION</Typography>

                    <Stack spacing=".5rem">
                        <Typography sx={{ lineHeight: 1 }}>
                            • TIME ELAPSED:{" "}
                            <span style={{ color: colors.neonBlue }}>
                                <TimeElapsed startTime={startTime} />
                            </span>
                        </Typography>

                        <Typography sx={{ lineHeight: 1 }}>
                            • SUPS EARNED:{" "}
                            <span style={{ color: colors.supsCredit }}>
                                <SvgSupToken size="1.4rem" fill={colors.supsCredit} inline />
                                {supFormatter(supsEarned.current.toString(), 4)}
                            </span>
                        </Typography>
                    </Stack>
                </Box>

                <Stack spacing=".5rem">
                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>TOTAL {IS_TESTING_MODE ? "V" : ""}SUPS</Typography>

                    <Typography sx={{ lineHeight: 1 }}>
                        <SvgSupToken size="1.4rem" fill={IS_TESTING_MODE ? colors.red : colors.yellow} inline />
                        {sups ? supFormatter(sups, 18) : "0.00"}
                    </Typography>
                </Stack>

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
            </Stack>
        </NicePopover>
    )
}
