import { Box, Stack } from "@mui/material"
import BigNumber from "bignumber.js"
import { useMemo } from "react"
import { colors } from "../../../theme/theme"

export const ContributionBar = ({
    color,
    initialTargetCost,
    currentSups,
    supsCost,
    hideRedBar,
    forceHundredPercent,
}: {
    color: string
    initialTargetCost: BigNumber
    currentSups: BigNumber
    supsCost: BigNumber
    hideRedBar?: boolean
    forceHundredPercent: boolean
}) => {
    const progressPercent = useMemo(
        () => (initialTargetCost.isZero() ? 0 : currentSups.dividedBy(initialTargetCost).toNumber() * 100),
        [initialTargetCost, currentSups],
    )
    const costPercent = useMemo(() => (initialTargetCost.isZero() ? 0 : supsCost.dividedBy(initialTargetCost).toNumber() * 100), [initialTargetCost, supsCost])

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            style={{
                flex: 1,
                position: "relative",
                height: ".7rem",
                backgroundColor: `${colors.text}20`,
                overflow: "visible",
                borderRadius: 0.4,
            }}
        >
            <SupsProgress forceHundredPercent={forceHundredPercent} color={color} progressPercent={progressPercent} />

            {!hideRedBar && (
                <Box
                    style={{
                        position: "absolute",
                        left: `${costPercent}%`,
                        backgroundColor: colors.lightRed,
                        height: "1rem",
                        width: 2,
                        zIndex: 6,
                    }}
                />
            )}
        </Stack>
    )
}

const SupsProgress = ({ forceHundredPercent, color, progressPercent }: { progressPercent: number; color: string; forceHundredPercent: boolean }) => (
    <Box
        style={{
            width: `${forceHundredPercent ? "100" : `${progressPercent}`}%`,
            height: "100%",
            transition: "all .15s",
            backgroundColor: color || colors.neonBlue,
            zIndex: 5,
            borderRadius: 0.4,
        }}
    />
)
