import { Box, CircularProgress, Divider, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useEffect, useRef, useState } from "react"
import { BarExpandable, BuySupsButton, SupsTooltipContent } from "../.."
import { SvgSupToken, SvgWallet } from "../../../assets"
import { NullUUID } from "../../../constants"
import { useGameServerAuth, useGameServerWebsocket, usePassportServerAuth, usePassportServerWebsocket, useWallet } from "../../../containers"
import { supFormatterNoFixed } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { GameServerKeys, PassportServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { BattleMultipliers, MultiplierUpdateResp } from "../../../types"
import { Transaction } from "../../../types/passport"

export const WalletDetails = () => {
    const { state, subscribe } = useGameServerWebsocket()
    const { user: gsUser } = useGameServerAuth()
    const { state: psState, subscribe: psSubscribe } = usePassportServerWebsocket()
    const { user, userID } = usePassportServerAuth()
    const { onWorldSupsRaw } = useWallet()

    // Multipliers
    const [multipliers, setMultipliers] = useState<BattleMultipliers[]>([])
    const [currentBattleMultiplier, setCurrentBattleMultiplier] = useState<string>("")
    // Transactions
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [latestTransaction, setLatestTransaction] = useState<Transaction[]>([])
    // Accruing transaction spend / ticks
    const supsSpent = useRef<BigNumber>(new BigNumber(0))
    const supsEarned = useRef<BigNumber>(new BigNumber(0))

    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()

    useEffect(() => {
        return subscribe<MultiplierUpdateResp>(GameServerKeys.SubscribeSupsMultiplier, (resp) => {
            const sorted = resp.battles.sort((a, b) => (a.battle_number < b.battle_number ? 1 : 0))
            setMultipliers(sorted)
            setCurrentBattleMultiplier(sorted[0] ? sorted[0].total_multipliers : "0x")
        })
    }, [state, subscribe, gsUser])

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
        setTransactions([...latestTransaction, ...transactions].slice(0, 30))
    }, [latestTransaction, userID])

    if (!onWorldSupsRaw) {
        return (
            <Stack alignItems="center" sx={{ width: "26rem" }}>
                <CircularProgress size="1.8rem" sx={{ color: colors.neonBlue }} />
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
                                    key={`current-multi-key-${currentBattleMultiplier}`}
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
                                    {currentBattleMultiplier}
                                </Typography>
                            )}
                        </Stack>

                        {user && <BuySupsButton user={user} />}
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
                />
            )}
        </>
    )
}
