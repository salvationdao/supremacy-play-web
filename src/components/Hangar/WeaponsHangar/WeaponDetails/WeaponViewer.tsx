import { Box } from "@mui/material"
import { useTheme } from "../../../../containers/theme"
import { Weapon } from "../../../../types"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { FeatherFade } from "../../WarMachinesHangar/WarMachineDetails/MechViewer"

export const WeaponViewer = ({ weaponDetails }: { weaponDetails: Weapon }) => {
    const theme = useTheme()

    const backgroundColor = theme.factionTheme.background

    const skin = weaponDetails.weapon_skin
    const avatarUrl = skin?.avatar_url || weaponDetails?.avatar_url
    const imageUrl = skin?.image_url || weaponDetails?.image_url
    const largeImageUrl = skin?.large_image_url || weaponDetails?.large_image_url
    const animationUrl = skin?.animation_url || weaponDetails?.animation_url
    const cardAnimationUrl = skin?.card_animation_url || weaponDetails?.card_animation_url

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
                    height: "unset",
                    left: "50%",
                    top: "52%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <FeatherFade color={backgroundColor} />
                <MediaPreview imageUrl={largeImageUrl || imageUrl || avatarUrl} videoUrls={[animationUrl, cardAnimationUrl]} objectFit="cover" />
            </Box>
        </Box>
    )
}
