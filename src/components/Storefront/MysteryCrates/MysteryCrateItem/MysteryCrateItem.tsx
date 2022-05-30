import { Box, Skeleton, Stack } from "@mui/material"
import { ClipThing } from "../../.."
import { useTheme } from "../../../../containers/theme"

export const MysteryCrateItem = () => {
    return <Stack></Stack>
}

export const MysteryCrateItemLoadingSkeleton = () => {
    const theme = useTheme()

    return (
        <Box sx={{ position: "relative", overflow: "visible" }}>
            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: true,
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".15rem",
                }}
                opacity={0.7}
                backgroundColor={theme.factionTheme.background}
            >
                <Stack direction="row" alignItems="center" spacing="1.2rem" sx={{ height: "22rem", px: "1.8rem", py: "1.6rem" }}>
                    <Skeleton variant="rectangular" width="100%" height="4rem" />
                </Stack>
            </ClipThing>
        </Box>
    )
}
