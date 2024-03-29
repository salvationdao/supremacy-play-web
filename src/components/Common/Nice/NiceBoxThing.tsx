import { Box, BoxProps, SxProps } from "@mui/material"
import { ResponsiveStyleValue } from "@mui/system"
import { Property } from "csstype"
import React, { useMemo } from "react"

export interface NiceBoxThingProps extends Omit<BoxProps, "border" | "background"> {
    caret?: {
        position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
        /**
         * The colour of the caret. If no colour is provided, it will default to the border colour. An
         * error is thrown when both the caret color and border color is not provided.
         */
        color?: ResponsiveStyleValue<Property.Color | undefined>
        size?: "small" | "regular" | "large"
        detached?: boolean
    }
    border?: {
        color: ResponsiveStyleValue<Property.Color | undefined>
        thickness?: "very-lean" | "lean" | "thicc"
        style?: "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "inset" | "outset" | "none" | "hidden"
    }
    background?:
        | boolean
        | {
              /**
               * Specify the colours used for the gradient background, going from the top left corner and ending at the
               * bottom right corner of the NiceBoxThing. If only one colour is provided, then there is no gradient.
               *
               * If no colors are provided, it will default to the border color. An error is thrown when both the background
               * colors and border color is not provided.
               *
               * @example Generating a gradient background, where the top left corner is black and the bottom right corner
               * is neon blue:
               * ```
               * ["#000", colors.neonBlue]
               * ```
               */
              colors?: ResponsiveStyleValue<Property.Color | undefined>[]
              opacity?: number
              linearGradientDegrees?: number
              insetPx?: number
          }
    enableBoxShadow?: boolean
    sx?: SxProps
    children?: React.ReactNode
}

export const NiceBoxThing = React.forwardRef<unknown, NiceBoxThingProps>(function NiceBoxThing(
    { caret, border, background, enableBoxShadow = true, sx, children, ...props },
    ref,
) {
    const renderCaret = useMemo(() => {
        if (!caret) return
        const color = caret.color || border?.color

        const styles: SxProps = {
            position: "absolute",
            borderColor: "transparent",
            borderStyle: "solid",
        }

        const offset = caret.detached ? "1px" : "0px"

        switch (caret.position) {
            case "top-left":
                styles.top = offset
                styles.left = offset
                styles.borderTopColor = color
                styles.borderLeftColor = color
                break
            case "top-right":
                styles.top = offset
                styles.right = offset
                styles.borderTopColor = color
                styles.borderRightColor = color
                break
            case "bottom-left":
                styles.bottom = offset
                styles.left = offset
                styles.borderBottomColor = color
                styles.borderLeftColor = color
                break
            case "bottom-right":
                styles.bottom = offset
                styles.right = offset
                styles.borderBottomColor = color
                styles.borderRightColor = color
                break
        }

        switch (typeof caret.size === "undefined" ? "regular" : caret.size) {
            case "small":
                styles.borderWidth = "5px"
                break
            case "regular":
                styles.borderWidth = "8px"
                break
            case "large":
                styles.borderWidth = "12px"
                break
        }

        return (
            <Box
                sx={{
                    ...styles,
                }}
            />
        )
    }, [border?.color, caret])

    const renderBackground = useMemo(() => {
        if (!background) return null

        const backgroundStyles: SxProps = {
            zIndex: -1,
            position: "absolute",
            top: typeof background !== "boolean" ? `${background.insetPx || 0}px` : 0,
            left: typeof background !== "boolean" ? `${background.insetPx || 0}px` : 0,
            right: typeof background !== "boolean" ? `${background.insetPx || 0}px` : 0,
            bottom: typeof background !== "boolean" ? `${background.insetPx || 0}px` : 0,
            pointerEvents: "none",
        }

        let colors: ResponsiveStyleValue<Property.Color | undefined>[] = []
        if (typeof background !== "boolean" && background.colors && background.colors.length > 0) {
            colors = background.colors
        } else if (border?.color) {
            colors = [border.color]
        }

        if (colors.length === 1) {
            backgroundStyles.backgroundColor = colors[0]
        } else {
            backgroundStyles.background = `linear-gradient(${typeof background === "boolean" ? 150 : background.linearGradientDegrees || 150}deg, ${colors.join(
                ", ",
            )})`
        }

        backgroundStyles.opacity = typeof background === "boolean" ? 1 : background.opacity || 1

        return (
            <Box
                sx={{
                    ...backgroundStyles,
                }}
            />
        )
    }, [background, border?.color])

    const generateBorderStyles = useMemo(() => {
        if (!border) return {}
        const styles: SxProps = {
            borderColor: border.color,
            borderStyle: border.style || "solid",
        }

        switch (typeof border.thickness === "undefined" ? "very-lean" : border.thickness) {
            case "very-lean":
                styles.borderWidth = "1px"
                break
            case "lean":
                styles.borderWidth = "2px"
                break
            case "thicc":
                styles.borderWidth = "3px"
                break
        }

        return styles
    }, [border])

    return (
        <Box
            ref={ref}
            sx={{
                zIndex: 0,
                position: "relative",
                boxShadow: enableBoxShadow ? 0.4 : "none",
                borderRadius: 0.3,
                ...generateBorderStyles,
                ...sx,
            }}
            {...props}
        >
            {renderBackground}
            {children}
            {renderCaret}
        </Box>
    )
})
