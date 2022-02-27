import { Box, Typography, TypographyPropsVariantOverrides } from "@mui/material"
import { Variant } from "@mui/material/styles/createTypography"
import { OverridableStringUnion } from "@mui/types"
import { useMemo } from "react"

export const StyledImageText = ({
    imageUrl,
    text,
    variant = "body1",
    color,
    truncateLine,

    fontFamily,
    fontWeight = "fontWeightBold",
    imageSize = 16,
    imageBorderColor,
    imageBackgroundColor,
    imageBorderThickness = "1px",
    imageBackgroundSize = "cover",
    noImageBackgroundColor,
}: {
    imageUrl?: string
    text: string
    variant?: OverridableStringUnion<Variant | "inherit", TypographyPropsVariantOverrides>
    color: string
    truncateLine?: boolean

    fontWeight?: string
    fontFamily?: string
    imageSize?: number
    imageBorderColor?: string
    imageBackgroundColor?: string
    imageBorderThickness?: string
    imageBackgroundSize?: string
    noImageBackgroundColor?: boolean
}) => {
    const truncateStyle: any = useMemo(
        () =>
            truncateLine
                ? {
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                  }
                : {},
        [truncateLine],
    )

    return (
        <Box
            sx={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                pl: imageUrl ? `${imageSize + 0.2 * imageSize}px` : 0,
            }}
        >
            {imageUrl && (
                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                        display: "inline-block",
                        flexShrink: 0,
                        width: imageSize,
                        height: imageSize,
                        backgroundImage: `url(${imageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: imageBackgroundSize,
                        backgroundColor: noImageBackgroundColor
                            ? "unset"
                            : imageBackgroundColor || imageBorderColor || color,
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
                    lineHeight: 1,
                    fontFamily,
                    fontWeight,
                    color,
                    wordBreak: "break-word",
                    ...truncateStyle,
                }}
            >
                {text}
                <span style={{ visibility: "hidden" }}>.</span>
            </Typography>
        </Box>
    )
}
