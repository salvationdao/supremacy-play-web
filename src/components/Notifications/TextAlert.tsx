import { Box, Typography } from '@mui/material'
import { ClipThing } from '..'
import { colors } from '../../theme/theme'

export const TextAlert = ({ data }: { data: string }) => {
    return (
        <ClipThing border={{ isFancy: true, borderThickness: '2px' }} clipSize="5px">
            <Box
                sx={{
                    width: 360,
                    px: 1.2,
                    py: 1,
                    backgroundColor: colors.darkNavy,
                }}
            >
                <Typography variant="body2">{data}</Typography>
            </Box>
        </ClipThing>
    )
}
