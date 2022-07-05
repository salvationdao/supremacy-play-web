import { Box } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { Weapon } from "../../../../types"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"

export const WeaponViewer = ({ weaponDetails }: { weaponDetails: Weapon }) => {
    const theme = useTheme()

    const backgroundColor = theme.factionTheme.background
    const avatarUrl = weaponDetails?.avatar_url
    const imageUrl = weaponDetails?.image_url
    const largeImageUrl = weaponDetails?.large_image_url
    const animationUrl = weaponDetails?.animation_url
    const cardAnimationUrl = weaponDetails?.card_animation_url

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
                }}
            >
                <MediaPreview imageUrl={largeImageUrl || imageUrl || avatarUrl} videoUrls={[animationUrl, cardAnimationUrl]} objectFit="contain" />
            </Box>
        </Box>
    )
}
