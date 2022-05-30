import { Stack } from "@mui/material"
import { ClipThing } from ".."
import { useTheme } from "../../containers/theme"

export const Filter = () => {
    const theme = useTheme()

    return (
        <ClipThing
            clipSize="10px"
            border={{
                isFancy: true,
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%", minWidth: "30rem", maxWidth: "45rem" }}
        >
            <Stack sx={{ position: "relative", height: "100%" }}></Stack>
        </ClipThing>
    )
}
