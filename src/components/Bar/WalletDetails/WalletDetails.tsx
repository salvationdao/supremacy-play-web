import { Box, Button, CircularProgress, Divider, Stack, Typography } from "@mui/material"
import { BarExpandable, SupsTooltipContent } from "../.."
import { usePassportServerSecureSubscription, useToggle } from "../../../hooks"
import { useEffect, useState } from "react"
import Tooltip from "@mui/material/Tooltip"
import { SvgSupToken, SvgWallet } from "../../../assets"
import { useGameServerWebsocket, usePassportServerAuth, useWallet } from "../../../containers"
import { GameServerKeys, PassportServerKeys } from "../../../keys"
import { Transaction } from "../../../types/passport"
import { shadeColor, supFormatterNoFixed } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { TOKEN_SALE_PAGE } from "../../../constants"

export interface SupsMultipliers {
    total_multipliers: string
    multipliers: { key: string; value: string }[]
}

export const WalletDetails = () => {
    const { state, subscribe } = useGameServerWebsocket()
    const { setOnWorldSupsRaw } = useWallet()
    const { user, userID } = usePassportServerAuth()
    const [isTooltipOpen, toggleIsTooltipOpen] = useToggle()
    const { payload: sups } = usePassportServerSecureSubscription<string>(PassportServerKeys.SubscribeWallet)
    const [multipliers, setMultipliers] = useState<SupsMultipliers>()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const { payload: transactionsPayload } = usePassportServerSecureSubscription<Transaction[]>(
        PassportServerKeys.SubscribeUserTransactions,
    )
    const { payload: latestTransactionPayload, setArguments: latestTransactionArguments } =
        usePassportServerSecureSubscription<Transaction[]>(PassportServerKeys.SubscribeUserLatestTransactions)

    // Subscribe to multipliers
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<SupsMultipliers>(GameServerKeys.SubscribeSupsMultiplier, (payload) => {
            if (!payload) return
            setMultipliers(payload)
        })
    }, [state, subscribe])

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
                        <SvgSupToken size="20px" />
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
                                    multipliers={multipliers}
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
                                <Typography sx={{ fontFamily: "Nostromo Regular Bold", lineHeight: 1 }}>
                                    {sups ? supFormatterNoFixed(sups, 2) : "0.00"}
                                </Typography>

                                {multipliers && (
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
                                        {multipliers.total_multipliers}
                                    </Typography>
                                )}
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
