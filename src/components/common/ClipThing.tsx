import { Box, SxProps } from '@mui/system'
import React from 'react'
import { useTheme } from '@mui/styles'
import { Theme } from '@mui/material/styles'

export interface ClipThingProps {
    clipSize?: string
    clipSlantSize?: string
    border?:
        | {
              borderThickness?: string
              borderColor?: string
              isFancy?: boolean
          }
        | boolean
    sx?: SxProps<Theme>
    innerSx?: SxProps<Theme>
    fillHeight?: boolean
}

export const ClipThing: React.FC<ClipThingProps> = ({
    children,
    clipSize = '1rem',
    clipSlantSize = '0px',
    border,
    innerSx,
    sx,
    fillHeight,
}) => {
    const theme = useTheme<Theme>()

    const innerClipStyles: any = {
        height: fillHeight ? '100%' : 'fit-content',
        lineHeight: 1,
        clipPath: `polygon(${clipSlantSize} 0, calc(100% - ${clipSize}) 0%, 100% ${clipSize}, calc(100% - ${clipSlantSize}) 100%, ${clipSize} 100%, ${
            clipSlantSize != '0px' ? '2px' : '0%'
        } calc(100% - ${clipSize}))`,
    }

    const outerClipStyles: any = {
        height: fillHeight ? '100%' : 'fit-content',
        lineHeight: 1,
        clipPath: `polygon(${clipSlantSize} 0, calc(100% - ${clipSize}) 0%, 100% ${clipSize}, calc(100% - ${clipSlantSize}) 100%, ${clipSize} 100%, 0% calc(100% - ${clipSize}))`,
    }

    const borderStyles: any = {
        borderTopLeftRadius: '2px',
        borderBottomRightRadius: '2px',
    }

    if (border) {
        if (typeof border == 'boolean') {
            // Set default styles
            borderStyles.padding = '1px'
            borderStyles.backgroundColor = theme.factionTheme.primary
        } else {
            borderStyles.padding = border.borderThickness || '1px'
            const _color = border.borderColor || theme.factionTheme.primary
            if (border.isFancy) {
                borderStyles.background = `transparent linear-gradient(45deg, ${_color} 0%, ${_color}28 51%, ${_color} 100%) 0% 0% no-repeat padding-box`
            } else {
                borderStyles.backgroundColor = _color
            }
        }
    }

    return (
        <Box
            sx={{
                ...borderStyles,
                ...outerClipStyles,
                ...sx,
            }}
        >
            <Box
                sx={{
                    ...innerSx,
                    ...innerClipStyles,
                }}
            >
                {children}
            </Box>
        </Box>
    )
}
