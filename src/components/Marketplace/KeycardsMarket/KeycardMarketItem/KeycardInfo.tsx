import { Stack, Typography } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { fonts } from "../../../../theme/theme"

export const KeycardInfo = ({ isGridView, label, description }: { isGridView: boolean; label: string; description: string }) => {
    const theme = useTheme()

    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    color: theme.factionTheme.primary,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="caption"
                sx={{
                    fontFamily: fonts.nostromoBold,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {description}
            </Typography>
        </Stack>
    )
}
