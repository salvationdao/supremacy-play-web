import { Box, Stack } from "@mui/material"
import { colors } from "../../../theme/theme"
import { BoxSlanted } from "./BoxSlanted"

export const SlantedBar = ({ backgroundColor, progressPercent, costPercent }: { backgroundColor: string; progressPercent: number; costPercent?: number }) => {
    return (
        <BoxSlanted
            clipSlantSize="20px"
            style={{
                height: "100%",
                width: "100%",
                pointerEvents: "none",
            }}
        >
            <Stack justifyContent="flex-end" style={{ position: "relative", height: "100%", width: "100%", backgroundColor: "#97979C" }}>
                <Box
                    style={{
                        height: `${progressPercent}%`,
                        width: "100%",
                        backgroundColor,
                        transition: "all .25s",
                    }}
                />

                {!!costPercent && (
                    <Box
                        style={{
                            position: "absolute",
                            bottom: `${costPercent - 2.5}%`,
                            height: 2,
                            width: "100%",
                            backgroundColor: colors.red,
                            zIndex: 6,
                        }}
                    />
                )}
            </Stack>
        </BoxSlanted>
    )
}
