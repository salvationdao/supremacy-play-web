import { Box, keyframes } from "@mui/material"
import React, { useEffect, useMemo, useState } from "react"
import { useMiniMap } from "../../../containers"

import { useGameServerSubscription } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { CellCoords } from "../../../types"

interface MinimapEvent {
    id: string
    game_ability_id: number
    duration: number
    radius: number
    coords: CellCoords
}

interface BlackoutWithAnimationState extends MinimapEvent {
    isVisible: boolean
}

export const Blackouts = () => {
    // const [payload, setPayload] = useState<MinimapEvent[]>([])
    const [payload, setPayload] = useState<MinimapEvent[]>([])
    const [blackouts, setBlackouts] = useState<Map<string, BlackoutWithAnimationState>>(new Map())
    const [removedBlackoutIDs, setRemovedBlackoutIDs] = useState<string[]>([])

    useGameServerSubscription<MinimapEvent[]>(
        {
            URI: "/public/minimap",
            key: GameServerKeys.MinimapUpdatesSubscribe,
        },
        (payload) => {
            if (!payload) return
            setPayload(payload)
        },
    )

    useEffect(() => {
        const payloadMap = new Map<string, MinimapEvent>()
        setBlackouts((prev) => {
            const newBlackouts = new Map(prev)
            payload.forEach((m) => {
                payloadMap.set(m.id, m)
                if (!prev.has(m.id)) {
                    newBlackouts.set(m.id, {
                        ...m,
                        isVisible: true,
                    })
                }
            })

            for (const [id, b] of newBlackouts.entries()) {
                if (!payloadMap.has(id)) {
                    newBlackouts.set(id, {
                        ...b,
                        isVisible: false,
                    })

                    setRemovedBlackoutIDs((prev) => {
                        prev.push(id)
                        return prev.map((p) => p)
                    })
                }
            }
            return newBlackouts
        })
    }, [payload])

    useEffect(() => {
        removedBlackoutIDs.forEach((r) => {
            setTimeout(() => {
                setBlackouts((prev) => {
                    const newBlackouts = new Map(prev)
                    newBlackouts.delete(r)
                    return newBlackouts
                })
            }, BLACKOUT_TRANSITION_DURATION)
        })
    }, [removedBlackoutIDs])

    return <>{blackouts.size > 0 && new Array(...blackouts).map(([id, b]) => <Blackout key={id} {...b} />)}</>
}

const BLACKOUT_TRANSITION_DURATION = 500

const Blackout = React.forwardRef(function Blackout({ radius, coords, isVisible }: BlackoutWithAnimationState, ref) {
    const { gridHeight, gridWidth } = useMiniMap()

    const diameter = useMemo(() => (radius / gridHeight) * 2.5, [gridHeight, radius])

    return (
        <Box
            ref={ref}
            sx={{
                zIndex: 900,
                position: "absolute",
                width: diameter,
                height: diameter,
                transform: `translate(${coords.x * gridWidth - diameter / 2}px, ${coords.y * gridHeight - diameter / 2}px)`,
                borderRadius: "50%",
                backgroundColor: `${colors.black2}DD`,
                boxShadow: 20,
                animation: `${isVisible ? fadeInKeyframes : fadeOutKeyframes} ${BLACKOUT_TRANSITION_DURATION}ms ease-in`,
            }}
        />
    )
})

const fadeInKeyframes = keyframes({
    "0%": {
        opacity: 0,
    },
    "100%": {
        opacity: 1,
    },
})

const fadeOutKeyframes = keyframes({
    "0%": {
        opacity: 1,
    },
    "100%": {
        opacity: 0,
    },
})
