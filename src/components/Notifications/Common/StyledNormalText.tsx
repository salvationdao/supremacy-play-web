import { Typography } from '@mui/material'

export const StyledNormalText = ({ text }: { text: string }) => {
    return (
        <Typography component="span" variant="body1" sx={{ display: 'inline', wordBreak: 'break-word' }}>
            {text}
        </Typography>
    )
}
