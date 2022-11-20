import { Box, Stack, Typography } from "@mui/material"
import { useTheme } from "../../../containers/theme"
import { truncateTextLines } from "../../../helpers"
import { fonts } from "../../../theme/theme"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"

export const CrateCommonArea = ({
    isGridView,
    label,
    description,
    imageUrl,
    videoUrls,
}: {
    isGridView: boolean
    label: string
    description: string
    imageUrl?: string
    videoUrls?: (string | undefined)[]
}) => {
    const theme = useTheme()

    return (
        <Stack direction={isGridView ? "column" : "row"} alignItems={isGridView ? "flex-start" : "center"} spacing="1.4rem" sx={{ position: "relative" }}>
            <Box
                sx={{
                    position: "relative",
                    height: isGridView ? "20rem" : "100%",
                    width: isGridView ? "100%" : "8rem",
                    flexShrink: 0,
                }}
            >
                <MediaPreview imageUrl={imageUrl} videoUrls={videoUrls} objectFit={isGridView ? "cover" : "contain"} />
            </Box>

            <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                        color: theme.factionTheme.primary,
                        ...truncateTextLines(1),
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    sx={{
                        ...truncateTextLines(2),
                    }}
                >
                    {description}
                </Typography>
            </Stack>
        </Stack>
    )
}
