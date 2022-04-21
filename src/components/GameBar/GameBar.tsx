import { Box } from "@mui/material"
import { Assets, Bar, DrawerButtons, LiveChat, PlayerList } from ".."
import { BarProvider, ChatProvider } from "../../containers"

export const GameBar: React.FC = () => {
    return (
        <Box sx={{ zIndex: 99999 }}>
            <BarProvider>
                <Bar />
            </BarProvider>

            <DrawerButtons />

            <ChatProvider>
                <LiveChat />
            </ChatProvider>

            <Assets />

            <PlayerList />
        </Box>
    )
}
