import { Box } from "@mui/material"
import { Bar, DrawerButtons, LiveChat, Assets } from ".."
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
        </Box>
    )
}
