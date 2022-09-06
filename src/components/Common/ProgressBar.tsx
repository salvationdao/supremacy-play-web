import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { shadeColor } from "../../helpers"
import { colors } from "../../theme/theme"

export const ProgressBar = ({
    id,
    percent,
    linePercent,
    color,
    backgroundColor,
    thickness,
    orientation = "vertical",
}: {
    id?: string
    percent: number // 0 to 100
    linePercent?: number
    color: string
    backgroundColor: string
    thickness: string
    orientation?: "vertical" | "horizontal"
}) => {
    const darkerShadeBackgroundColor = useMemo(() => shadeColor(color, 5), [color])

    return useMemo(() => {
        const percent2 = Math.min(percent, 100)
        const linePercent2 = Math.min(linePercent || 0, 100)

        if (orientation === "horizontal") {
            return (
                <Stack justifyContent="flex-end" style={{ position: "relative", height: thickness, width: "100%", backgroundColor }}>
                    <Box
                        id={id}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: 0,
                            height: "100%",
                            width: `${percent2}%`,
                            backgroundColor: color,
                            background: `linear-gradient(${darkerShadeBackgroundColor} 26%, ${color})`,
                            transition: "all .25s",
                            transform: "translateY(-50%) scaleY(1.08)",
                        }}
                    />

                    {!!linePercent2 && (
                        <Box
                            style={{
                                position: "absolute",
                                left: `${linePercent2 - 2.5}%`,
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
                    id={id}
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        height: `${percent2}%`,
                        width: "100%",
                        backgroundColor: color,
                        background: `linear-gradient(${darkerShadeBackgroundColor} 26%, ${color})`,
                        transition: "all .25s",
                        transform: "translateX(-50%) scaleX(1.08)",
                    }}
                />

                {!!linePercent2 && (
                    <Box
                        style={{
                            position: "absolute",
                            bottom: `${linePercent2 - 2.5}%`,
                            height: 2,
                            width: "100%",
                            backgroundColor: colors.orange,
                            zIndex: 6,
                        }}
                    />
                )}
            </Stack>
        )
    }, [backgroundColor, color, darkerShadeBackgroundColor, id, linePercent, orientation, percent, thickness])
}
