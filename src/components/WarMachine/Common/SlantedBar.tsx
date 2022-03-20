import { Box, Stack } from "@mui/material"
import { colors } from "../../../theme/theme"
import { BoxSlanted } from "./BoxSlanted"

export const SlantedBar = ({
    backgroundColor,
    progressPercent,
    costPercent,
}: {
    backgroundColor: string
    progressPercent: number
    costPercent?: number
}) => {
    return (
        <BoxSlanted
            clipSlantSize="0.2rem"
            sx={{
                height: "100%",
                width: "100%",
                pointerEvents: "none",
            }}
        >
            <Stack
                justifyContent="flex-end"
                sx={{ position: "relative", height: "100%", width: "100%", backgroundColor: "#00000060" }}
            >
                <Box
                    sx={{
                        height: `${progressPercent}%`,
                        width: "100%",
                        backgroundColor,
                        transition: "all .25s",
                    }}
                />

                {!!costPercent && (
                    <Box
                        sx={{
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
