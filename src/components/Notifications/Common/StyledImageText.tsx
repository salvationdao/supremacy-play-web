import { Box, SxProps, Typography, TypographyPropsVariantOverrides } from "@mui/material"
import { Variant } from "@mui/material/styles/createTypography"
import { OverridableStringUnion } from "@mui/types"
import { ReactNode, useMemo } from "react"

export interface StyledImageTextProps {
    imageUrl?: string
    text?: string | ReactNode
    variant?: OverridableStringUnion<Variant | "inherit", TypographyPropsVariantOverrides>
    textColor?: string
    color?: string
    truncateLine?: boolean
    textSx?: SxProps

    fontWeight?: string
    fontFamily?: string
    imageSize?: number
    imageBorderColor?: string
    imageBackgroundColor?: string
    imageBorderThickness?: string
    imageBackgroundSize?: string
    noImageBackgroundColor?: boolean
    imageMb?: number
}

export const StyledImageText = ({
    imageUrl,
    text,
    variant = "body1",
    textColor,
    color,
    truncateLine,
    textSx,

    fontFamily,
    fontWeight = "fontWeightBold",
    imageSize = 1.6,
    imageBorderColor,
    imageBackgroundColor,
    imageBorderThickness = "1px",
    imageBackgroundSize = "cover",
    noImageBackgroundColor,
    imageMb,
}: StyledImageTextProps) => {
    const truncateStyle: SxProps = useMemo(
        () =>
            truncateLine
                ? {
                      display: "-webkit-inline-box",
                      overflow: "hidden",
                      overflowWrap: "anywhere",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: 1, // change to max number of lines
                      WebkitBoxOrient: "vertical",
                  }
                : {},
        [truncateLine],
    )

    return (
        <span style={{ display: "inline" }}>
            {imageUrl && (
                <Box
                    component="span"
                    sx={{
                        flexShrink: 0,
                        display: "inline-block",
                        width: `${imageSize}rem`,
                        height: `${imageSize}rem`,
                        mb: imageMb || "-0.16rem",
                        mr: `${0.3 * imageSize}rem`,
                        backgroundImage: `url(${imageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: imageBackgroundSize,
                        backgroundColor: noImageBackgroundColor ? "unset" : imageBackgroundColor || imageBorderColor || color,
                        borderRadius: 0.5,
                        border: `${imageBorderColor || color} solid ${imageBorderThickness}`,
                    }}
                />
            )}
            <Typography
                component="span"
                variant={variant}
                sx={{
                    display: "inline",
                    fontFamily,
                    fontWeight,
                    color: textColor || color,
                    wordBreak: "break-all",
                    ...truncateStyle,
                    ...textSx,
                }}
            >
                {text}
                <span style={{ marginLeft: -1.5, visibility: "hidden" }}>.</span>
            </Typography>
        </span>
    )
}
