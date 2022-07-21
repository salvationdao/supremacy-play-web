import { Box, SxProps } from "@mui/material"

export const MediaPreview = ({
    imageUrl,
    videoUrls,
    showBorder,
    sx,
    imageTransform,
    objectFit,
    objectPosition,
    blurBackground,
}: {
    imageUrl?: string
    videoUrls?: (string | undefined)[]
    showBorder?: boolean
    sx?: SxProps
    imageTransform?: string
    objectFit?: string
    objectPosition?: string
    blurBackground?: boolean
}) => {
    const videoUrlsFilters = videoUrls ? videoUrls.filter((videoUrl) => !!videoUrl) : []

    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
                width: "100%",
                border: showBorder ? "#FFFFFF18 1.5px solid" : "unset",
                boxShadow: "inset 0 0 12px 6px #00000040",
                background: `radial-gradient(#FFFFFF20 10px, #00000080)`,
                ...sx,
            }}
        >
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
        </Box>
    )
}
