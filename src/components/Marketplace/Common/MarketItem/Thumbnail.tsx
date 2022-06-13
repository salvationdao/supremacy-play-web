import { Box } from "@mui/material"

export const Thumbnail = ({ isGridView, imageUrl, animationUrl }: { isGridView: boolean; imageUrl: string; animationUrl?: string }) => {
    return (
        <Box
            sx={{
                position: "relative",
                height: isGridView ? "15rem" : "100%",
                width: "100%",
            }}
        >
            <Box
                key={imageUrl}
                component="video"
                sx={{
                    height: "100%",
                    width: "100%",
                    overflow: "hidden",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: 1,
                }}
                loop
                muted
                autoPlay
                poster={`${imageUrl}`}
            >
                {animationUrl && <source src={animationUrl} type="video/mp4" />}
            </Box>
        </Box>
    )
}