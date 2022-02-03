import { Typography } from '@mui/material'
import * as React from 'react'
import { useWebsocket } from '../../containers'
import { NetMessageType } from '../../types'
import BigNumber from 'bignumber.js'

interface LiveGraphProps {
    maxHeightPx: number
    maxWidthPx: number
    maxLiveVotingDataLength: number
}

interface LiveVotingData {
    rawData: number
    smoothData: number
}

export const LiveGraph = (props: LiveGraphProps) => {
    const { maxHeightPx, maxWidthPx, maxLiveVotingDataLength } = props

    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    const { state, subscribeNetMessage } = useWebsocket()
    const [liveVotingData, setLiveVotingData] = React.useState<LiveVotingData[]>([])

    React.useEffect(() => {
        const zeroArray: LiveVotingData[] = []
        for (let i = 0; i < maxLiveVotingDataLength; i++) zeroArray.push({ rawData: 0, smoothData: 0 })
        setLiveVotingData(zeroArray)
    }, [])

    // live voting data
    React.useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeNetMessage) return
        return subscribeNetMessage<string | undefined>(NetMessageType.LiveVoting, (payload) => {
            if (!payload) return
            const rawData = new BigNumber(payload).dividedBy(new BigNumber('1000000000000000000')).toNumber()
            setLiveVotingData((lvd) => {
                if (lvd.length > maxLiveVotingDataLength) {
                    for (let i = 0; i <= lvd.length - maxLiveVotingDataLength; i++) {
                        lvd.shift()
                    }
                }

                // get latest two data
                const latestData: number[] = [rawData]
                if (lvd.length >= 2) {
                    latestData.concat(lvd[lvd.length - 1].rawData, lvd[lvd.length - 2].rawData)
                } else if (lvd.length === 1) {
                    latestData.concat(lvd[lvd.length - 1].rawData, 0)
                } else {
                    latestData.concat(0, 0)
                }

                let sum = 0
                latestData.forEach((d) => {
                    sum += d
                })
                const smoothData = sum / 3

                return lvd.concat({ rawData, smoothData })
            })
        })
    }, [state, subscribeNetMessage])

    // draw live graph
    React.useEffect(() => {
        if (!liveVotingData || liveVotingData.length === 0 || !canvasRef.current) return
        // calculate largest piece of data
        let largest = 1
        liveVotingData.forEach((lvd) => {
            if (lvd.rawData > largest) {
                largest = lvd.rawData
            }
        })

        const canvas: HTMLCanvasElement = canvasRef.current

        canvas.width = maxWidthPx - 100

        const context = canvasRef.current.getContext('2d')

        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height)

            const GRAPH_TOP = 0
            const GRAPH_BOTTOM = canvas.height
            const GRAPH_LEFT = 0
            const GRAPH_RIGHT = canvas.width

            const GRAPH_HEIGHT = canvas.height
            const GRAPH_WIDTH = canvas.width

            context.beginPath()
            // draw X and Y axis
            context.moveTo(GRAPH_RIGHT, GRAPH_BOTTOM)
            context.lineTo(GRAPH_LEFT, GRAPH_BOTTOM)
            context.stroke()

            // draw raw voting data
            context.beginPath()
            context.lineJoin = 'round'
            context.strokeStyle = 'white'

            // add first point in the graph
            context.moveTo(GRAPH_LEFT, GRAPH_HEIGHT - (liveVotingData[0].rawData / largest) * GRAPH_HEIGHT + GRAPH_TOP)

            liveVotingData.forEach((lvd, i) => {
                if (i === 0) return
                context.lineTo(
                    (GRAPH_WIDTH * (i + 1)) / maxLiveVotingDataLength + GRAPH_LEFT,
                    GRAPH_HEIGHT * (1 - lvd.rawData / largest) + GRAPH_TOP,
                )
            })

            // actually draw the graph
            context.stroke()
        }
    }, [liveVotingData, canvasRef.current])

    return (
        <>
            <Typography margin={0} sx={{ ml: 0, mb: 0, fontWeight: 'fontWeightBold', fontSize: 15 }}>
                Live SUPS Spend
            </Typography>
            <canvas
                style={{
                    width: `${maxWidthPx - 30}px`,
                    height: `${maxHeightPx - 60}px`,
                    marginTop: 0,
                }}
                ref={canvasRef}
            />
        </>
    )
}
