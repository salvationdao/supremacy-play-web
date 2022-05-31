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
    corners?: {
        topLeft?: boolean
        topRight?: boolean
        bottomLeft?: boolean
        bottomRight?: boolean
    }
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
    corners = {
        topLeft: true,
        topRight: true,
        bottomLeft: true,
        bottomRight: true,
    },
    opacity,
    backgroundColor,
}) => {
    const { topLeft, topRight, bottomLeft, bottomRight } = corners
    const isSlanted = clipSlantSize !== "0" && clipSlantSize !== "0px"

    const innerClipStyles: SxProps = {
        lineHeight: 1,
        clipPath: `
            polygon(
                ${isSlanted ? `${clipSlantSize} 0` : topLeft ? `${clipSize} 0` : "0 0"}
                ${topRight ? `,calc(100% - ${clipSize}) 0` : ",100% 0"}
                ${topRight ? `,${isSlanted ? "calc(100% - 2px)" : "100%"} ${clipSize}` : ""}
                ${isSlanted ? `,calc(100% - ${clipSlantSize}) 100%` : bottomRight ? `,100% calc(100% - ${clipSize})` : ",100% 100%"}
                ${!isSlanted && bottomRight ? `,calc(100% - ${clipSize}) 100%` : ""}
                ${bottomLeft ? `,${clipSize} 100%` : ",0 100%"}
                ${bottomLeft ? `,${isSlanted ? "2px" : "0"} calc(100% - ${clipSize})` : ""}
                ${topLeft ? `,0 ${clipSize}` : ""}
            )
        `,
    }

    const outerClipStyles: SxProps = {
        lineHeight: 1,
        clipPath: `
            polygon(
                ${isSlanted ? `${clipSlantSize} 0` : topLeft ? `${clipSize} 0` : "0 0"}
                ${topRight ? `,calc(100% - ${clipSize}) 0` : ",100% 0"}
                ${topRight ? `,100% ${clipSize}` : ""}
                ${isSlanted ? `,calc(100% - ${clipSlantSize}) 100%` : bottomRight ? `,100% calc(100% - ${clipSize})` : ",100% 100%"}
                ${!isSlanted && bottomRight ? `,calc(100% - ${clipSize}) 100%` : ""}
                ${bottomLeft ? `,${clipSize} 100%` : ",0 100%"}
                ${bottomLeft ? `,0 calc(100% - ${clipSize})` : ""}
                ${topLeft ? `,0 ${clipSize}` : ""}
            )
        `,
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
                className="clip-thing-outer"
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
                    className="clip-thing-inner"
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
            <Box sx={{ height: "100%", ...innerClipStyles }}>{children}</Box>
        </Box>
    )
}
