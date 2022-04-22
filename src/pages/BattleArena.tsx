import { Box } from "@mui/material"
import React from "react"
import {
    BattleCloseAlert,
    BattleEndScreen,
    BattleHistory,
    Controls,
    EarlyAccessWarning,
    LiveVotingChart,
    LoadMessage,
    Maintenance,
    MiniMap,
    Notifications,
    Stream,
    VotingSystem,
    WaitingPage,
    WarMachineStats,
} from "../components"
import { Music } from "../components/Music/Music"
import { UNDER_MAINTENANCE } from "../constants"
import { useGameServerAuth, useGameServerWebsocket } from "../containers"
import { useToggle } from "../hooks"

export const BattleArenaPage: React.VoidFunctionComponent = () => {
    const { state, isServerUp } = useGameServerWebsocket()
    const { user } = useGameServerAuth()
    const [haveSups, toggleHaveSups] = useToggle(true)

    return (
        <>
            {!isServerUp || UNDER_MAINTENANCE ? (
                <Maintenance />
            ) : (
                <>
                    <LoadMessage />
                    <BattleCloseAlert />
                    <Stream haveSups={haveSups} toggleHaveSups={toggleHaveSups} />

                    {user && haveSups && state === WebSocket.OPEN ? (
                        <Box>
                            <EarlyAccessWarning />
                            <VotingSystem />
                            <MiniMap />
                            <Notifications />
                            <LiveVotingChart />
                            <WarMachineStats />
                            <BattleEndScreen />
                            <BattleHistory />
                        </Box>
                    ) : (
                        <WaitingPage />
                    )}
                </>
            )}
            <Music />
            <Controls />
        </>
    )
}
