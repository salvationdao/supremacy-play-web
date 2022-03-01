import { Box, Button, CircularProgress, Divider, IconButton, Snackbar, Stack, Typography } from "@mui/material"
import { BarExpandable } from ".."
import { supFormatter } from "../../helpers"
import { colors } from "../../theme"
import { useBar, useWallet } from "../../containers"
import { useSecureSubscription } from "../../hooks"
import HubKey from "../../keys"
import { useEffect, useState } from "react"
import { useInterval } from "../../hooks/useInterval"
import Tooltip from "@mui/material/Tooltip"
import { SvgContentCopyIcon, SvgSupToken, SvgWallet } from "../../assets"
import { useToggle } from "../../../../hooks"
import { useAuth } from "../../../../containers/auth"
import { NilUUID } from "../../constants"
import { Transaction } from "../../types"

interface SupsMultiplier {
    key: string
    value: number
    expiredAt: Date
}

export const WalletDetails = ({ tokenSalePage }: { tokenSalePage: string }) => {
    const { setOnWorldSupsRaw } = useWallet()
    const { userID } = useAuth()
    const { barPosition } = useBar()
    const { payload: sups } = useSecureSubscription<string>(HubKey.SubscribeWallet)
    const { payload: multipliers } = useSecureSubscription<SupsMultiplier[]>(HubKey.SubscribeSupsMultiplier)

    const [supsMultipliers, setSupsMultipliers] = useState<Map<string, SupsMultiplier>>(
        new Map<string, SupsMultiplier>(),
    )
    const [multipliersCleaned, setMultipliersCleaned] = useState<SupsMultiplier[]>([])
    const [totalMultipliers, setTotalMultipliers] = useState(0)
    const [reRender, toggleReRender] = useToggle()

    const [copySuccess, setCopySuccess] = useState(false)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const { payload: transactionsPayload, setArguments } = useSecureSubscription<Transaction[]>(
        HubKey.SubscribeUserTransactions,
    )
    const { payload: latestTransactionPayload, setArguments: latestTransactionArguments } = useSecureSubscription<
        Transaction[]
    >(HubKey.SubscribeUserLatestTransactions)

    useEffect(() => {
        if (!userID || userID === NilUUID) return
        setArguments({ id: userID })
        latestTransactionArguments({ id: userID })
    }, [userID])

    // get initial 5 transactions
    useEffect(() => {
        if (!transactionsPayload) return
        setTransactions(transactionsPayload)
    }, [transactionsPayload])

    // get latest transaction, append to transactions list
    useEffect(() => {
        if (!latestTransactionPayload) return
        if (transactions.length < 5) {
            setTransactions([...latestTransactionPayload, ...transactions])
            return
        }

        transactions.pop()
        setTransactions([...latestTransactionPayload, ...transactions])
    }, [latestTransactionPayload])

    // Set the sups amount in wallet container
    useEffect(() => {
        if (!sups) return
        setOnWorldSupsRaw(sups)
    }, [sups, setOnWorldSupsRaw])

    // Subscription only sends back new multipliers, not including existing ones,
    // so this useEffect adds new ones in.
    useEffect(() => {
        setSupsMultipliers((prev) => {
            if (!multipliers || multipliers.length === 0) {
                return new Map<string, SupsMultiplier>()
            }

            multipliers.forEach((m) => {
                prev.set(m.key, { ...m, value: m.value / 100.0 })
            })

            return prev
        })
        toggleReRender()
    }, [multipliers])

    useEffect(() => {
        if (supsMultipliers.size <= 0) return
        let sum = 0
        const list: SupsMultiplier[] = []
        supsMultipliers.forEach((sm) => {
            sum += sm.value
            list.push(sm)
        })
        setTotalMultipliers(sum)
        // Sort longest expiring first before returning
        setMultipliersCleaned(list.sort((a, b) => (b.expiredAt > a.expiredAt ? 1 : -1)))
    }, [supsMultipliers, reRender])

    const selfDestroyed = (key: string) => {
        supsMultipliers.delete(key)
    }

    if (!sups) {
        return (
            <Stack alignItems="center" sx={{ width: 260 }}>
                <CircularProgress size={20} />
            </Stack>
        )
    }

    return (
        <>
            <BarExpandable
                noDivider
                barName={"wallet"}
                iconComponent={
                    <Box sx={{ p: 0.4, backgroundColor: colors.grey, borderRadius: 1 }}>
                        <SvgSupToken size="20px" fill={colors.text} />
                    </Box>
                }
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                        mx: 1.5,
                        height: "100%",
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{
                            position: "relative",
                            height: "100%",
                            overflowX: "auto",
                            overflowY: "hidden",
                            scrollbarWidth: "none",
                            "::-webkit-scrollbar": {
                                height: 4,
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: colors.darkNeonBlue,
                                borderRadius: 3,
                            },
                        }}
                    >
                        <Tooltip
                            arrow
                            placement={barPosition === "top" ? "bottom-start" : "top-start"}
                            title={
                                <SupsToolTipContent
                                    sups={sups}
                                    supsMultipliers={supsMultipliers}
                                    selfDestroyed={selfDestroyed}
                                    multipliersCleaned={multipliersCleaned}
                                    totalMultipliers={totalMultipliers}
                                    setCopySuccess={setCopySuccess}
                                    userID={userID || ""}
                                    transactions={transactions}
                                />
                            }
                            componentsProps={{
                                popper: { style: { zIndex: 99999, filter: "drop-shadow(0 3px 3px #00000050)" } },
                                arrow: { sx: { color: colors.darkNavy } },
                                tooltip: { sx: { width: 320, maxWidth: 320, background: colors.darkNavy } },
                            }}
                        >
                            <Stack direction="row" alignItems="center">
                                <SvgWallet size="23px" sx={{ mr: 1.3 }} />
                                <SvgSupToken size="19px" fill={colors.yellow} sx={{ mr: 0.6 }} />
                                <Typography sx={{ lineHeight: 1 }}>
                                    {sups ? supFormatter(sups, 0) : "0.0000"}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        ml: 1,
                                        px: 1,
                                        pt: 0.5,
                                        pb: 0.3,
                                        textAlign: "center",
                                        lineHeight: 1,
                                        border: `${colors.orange} 1px solid`,
                                        color: colors.orange,
                                        borderRadius: 0.6,
                                    }}
                                >
                                    {totalMultipliers}x
                                </Typography>
                            </Stack>
                        </Tooltip>

                        <Button
                            href={tokenSalePage}
                            target="_blank"
                            sx={{
                                px: 1.5,
                                pt: 0.4,
                                pb: 0.2,
                                flexShrink: 0,
                                justifyContent: "flex-start",
                                color: colors.neonBlue,
                                whiteSpace: "nowrap",
                                borderRadius: 0.2,
                                border: `1px solid ${colors.neonBlue}`,
                                overflow: "hidden",
                            }}
                        >
                            Get SUPS
                        </Button>
                    </Stack>

                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                            height: 23,
                            my: "auto !important",
                            ml: 3,
                            borderColor: colors.darkGrey,
                            borderRightWidth: 1.6,
                        }}
                    />
                </Stack>
            </BarExpandable>
            <CopySuccessSnackbar
                open={copySuccess}
                setOpen={setCopySuccess}
                handleClose={() => setCopySuccess(false)}
            />
        </>
    )
}

