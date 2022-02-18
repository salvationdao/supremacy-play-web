import { Box, Stack, Typography } from '@mui/material'
import { SvgChatIcon } from '../../assets'
import { SIDE_BARS_WIDTH } from '../../constants'
import { useDimension } from '../../containers'
import { colors } from '../../theme/theme'

export const LiveChatSideButton = () => {
    const { toggleIsLiveChatOpen } = useDimension()

    return (
        <Box
            onClick={() => toggleIsLiveChatOpen()}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                width: SIDE_BARS_WIDTH,
                cursor: 'pointer',
                backgroundColor: colors.darkNavyBlue,
                ':hover > *': {
                    opacity: 1,
                },
                ':active > *': {
                    opacity: 0.8,
                },
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={0.7}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-90deg)',
                    opacity: 0.6,
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        lineHeight: 1,
                        fontWeight: 'fontWeightBold',
                        whiteSpace: 'nowrap',
                    }}
                >
                    WAR ROOM
                </Typography>
                <SvgChatIcon size="10px" sx={{ pt: 0.1 }} />
            </Stack>
        </Box>
    )
}
