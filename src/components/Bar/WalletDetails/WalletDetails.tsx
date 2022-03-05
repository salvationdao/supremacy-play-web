import { Box, Button, CircularProgress, Divider, Stack, Typography } from "@mui/material"
import { BarExpandable, SupsTooltipContent } from "../.."
import { usePassportServerSecureSubscription, useToggle } from "../../../hooks"
import { useEffect, useState } from "react"
import Tooltip from "@mui/material/Tooltip"
import { SvgSupToken, SvgWallet } from "../../../assets"
import { usePassportServerAuth, useWallet } from "../../../containers"
import { PassportServerKeys } from "../../../keys"
import { Transaction } from "../../../types/passport"
import { shadeColor, supFormatterNoFixed } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { TOKEN_SALE_PAGE } from "../../../constants"

export interface SupsMultiplier {
    key: string
    value: number
    expiredAt: Date
}

export const WalletDetails = () => {
    const { setOnWorldSupsRaw } = useWallet()
    const { user, userID } = usePassportServerAuth()
    const [isTooltipOpen, toggleIsTooltipOpen] = useToggle()
    const { payload: sups } = usePassportServerSecureSubscription<string>(PassportServerKeys.SubscribeWallet)
    const { payload: multipliers } = usePassportServerSecureSubscription<SupsMultiplier[]>(
        PassportServerKeys.SubscribeSupsMultiplier,
    )

    const [supsMultipliers, setSupsMultipliers] = useState<{ [key: string]: SupsMultiplier }>({})
    const [multipliersCleaned, setMultipliersCleaned] = useState<SupsMultiplier[]>([])
    const [totalMultipliers, setTotalMultipliers] = useState(0)
    const [reRender, toggleReRender] = useToggle()

    const [transactions, setTransactions] = useState<Transaction[]>([])
    const { payload: transactionsPayload } = usePassportServerSecureSubscription<Transaction[]>(
        PassportServerKeys.SubscribeUserTransactions,
    )
    const { payload: latestTransactionPayload, setArguments: latestTransactionArguments } =
        usePassportServerSecureSubscription<Transaction[]>(PassportServerKeys.SubscribeUserLatestTransactions)

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
        const mults: { [key: string]: SupsMultiplier } = {}

        if (!multipliers || multipliers.length === 0) {
            setSupsMultipliers({})
            return
        }

        multipliers.forEach((m) => {
            mults[m.key] = { ...m, value: m.value / 100 }
        })

        setSupsMultipliers(mults)
        toggleReRender()
    }, [multipliers])

    useEffect(() => {
        if (Object.keys(supsMultipliers).length <= 0) return
        let sum = 0
        const list: SupsMultiplier[] = []
        Object.keys(supsMultipliers).forEach((sm) => {
            sum += supsMultipliers[sm].value
            list.push(supsMultipliers[sm])
        })
        setTotalMultipliers(sum)
        // Sort longest expiring first before returning
        setMultipliersCleaned(list.sort((a, b) => (b.expiredAt > a.expiredAt ? 1 : -1)))
    }, [supsMultipliers, reRender])

    const selfDestroyed = (key: string) => {
        const mults: { [key: string]: SupsMultiplier } = {}
        if (!multipliers || multipliers.length === 0) {
            setSupsMultipliers(mults)
            return
        }

        multipliers.forEach((m) => {
            if (m.key === key) return
            mults[m.key] = m
        })

        setSupsMultipliers(mults)
    }

    if (!sups) {
        return (
            <Stack alignItems="center" sx={{ width: 260 }}>
                <CircularProgress size={20} />
            </Stack>
        )
    }

    const tooltipBackgroundColor = user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavy

    return (
        <>
            <BarExpandable
                noDivider
                barName={"wallet"}
                iconComponent={
                    <Box sx={{ p: 0.4, backgroundColor: colors.grey, borderRadius: 1 }}>
                        <SvgSupToken size="20px" fill="#FFFFFF" />
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
                            open={isTooltipOpen}
                            placement="bottom-end"
                            title={
                                <SupsTooltipContent
                                    sups={sups}
                                    supsMultipliers={supsMultipliers}
                                    selfDestroyed={selfDestroyed}
                                    multipliersCleaned={multipliersCleaned}
                                    totalMultipliers={totalMultipliers}
                                    userID={userID || ""}
                                    transactions={transactions}
                                    onClose={() => toggleIsTooltipOpen(false)}
                                />
                            }
                            componentsProps={{
                                popper: { style: { zIndex: 99999, filter: "drop-shadow(0 3px 3px #00000050)" } },
                                arrow: { sx: { color: tooltipBackgroundColor } },
                                tooltip: { sx: { width: 320, maxWidth: 320, background: tooltipBackgroundColor } },
                            }}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                onClick={toggleIsTooltipOpen}
                                sx={{
                                    px: 1.2,
                                    py: 1,
                                    cursor: "pointer",
                                    borderRadius: 1,
                                    backgroundColor: isTooltipOpen ? "#FFFFFF12" : "unset",
                                    ":hover": {
                                        backgroundColor: "#FFFFFF12",
                                    },
                                    ":active": {
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                <SvgWallet size="23px" sx={{ mr: 1.3 }} />
                                <SvgSupToken size="19px" fill={colors.yellow} sx={{ mr: 0.6 }} />
                                <Typography
                                    sx={{ fontFamily: "Nostromo Regular Bold", lineHeight: 1, color: "#FFFFFF" }}
                                >
                                    {sups ? supFormatterNoFixed(sups, 2) : "0.00"}
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
                                        fontFamily: "Nostromo Regular Bold",
                                        border: `${colors.orange} 1px solid`,
                                        color: colors.orange,
                                        borderRadius: 0.6,
                                    }}
                                >
                                    {totalMultipliers.toFixed(2)}x
                                </Typography>
                            </Stack>
                        </Tooltip>

                        <Button
                            href={TOKEN_SALE_PAGE}
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
                                fontFamily: "Nostromo Regular Bold",
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
                            borderColor: "#494949",
                            borderRightWidth: 1.6,
                        }}
                    />
                </Stack>
            </BarExpandable>
        </>
    )
}
