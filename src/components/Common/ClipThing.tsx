import { Box, SxProps } from "@mui/system"
import React, { useMemo } from "react"
import { shadeColor } from "../../helpers"
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

interface ClipThingPropsWithChildren extends ClipThingProps {
    children: React.ReactNode
}

export const ClipThing = React.forwardRef(function ClipThing(
    {
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
    }: ClipThingPropsWithChildren,
    ref,
) {
    const { topLeft, topRight, bottomLeft, bottomRight } = corners
    const isSlanted = useMemo(() => clipSlantSize !== "0" && clipSlantSize !== "0px", [clipSlantSize])

    const innerClipStyles: SxProps = useMemo(
        () => ({
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
                ${!isSlanted && topLeft ? `,0 ${clipSize}` : ""}
            )
        `,
        }),
        [bottomLeft, bottomRight, clipSize, clipSlantSize, isSlanted, topLeft, topRight],
    )

    const outerClipStyles: SxProps = useMemo(
        () => ({
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
                ${!isSlanted && topLeft ? `,0 ${clipSize}` : ""}
            )
        `,
        }),
        [bottomLeft, bottomRight, clipSize, clipSlantSize, isSlanted, topLeft, topRight],
    )

    const borderStyles: SxProps = {
        borderTopLeftRadius: "1.5px",
        borderBottomRightRadius: "1.5px",
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

    const innerBackground = useMemo(
        () => (backgroundColor ? `linear-gradient(${backgroundColor} 26%, ${shadeColor(backgroundColor, -20)})` : "unset"),
        [backgroundColor],
    )

    return (
        <Box
            ref={ref}
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
                            background: innerBackground,
                        } as Record<string, unknown>
                    }
                />
            </Box>
            <Box sx={{ height: "100%", ...innerClipStyles }}>{children}</Box>
        </Box>
    )
})
