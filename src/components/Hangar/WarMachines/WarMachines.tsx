import { Box, useTheme, Theme } from "@mui/material"
import { ClipThing } from "../.."

export const WarMachines = () => {
    const theme = useTheme<Theme>()

    return (
        <ClipThing
            clipSize="10px"
            border={{
                isFancy: true,
                borderColor: theme.factionTheme.primary,
                borderThickness: ".15rem",
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Box>asdsadasdsad</Box>
        </ClipThing>
    )
}
