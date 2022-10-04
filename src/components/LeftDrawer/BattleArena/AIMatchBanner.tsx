import { Stack, Typography } from "@mui/material"
import { useGame } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"

export const AIMatchBanner = () => {
    const { isAIDrivenMatch } = useGame()

    if (!isAIDrivenMatch) return null

    return (
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: ".25rem", py: ".5rem", backgroundColor: colors.green }}>
            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                AI Match
            </Typography>
        </Stack>
    )
}
