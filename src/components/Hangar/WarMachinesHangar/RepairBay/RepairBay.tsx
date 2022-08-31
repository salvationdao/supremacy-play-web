import { Box, Stack } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { ClipThing } from "../../../Common/ClipThing"

export const RepairBay = () => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: primaryColor,
                borderThickness: ".3rem",
            }}
            opacity={0.7}
            backgroundColor={backgroundColor}
            sx={{ height: "100%", width: "38rem", ml: "1rem" }}
        >
            <Stack sx={{ height: "100%" }}>
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        direction: "ltr",
                        scrollbarWidth: "none",
                        "::-webkit-scrollbar": {
                            width: ".4rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                            borderRadius: 3,
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: primaryColor,
                            borderRadius: 3,
                        },
                    }}
                >
                    <Stack sx={{ position: "relative", height: 0, mt: "-.3rem", mx: "-.3rem" }}></Stack>
                </Box>
            </Stack>
        </ClipThing>
    )
}
