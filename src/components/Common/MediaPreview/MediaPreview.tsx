import { Box, SxProps } from "@mui/material"
import { useState } from "react"
import { MediaPreviewModal } from "./MediaPreviewModal"

export const MediaPreview = ({
    imageUrl,
    videoUrls,
    showBorder,
    sx,
    imageTransform,
    objectFit,
    objectPosition,
    blurBackground,
    allowModal,
}: {
    imageUrl?: string
    videoUrls?: (string | undefined)[]
    showBorder?: boolean
    sx?: SxProps
    imageTransform?: string
    objectFit?: string
    objectPosition?: string
    blurBackground?: boolean
    allowModal?: boolean // Opens the media in a full screen modal on click
}) => {
    const [showModal, setShowModal] = useState(false)

    const videoUrlsFilters = videoUrls ? videoUrls.filter((videoUrl) => !!videoUrl) : []

    const isTransparentVideo = !videoUrlsFilters[0] || videoUrlsFilters[0].endsWith("webm")

    return (
        <>
            <Box
                sx={{
                    position: "relative",
                    height: "100%",
                    width: "100%",
                    border: showBorder ? "#FFFFFF18 1.5px solid" : "unset",
                    boxShadow: "inset 0 0 12px 6px #00000040",
                    background: isTransparentVideo ? `radial-gradient(#FFFFFF08 10px, #00000080)` : "#000000",
                    cursor: allowModal ? "pointer" : "auto",
                    ...sx,
                }}
                onClick={allowModal ? () => setShowModal(true) : undefined}
            >
                {(!videoUrlsFilters || videoUrlsFilters.length <= 0) && imageUrl ? (
                    <Box
                        component="img"
                        src={imageUrl}
                        sx={{
                            height: "100%",
                            width: "100%",
                            objectFit: objectFit || "contain",
                            objectPosition: objectPosition || "center",
                            transform: imageTransform || "",
                        }}
                    />
                ) : (
                    <Box
                        key={imageUrl}
                        component="video"
                        sx={{
                            height: "100%",
                            width: "100%",
                            objectFit: objectFit || "contain",
                            objectPosition: objectPosition || "center",
                        }}
                        disablePictureInPicture
                        disableRemotePlayback
                        loop
                        muted
                        autoPlay
                        controls={false}
                        poster={`${imageUrl}`}
                    >
                        {videoUrlsFilters.map((videoUrl, i) => videoUrl && <source key={videoUrl + i} src={videoUrl} type="video/mp4" />)}
                    </Box>
                )}

                {blurBackground && imageUrl && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            filter: "blur(25px)",
                            opacity: 0.65,
                            height: "100%",
                            width: "100%",
                            background: `url(${imageUrl})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            zIndex: -1,
                        }}
                    />
                )}
            </Box>

            {allowModal && showModal && <MediaPreviewModal imageUrl={imageUrl} videoUrls={videoUrlsFilters} onClose={() => setShowModal(false)} />}
        </>
    )
}
