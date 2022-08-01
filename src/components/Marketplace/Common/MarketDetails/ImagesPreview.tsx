import { Box, CircularProgress, Stack } from "@mui/material"
import { useState } from "react"
import { useToggle } from "../../../../hooks"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { MediaPreviewModal } from "../../../Common/MediaPreview/MediaPreviewModal"

export interface MarketMedia {
    imageUrl?: string
    videoUrl?: string
}

export const ImagesPreview = ({ media, primaryColor }: { media: MarketMedia[]; primaryColor: string }) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [previewModalOpen, togglePreviewModalOpen] = useToggle()

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
                    {media[activeIndex] ? (
                        <MediaPreview
                            imageUrl={media[activeIndex].imageUrl}
                            videoUrls={media[activeIndex].videoUrl ? [media[activeIndex].videoUrl] : undefined}
                            showBorder
                        />
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
                                index={i}
                                imageUrl={m.imageUrl}
                                videoUrl={m.videoUrl}
                                activeIndex={activeIndex}
                                setActiveIndex={setActiveIndex}
                                primaryColor={primaryColor}
                            />
                        )
                    })}
                </Box>
            </Stack>

            {previewModalOpen && (
                <MediaPreviewModal
                    imageUrl={media[activeIndex].imageUrl}
                    videoUrls={[media[activeIndex].videoUrl]}
                    onClose={() => togglePreviewModalOpen(false)}
                />
            )}
        </>
    )
}

const SmallImageThumbnail = ({
    index,
    imageUrl,
    activeIndex,
    setActiveIndex,
    primaryColor,
}: {
    index: number
    imageUrl?: string
    videoUrl?: string
    activeIndex: number
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>
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
                border: index === activeIndex ? `${primaryColor} 2px solid` : "#FFFFFF18 2px solid",
            }}
            onClick={() => setActiveIndex(index)}
        />
    )
}
