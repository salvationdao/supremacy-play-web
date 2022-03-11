import { Box } from "@mui/material"
import { Bar, DrawerButtons, LiveChat, Assets } from ".."
import { BarProvider, QueueProvider } from "../../containers"

const Inner = () => {
    return (
        <Box sx={{ zIndex: 99999 }}>
            <Bar />
            <DrawerButtons />
            <LiveChat />
            <Assets />
        </Box>
    )
}

export const GameBar: React.FC = () => {
    // This will tell us whether we are rendering game bar directly (i.e. local dev)
    // or being used by 3rd party

    return (
        <QueueProvider>
            <BarProvider>
                <Inner />
            </BarProvider>
        </QueueProvider>
    )
}
