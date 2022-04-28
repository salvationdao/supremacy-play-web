import { useGameServerWebsocket } from "../../containers"
import { NetMessageType } from "../../types"
import BigNumber from "bignumber.js"
import { RefObject, MutableRefObject, useEffect, useRef, useState } from "react"
import { colors } from "../../theme/theme"
import { Box, Stack, Typography } from "@mui/material"

interface LiveGraphProps {
    maxHeightPx: number
    maxWidthPx: number
    maxLiveVotingDataLength: number
    battleIdentifier?: number
}

export const LiveGraph = (props: LiveGraphProps) => {
    const { battleIdentifier, maxWidthPx, maxHeightPx, maxLiveVotingDataLength } = props

    const { state, subscribeNetMessage } = useGameServerWebsocket()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [liveVotingData, setLiveVotingData] = useState<number[]>([])
    const largest = useRef<number>(0.1)
    const battleID = useRef(battleIdentifier)

    useEffect(() => {
        if (battleIdentifier !== battleID.current) {
            setLiveVotingData((lvd) => {
                lvd.shift()
                return lvd.concat(-1)
            })
            battleID.current = battleIdentifier
        }
    }, [battleIdentifier])

    useEffect(() => {
        const zeroArray: number[] = []
        for (let i = 0; i < maxLiveVotingDataLength; i++) zeroArray.push(0)
        setLiveVotingData(zeroArray)
    }, [maxLiveVotingDataLength])

    // Live voting data
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeNetMessage) return
        return subscribeNetMessage<string | undefined>(NetMessageType.LiveVoting, (payload) => {
            if (!payload) return
            const rawData = new BigNumber(payload).dividedBy(new BigNumber("1000000000000000000")).toNumber()
            setLiveVotingData((lvd) => {
                if (lvd.length > maxLiveVotingDataLength) {
                    for (let i = 0; i <= lvd.length - maxLiveVotingDataLength; i++) {
                        lvd.shift()
                    }
                }

                return lvd.concat(rawData)
            })
        })
    }, [maxLiveVotingDataLength, state, subscribeNetMessage])

    // Draw live graph
    useEffect(() => {
        if (!liveVotingData || liveVotingData.length === 0 || !canvasRef.current) return
        // Calculate largest piece of data
        largest.current = 0.1
        liveVotingData.forEach((lvd) => {
            if (lvd > largest.current) {
                largest.current = lvd
            }
        })

        const canvas: HTMLCanvasElement = canvasRef.current
        canvas.width = maxWidthPx - 100

        const context = canvasRef.current.getContext("2d")

        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height)

            const GRAPH_TOP = 0
            const GRAPH_LEFT = 0

            const GRAPH_HEIGHT = canvas.height - 18
            const GRAPH_WIDTH = canvas.width

            // Draw raw voting data
            context.beginPath()
            context.lineJoin = "round"
            context.strokeStyle = colors.neonBlue

            // Add first point in the graph
            context.moveTo(GRAPH_LEFT, GRAPH_HEIGHT - (liveVotingData[0] / largest.current) * GRAPH_HEIGHT + GRAPH_TOP)

            const newBattlePoints: { x: number; y: number }[] = []

            liveVotingData.forEach((lvd, i) => {
                if (i === 0) return

                const locationX = (GRAPH_WIDTH * (i + 1)) / maxLiveVotingDataLength + GRAPH_LEFT
                if (lvd === -1) {
                    const locationY = GRAPH_HEIGHT * (1 - Math.max(0, liveVotingData[i - 1]) / largest.current) + GRAPH_TOP
                    newBattlePoints.push({ x: locationX, y: locationY })
                    return
                }
                const locationY = GRAPH_HEIGHT * (1 - Math.max(0, lvd) / largest.current) + GRAPH_TOP
                context.lineTo(locationX, locationY)
            })

            // Actually draw the graph
            context.stroke()

            // Draw dashed line for new battle point
            context.strokeStyle = colors.lightRed
            context.lineWidth = 2
            newBattlePoints.forEach((loc) => {
                context.beginPath()
                context.setLineDash([4, 4])
                context.moveTo(loc.x - 5, loc.y - 10)
                context.lineTo(loc.x - 5, loc.y + 10)
                context.stroke()
            })
        }
    }, [liveVotingData, maxWidthPx, maxLiveVotingDataLength])

    return <LiveGraphInner maxWidthPx={maxWidthPx} maxHeightPx={maxHeightPx} canvasRef={canvasRef} largest={largest} />
}

const LiveGraphInner = ({
    maxWidthPx,
    maxHeightPx,
    canvasRef,
    largest,
}: {
    maxWidthPx: number
    maxHeightPx: number
    canvasRef: RefObject<HTMLCanvasElement>
    largest: MutableRefObject<number>
}) => {
    return (
        <>
            <Box
                sx={{
                    ml: ".8rem",
                    width: `${maxWidthPx - (30 + 1 * 8)}px`,
                    height: `${maxHeightPx - 60}px`,
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        padding: 0,
                        margin: 0,
                    }}
                />
            </Box>

            <Stack
                alignItems="flex-start"
                justifyContent="space-between"
                sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    my: ".72rem",
                    ml: ".48rem",
                    pl: ".48rem",
                    zIndex: 99,
                    borderLeft: `${colors.text}80 1px dashed`,
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        px: ".4rem",
                        pt: ".24rem",
                        pb: ".08rem",
                        lineHeight: 1,
                        color: `${colors.text}80`,
                        backgroundColor: "#111111",
                        borderRadius: 0.5,
                    }}
                >
                    {(Math.round(largest.current * 10000) / 10000).toFixed(2)}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        px: ".4rem",
                        pt: ".24rem",
                        pb: ".08rem",
                        lineHeight: 1,
                        color: `${colors.text}80`,
                        backgroundColor: "#111111",
                        borderRadius: 0.5,
                    }}
                >
                    0.00
                </Typography>
            </Stack>
        </>
    )
}
