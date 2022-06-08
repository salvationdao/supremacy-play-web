import { Box } from "@mui/material"

export const Thumbnail = ({ isGridView, imageUrl, animationUrl }: { isGridView: boolean; imageUrl: string; animationUrl: string }) => {
    return (
        <Box
            key={imageUrl}
            component="video"
            sx={{
                height: isGridView ? "15rem" : "100%",
                width: "100%",
                overflow: "hidden",
                objectFit: "cover",
                objectPosition: "center",
                border: "#FFFFFF18 1px solid",
                borderRadius: 1,
                boxShadow: "inset 0 0 12px 6px #00000040",
                background: `radial-gradient(#FFFFFF20 10px, #00000080)`,
            }}
            loop
            muted
            autoPlay
            poster={`${imageUrl}`}
        >
            <source src={animationUrl} type="video/mp4" />
        </Box>
    )
}
