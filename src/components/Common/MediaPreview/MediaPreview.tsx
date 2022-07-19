import { Box, SxProps } from "@mui/material"

export const MediaPreview = ({
    imageUrl,
    videoUrls,
    showBorder,
    sx,
    objectFit,
    objectPosition,
}: {
    imageUrl?: string
    videoUrls?: (string | undefined)[]
    showBorder?: boolean
    sx?: SxProps
    objectFit?: string
    objectPosition?: string
}) => {
    const videoUrlsFilters = videoUrls ? videoUrls.filter((videoUrl) => !!videoUrl) : []

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                border: showBorder ? "#FFFFFF18 1.5px solid" : "unset",
                boxShadow: "inset 0 0 12px 6px #00000040",
                background: `radial-gradient(#FFFFFF20 10px, #00000080)`,
                ...sx,
            }}
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
