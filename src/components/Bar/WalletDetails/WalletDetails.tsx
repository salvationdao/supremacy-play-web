import { Box, CircularProgress, Divider, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useEffect, useRef, useState } from "react"
import { BarExpandable, BuySupsButton, SupsTooltipContent } from "../.."
import { SvgSupToken, SvgWallet } from "../../../assets"
import { NullUUID } from "../../../constants"
import { useGame, useGameServerAuth, useGameServerWebsocket, usePassportServerAuth, usePassportServerWebsocket, useWallet } from "../../../containers"
import { supFormatterNoFixed } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { GameServerKeys, PassportServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { MultipliersAll } from "../../../types"
import { Transaction } from "../../../types/passport"

export const WalletDetails = () => {
    const { state, subscribe } = useGameServerWebsocket()
    const { state: psState, subscribe: psSubscribe } = usePassportServerWebsocket()
    const { battleEndDetail } = useGame()
    const { user, userID } = usePassportServerAuth()
    const { userID: gameserverUserID } = useGameServerAuth()
    const { onWorldSupsRaw } = useWallet()
    const startTime = useRef(new Date())
    // Multipliers
    const [multipliers, setMultipliers] = useState<MultipliersAll>()
    // Transactions
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [latestTransaction, setLatestTransaction] = useState<Transaction[]>([])
    // Accruing transaction spend / ticks
    const supsSpent = useRef<BigNumber>(new BigNumber(0))
    const supsEarned = useRef<BigNumber>(new BigNumber(0))

    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()

    useEffect(() => {
        if (battleEndDetail && battleEndDetail.multipliers.length > 0) {
            setMultipliers({
                total_multipliers: battleEndDetail.total_multipliers,
                multipliers: battleEndDetail.multipliers,
            })
        } else {
            setMultipliers(undefined)
        }
    }, [battleEndDetail])

    // Subscribe to multipliers
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !gameserverUserID || gameserverUserID === NullUUID) return
        return subscribe<MultipliersAll>(GameServerKeys.SubscribeSupsMultiplier, (payload) => {
            if (!payload || payload.multipliers.length <= 0) return
            setMultipliers(payload)
        })
    }, [state, subscribe, gameserverUserID])

    // Get initial 5 transactions
    useEffect(() => {
        if (psState !== WebSocket.OPEN || !psSubscribe || !user) return
        return psSubscribe<Transaction[]>(PassportServerKeys.SubscribeUserTransactions, (payload) => {
            if (!payload) return
            setTransactions(payload)
        })
    }, [psState, psSubscribe, user])

    // Subscribe to latest transactions
    useEffect(() => {
        if (psState !== WebSocket.OPEN || !psSubscribe || !user) return
        return psSubscribe<Transaction[]>(PassportServerKeys.SubscribeUserLatestTransactions, (payload) => {
            if (!payload) return
            setLatestTransaction(payload)
        })
    }, [psState, psSubscribe, user])

    // Append to latest transaction to list
    useEffect(() => {
        if (!transactions || transactions.length <= 0 || !latestTransaction || latestTransaction.length <= 0 || !userID || userID === NullUUID) return

        // Accrue stuff
        latestTransaction.forEach((tx) => {
            const isCredit = userID === tx.credit

            // For inflow of spoil ticks
            if (isCredit) {
                supsEarned.current = supsEarned.current.plus(new BigNumber(tx.amount))
            }

            if (!isCredit && !transactions.some((t) => t.id === tx.id)) {
                supsSpent.current = supsSpent.current.plus(new BigNumber(tx.amount))
            }
        })

        // Append the latest transaction into list
        setTransactions([...latestTransaction, ...transactions].slice(0, 5))
    }, [latestTransaction, userID])

    if (!onWorldSupsRaw) {
        return (
            <Stack alignItems="center" sx={{ width: "26rem" }}>
                <CircularProgress size="2rem" />
            </Stack>
        )
    }

    return (
        <>
            <BarExpandable
                noDivider
                barName={"wallet"}
                iconComponent={
                    <Box sx={{ p: ".32rem", backgroundColor: colors.grey, borderRadius: 1 }}>
                        <SvgSupToken size="2rem" />
                    </Box>
                }
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                        mx: "1.2rem",
                        height: "100%",
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing="1.6rem"
                        sx={{
                            position: "relative",
                            height: "100%",
                            overflowX: "auto",
                            overflowY: "hidden",
                            scrollbarWidth: "none",
                            "::-webkit-scrollbar": {
                                height: ".4rem",
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
                        <Stack
                            ref={popoverRef}
                            onClick={() => toggleIsPopoverOpen()}
                            direction="row"
                            alignItems="center"
                            sx={{
                                px: ".96rem",
                                py: ".8rem",
                                cursor: "pointer",
                                borderRadius: 1,
                                backgroundColor: isPopoverOpen ? "#FFFFFF12" : "unset",
                                ":hover": {
                                    backgroundColor: "#FFFFFF12",
                                },
                                ":active": {
                                    opacity: 0.8,
                                },
                            }}
                        >
                            <SvgWallet size="2.3rem" sx={{ mr: "1.04rem" }} />
                            <SvgSupToken size="1.9rem" fill={colors.yellow} sx={{ mr: ".2rem", pb: ".4rem" }} />
                            <Typography sx={{ fontFamily: "Nostromo Regular Bold", lineHeight: 1 }}>
                                {onWorldSupsRaw ? supFormatterNoFixed(onWorldSupsRaw, 2) : "0.00"}
                            </Typography>

                            {multipliers && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        ml: ".8rem",
                                        px: ".8rem",
                                        pt: ".4rem",
                                        pb: ".24rem",
                                        textAlign: "center",
                                        lineHeight: 1,
                                        fontFamily: "Nostromo Regular Bold",
                                        border: `${colors.orange} 1px solid`,
                                        color: colors.orange,
                                        borderRadius: 0.6,
                                    }}
                                >
                                    {multipliers.total_multipliers}
                                </Typography>
                            )}
                        </Stack>

                        <BuySupsButton user={user} />
                    </Stack>

                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                            height: "2.3rem",
                            my: "auto !important",
                            ml: "2.4rem",
                            borderColor: "#494949",
                            borderRightWidth: 1.6,
                        }}
                    />
                </Stack>
            </BarExpandable>

            {isPopoverOpen && user && (
                <SupsTooltipContent
                    user={user}
                    open={isPopoverOpen}
                    sups={onWorldSupsRaw}
                    multipliers={multipliers}
                    userID={userID || ""}
                    transactions={transactions}
                    supsSpent={supsSpent}
                    supsEarned={supsEarned}
                    onClose={() => toggleIsPopoverOpen(false)}
                    popoverRef={popoverRef}
                    startTime={startTime.current}
                />
            )}
        </>
    )
}
