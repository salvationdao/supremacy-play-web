import { Box, Stack, Typography } from "@mui/material"
import { colors, fonts } from "../../../theme/theme"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"

interface FactionStakedMechStatisticProps {
    totalCount: number
    inQueueCount: number
    damagedCount: number
    battleReadyCount: number
    inBattleCount: number
}

export const FactionStakedMechStatistic = ({ totalCount, inQueueCount, damagedCount, battleReadyCount, inBattleCount }: FactionStakedMechStatisticProps) => {
    return (
        <Stack direction="column" spacing="1rem" sx={{ width: "30rem", height: "fit-content", backgroundColor: `${colors.offWhite}20`, p: "1.5rem" }}>
            <Stack direction="column" spacing="1.5rem">
                <StakedMechStatBar color={colors.orange} label={"Mechs battle ready"} percentage={battleReadyCount / totalCount} />
                <StakedMechStatBar color={colors.green} label={"Mechs in queue"} percentage={inQueueCount / totalCount} />
                <StakedMechStatBar color={colors.lightRed} label={"Mechs Damaged"} percentage={damagedCount / totalCount} />
                <StakedMechStatBar color={colors.bronze} label={"Mechs in battle"} percentage={inBattleCount / totalCount} />
            </Stack>
        </Stack>
    )
}

interface StakedMechStatBarProps {
    color: string
    label: string
    percentage: number
}

const StakedMechStatBar = ({ color, label, percentage }: StakedMechStatBarProps) => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
            <Stack direction="row" flex={1} alignItems="center" spacing="1rem">
                <NiceBoxThing
                    sx={{
                        backgroundColor: color,
                        width: "2rem",
                        height: "2rem",
                        borderRadius: 0.8,
                    }}
                />
                <Typography fontFamily={fonts.rajdhaniBold}>{label}</Typography>
            </Stack>

            <Typography color={color} fontFamily={fonts.rajdhaniBold}>
                {Math.round(percentage * 10000) / 100}%
            </Typography>
        </Stack>
    )
}
