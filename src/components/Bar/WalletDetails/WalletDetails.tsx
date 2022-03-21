import { Box, Button, CircularProgress, Divider, Popover, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { BarExpandable, SupsTooltipContent, TooltipHelper } from "../.."
import { SvgSupToken, SvgWallet } from "../../../assets"
import { NullUUID, TOKEN_SALE_PAGE } from "../../../constants"
import {
    SocketState,
    useGame,
    useGameServerAuth,
    useGameServerWebsocket,
    usePassportServerAuth,
    usePassportServerWebsocket,
    useWallet,
} from "../../../containers"
import { dateFormatter, shadeColor, supFormatterNoFixed } from "../../../helpers"
import { usePassportServerSecureSubscription, useToggle } from "../../../hooks"
import { GameServerKeys, PassportServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { MultipliersAll } from "../../../types"
import { Transaction } from "../../../types/passport"

export const WalletDetails = () => {
    const { state, subscribe } = useGameServerWebsocket()
    const { setOnWorldSupsRaw } = useWallet()
    const { battleEndDetail } = useGame()
    const { user, userID } = usePassportServerAuth()
    const { userID: gameserverUserID } = useGameServerAuth()
    const { payload: sups } = usePassportServerSecureSubscription<string>(PassportServerKeys.SubscribeWallet)
    const [multipliers, setMultipliers] = useState<MultipliersAll>()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const { payload: transactionsPayload } = usePassportServerSecureSubscription<Transaction[]>(
        PassportServerKeys.SubscribeUserTransactions,
    )
    const { payload: latestTransactionPayload } = usePassportServerSecureSubscription<Transaction[]>(
        PassportServerKeys.SubscribeUserLatestTransactions,
    )

    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()

    // Free sups button
    const isFreeSupsEnabled = useMemo(
        () =>
            process.env.REACT_APP_SENTRY_ENVIRONMENT === "staging" ||
            process.env.REACT_APP_SENTRY_ENVIRONMENT === "development",
        [],
    )

    const { send: psSend, state: psState } = usePassportServerWebsocket()
    const [timeTilNextClaim, setTimeTilNextClaim] = useState<Date>()

    const getFreeSups = useCallback(async () => {
        if (psState !== SocketState.OPEN || !psSend || !user) return

        const resp = await psSend<Date | boolean>(PassportServerKeys.GetFreeSups)
        if (resp instanceof Date) {
            setTimeTilNextClaim(resp)
        }
    }, [psState, psSend, user])

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
                            onClick={toggleIsPopoverOpen}
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
                                {sups ? supFormatterNoFixed(sups, 2) : "0.00"}
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

                        <TooltipHelper
                            placement="bottom"
                            text={
                                timeTilNextClaim
                                    ? timeTilNextClaim < new Date()
                                        ? "Claim free SUPs!"
                                        : `Time until next claim: ${dateFormatter(timeTilNextClaim)}`
                                    : ""
                            }
                        >
                            <Button
                                sx={{
                                    px: "1.2rem",
                                    pt: ".32rem",
                                    pb: ".16rem",
                                    flexShrink: 0,
                                    justifyContent: "flex-start",
                                    color: isFreeSupsEnabled ? colors.gold : colors.neonBlue,
                                    whiteSpace: "nowrap",
                                    borderRadius: 0.2,
                                    border: `1px solid ${isFreeSupsEnabled ? colors.gold : colors.neonBlue}`,
                                    overflow: "hidden",
                                    fontFamily: "Nostromo Regular Bold",
                                }}
                                href={isFreeSupsEnabled ? undefined : TOKEN_SALE_PAGE}
                                onClick={isFreeSupsEnabled ? () => getFreeSups() : undefined}
                                disabled={timeTilNextClaim && timeTilNextClaim < new Date()}
                            >
                                {isFreeSupsEnabled ? "GET FREE SUPS" : "GET SUPS"}
                            </Button>
                        </TooltipHelper>
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

            <Popover
                open={isPopoverOpen}
                anchorEl={popoverRef.current}
                onClose={() => toggleIsPopoverOpen(false)}
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
                    zIndex: 10000,
                    ".MuiPaper-root": {
                        mt: ".8rem",
                        background: "none",
                        backgroundColor:
                            user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavy,
                        border: "#FFFFFF50 1px solid",
                    },
                }}
            >
                <SupsTooltipContent
                    sups={sups}
                    multipliers={multipliers}
                    userID={userID || ""}
                    transactions={transactions}
                    onClose={() => toggleIsPopoverOpen(false)}
                />
            </Popover>
        </>
    )
}
