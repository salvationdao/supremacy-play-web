import { Box, IconButton, Popover, Stack, Switch, Typography } from "@mui/material"
import { SvgClose, SvgSupToken } from "../../../assets"
import { MultiplierItem, TransactionItem } from "../.."
import { Transaction, UserData } from "../../../types/passport"
import { colors } from "../../../theme/theme"
import { shadeColor, supFormatterNoFixed } from "../../../helpers"
import { Multiplier, MultipliersAll } from "../../../types"
import { useEffect, useState, MutableRefObject } from "react"
import BigNumber from "bignumber.js"
import { useToggle } from "../../../hooks"
import moment from "moment"

const TimeElapsed = ({ startTime }: { startTime: Date }) => {
    const [elapsedTime, setElapsedTime] = useState(Math.round((new Date().getTime() - startTime.getTime()) / 1000))
    const [hours, setHours] = useState<number>()
    const [minutes, setMinutes] = useState<number>()
    const [seconds, setSeconds] = useState<number>()

    useEffect(() => {
        setInterval(() => {
            setElapsedTime((s) => s + 1)
        }, 1000)
    }, [])

    useEffect(() => {
        const d = moment.duration(elapsedTime, "s")
        const hours = Math.floor(d.asHours())
        const minutes = Math.floor(d.asMinutes()) - hours * 60
        const seconds = Math.floor(d.asSeconds()) - hours * 60 * 60 - minutes * 60
        setHours(Math.max(hours, 0))
        setMinutes(Math.max(minutes, 0))
        setSeconds(Math.max(seconds, 0))
    }, [elapsedTime])

    return (
        <>
            {hours ? `${hours}h` : ""} {minutes ? `${minutes}m` : ""} {`${seconds}s`}
        </>
    )
}

