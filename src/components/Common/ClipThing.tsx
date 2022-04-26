import { Box, SxProps } from "@mui/system"
import React from "react"
import { colors } from "../../theme/theme"

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
    sx?: SxProps
    innerSx?: SxProps
    fillHeight?: boolean
    skipRightCorner?: boolean
}

export const ClipThing: React.FC<ClipThingProps> = ({
    children,
    clipSize = "1rem",
    clipSlantSize = "0px",
    border,
    innerSx,
    sx,
    fillHeight,
    skipRightCorner,
}) => {
    const innerClipStyles: SxProps = {
        height: fillHeight ? "100%" : "fit-content",
        lineHeight: 1,
        clipPath: `polygon(${clipSlantSize} 0, calc(100% - ${
            skipRightCorner ? "0%" : clipSize
        }) 0%, 100% ${clipSize}, calc(100% - ${clipSlantSize}) 100%, ${clipSize} 100%, ${clipSlantSize != "0px" ? "2px" : "0%"} calc(100% - ${clipSize}))`,
    }

    const outerClipStyles: SxProps = {
        height: fillHeight ? "100%" : "fit-content",
        lineHeight: 1,
        clipPath: `polygon(${clipSlantSize} 0, calc(100% - ${
            skipRightCorner ? "0%" : clipSize
        }) 0%, 100% ${clipSize}, calc(100% - ${clipSlantSize}) 100%, ${clipSize} 100%, 0% calc(100% - ${clipSize}))`,
    }

    const borderStyles: SxProps = {
        borderTopLeftRadius: "2px",
        borderBottomRightRadius: "2px",
    }

    if (border) {
        if (typeof border == "boolean") {
            // Set default styles
            borderStyles.padding = "1px"
            borderStyles.backgroundColor = colors.neonBlue
        } else {
            borderStyles.padding = border.borderThickness || "1px"
            const _color = border.borderColor || colors.neonBlue
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
                sx={
                    {
                        ...innerSx,
                        ...innerClipStyles,
                    } as Record<string, unknown>
                }
            >
                {children}
            </Box>
        </Box>
    )
}
