import { Drawer, Typography } from '@mui/material'
import { LIVE_CHAT_DRAWER_WIDTH } from '../../constants'
import { useDimension } from '../../containers'
import { colors } from '../../theme/theme'

export const LiveChat = () => {
    const { isLiveChatOpen } = useDimension()

    return (
        <Drawer
            open={isLiveChatOpen}
            variant="persistent"
            anchor="right"
            sx={{
                width: LIVE_CHAT_DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: LIVE_CHAT_DRAWER_WIDTH,
                    backgroundColor: colors.darkNavy,
                    px: 1.2,
                    py: 1,
                },
            }}
        >
            <Typography>LIVE CHAT (COMING SOON)</Typography>
        </Drawer>
    )
}
