import { Box, Fade, Stack, Theme, Typography } from "@mui/material"
import { useTheme } from "@mui/styles"
import { useCallback, useEffect, useMemo, useState } from "react"
import { MoveableResizable, MoveableResizableConfig } from ".."
import { useGameServerWebsocket, useOverlayToggles } from "../../containers"
import { parseString } from "../../helpers"
import { useToggle } from "../../hooks"
import { GameServerKeys } from "../../keys"
import { pulseEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"
import { LiveGraph } from "./LiveGraph"
import { BattleStats } from "../BattleStats/BattleStats"

const DefaultMaxLiveVotingDataLength = 100

export const LiveVotingChart = () => {
    const { isLiveChartOpen } = useOverlayToggles()
    const [isRender, toggleIsRender] = useToggle(isLiveChartOpen)

    // A little timeout so fade transition can play
    useEffect(() => {
        if (isLiveChartOpen) return toggleIsRender(true)
        setTimeout(() => {
            toggleIsRender(false)
        }, 250)
    }, [isLiveChartOpen])

    if (!isRender) return null

    return <Content />
}

const Content = () => {
    const theme = useTheme<Theme>()
    const { state, subscribe } = useGameServerWebsocket()
    const { isLiveChartOpen, toggleIsLiveChartOpen } = useOverlayToggles()
    const [curWidth, setCurWidth] = useState(0)
    const [curHeight, setCurHeight] = useState(0)
    const [maxLiveVotingDataLength, setMaxLiveVotingDataLength] = useState(
        parseString(localStorage.getItem("liveVotingDataMax"), DefaultMaxLiveVotingDataLength),
    )

    // DO NOT REMOVE THIS! Triggered spoil of war update
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe(GameServerKeys.TriggerSpoilOfWarUpdated, () => null, null)
    }, [state, subscribe])

    // DO NOT REMOVE THIS!
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe(GameServerKeys.TriggerLiveVoteCountUpdated, () => null, null)
    }, [state, subscribe])

    const onResize = useCallback((width: number, height: number) => {
        setCurWidth(width)
        setCurHeight(height)
        setMaxLiveVotingDataLength(width / 5)
    }, [])

    const config: MoveableResizableConfig = useMemo(
        () => ({
            localStoragePrefix: "liveVoting",
            // Defaults
            defaultPositionX: 0,
            defaultPositionYBottom: 128,
            defaultSizeX: 415,
            defaultSizeY: 115,
            // Limits
            minSizeX: 415,
            minSizeY: 115,
            // Toggles
            allowResizeX: true,
            allowResizeY: false,
            // Callbacks
            onReizeCallback: onResize,
            onHideCallback: () => toggleIsLiveChartOpen(false),
            // Others
            CaptionArea: (
                <Box sx={{ pl: ".3rem" }}>
                    <BattleStats />
                </Box>
            ),
            tooltipText:
                "The chart shows you the SUPS being spent into the battle arena in real time. All SUPS spent are accumulated into the SPOILS OF WAR, which are distributed back to the players in future battles based on the multipliers that they have earned. Contribute to the battle or be part of the winning Syndicate to increase your earnings.",
        }),
        [onResize],
    )

    return (
        <Fade in={isLiveChartOpen}>
            <Box>
                <MoveableResizable config={config}>
                    <Box
                        sx={{
                            flex: 1,
                            position: "relative",
                            px: "1.1rem",
                            pt: "1rem",
                            pb: ".8rem",
                            width: "100%",
                        }}
                    >
                        <Box
                            key={maxLiveVotingDataLength}
                            sx={{
                                position: "relative",
                                height: "100%",
                                px: ".56rem",
                                pt: "1.6rem",
                                background: "#00000099",
                                border: `${theme.factionTheme.primary}10 1px solid`,
                                borderRadius: 1,
                            }}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                spacing=".4rem"
                                sx={{
                                    position: "absolute",
                                    top: ".5rem",
                                    right: ".7rem",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 7,
                                        height: 7,
                                        mb: ".32rem",
                                        backgroundColor: colors.red,
                                        borderRadius: "50%",
                                        animation: `${pulseEffect} 3s infinite`,
                                    }}
                                />
                                <Typography variant="body2" sx={{ lineHeight: 1 }}>
                                    Live
                                </Typography>
                            </Stack>

                            <LiveGraph maxWidthPx={curWidth} maxHeightPx={curHeight} maxLiveVotingDataLength={maxLiveVotingDataLength} />
                        </Box>
                    </Box>
                </MoveableResizable>
            </Box>
        </Fade>
    )
}
