import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { colors } from "../../theme/theme"

export const ProgressBar = ({
    percent,
    lineCercent,
    color,
    backgroundColor,
    thickness,
    orientation = "vertical",
}: {
    percent: number
    lineCercent?: number
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

                    {!!lineCercent && (
                        <Box
                            style={{
                                position: "absolute",
                                bottom: `${lineCercent - 2.5}%`,
                                height: "100%",
                                width: 2,
                                backgroundColor: colors.lightRed,
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

                {!!lineCercent && (
                    <Box
                        style={{
                            position: "absolute",
                            bottom: `${lineCercent - 2.5}%`,
                            height: 2,
                            width: "100%",
                            backgroundColor: colors.lightRed,
                            zIndex: 6,
                        }}
                    />
                )}
            </Stack>
        )
    }, [backgroundColor, color, lineCercent, orientation, percent, thickness])
}
