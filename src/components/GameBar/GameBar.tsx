import { Box } from "@mui/material"
import { Bar, DrawerButtons, LiveChat, Assets } from ".."
import { PASSPORT_SERVER_HOST } from "../../constants"
import { BarProvider, PassportServerAuthProvider, QueueProvider } from "../../containers"
import { PassportServerSocketProvider } from "../../containers/passportServerSocket"

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

export interface GameBarBaseProps {
    gameserverSessionID?: string
}

export const GameBar: React.FC<GameBarBaseProps> = (props) => {
    // This will tell us whether we are rendering game bar directly (i.e. local dev)
    // or being used by 3rd party

    return (
        <PassportServerSocketProvider initialState={PASSPORT_SERVER_HOST}>
            <PassportServerAuthProvider initialState={{ gameserverSessionID: props.gameserverSessionID }}>
                <QueueProvider>
                    <BarProvider>
                        <Inner />
                    </BarProvider>
                </QueueProvider>
            </PassportServerAuthProvider>
        </PassportServerSocketProvider>
    )
}
