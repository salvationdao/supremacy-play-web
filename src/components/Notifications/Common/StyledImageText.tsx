import { Box, Typography } from '@mui/material'

export const StyledImageText = ({ imageUrl, text, color }: { imageUrl?: string; text: string; color: string }) => {
    return (
        <Box sx={{ display: 'inline' }}>
            {imageUrl && (
                <Box
                    sx={{
                        display: 'inline-block',
                        width: 16,
                        height: 16,
                        mb: '-2px',
                        mr: 0.5,
                        backgroundImage: `url(${imageUrl})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundColor: color,
                        borderRadius: 0.3,
                        border: `${color} solid 1px`,
                    }}
                />
            )}
            <Typography
                component="span"
                variant="body1"
                sx={{ display: 'inline', fontWeight: 'fontWeightBold', color, wordBreak: 'break-word' }}
            >
                {text}
            </Typography>
        </Box>
    )
}
