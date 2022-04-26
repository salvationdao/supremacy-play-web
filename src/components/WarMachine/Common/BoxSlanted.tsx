import React from "react"
import { Box, BoxProps } from "@mui/material"

interface BoxSlantedProps extends BoxProps {
    clipSize?: string
    clipSlantSize?: string
    skipLeft?: boolean
    skipRight?: boolean
}

export const BoxSlanted: React.FC<BoxSlantedProps> = ({ children, clipSize = "0px", clipSlantSize = "0px", skipLeft, skipRight, sx, ...props }) => {
    return (
        <Box
            {...props}
            sx={{
                ...sx,
                clipPath: `polygon(${skipLeft ? "0" : clipSlantSize} 0, calc(100% - ${skipRight ? "100%" : clipSize}) 0%, 100% ${clipSize}, calc(100% - ${
                    skipRight ? "0%" : clipSlantSize
                }) 100%, ${skipLeft ? "0" : clipSize} 100%, 0% calc(100% - ${clipSize}))`,
            }}
        >
            {children}
        </Box>
    )
}
