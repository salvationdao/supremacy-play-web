import { Box, Stack, Typography } from "@mui/material"
import { ClipThing } from ".."
import { useTheme } from "../../containers/theme"
import { colors, fonts } from "../../theme/theme"

export const SortAndFilters = () => {
    const theme = useTheme()

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%", minWidth: "30rem", maxWidth: "45rem" }}
        >
            <Stack sx={{ position: "relative", height: "100%", px: "1.2rem", py: "1rem" }}>
                <Box>
                    <Typography variant="caption" sx={{ color: colors.grey, fontFamily: fonts.nostromoBold }}>
                        SEARCH
                    </Typography>
                </Box>
            </Stack>
        </ClipThing>
    )
}
