import { Stack, Typography } from "@mui/material"
import { colors, fonts } from "../../../theme/theme"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import { useMemo } from "react"

ChartJS.register(ArcElement, Tooltip, Legend)

interface FactionStakedMechStatisticProps {
    totalCount: number
    inQueueCount: number
    damagedCount: number
    battleReadyCount: number
    inBattleCount: number
}

export const FactionStakedMechStatistic = ({ totalCount, inQueueCount, damagedCount, battleReadyCount, inBattleCount }: FactionStakedMechStatisticProps) => {
    const chartData = useMemo(
        () => [
            { label: "Mechs battle ready", color: colors.orange, percentage: Math.round((battleReadyCount * 100) / totalCount) / 100 },
            { label: "Mechs in queue", color: colors.green, percentage: Math.round((inQueueCount * 100) / totalCount) / 100 },
            { label: "Mechs Damaged", color: colors.lightRed, percentage: Math.round((damagedCount * 100) / totalCount) / 100 },
            { label: "Mechs in battle", color: colors.bronze, percentage: Math.round((inBattleCount * 100) / totalCount) / 100 },
        ],
        [totalCount, inQueueCount, damagedCount, battleReadyCount, inBattleCount],
    )

    return (
        <Stack direction="column" spacing="1rem" sx={{ width: "30rem", height: "fit-content", backgroundColor: `${colors.offWhite}20`, p: "1.5rem" }}>
            <Doughnut
                data={{
                    labels: [],
                    datasets: [
                        {
                            label: "Amount",
                            data: chartData.map((cd) => cd.percentage),
                            backgroundColor: chartData.map((cd) => cd.color),
                            borderColor: chartData.map((cd) => cd.color),
                            borderWidth: 1,
                        },
                    ],
                }}
            />
            <Stack direction="column" spacing="1.5rem">
                {chartData.map((cd) => (
                    <StakedMechStatBar key={cd.label} color={cd.color} label={cd.label} percentage={cd.percentage} />
                ))}
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
                {Math.round(percentage * 100)}%
            </Typography>
        </Stack>
    )
}
