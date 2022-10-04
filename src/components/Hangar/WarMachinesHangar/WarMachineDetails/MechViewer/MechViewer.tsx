import { Box } from "@mui/material"
import React from "react"
import { useTheme } from "../../../../../containers/theme"
import { MechDetails } from "../../../../../types"
import { MediaPreview } from "../../../../Common/MediaPreview/MediaPreview"
import { LoadoutMechSkin, LoadoutPowerCore, LoadoutWeapon } from "../MechLoadout"
import { UnityViewer } from "./UnityViewer"

export type UnityHandle = {
    handleWeaponUpdate: (wu: LoadoutWeapon) => void
    handlePowerCoreUpdate: (pcu: LoadoutPowerCore) => void
    handleMechSkinUpdate: (msu: LoadoutMechSkin) => void
}
export interface MechViewerProps {
    mechDetails: MechDetails
    unity?: {
        onUnlock: () => void
    }
}

export const MechViewer = React.forwardRef<UnityHandle, MechViewerProps>(function MechViewer(props, ref) {
    const { mechDetails, unity } = props
    const theme = useTheme()
    const backgroundColor = theme.factionTheme.background

    const skin = mechDetails.chassis_skin && mechDetails.default_chassis_skin
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
                    aspectRatio: "1.1",
                    height: "80%",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    overflow: "hidden",
                }}
            >
                <FeatherFade color={backgroundColor} />
                {unity ? (
                    <UnityViewer unityRef={ref} {...props} />
                ) : (
                    <MediaPreview
                        imageUrl={largeImageUrl || imageUrl || avatarUrl}
                        videoUrls={[animationUrl, cardAnimationUrl]}
                        objectFit="cover"
                        blurBackground
                    />
                )}
            </Box>
        </Box>
    )
})

interface FeatherFadeProps {
    color: string
    featherSize?: string
    featherBlur?: string
}
export const FeatherFade = ({ color, featherBlur = "60px", featherSize = "50px" }: FeatherFadeProps) => {
    return (
        <Box
            sx={{
                position: "absolute",
                top: -1,
                bottom: -1,
                left: -1,
                right: -1,
                boxShadow: `0 0 ${featherBlur} ${featherSize} ${color}`,
                zIndex: 9,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    width: "100%",
                    height: "15rem",
                    background: `linear-gradient(to top, transparent 50%, ${color})`,
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: "15rem",
                    background: `linear-gradient(to bottom, transparent 50%, ${color})`,
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    width: "15rem",
                    height: "100%",
                    background: `linear-gradient(to left, transparent 50%, ${color})`,
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    right: 0,
                    width: "15rem",
                    height: "100%",
                    background: `linear-gradient(to right, transparent 50%, ${color})`,
                }}
            />
        </Box>
    )
}