const SupsToolTipContent = ({
    sups,
    supsMultipliers,
    selfDestroyed,
    multipliersCleaned,
    totalMultipliers,
    transactions,
    userID,
    setCopySuccess,
}: {
    sups?: string
    supsMultipliers: Map<string, SupsMultiplier>
    selfDestroyed: (key: string) => void
    multipliersCleaned: SupsMultiplier[]
    totalMultipliers: number
    transactions: Transaction[]
    setCopySuccess: (b: boolean) => void
    userID: string
}) => {
    return (
        <Stack spacing={1.5} sx={{ px: 1.3, py: 1 }}>
            <Box>
                <Typography sx={{ fontFamily: "Share Tech", fontWeight: "bold", color: colors.textBlue }} variant="h6">
                    TOTAL SUPS:
                </Typography>

                <Stack direction="row" alignItems="center" spacing={0.4} sx={{ mt: 0.4 }}>
                    <SvgSupToken size="14px" fill={colors.yellow} />
                    <Typography sx={{ fontFamily: "Share Tech", lineHeight: 1 }} variant="body2">
                        {sups ? supFormatter(sups, 18) : "0.0000"}
                    </Typography>
                </Stack>
            </Box>

            {supsMultipliers.size > 0 && (
                <Box>
                    <Typography
                        sx={{ fontFamily: "Share Tech", fontWeight: "bold", color: colors.textBlue }}
                        variant="h6"
                    >
                        MULTIPLIERS: {`${totalMultipliers}x`}
                    </Typography>

                    <Stack spacing={0.4}>
                        {multipliersCleaned.map((sm, i) => (
                            <MultiplierItem key={i} supsMultiplier={sm} selfDestroyed={selfDestroyed} />
                        ))}
                    </Stack>
                </Box>
            )}

            {transactions.length > 0 && (
                <Box>
                    <Typography
                        sx={{ fontFamily: "Share Tech", fontWeight: "bold", color: colors.textBlue }}
                        mb={1}
                        variant="body1"
                    >
                        TRANSACTIONS:
                    </Typography>

                    <Stack spacing={0.4}>
                        {transactions.map((t, i) => (
                            <TransactionItem setCopySuccess={setCopySuccess} userID={userID} key={i} transaction={t} />
                        ))}
                    </Stack>
                </Box>
            )}
        </Stack>
    )
}

