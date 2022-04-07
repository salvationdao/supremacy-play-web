import { Box, IconButton, Popover, Stack, Typography } from "@mui/material"
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
    supsSpent,
    supsEarned,
    userID,
    onClose,
    popoverRef,
    startTime,
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
}) => {
    const [localOpen, toggleLocalOpen] = useToggle(open)
    const [multiplicative, setMultiplicative] = useState<Multiplier[]>([])
    const [multiplierList, setMultiplierList] = useState<Multiplier[]>([])
    const [, setTotalMultiplierValue] = useState(0)
    const [, setTotalMultiplicativeValue] = useState(0)

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
                            <Typography sx={{ lineHeight: 1, mr: ".3rem" }}>• SUPS SPENT:</Typography>
                            <SvgSupToken size="1.4rem" fill={colors.supsDebit} sx={{ pb: ".1rem" }} />
                            <Typography sx={{ lineHeight: 1, color: colors.supsDebit }}>{supFormatterNoFixed(supsSpent.current.toString())}</Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center">
                            <Typography sx={{ lineHeight: 1, mr: ".3rem" }}>• SUPS EARNED:</Typography>
                            <SvgSupToken size="1.4rem" fill={colors.supsCredit} sx={{ pb: ".1rem" }} />
                            <Typography sx={{ lineHeight: 1, color: colors.supsCredit }}>{supFormatterNoFixed(supsEarned.current.toString())}</Typography>
                        </Stack>
                    </Stack>
                </Box>

                <Box>
                    <Typography sx={{ mb: ".24rem", fontWeight: "bold", color: colors.offWhite }} variant="h6">
                        TOTAL SUPS:
                    </Typography>

                    <Stack direction="row" alignItems="center">
                        <SvgSupToken size="1.4rem" fill={colors.yellow} sx={{ pb: ".1rem" }} />
                        <Typography sx={{ lineHeight: 1 }}>{sups ? supFormatterNoFixed(sups) : "0.00"}</Typography>
                    </Stack>
                </Box>

                {multipliers && (
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
                            TOTAL MULTIPLIERS: <span>{multipliers.total_multipliers}</span>
                        </Typography>

                        <Stack spacing="1.2rem">
                            <Stack spacing=".2rem">
                                <Typography sx={{ color: "grey !important" }}>MULTIPLIERS</Typography>
                                <Stack spacing=".32rem">
                                    {multiplierList.map((m, i) => (
                                        <MultiplierItem key={i} multiplier={m} />
                                    ))}
                                </Stack>
                            </Stack>

                            {multiplicative && multiplicative.length > 0 && (
                                <Stack spacing=".2rem">
                                    <Typography sx={{ color: "grey !important" }}>BONUSES</Typography>
                                    <Stack spacing=".32rem">
                                        {multiplicative.map((m, i) => (
                                            <MultiplierItem key={i} multiplier={m} />
                                        ))}
                                    </Stack>
                                </Stack>
                            )}
                        </Stack>
                    </Box>
                )}

                {transactions.length > 0 && (
                    <Box>
                        <Typography sx={{ mb: ".24rem", fontWeight: "bold", color: colors.offWhite }} variant="h6">
                            RECENT TRANSACTIONS:
                        </Typography>

                        <Stack spacing=".4rem">
                            {transactions.map((t, i) => (
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
