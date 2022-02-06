import { Box, Stack } from '@mui/material'
import { NotificationItem, TextAlert } from '..'
import { UI_OPACITY } from '../../constants'
import { useNotifications } from '../../containers/notifications'
import { colors } from '../../theme/theme'
import { useTheme } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { useDimension } from '../../containers'

export const Notifications = () => {
    const { notifications } = useNotifications()
    const theme = useTheme<Theme>()
    const {
        iframeDimensions: { height },
    } = useDimension()

    const notificationsJsx = notifications
        .filter((n) => !!n)
        .map((n) => {
            if (!n) return null

            switch (n.type) {
                case 'KILL':
                case 'ACTION':
                case 'TEXT':
                    return (
                        <Box key={n.notiID}>
                            <NotificationItem duration={n.duration}>
                                <TextAlert data={n.data} />
                            </NotificationItem>
                        </Box>
                    )
            }
        })

    return (
        <Stack
            sx={{
                position: 'absolute',
                bottom: 138,
                left: 10,
                zIndex: 15,
                overflow: 'hidden',
                opacity: UI_OPACITY,
            }}
        >
            <Box>
                <Box
                    sx={{
                        flex: 1,
                        // 100vh, 2 x 8px gap above, 150px gap bottom
                        // Voting action: 288px total height, 65px above it
                        maxHeight: `calc(${height}px - 8px - 150px - 8px - 288px - 65px)`,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        pl: 1,
                        py: 0.2,
                        direction: 'rtl',
                        scrollbarWidth: 'none',
                        '::-webkit-scrollbar': {
                            width: 4,
                        },
                        '::-webkit-scrollbar-track': {
                            boxShadow: `inset 0 0 5px ${colors.darkerNeonBlue}`,
                            borderRadius: 3,
                        },
                        '::-webkit-scrollbar-thumb': {
                            background: theme.factionTheme.primary,
                            borderRadius: 3,
                        },
                    }}
                >
                    <Box sx={{ direction: 'ltr' }}>
                        <Stack spacing={0.6}>{notificationsJsx}</Stack>
                    </Box>
                </Box>
            </Box>
        </Stack>
    )
}
