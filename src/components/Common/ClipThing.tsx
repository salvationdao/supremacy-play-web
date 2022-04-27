import { Box, SxProps } from "@mui/system"
import React from "react"
import { colors } from "../../theme/theme"

export interface ClipThingProps {
    clipSize?: string
    clipSlantSize?: string
    border?: {
        borderThickness?: string
        borderColor?: string
        isFancy?: boolean
    }
    sx?: SxProps
    outerSx?: SxProps
    innerSx?: SxProps
    skipRightCorner?: boolean
    opacity?: number
    backgroundColor?: string
}

export const ClipThing: React.FC<ClipThingProps> = ({
    children,
    clipSize = "1rem",
    clipSlantSize = "0px",
    border,
    sx,
    innerSx,
    outerSx,
    skipRightCorner,
    opacity,
    backgroundColor,
}) => {
    const innerClipStyles: SxProps = {
        lineHeight: 1,
        clipPath: `polygon(${clipSlantSize} 0, calc(100% - ${
            skipRightCorner ? "0%" : clipSize
        }) 0%, 100% ${clipSize}, calc(100% - ${clipSlantSize}) 100%, ${clipSize} 100%, ${clipSlantSize != "0px" ? "2px" : "0%"} calc(100% - ${clipSize}))`,
    }

    const outerClipStyles: SxProps = {
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
        if (border) {
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
                position: "relative",
                p: border && typeof border !== "boolean" ? border.borderThickness : 0,
                overflow: "hidden",
                ...outerClipStyles,
                ...sx,
            }}
        >
            <Box
                sx={{
                    ...borderStyles,
                    ...outerClipStyles,
                    ...outerSx,
                    ...{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: -1,
                        opacity: opacity || 1,
                    },
                }}
            >
                <Box
                    sx={
                        {
                            ...innerSx,
                            ...innerClipStyles,
                            height: "100%",
                            backgroundColor: backgroundColor || "unset",
                        } as Record<string, unknown>
                    }
                />
            </Box>
            <Box sx={{ ...innerClipStyles }}>{children}</Box>
        </Box>
    )
}
