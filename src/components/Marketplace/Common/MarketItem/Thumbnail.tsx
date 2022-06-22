import { Box } from "@mui/material"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"

export const Thumbnail = ({
    isGridView,
    imageUrl,
    animationUrl,
    cardAnimationUrl,
}: {
    isGridView: boolean
    imageUrl: string
    animationUrl?: string
    cardAnimationUrl?: string
}) => {
    return (
        <Box
            sx={{
                position: "relative",
                height: isGridView ? "15rem" : "100%",
                width: "100%",
            }}
        >
            <MediaPreview imageUrl={imageUrl} videoUrls={[animationUrl, cardAnimationUrl]} />
        </Box>
    )
}
