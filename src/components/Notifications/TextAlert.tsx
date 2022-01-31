import { Box, Typography } from '@mui/material'
import { ClipThing } from '..'
import { colors } from '../../theme/theme'

export const TextAlert = ({ data }: { data: string }) => {
    return (
        <ClipThing border={{ isFancy: true }} clipSize="5px">
            <Box
                sx={{
                    width: 300,
                    px: 1.2,
                    py: 0.5,
                    backgroundColor: colors.darkNavy,
                }}
            >
                <Typography variant="body2">{data}</Typography>
            </Box>
        </ClipThing>
    )
}
