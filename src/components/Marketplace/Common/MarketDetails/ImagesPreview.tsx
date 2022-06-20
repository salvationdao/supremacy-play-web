import { Box, CircularProgress, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { useToggle } from "../../../../hooks"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { MediaPreviewModal } from "../../../Common/MediaPreview/MediaPreviewModal"

export interface MarketMedia {
    imageUrl?: string
    videoUrl?: string
}

export const ImagesPreview = ({ media, primaryColor }: { media: MarketMedia[]; primaryColor: string }) => {
    const [activeImageUrl, setActiveImageUrl] = useState<string>()
    const [activeVideoUrl, setActiveVideoUrl] = useState<string>()
    const [previewModalOpen, togglePreviewModalOpen] = useToggle()

    // Sets the initial image to display
    useEffect(() => {
        if (!activeImageUrl && media.length > 0) {
            setActiveImageUrl(media[0].imageUrl)
            setActiveVideoUrl(media[0].videoUrl)
        }
    }, [activeImageUrl, activeVideoUrl, media])

    return (
        <>
            <Stack spacing="1.3rem">
                <Box
                    sx={{
                        position: "relative",
                        height: "56rem",
                        cursor: "zoom-in",
                        transition: "all .2s",
                        ":hover": {
                            boxShadow: 10,
                            transform: "scale(1.004)",
                        },
                    }}
                    onClick={() => togglePreviewModalOpen(true)}
                >
                    {activeImageUrl ? (
                        <MediaPreview imageUrl={activeImageUrl} videoUrls={activeVideoUrl ? [activeVideoUrl] : undefined} showBorder />
                    ) : (
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                height: "100%",
                                border: "#FFFFFF18 2px solid",
                                boxShadow: "inset 0 0 12px 6px #00000040",
                                background: `radial-gradient(#FFFFFF20 10px, #00000080)`,
                            }}
                        >
                            <CircularProgress />
                        </Stack>
                    )}
                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, 6rem)",
                        gridTemplateRows: "repeat(auto-fill, 6rem)",
                        gap: "1.3rem",
                    }}
                >
                    {media.map((m, i) => {
                        if (!m.imageUrl) return null
                        return (
                            <SmallImageThumbnail
                                key={i}
                                imageUrl={m.imageUrl}
                                videoUrl={m.videoUrl}
                                activeImageUrl={activeImageUrl}
                                setActiveImageUrl={setActiveImageUrl}
                                setActiveVideoUrl={setActiveVideoUrl}
                                primaryColor={primaryColor}
                            />
                        )
                    })}
                </Box>
            </Stack>

            {previewModalOpen && (
                <MediaPreviewModal
                    imageUrl={activeImageUrl}
                    videoUrls={activeVideoUrl ? [activeVideoUrl] : undefined}
                    onClose={() => togglePreviewModalOpen(false)}
                />
            )}
        </>
    )
}

const SmallImageThumbnail = ({
    imageUrl,
    videoUrl,
    activeImageUrl,
    setActiveImageUrl,
    setActiveVideoUrl,
    primaryColor,
}: {
    imageUrl?: string
    videoUrl?: string
    activeImageUrl?: string
    setActiveImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>
    setActiveVideoUrl: React.Dispatch<React.SetStateAction<string | undefined>>
    primaryColor: string
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
                border: activeImageUrl === imageUrl ? `${primaryColor} 2px solid` : "#FFFFFF18 2px solid",
            }}
            onClick={() => {
                setActiveImageUrl(imageUrl)
                setActiveVideoUrl(videoUrl)
            }}
        />
    )
}
