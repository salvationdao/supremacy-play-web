import { Box, SxProps } from "@mui/material"
import { ResponsiveStyleValue } from "@mui/system"
import { Property } from "csstype"
import React from "react"

export enum CaretPosition {
    TopLeft, // default
    TopRight,
    BottomLeft,
    BottomRight,
}

export enum CaretSize {
    Small,
    Regular, // default
    Large,
}

export enum BorderThickness {
    Lean, // default
    Thicc,
}

export enum BackgroundOpacity {
    Transparent,
    MoreTransparent,
    Half,
    MoreOpaque,
    Opaque, // default
}

export interface NiceBoxThingProps {
    caret?: {
        position: CaretPosition
        /**
         * The colour of the caret. If no colour is provided, it will default to the specified border colour. An
         * error is thrown when both the caret color and border color is not provided.
         */
        color?: ResponsiveStyleValue<Property.Color | string[] | undefined>
        size?: CaretSize
        detached?: boolean
    }
    border?: {
        color: ResponsiveStyleValue<Property.Color | string[] | undefined>
        thickness?: BorderThickness
    }
    background?: {
        /**
         * Specify the colours used for the gradient background, going from the top left corner and ending at the
         * bottom right corner of the NiceBoxThing. If only one colour is provided, then there is no gradient.
         * @example Generating a gradient background, where the top left corner is black and the bottom right corner
         * is neon blue:
         * ```
         * ["#000", colors.neonBlue]
         * ```
         */
        color: ResponsiveStyleValue<Property.Color | undefined>[]
        opacity?: BackgroundOpacity
    }
    sx?: SxProps
    children: React.ReactNode | null
}

export const NiceBoxThing = ({ caret, border, background, sx, children }: NiceBoxThingProps) => {
    const renderCaret = () => {
        if (!caret) return
        const color = caret.color || border?.color
        if (!color) throw new Error("A caret or border color must be provided for the caret to render.")

        const styles: SxProps = {
            position: "absolute",
            borderColor: "transparent",
            borderStyle: "solid",
        }

        const offset = caret.detached ? "1px" : "0px"

        switch (caret.position) {
            case CaretPosition.TopLeft:
                styles.top = offset
                styles.left = offset
                styles.borderTopColor = color
                styles.borderLeftColor = color
                break
            case CaretPosition.TopRight:
                styles.top = offset
                styles.right = offset
                styles.borderTopColor = color
                styles.borderRightColor = color
                break
            case CaretPosition.BottomLeft:
                styles.bottom = offset
                styles.left = offset
                styles.borderBottomColor = color
                styles.borderLeftColor = color
                break
            case CaretPosition.BottomRight:
                styles.bottom = offset
                styles.right = offset
                styles.borderBottomColor = color
                styles.borderRightColor = color
                break
        }

        switch (typeof caret.size === "undefined" ? CaretSize.Regular : caret.size) {
            case CaretSize.Small:
                styles.borderWidth = "5px"
                break
            case CaretSize.Regular:
                styles.borderWidth = "8px"
                break
            case CaretSize.Large:
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
    }

    const renderBackground = () => {
        if (!background) return

        const backgroundStyles: SxProps = {
            zIndex: -1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        }

        if (background.color.length === 1) {
            backgroundStyles.backgroundColor = background.color[0]
        } else {
            backgroundStyles.background = `linear-gradient(to bottom right, ${background.color.join(", ")})`
        }

        switch (typeof background.opacity === "undefined" ? BackgroundOpacity.Opaque : background.opacity) {
            case BackgroundOpacity.Transparent:
                backgroundStyles.opacity = 0
                break
            case BackgroundOpacity.MoreTransparent:
                backgroundStyles.opacity = 0.2
                break
            case BackgroundOpacity.Half:
                backgroundStyles.opacity = 0.5
                break
            case BackgroundOpacity.MoreOpaque:
                backgroundStyles.opacity = 0.7
                break
            case BackgroundOpacity.Opaque:
                backgroundStyles.opacity = 1
                break
        }

        return (
            <Box
                sx={{
                    ...backgroundStyles,
                }}
            />
        )
    }

    const generateBorderStyles = () => {
        if (!border) return {}
        const styles: SxProps = {
            borderColor: border.color,
            borderStyle: "solid",
        }

        switch (typeof border.thickness === "undefined" ? BorderThickness.Lean : border.thickness) {
            case BorderThickness.Lean:
                styles.borderWidth = "2px"
                break
            case BorderThickness.Thicc:
                styles.borderWidth = "3px"
                break
        }

        return styles
    }

    return (
        <Box
            sx={{
                position: "relative",
                ...generateBorderStyles(),
                ...sx,
            }}
        >
            {renderBackground()}
            {children}
            {renderCaret()}
        </Box>
    )
}
