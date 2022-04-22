import { Box } from "@mui/material"
import React from "react"
import { DRAWER_TRANSITION_DURATION } from "../../constants"
import { useDimension } from "../../containers"
import { colors } from "../../theme/theme"

export const PageWrapper: React.FC = ({ children }) => {
    const { streamDimensions } = useDimension()
    return (
        <Box sx={{ display: "flex" }}>
            <Box
                sx={{
                    position: "relative",
                    height: streamDimensions.height,
                    width: "auto",
                    minWidth: streamDimensions.width,
                    backgroundColor: colors.darkNavy,
                    transition: `all ${DRAWER_TRANSITION_DURATION / 1000}s`,
                }}
            >
                {children}
            </Box>
        </Box>
    )
}
