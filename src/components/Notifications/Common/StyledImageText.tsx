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
    imageSize = 1.6,
    imageBorderColor,
    imageBackgroundColor,
    imageBorderThickness = "1px",
    imageBackgroundSize = "cover",
    noImageBackgroundColor,
    imageMb,
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
    imageMb?: number
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
        <span>
            {imageUrl && (
                <Box
                    sx={{
                        display: "inline-block",
                        width: `${imageSize}rem`,
                        height: `${imageSize}rem`,
                        mb: imageMb || "-0.16rem",
                        mr: `${0.3 * imageSize}rem`,
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
                <span style={{ marginLeft: -1.5, visibility: "hidden" }}>.</span>
            </Typography>
        </span>
    )
}
