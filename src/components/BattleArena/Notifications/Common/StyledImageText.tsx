import { Box, SxProps, Typography } from "@mui/material"
import { ReactNode } from "react"

export const StyledImageText = ({ imageUrl, children, sx }: { imageUrl?: string; children: ReactNode; sx?: SxProps }) => {
    return (
        <Typography component="span" sx={{ ...sx, overflowWrap: "anywhere", whiteSpace: "normal" }}>
            {imageUrl && (
                <>
                    <Box
                        sx={{
                            display: "inline-block",
                            width: "2.8rem",
                            height: "2.8rem",
                            verticalAlign: "middle",
                            background: `url(${imageUrl})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                        }}
                    />{" "}
                </>
            )}
            {children}
        </Typography>
    )
}
