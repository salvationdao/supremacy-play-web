import { Box, Typography } from '@mui/material'

export const StyledImageText = ({ imageUrl, text, color }: { imageUrl?: string; text: string; color: string }) => {
    return (
        <Box sx={{ display: 'inline-block' }}>
            {imageUrl && (
                <Box
                    sx={{
                        display: 'inline-block',
                        width: 13,
                        height: 13,
                        mr: 0.5,
                        backgroundImage: `url(${imageUrl})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        backgroundColor: color,
                        borderRadius: 0.3,
                    }}
                />
            )}
            <Typography
                component="span"
                variant="body1"
                sx={{ fontWeight: 'fontWeightBold', color, wordBreak: 'break-word' }}
            >
                {text}
            </Typography>
        </Box>
    )
}
