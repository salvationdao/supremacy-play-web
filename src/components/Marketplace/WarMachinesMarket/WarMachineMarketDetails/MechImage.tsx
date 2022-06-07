import { Box, IconButton, Modal, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgClose } from "../../../../assets"
import { useToggle } from "../../../../hooks"
import { colors, siteZIndex } from "../../../../theme/theme"
import { MechDetails } from "../../../../types"

export const MechImage = ({ mechDetails }: { mechDetails?: MechDetails }) => {
    const [activeImageUrl, setActiveImageUrl] = useState<string>()
    const [activeVideoUrl, setActiveVideoUrl] = useState<string>()
    const [previewModalOpen, togglePreviewModalOpen] = useToggle()

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
        <>
            <Stack spacing="1.3rem">
                <Box
                    sx={{
                        height: "59rem",
                        cursor: "zoom-in",
                        transition: "all .2s",
                        ":hover": {
                            boxShadow: 10,
                            transform: "scale(1.004)",
                        },
                    }}
                    onClick={() => togglePreviewModalOpen(true)}
                >
                    <MainPreview imageUrl={activeImageUrl} videoUrl={activeVideoUrl} />
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

            {previewModalOpen && <PreviewModal imageUrl={activeImageUrl} videoUrl={activeVideoUrl} onClose={() => togglePreviewModalOpen(false)} />}
        </>
    )
}

const MainPreview = ({ imageUrl, videoUrl }: { imageUrl?: string; videoUrl?: string }) => {
    return (
        <Box
            key={imageUrl}
            component="video"
            sx={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
                objectPosition: "center",
                border: "#FFFFFF18 2px solid",
                boxShadow: "inset 0 0 12px 6px #00000040",
                background: `radial-gradient(#FFFFFF20 10px, #00000080)`,
            }}
            loop
            muted
            autoPlay
            poster={`${imageUrl}`}
        >
            <source src={videoUrl} type="video/mp4" />
        </Box>
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

const PreviewModal = ({ imageUrl, videoUrl, onClose }: { imageUrl?: string; videoUrl?: string; onClose: () => void }) => {
    return (
        <Modal open onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80vw",
                    height: "90vh",
                    boxShadow: 6,
                    outline: "none",
                    backgroundColor: "#000000",
                }}
            >
                <Box sx={{ position: "relative", height: "100%" }}>
                    <MainPreview imageUrl={imageUrl} videoUrl={videoUrl} />

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="3rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </Box>
            </Box>
        </Modal>
    )
}