export const SupsTooltipContent = ({
    user,
    open,
    sups,
    multipliers,
    transactions,
    supsEarned,
    userID,
    onClose,
    popoverRef,
    startTime,
    battleEndTime,
    multipliersStartTime,
}: {
    user: UserData
    open: boolean
    sups?: string
    multipliers?: MultipliersAll
    transactions: Transaction[]
    supsSpent: MutableRefObject<BigNumber>
    supsEarned: MutableRefObject<BigNumber>
    userID: string
    onClose: () => void
    popoverRef: MutableRefObject<null>
    startTime: Date
    battleEndTime?: Date
    multipliersStartTime: Date
}) => {
    const [localOpen, toggleLocalOpen] = useToggle(open)
    const [multiplicative, setMultiplicative] = useState<Multiplier[]>([])
    const [multiplierList, setMultiplierList] = useState<Multiplier[]>([])
    const [totalMultiplierValue, setTotalMultiplierValue] = useState(0)
    const [totalMultiplicativeValue, setTotalMultiplicativeValue] = useState(0)
    const [totalMultipliers, setTotalMultipliers] = useState(0)
    const [hideBattleTxs, toggleHideBattleTxs] = useToggle()

    useEffect(() => {
        if (!multipliers) {
            setMultiplicative([])
            setMultiplierList([])
            setTotalMultiplierValue(0)
            setTotalMultiplicativeValue(0)
            return
        }

        const m1 = multipliers.multipliers.filter((m) => !m.is_multiplicative)
        const m2 = multipliers.multipliers.filter((m) => m.is_multiplicative)
        setMultiplierList(m1)
        setMultiplicative(m2)

        const total1 = m1.reduce((acc, m) => acc + Math.round(parseFloat(m.value) * 10) / 10, 0)
        const total2 = m2.reduce((acc, m) => acc + Math.round(parseFloat(m.value) * 10) / 10, 0)
        setTotalMultiplierValue(total1)
        setTotalMultiplicativeValue(total2)

        setTotalMultipliers(total1 * (total2 || 1))
    }, [multipliers])

    useEffect(() => {
        if (!localOpen) {
            setTimeout(() => {
                onClose()
            }, 300)
        }
    }, [localOpen])

    return (
        <Popover
            open={localOpen}
            anchorEl={popoverRef.current}
            onClose={() => toggleLocalOpen(false)}
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
                    backgroundColor: user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavy,
                    border: "#FFFFFF50 1px solid",
                },
            }}
        >
            <Stack spacing="1.2rem" sx={{ position: "relative", minWidth: "35rem", px: "2rem", py: "1.4rem" }}>
                <Box>
                    <Typography sx={{ mb: ".24rem", fontWeight: "bold", color: colors.offWhite }} variant="h6">
                        CURRENT SESSION:
                    </Typography>

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
                            <Typography sx={{ lineHeight: 1, color: colors.supsCredit }}>{supFormatterNoFixed(supsEarned.current.toString(), 4)}</Typography>
                        </Stack>
                    </Stack>
                </Box>

                <Box>
                    <Typography sx={{ mb: ".24rem", fontWeight: "bold", color: colors.offWhite }} variant="h6">
                        TOTAL SUPS:
                    </Typography>

                    <Stack direction="row" alignItems="center">
                        <SvgSupToken size="1.4rem" fill={colors.yellow} sx={{ pb: ".1rem" }} />
                        <Typography sx={{ lineHeight: 1 }}>{sups ? supFormatterNoFixed(sups, 18) : "0.00"}</Typography>
                    </Stack>
                </Box>

                {multipliers && (multiplierList.length > 0 || multiplicative.length > 0) && totalMultipliers > 0 && (
                    <Box>
                        <Typography
                            sx={{
                                mb: ".24rem",
                                fontWeight: "bold",
                                color: colors.offWhite,
                                span: { color: colors.yellow },
                            }}
                            variant="h6"
                        >
                            TOTAL MULTIPLIERS: <span>{totalMultipliers}x</span>
                        </Typography>

                        <Box
                            sx={{
                                my: ".8rem",
                                pl: ".5rem",
                                pr: ".5rem",
                                maxHeight: "15rem",
                                overflowY: "auto",
                                overflowX: "hidden",
                                direction: "ltr",
                                scrollbarWidth: "none",
                                "::-webkit-scrollbar": {
                                    width: ".4rem",
                                },
                                "::-webkit-scrollbar-track": {
                                    background: "#FFFFFF15",
                                    borderRadius: 3,
                                },
                                "::-webkit-scrollbar-thumb": {
                                    background: "#FFFFFF96",
                                    borderRadius: 3,
                                },
                            }}
                        >
                            <Stack spacing="1.2rem">
                                <Stack spacing=".2rem">
                                    <Typography sx={{ color: "grey !important" }}>MULTIPLIERS</Typography>
                                    <Stack spacing=".32rem">
                                        {multiplierList.map((m, i) => (
                                            <MultiplierItem key={i} multiplier={m} battleEndTime={battleEndTime} multipliersStartTime={multipliersStartTime} />
                                        ))}
                                    </Stack>
                                </Stack>

                                {multiplicative && multiplicative.length > 0 && (
                                    <Stack spacing=".2rem">
                                        <Typography sx={{ color: "grey !important" }}>BONUSES</Typography>
                                        <Stack spacing=".32rem">
                                            {multiplicative.map((m, i) => (
                                                <MultiplierItem
                                                    key={i}
                                                    multiplier={m}
                                                    battleEndTime={battleEndTime}
                                                    multipliersStartTime={multipliersStartTime}
                                                />
                                            ))}
                                        </Stack>
                                    </Stack>
                                )}
                            </Stack>
                        </Box>
                    </Box>
                )}

                {transactions.length > 0 && (
                    <Box>
                        <Typography sx={{ fontWeight: "bold", color: colors.offWhite }} variant="h6">
                            RECENT TRANSACTIONS:
                        </Typography>

                        <Stack direction="row" alignItems="center" sx={{ mt: "-.5rem", opacity: 0.7, ":hover": { opacity: 1 } }}>
                            <Typography variant="body2">Hide battle transactions:</Typography>
                            <Switch
                                size="small"
                                checked={hideBattleTxs}
                                onClick={() => toggleHideBattleTxs()}
                                sx={{
                                    transform: "scale(.5)",
                                    ".Mui-checked": { color: `${user?.faction.theme.primary} !important` },
                                    ".Mui-checked+.MuiSwitch-track": {
                                        backgroundColor: `${user?.faction.theme.primary}50 !important`,
                                    },
                                }}
                            />
                        </Stack>

                        <Stack spacing=".2rem">
                            {transactions
                                .slice(0, 5)
                                .filter(
                                    (t) =>
                                        !hideBattleTxs ||
                                        (!t.description.toLowerCase().includes("spoil") && !t.description.toLowerCase().includes("battle contri")),
                                )
                                .map((t, i) => (
                                    <TransactionItem userID={userID} key={i} transaction={t} />
                                ))}
                        </Stack>
                    </Box>
                )}

                <IconButton size="small" onClick={() => toggleLocalOpen(false)} sx={{ position: "absolute", top: "-1rem", right: ".2rem" }}>
                    <SvgClose size="1.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                </IconButton>
            </Stack>
        </Popover>
    )
}
