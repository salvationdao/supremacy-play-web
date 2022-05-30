import { Stack } from "@mui/material"
import { ClipThing } from "../.."
import { useTheme } from "../../../containers/theme"

export const MysteryCrates = () => {
    const theme = useTheme()

    return (
        <Stack direction="row" sx={{ height: "100%" }}>
            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: true,
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".2rem",
                }}
                opacity={0.7}
                backgroundColor={theme.factionTheme.background}
                sx={{ height: "100%", width: "100%" }}
            >
                <Stack sx={{ position: "relative", height: "100%" }}></Stack>
            </ClipThing>
        </Stack>
    )
}
