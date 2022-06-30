import { Box } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { MechDetails } from "../../../../types"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"

export const MechViewer = ({ mechDetails }: { mechDetails: MechDetails }) => {
    const theme = useTheme()

    const skin = mechDetails.chassis_skin || mechDetails.default_chassis_skin
    const imageUrl = skin?.large_image_url || mechDetails.large_image_url
    const animationUrl = skin?.animation_url || mechDetails.animation_url
    const cardAnimationUrl = skin?.card_animation_url || mechDetails.card_animation_url

    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
                width: "100%",
                overflow: "hidden",
                border: `${theme.factionTheme.primary}90 .3rem solid`,
                borderLeft: "none",
                boxShadow: 2,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    boxShadow: `inset 0 0 50px 60px ${theme.factionTheme.background}90`,
                    zIndex: 4,
                }}
            />

            <MediaPreview
                imageUrl={imageUrl}
                videoUrls={[animationUrl, cardAnimationUrl]}
                objectFit="cover !important"
                objectPosition="50% 8%"
                sx={{
                    position: "absolute",
                    zIndex: 3,
                }}
            />
        </Box>
    )
}
