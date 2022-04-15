import { Box, Button, Collapse, IconButton, Popover, Stack, Switch, Typography } from "@mui/material"
import { SvgClose, SvgSupToken } from "../../../assets"
import { MultiplierItem, TransactionItem } from "../.."
import { Transaction, UserData } from "../../../types/passport"
import { colors } from "../../../theme/theme"
import { shadeColor, supFormatterNoFixed } from "../../../helpers"
import { BattleMultipliers } from '../../../types'
import { useEffect, useState, MutableRefObject } from "react"
import BigNumber from "bignumber.js"
import { useToggle } from "../../../hooks"
import { ExpandLess, ExpandMore } from "@mui/icons-material"

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
}: {
    user: UserData
    open: boolean
    sups?: string
    multipliers: BattleMultipliers[]
    transactions: Transaction[]
    supsSpent: MutableRefObject<BigNumber>
    supsEarned: MutableRefObject<BigNumber>
    userID: string
    onClose: () => void
    popoverRef: MutableRefObject<null>


}) => {
    const [localOpen, toggleLocalOpen] = useToggle(open)
    const [hideBattleTxs, toggleHideBattleTxs] = useToggle()







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
                        {/*<Stack direction="row" alignItems="center">*/}
                        {/*    <Typography sx={{ lineHeight: 1, mr: ".3rem" }}>• TIME ELAPSED:</Typography>*/}
                        {/*    <Typography sx={{ lineHeight: 1, color: colors.neonBlue }}>*/}
                        {/*        <TimeElapsed startTime={startTime} />*/}
                        {/*    </Typography>*/}
                        {/*</Stack>*/}

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


                {multipliers.map((bm)=> {
                    if (bm.multipliers.length === 0) return <></>
                    return (<BattleMultiplierView key={`bmv-key-${bm.battle_number}`} bm={bm} />)
                })}

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



const BattleMultiplierView = ({ bm }: { bm: BattleMultipliers})=>{
    const [multiplierList] = useState(bm.multipliers.filter((m) => !m.is_multiplicative))
    const [multiplicative] = useState(bm.multipliers.filter((m) => m.is_multiplicative))
    const [total1] = useState(multiplierList.reduce((acc, m) => acc + Math.round(parseFloat(m.value) * 10) / 10, 0))
    const [total2] = useState(multiplicative.reduce((acc, m) => acc + Math.round(parseFloat(m.value) * 10) / 10, 0))
    const  [totalMultipliers] = useState(total1 * (total2 || 1))
    const [open, setOpen] = useState<boolean>(false)

    return (
        <Box key={`multies-${bm.battle_number}=${bm.total_multipliers}`}>
        <Button fullWidth  onClick={()=> setOpen((prev)=>!prev)} sx={{ display: 'flex',justifyContent: 'space-between', padding: '2px'}}>
            <Typography
                sx={{
                    mb: '.24rem',
                    fontWeight: 'bold',
                    color: colors.offWhite,
                    span: { color: colors.yellow },
                }}
                variant='h6'
            >
                BATTLE: <span>{bm.battle_number}</span>
            </Typography>
            <Typography
                sx={{
                    mb: '.24rem',
                    fontWeight: 'bold',
                    color: colors.offWhite,
                    span: { color: colors.yellow },
                }}
                variant='h6'
            >
                MULTIPLIERS: <span>{totalMultipliers}x</span>
            </Typography>

            {/*<IconButton onClick={()=> setOpen((prev)=>!prev)}>*/}
                {open ? <ExpandLess /> : <ExpandMore />}
            {/*</IconButton>*/}


        </Button>



            <Collapse in={open} timeout="auto" unmountOnExit>
        <Box
            sx={{
                paddingTop:'0.5rem',
                overflowY: 'auto',
                overflowX: 'hidden',
                direction: 'ltr',
                scrollbarWidth: 'none',
                '::-webkit-scrollbar': {
                    width: '.4rem',
                },
                '::-webkit-scrollbar-track': {
                    background: '#FFFFFF15',
                    borderRadius: 3,
                },
                '::-webkit-scrollbar-thumb': {
                    background: '#FFFFFF96',
                    borderRadius: 3,
                },
            }}
        >
            <Stack spacing='1.2rem'>
                <Stack spacing='.2rem'>
                    <Stack spacing='.32rem'>
                        {multiplierList.map((m, i) => (
                            <MultiplierItem key={i} multiplier={m}  />
                        ))}
                    </Stack>
                </Stack>

                {multiplicative && multiplicative.length > 0 && (
                    <Stack spacing='.2rem'>
                        <Typography sx={{ color: 'grey !important' }}>BONUSES</Typography>
                        <Stack spacing='.32rem'>
                            {multiplicative.map((m, i) => (
                                <MultiplierItem
                                    key={i}
                                    multiplier={m}
                                />
                            ))}
                        </Stack>
                    </Stack>
                )}
            </Stack>
        </Box>
            </Collapse>
    </Box>
    )
}