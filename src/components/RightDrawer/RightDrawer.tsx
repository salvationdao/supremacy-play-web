import { Box } from "@mui/material"
import React from "react"
import { ChatProvider } from "../../containers"
import { colors } from "../../theme/theme"
import { Assets } from "../Assets/Assets"
import { LiveChat } from "../LiveChat/LiveChat"
import { PlayerList } from "../PlayerList/PlayerList"

export const RightDrawer: React.FC = () => {
    return (
        <Box sx={{ position: "relative", background: colors.black3 }}>
            <ChatProvider>
                <LiveChat />
            </ChatProvider>
            <Assets />
            <PlayerList />
        </Box>
    )
}
