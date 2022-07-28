import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { colors } from "../../theme/theme"

export const ProgressBar = ({
    percent,
    linePercent,
    color,
    backgroundColor,
    thickness,
    orientation = "vertical",
}: {
    percent: number
    linePercent?: number
    color: string
    backgroundColor: string
    thickness: string
    orientation?: "vertical" | "horizontal"
}) => {
    return useMemo(() => {
        const percentt = Math.min(percent, 100)
        const linePercentt = Math.min(linePercent || 0, 100)

        if (orientation === "horizontal") {
            return (
                <Stack justifyContent="flex-end" style={{ position: "relative", height: thickness, width: "100%", backgroundColor }}>
                    <Box
                        style={{
                            height: "100%",
                            width: `${percentt}%`,
                            backgroundColor: color,
                            transition: "all .25s",
                            transform: "scaleY(1.2)",
                        }}
                    />

                    {!!linePercentt && (
                        <Box
                            style={{
                                position: "absolute",
                                left: `${linePercentt - 2.5}%`,
                                height: "100%",
                                width: 2,
                                backgroundColor: colors.orange,
                                zIndex: 6,
                            }}
                        />
                    )}
                </Stack>
            )
        }

        return (
            <Stack justifyContent="flex-end" style={{ position: "relative", height: "100%", width: thickness, backgroundColor }}>
                <Box
                    style={{
                        height: `${percentt}%`,
                        width: "100%",
                        backgroundColor: color,
                        transition: "all .25s",
                        transform: "scaleX(1.2)",
                    }}
                />

                {!!linePercentt && (
                    <Box
                        style={{
                            position: "absolute",
                            bottom: `${linePercentt - 2.5}%`,
                            height: 2,
                            width: "100%",
                            backgroundColor: colors.orange,
                            zIndex: 6,
                        }}
                    />
                )}
            </Stack>
        )
    }, [backgroundColor, color, linePercent, orientation, percent, thickness])
}
