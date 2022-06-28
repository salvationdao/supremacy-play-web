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
        if (orientation === "horizontal") {
            return (
                <Stack justifyContent="flex-end" style={{ position: "relative", height: thickness, width: "100%", backgroundColor }}>
                    <Box
                        style={{
                            height: "100%",
                            width: `${percent}%`,
                            backgroundColor: color,
                            transition: "all .25s",
                        }}
                    />

                    {!!linePercent && (
                        <Box
                            style={{
                                position: "absolute",
                                left: `${linePercent - 2.5}%`,
                                height: "100%",
                                width: 3,
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
                        height: `${percent}%`,
                        width: "100%",
                        backgroundColor: color,
                        transition: "all .25s",
                    }}
                />

                {!!linePercent && (
                    <Box
                        style={{
                            position: "absolute",
                            bottom: `${linePercent - 2.5}%`,
                            height: 3,
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
