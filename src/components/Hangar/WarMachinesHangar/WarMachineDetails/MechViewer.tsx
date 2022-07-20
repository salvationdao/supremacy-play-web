import { Box } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { MechDetails } from "../../../../types"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"

export const MechViewer = ({ mechDetails }: { mechDetails: MechDetails }) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    const skin = mechDetails.chassis_skin || mechDetails.default_chassis_skin
    const avatarUrl = skin?.avatar_url || mechDetails.avatar_url
    const imageUrl = skin?.image_url || mechDetails.image_url
    const largeImageUrl = skin?.large_image_url || mechDetails.large_image_url
    const animationUrl = skin?.animation_url || mechDetails.animation_url
    const cardAnimationUrl = skin?.card_animation_url || mechDetails.card_animation_url

    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: "hidden",
                zIndex: 5,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    boxShadow: `inset 0 0 40px 40px ${backgroundColor}`,
                    zIndex: 2,
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    zIndex: 3,
                    width: "100%",
                    height: "100%",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    border: `${primaryColor} 1.5px solid`,
                }}
            >
                <MediaPreview
                    imageUrl={largeImageUrl || imageUrl || avatarUrl}
                    videoUrls={[animationUrl, cardAnimationUrl]}
                    objectFit="cover"
                    objectPosition="50% 8%"
                />
            </Box>
        </Box>
    )
}
