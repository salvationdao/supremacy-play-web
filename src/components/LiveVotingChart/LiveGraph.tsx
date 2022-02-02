import { IconButton, Stack, Typography } from '@mui/material'
import * as React from 'react'
import { MaxLiveVotingDataLength } from '../../constants'
import { useGame } from '../../containers'
import RemoveIcon from '@mui/icons-material/Remove'

const DefaultLargestVoteValue = 20

export const LiveGraph = () => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const { liveVotingData } = useGame()

    const [hideGraph, setHideGraph] = React.useState(false)

    const [maxSupsValue, setMaxSupsValue] = React.useState<number>(DefaultLargestVoteValue)

    const [currentSpike, setCurrentLargestValue] = React.useState(0)

    React.useEffect(() => {
        // calculate largest piece of data
        let largest = 0
        liveVotingData.forEach((lvd) => {
            if (lvd.rawData > largest) {
                largest = lvd.rawData
            }
        })
        setCurrentLargestValue(largest)

        if (!liveVotingData || liveVotingData.length === 0 || !canvasRef.current) return

        if (largest < DefaultLargestVoteValue) largest = DefaultLargestVoteValue
        setMaxSupsValue(largest)

        const canvas: HTMLCanvasElement = canvasRef.current
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
            context.lineTo(GRAPH_LEFT, GRAPH_TOP)
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
                    (GRAPH_WIDTH * (i + 1)) / MaxLiveVotingDataLength + GRAPH_LEFT,
                    GRAPH_HEIGHT * (1 - lvd.rawData / largest) + GRAPH_TOP,
                )
            })

            // actually draw the graph
            context.stroke()
        }
    }, [liveVotingData, setMaxSupsValue])

    return (
        <>
            <Stack justifyContent="space-between" alignItems="center" direction="row">
                <Typography sx={{ ml: 0, mb: 0, fontWeight: 'fontWeightBold', fontSize: 18 }}>
                    Live Voting Chart
                </Typography>
                <IconButton aria-label="minimize" onClick={() => setHideGraph((hg) => !hg)}>
                    <RemoveIcon color="primary" />
                </IconButton>
            </Stack>
            <Typography sx={{ marginTop: 0, fontWeight: 'fontWeightBold', fontSize: 12 }}>
                {hideGraph ? `Current Spike: ${currentSpike}` : `${maxSupsValue} SUPS`}
            </Typography>
            {!hideGraph && (
                <canvas
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    ref={canvasRef}
                />
            )}
        </>
    )
}
