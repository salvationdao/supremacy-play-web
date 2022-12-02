import { Box, CircularProgress, IconButton, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { MutableRefObject, useRef, useState } from "react"
import { SvgHide, SvgSupToken, SvgUnhide } from "../../../../assets"
import { STAGING_ONLY } from "../../../../constants"
import { useAuth, useWallet } from "../../../../containers"
import { supFormatter } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { useLocalStorage } from "../../../../hooks/useLocalStorage"
import { usePassportSubscriptionAccount } from "../../../../hooks/usePassport"
import { PassportServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { Transaction, User } from "../../../../types"
import { WalletPopover } from "./WalletPopover"

export const WalletInfo = () => {
    const { onWorldSupsRaw } = useWallet()
    const { user } = useAuth()
    const startTime = useRef(new Date())
    // Transactions
    const [transactions, setTransactions] = useState<Transaction[]>([])
    // Accruing transaction spend / ticks
    const supsSpent = useRef<BigNumber>(new BigNumber(0))
    const supsEarned = useRef<BigNumber>(new BigNumber(0))

    const accountID = user.account_id || ""

    usePassportSubscriptionAccount<Transaction[]>(
        {
            URI: "/transactions",
            key: PassportServerKeys.SubscribeUserTransactions,
        },
        (payload) => {
            if (!payload) return
            setTransactions((prev) => {
                if (!payload || payload.length <= 0 || !accountID) return prev

                // Accrue stuff
                payload.forEach((tx) => {
                    const isCredit = accountID === tx.credit
                    const summary = (tx.description + tx.sub_group + tx.group).toLowerCase()

                    // For inflows
                    if (isCredit && (summary.includes("spoil") || summary.includes("won"))) {
                        supsEarned.current = supsEarned.current.plus(new BigNumber(tx.amount))
                    }

                    // For outflows
                    if (!isCredit && !prev.some((t) => t.id === tx.id)) {
                        supsSpent.current = supsSpent.current.plus(new BigNumber(tx.amount))
                    }
                })

                // Append the latest transaction into list
                return [...payload, ...prev].slice(0, 30)
            })
        },
    )

    return (
        <WalletInfoInner
            onWorldSupsRaw={onWorldSupsRaw}
            startTime={startTime}
            user={user}
            accountID={accountID}
            transactions={transactions}
            supsSpent={supsSpent}
            supsEarned={supsEarned}
        />
    )
}

const WalletInfoInner = ({
    onWorldSupsRaw,
    startTime,
    user,
    accountID,
    transactions,
    supsSpent,
    supsEarned,
}: {
    onWorldSupsRaw: string
    startTime: MutableRefObject<Date>
    user: User
    accountID: string
    transactions: Transaction[]
    supsSpent: MutableRefObject<BigNumber>
    supsEarned: MutableRefObject<BigNumber>
}) => {
    const walletPopoverRef = useRef(null)
    const [isWalletPopoverOpen, toggleIsWalletPopoverOpen] = useToggle()
    const [isHideValue, setIsHideValue] = useLocalStorage<boolean>("walletHide", false)

    if (!onWorldSupsRaw) {
        return (
            <Stack alignItems="center" sx={{ width: "10rem" }}>
                <CircularProgress size="1.8rem" sx={{ color: colors.yellow }} />
            </Stack>
        )
    }

    return (
        <>
            <Box
                ref={walletPopoverRef}
                onClick={() => toggleIsWalletPopoverOpen()}
                sx={{
                    mr: ".3rem",
                    px: ".4rem",
                    py: ".6rem",
                    cursor: "pointer",
                    borderRadius: 1,
                    backgroundColor: isWalletPopoverOpen ? "#FFFFFF12" : "unset",
                    ":hover": {
                        backgroundColor: "#FFFFFF12",
                    },
                    ":active": {
                        opacity: 0.8,
                    },
                }}
            >
                <Typography sx={{ fontFamily: fonts.nostromoBold, lineHeight: 1, whiteSpace: "nowrap" }}>
                    <SvgSupToken size="2rem" fill={STAGING_ONLY ? colors.red : colors.yellow} inline />
                    {!isHideValue && <>{onWorldSupsRaw ? supFormatter(onWorldSupsRaw, 2) : "0.00"}</>}
                    {isHideValue && "---"}
                </Typography>
            </Box>

            <IconButton size="small" sx={{ ml: "-.4rem", opacity: 0.4, ":hover": { opacity: 1 } }} onClick={() => setIsHideValue((prev) => !prev)}>
                {isHideValue ? <SvgUnhide size="1.3rem" /> : <SvgHide size="1.3rem" />}
            </IconButton>

            {isWalletPopoverOpen && user && (
                <WalletPopover
                    open={isWalletPopoverOpen}
                    sups={onWorldSupsRaw}
                    accountID={accountID}
                    transactions={transactions}
                    supsSpent={supsSpent}
                    supsEarned={supsEarned}
                    onClose={() => toggleIsWalletPopoverOpen(false)}
                    popoverRef={walletPopoverRef}
                    startTime={startTime.current}
                />
            )}
        </>
    )
}
