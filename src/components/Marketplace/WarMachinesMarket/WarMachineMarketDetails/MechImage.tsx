import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { colors } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"

export const MechImage = ({ mechDetails }: { mechDetails?: MechDetails }) => {
    const theme = useTheme()
    const [activeImageUrl, setActiveImageUrl] = useState<string>()
    const [activeVideoUrl, setActiveVideoUrl] = useState<string>()

    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const avatarUrl = skin?.avatar_url // avatar
    const imageUrl = skin?.image_url // poster for card_animation_url
    const cardAnimationUrl = skin?.card_animation_url // smaller one, transparent bg
    const largeImageUrl = skin?.large_image_url // poster for animation_url
    const animationUrl = skin?.animation_url // big one

    // Sets the initial image to display
    useEffect(() => {
        if ((!activeImageUrl || !activeVideoUrl) && largeImageUrl && animationUrl) {
            setActiveImageUrl(largeImageUrl)
            setActiveVideoUrl(animationUrl)
        }
    }, [activeImageUrl, activeVideoUrl, animationUrl, largeImageUrl])

    return (
        <Stack spacing="1.3rem">
            <Box
                key={activeImageUrl}
                component="video"
                sx={{
                    height: "50rem",
                    width: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                    border: "#FFFFFF18 2px solid",
                    boxShadow: "inset 0 0 12px 6px #00000040",
                    background: `radial-gradient(#FFFFFF20 10px, ${theme.factionTheme.background})`,
                }}
                loop
                muted
                autoPlay
                poster={`${activeImageUrl}`}
            >
                <source src={activeVideoUrl} type="video/mp4" />
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, 6rem)",
                    gridTemplateRows: "repeat(auto-fill, 6rem)",
                    gap: "1.3rem",
                }}
            >
                <SmallImageThumbnail
                    imageUrl={largeImageUrl}
                    videoUrl={animationUrl}
                    activeImageUrl={activeImageUrl}
                    setActiveImageUrl={setActiveImageUrl}
                    setActiveVideoUrl={setActiveVideoUrl}
                />
                <SmallImageThumbnail
                    imageUrl={imageUrl}
                    videoUrl={cardAnimationUrl}
                    activeImageUrl={activeImageUrl}
                    setActiveImageUrl={setActiveImageUrl}
                    setActiveVideoUrl={setActiveVideoUrl}
                />
                <SmallImageThumbnail
                    imageUrl={avatarUrl}
                    videoUrl={avatarUrl}
                    activeImageUrl={activeImageUrl}
                    setActiveImageUrl={setActiveImageUrl}
                    setActiveVideoUrl={setActiveVideoUrl}
                />
            </Box>
        </Stack>
    )
}

const SmallImageThumbnail = ({
    imageUrl,
    videoUrl,
    activeImageUrl,
    setActiveImageUrl,
    setActiveVideoUrl,
}: {
    imageUrl?: string
    videoUrl?: string
    activeImageUrl?: string
    setActiveImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>
    setActiveVideoUrl: React.Dispatch<React.SetStateAction<string | undefined>>
}) => {
    return (
        <Box
            component="img"
            src={imageUrl}
            sx={{
                cursor: "pointer",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                border: activeImageUrl === imageUrl ? `${colors.neonBlue}99 2px solid` : "#FFFFFF18 2px solid",
            }}
            onClick={() => {
                setActiveImageUrl(imageUrl)
                setActiveVideoUrl(videoUrl)
            }}
        />
    )
}
