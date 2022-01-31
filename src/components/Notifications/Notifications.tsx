import { Box, Stack } from '@mui/material'
import moment from 'moment'
import { NotificationItem, SecondVote, TextAlert } from '..'
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
        .sort((n1, n2) =>
            n2.type == 'SECOND_VOTE' &&
            moment.duration(moment(n2.data.endTime).diff(moment())).asSeconds() > 0 &&
            n1.type != 'SECOND_VOTE'
                ? 1
                : -1,
        )
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
                case 'SECOND_VOTE':
                    return (
                        <Box key={n.notiID}>
                            <NotificationItem duration={n.duration}>
                                <SecondVote data={n.data} notiID={n.notiID} />
                            </NotificationItem>
                        </Box>
                    )
            }
        })

    return (
        <Stack
            sx={{
                position: 'absolute',
                bottom: 10,
                left: 7,
                zIndex: 15,
                overflow: 'hidden',
                opacity: UI_OPACITY,
            }}
        >
            <Box>
                <Box
                    sx={{
                        flex: 1,
                        // 45vh, 8px gap above, 7px gap bottom
                        maxHeight: `calc(${0.45 * height}px - 8px - 7px)`,
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
