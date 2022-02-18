import { Box, Typography, TypographyPropsVariantOverrides } from '@mui/material'
import { Variant } from '@mui/material/styles/createTypography'
import { OverridableStringUnion } from '@mui/types'
import { useMemo } from 'react'

export const StyledImageText = ({
    imageUrl,
    text,
    variant = 'body1',
    color,
    truncateLine,

    fontFamily,
    fontWeight = 'fontWeightBold',
    imageSize = 16,
    imageBorderColor,
    imageBorderThickness = '1px',
    imageBackgroundSize = 'cover',
    noImageBackgroundColor,
}: {
    imageUrl?: string
    text: string
    variant?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>
    color: string
    truncateLine?: boolean

    fontWeight?: string
    fontFamily?: string
    imageSize?: number
    imageBorderColor?: string
    imageBorderThickness?: string
    imageBackgroundSize?: string
    noImageBackgroundColor?: boolean
}) => {
    const truncateStyle: any = useMemo(
        () =>
            truncateLine
                ? {
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                  }
                : {},
        [truncateLine],
    )

    return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', overflow: 'hidden' }}>
            {imageUrl && (
                <Box
                    sx={{
                        display: 'inline-block',
                        flexShrink: 0,
                        width: imageSize,
                        height: imageSize,
                        mb: '4px',
                        mr: 0.032 * imageSize,
                        backgroundImage: `url(${imageUrl})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: imageBackgroundSize,
                        backgroundColor: noImageBackgroundColor ? 'unset' : imageBorderColor || color,
                        borderRadius: 0.5,
                        border: `${imageBorderColor || color} solid ${imageBorderThickness}`,
                    }}
                />
            )}
            <Typography
                component="span"
                variant={variant}
                sx={{ display: 'inline', fontFamily, fontWeight, color, wordBreak: 'break-word', ...truncateStyle }}
            >
                {text}
            </Typography>
        </Box>
    )
}
