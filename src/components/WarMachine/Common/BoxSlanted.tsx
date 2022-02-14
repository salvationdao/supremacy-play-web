import React from 'react'
import { Box, BoxProps } from '@mui/material'

interface BoxSlantedProps extends BoxProps {
    clipSize?: string
    clipSlantSize?: string
}

export const BoxSlanted: React.FC<BoxSlantedProps> = ({
    children,
    clipSize = '0px',
    clipSlantSize = '0px',
    sx,
    ...props
}) => {
    return (
        <Box
            {...props}
            sx={{
                ...sx,
                clipPath: `polygon(${clipSlantSize} 0, calc(100% - ${clipSize}) 0%, 100% ${clipSize}, calc(100% - ${clipSlantSize}) 100%, ${clipSize} 100%, 0% calc(100% - ${clipSize}))`,
            }}
        >
            {children}
        </Box>
    )
}
