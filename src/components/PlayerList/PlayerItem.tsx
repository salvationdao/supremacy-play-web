import { Stack, Theme, Typography, useTheme } from "@mui/material"
import { colors } from "../../theme/theme"
import { User } from "../../types"

export const PlayerItem = ({ player }: { player: User }) => {
    const theme = useTheme<Theme>()

    return (
        <Stack
            sx={{
                px: "1.3rem",
                py: ".8rem",
                backgroundColor: `${theme.factionTheme.primary}10`,
            }}
        >
            <Typography>{player.username}</Typography>
        </Stack>
    )
}