const MultiplierItem = ({
    supsMultiplier,
    selfDestroyed,
}: {
    supsMultiplier: SupsMultiplier
    selfDestroyed: (key: string) => void
}) => {
    const getRemainSecond = (date: Date): number => {
        return Math.floor((supsMultiplier.expiredAt.getTime() - new Date().getTime()) / 1000)
    }

    const [timeRemain, setTimeRemain] = useState<number>(getRemainSecond(supsMultiplier.expiredAt))
    useInterval(() => {
        const t = getRemainSecond(supsMultiplier.expiredAt)
        if (t <= 0) {
            selfDestroyed(supsMultiplier.key)
        }
        setTimeRemain(getRemainSecond(supsMultiplier.expiredAt))
    }, 1000)

    const keyTitle = (key: string) => {
        const index = supsMultiplier.key.indexOf("_")
        if (index === -1) return key
        return key.substring(0, index)
    }

    if (timeRemain <= 0) return null

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ fontFamily: "Share Tech", flex: 1 }} variant="body2">
                &#8226; {keyTitle(supsMultiplier.key).toUpperCase()}:
            </Typography>

            <Typography sx={{ fontFamily: "Share Tech", minWidth: 25, textAlign: "end" }} variant="body2">
                +{supsMultiplier.value}x
            </Typography>

            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ minWidth: 50, alignSelf: "stretch", background: "#00000075", borderRadius: 1 }}
            >
                <Typography
                    sx={{ fontFamily: "Share Tech", textAlign: "center", lineHeight: 1, color: "grey !important" }}
                    variant="caption"
                >
                    {supsMultiplier.key !== "Online" ? `${timeRemain}s` : "∞"}
                </Typography>
            </Stack>
        </Stack>
    )
}

const TransactionItem = ({
    transaction,
    userID,
    setCopySuccess,
}: {
    transaction: Transaction
    userID: string
    setCopySuccess: (b: boolean) => void
}) => {
    const isCredit = userID === transaction.credit
    const isDecimal = parseFloat(transaction.amount) % 1 !== 0

    return (
        <Stack direction="row" display={"flex"} justifyContent="space-between">
            <Typography
                sx={{ mt: 0.3, fontFamily: "Share Tech", lineHeight: 1, color: isCredit ? "#01FF70" : "#FF4136" }}
            >
                {isCredit ? "+" : "-"} {supFormatter(`${transaction.amount}`, isDecimal ? 18 : 0)}{" "}
                {transaction.description ? `  ${transaction.description}` : ""}
            </Typography>

            <IconButton
                onClick={() => {
                    navigator.clipboard.writeText(transaction.transactionReference).then(
                        () => {
                            setCopySuccess(true)
                        },
                        (err) => {
                            setCopySuccess(false)
                        },
                    )
                }}
            >
                <SvgContentCopyIcon sx={{ marginTop: "-5px" }} />
            </IconButton>
        </Stack>
    )
}

const CopySuccessSnackbar = ({
    open,
    handleClose,
}: {
    open: boolean
    setOpen: (b: boolean) => void
    handleClose: () => void
}) => {
    return (
        <Snackbar
            open={open}
            color="success"
            autoHideDuration={6000}
            onClose={handleClose}
            message={<span>Transaction reference copied</span>}
        />
    )
}
