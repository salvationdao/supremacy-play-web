import { Box, SxProps, TypographyPropsVariantOverrides } from "@mui/material"
import { Variant } from "@mui/material/styles/createTypography"
import { OverridableStringUnion } from "@mui/types"
import { ReactNode } from "react"
import { TypographyTruncated } from "../../../Common/TypographyTruncated"

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
    imageBackgroundSize?: string
}

export const StyledImageText = ({
    imageUrl,
    text,
    variant = "body1",
    textColor,
    color,
    textSx,

    fontFamily,
    fontWeight = "bold",
    imageSize = 1.8,
    imageBackgroundSize = "cover",
}: StyledImageTextProps) => {
    return (
        <span style={{ display: "inline-flex", alignItems: "center" }}>
            {imageUrl && (
                <Box
                    component="span"
                    sx={{
                        flexShrink: 0,
                        display: "inline-block",
                        width: `${imageSize}rem`,
                        height: `${imageSize}rem`,
                        mr: `${0.3 * imageSize}rem`,
                        backgroundImage: `url(${imageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: imageBackgroundSize,
                        borderRadius: 0.5,
                    }}
                />
            )}

            <TypographyTruncated
                variant={variant}
                sx={{
                    display: "inline",
                    fontFamily,
                    fontWeight,
                    color: textColor || color,
                    wordBreak: "break-all",
                    ...textSx,
                }}
            >
                {text}
                <span style={{ marginLeft: -1.5, visibility: "hidden" }}>.</span>
            </TypographyTruncated>
        </span>
    )
}
