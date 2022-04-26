import { CircularProgress, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { MutableRefObject, useEffect, useRef, useState } from "react"
import { SvgSupToken } from "../../../../assets"
import { NullUUID } from "../../../../constants"
import { usePassportServerAuth, usePassportServerWebsocket, useWallet } from "../../../../containers"
import { supFormatterNoFixed } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { PassportServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { Transaction, UserData } from "../../../../types/passport"
import { WalletPopover } from "./WalletPopover"

export const WalletInfo = () => {
    const { onWorldSupsRaw } = useWallet()
    const { user, userID } = usePassportServerAuth()
    const { state, subscribe } = usePassportServerWebsocket()
    const startTime = useRef(new Date())
    // Transactions
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [latestTransaction, setLatestTransaction] = useState<Transaction[]>([])
    // Accruing transaction spend / ticks
    const supsSpent = useRef<BigNumber>(new BigNumber(0))
    const supsEarned = useRef<BigNumber>(new BigNumber(0))

    // Get initial 5 transactions
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !user) return
        return subscribe<Transaction[]>(PassportServerKeys.SubscribeUserTransactions, (payload) => {
            if (!payload) return
            setTransactions(payload)
        })
    }, [state, subscribe, user])

    // Subscribe to latest transactions
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !user) return
        return subscribe<Transaction[]>(PassportServerKeys.SubscribeUserLatestTransactions, (payload) => {
            if (!payload) return
            setLatestTransaction(payload)
        })
    }, [state, subscribe, user])

    // Append to latest transaction to list
    useEffect(() => {
        if (!transactions || transactions.length <= 0 || !latestTransaction || latestTransaction.length <= 0 || !userID || userID === NullUUID) return

        // Accrue stuff
        latestTransaction.forEach((tx) => {
            const isCredit = userID === tx.credit
            const summary = (tx.description + tx.sub_group + tx.group).toLowerCase()

            // For inflows
            if (isCredit && (summary.includes("spoil") || summary.includes("won"))) {
                supsEarned.current = supsEarned.current.plus(new BigNumber(tx.amount))
            }

            // For outflows
            if (!isCredit && !transactions.some((t) => t.id === tx.id)) {
                supsSpent.current = supsSpent.current.plus(new BigNumber(tx.amount))
            }
        })

        // Append the latest transaction into list
        setTransactions([...latestTransaction, ...transactions].slice(0, 30))
    }, [latestTransaction, userID])

    return (
        <WalletInfoInner
            onWorldSupsRaw={onWorldSupsRaw}
            startTime={startTime}
            user={user}
            userID={userID}
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
    userID,
    transactions,
    supsSpent,
    supsEarned,
}: {
    onWorldSupsRaw: string
    startTime: MutableRefObject<Date>
    user?: UserData
    userID?: string
    transactions: Transaction[]
    supsSpent: MutableRefObject<BigNumber>
    supsEarned: MutableRefObject<BigNumber>
}) => {
    const walletPopoverRef = useRef(null)
    const [isWalletPopoverOpen, toggleIsWalletPopoverOpen] = useToggle()

    if (!onWorldSupsRaw) {
        return (
            <Stack alignItems="center" sx={{ width: "26rem" }}>
                <CircularProgress size="1.8rem" sx={{ color: colors.neonBlue }} />
            </Stack>
        )
    }

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                ref={walletPopoverRef}
                onClick={() => toggleIsWalletPopoverOpen()}
                sx={{
                    mr: ".3rem",
                    px: ".7rem",
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
                <SvgSupToken size="1.9rem" fill={colors.yellow} sx={{ mr: ".2rem", pb: ".4rem" }} />
                <Typography sx={{ fontFamily: fonts.nostromoBold, lineHeight: 1 }}>
                    {onWorldSupsRaw ? supFormatterNoFixed(onWorldSupsRaw, 2) : "0.00"}
                </Typography>
            </Stack>

            {isWalletPopoverOpen && user && (
                <WalletPopover
                    open={isWalletPopoverOpen}
                    sups={onWorldSupsRaw}
                    userID={userID || ""}
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
