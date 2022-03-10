import { Box, Stack } from "@mui/material"
import BigNumber from "bignumber.js"
import { colors } from "../../../theme/theme"

export const ContributionBar = ({
    color,
    initialTargetCost,
    currentSups,
    supsCost,
    hideRedBar,
}: {
    color: string
    initialTargetCost: BigNumber
    currentSups: BigNumber
    supsCost: BigNumber
    hideRedBar?: boolean
}) => {
    const progressPercent = initialTargetCost.isZero() ? 0 : currentSups.dividedBy(initialTargetCost).toNumber() * 100
    const costPercent = initialTargetCost.isZero() ? 0 : supsCost.dividedBy(initialTargetCost).toNumber() * 100

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            sx={{
                flex: 1,
                position: "relative",
                height: 7,
                backgroundColor: `${colors.text}20`,
                overflow: "visible",
                borderRadius: 0.4,
            }}
        >
            <Box
                sx={{
                    width: `${progressPercent}%`,
                    height: "100%",
                    transition: "all .15s",
                    backgroundColor: color || colors.neonBlue,
                    zIndex: 5,
                    borderRadius: 0.4,
                }}
            />

            {!hideRedBar && (
                <Box
                    sx={{
                        position: "absolute",
                        left: `${costPercent}%`,
                        backgroundColor: colors.red,
                        height: 10,
                        width: 2,
                        zIndex: 6,
                    }}
                />
            )}
        </Stack>
    )
}
