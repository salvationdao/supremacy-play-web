import { Box } from "@mui/material"
import { MarketplaceBuyAuctionItem } from "../../../../types/marketplace"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"

export const Thumbnail = ({
    isGridView,
    imageUrl,
    animationUrl,
    cardAnimationUrl,
    item,
}: {
    isGridView?: boolean
    imageUrl: string
    animationUrl?: string
    cardAnimationUrl?: string
    item: MarketplaceBuyAuctionItem
}) => {
    return (
        <Box
            sx={{
                position: "relative",
                height: isGridView ? "15rem" : "100%",
                width: "100%",
            }}
        >
            <MediaPreview
                imageUrl={imageUrl}
                videoUrls={[animationUrl, cardAnimationUrl]}
                objectFit={isGridView ? "cover" : "contain"}
                imageTransform={item?.weapon ? "rotate(-30deg) scale(.95)" : ""}
            />
        </Box>
    )
}
