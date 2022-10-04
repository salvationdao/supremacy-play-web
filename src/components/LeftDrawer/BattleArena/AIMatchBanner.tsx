import { useGame } from "../../../containers"
import { Stack, Typography } from "@mui/material"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"

export const AIMatchBanner = () => {
    const { isAIDrivenMatch } = useGame()
    const { factionTheme } = useTheme()

    if (!isAIDrivenMatch) return null
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{
                opacity: 0.5,
                mt: ".25rem",
                py: ".5rem",
                backgroundColor: factionTheme.primary,
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    fontFamily: fonts.nostromoBold,
                }}
            >
                AI Match
            </Typography>
        </Stack>
    )
}
