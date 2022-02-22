import { Box, Fade, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MoveableResizable, MoveableResizableConfig } from ".."
import { SvgSupToken } from "../../assets"
import { useWebsocket, useOverlayToggles } from "../../containers"
import { parseString } from "../../helpers"
import HubKey from "../../keys"
import { pulseEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"
import { NetMessageType } from "../../types"
import { LiveGraph } from "./LiveGraph"

const DefaultMaxLiveVotingDataLength = 100

const SpoilOfWarAmount = () => {
    const { state, subscribe, subscribeNetMessage } = useWebsocket()
    const [spoilOfWarAmount, setSpoilOfWarAmount] = useState<string>("0")

    // Triggered spoil of war update
    // useEffect(() => {
    //     if (state !== WebSocket.OPEN || !subscribe) return
    //     return subscribe(HubKey.TriggerSpoilOfWarUpdated, () => console.log(""), null)
    // }, [state, subscribe])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeNetMessage) return
        return subscribeNetMessage<string | undefined>(NetMessageType.SpoilOfWarTick, (payload) => {
            if (!payload) return
            setSpoilOfWarAmount(new BigNumber(payload).dividedBy("1000000000000000000").toFixed(6))
        })
    }, [state, subscribeNetMessage])

    return (
        <>
            <Typography variant="body1">SPOILS OF WAR:&nbsp;</Typography>
            <SvgSupToken size="14px" fill={colors.yellow} />
            <Typography variant="body1" sx={{ ml: 0.2 }}>
                {spoilOfWarAmount}
            </Typography>
        </>
    )
}

export const LiveVotingChart = () => {
    const { isLiveChartOpen, toggleIsLiveChartOpen } = useOverlayToggles()
    const [curWidth, setCurWidth] = useState(0)
    const [curHeight, setCurHeight] = useState(0)
    const [maxLiveVotingDataLength, setMaxLiveVotingDataLength] = useState(
        parseString(localStorage.getItem("liveVotingDataMax"), DefaultMaxLiveVotingDataLength),
    )

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
            defaultSizeX: 363,
            defaultSizeY: 115,
            // Limits
            minSizeX: 363,
            minSizeY: 115,
            // Toggles
            allowResizeX: true,
            allowResizeY: false,
            // Callbacks
            onReizeCallback: onResize,
            onHideCallback: () => toggleIsLiveChartOpen(false),
            // Others
            CaptionArea: <SpoilOfWarAmount />,
        }),
        [onResize],
    )

    return (
        <Fade in={isLiveChartOpen}>
            <Box>
                <MoveableResizable config={config}>
                    <Box sx={{ flex: 1, px: 1, pt: 1, pb: 0.9, width: "100%" }}>
                        <Box
                            key={maxLiveVotingDataLength}
                            sx={{
                                position: "relative",
                                height: "100%",
                                px: 0.7,
                                pt: 2,
                                background: "#00000099",
                            }}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                spacing={0.5}
                                sx={{
                                    position: "absolute",
                                    top: 5,
                                    right: 7,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 7,
                                        height: 7,
                                        mb: 0.2,
                                        backgroundColor: colors.red,
                                        borderRadius: "50%",
                                        animation: `${pulseEffect} 3s infinite`,
                                    }}
                                />
                                <Typography variant="caption" sx={{ lineHeight: 1 }}>
                                    Live
                                </Typography>
                            </Stack>

                            <LiveGraph
                                maxWidthPx={curWidth}
                                maxHeightPx={curHeight}
                                maxLiveVotingDataLength={maxLiveVotingDataLength}
                            />
                        </Box>
                    </Box>
                </MoveableResizable>
            </Box>
        </Fade>
    )
}
