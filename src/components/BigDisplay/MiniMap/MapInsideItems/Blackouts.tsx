import { Box, keyframes } from "@mui/material"
import React, { useEffect, useMemo, useState } from "react"
import { useArena, useGame, useMiniMap } from "../../../../containers"
import { useGameServerSubscription } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { GAME_CLIENT_TILE_SIZE, Position } from "../../../../types"

const BLACKOUT_TRANSITION_DURATION = 500

interface MinimapEvent {
    id: string
    game_ability_id: number
    duration: number
    radius: number
    coords: Position
}

interface BlackoutWithAnimationState extends MinimapEvent {
    isVisible: boolean
}

export const Blackouts = () => {
    const { currentArenaID } = useArena()
    const [payload, setPayload] = useState<MinimapEvent[]>([])
    const [blackouts, setBlackouts] = useState<Map<string, BlackoutWithAnimationState>>(new Map())
    const [removedBlackoutIDs, setRemovedBlackoutIDs] = useState<string[]>([])

    useGameServerSubscription<MinimapEvent[]>(
        {
            URI: `/public/arena/${currentArenaID}/minimap`,
            key: GameServerKeys.MinimapUpdatesSubscribe,
        },
        (payload) => {
            if (!payload) {
                setPayload([])
                return
            }
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
        if (removedBlackoutIDs.length === 0) return
        const timeouts: NodeJS.Timeout[] = []

        removedBlackoutIDs.forEach((r) => {
            const t = setTimeout(() => {
                setBlackouts((prev) => {
                    const newBlackouts = new Map(prev)
                    newBlackouts.delete(r)
                    return newBlackouts
                })
            }, BLACKOUT_TRANSITION_DURATION)
            timeouts.push(t)
        })

        return () => timeouts.forEach((t) => clearTimeout(t))
    }, [removedBlackoutIDs])

    if (blackouts.size <= 0) {
        return null
    }

    return (
        <>
            {new Array(...blackouts).map(([id, b]) => (
                <Blackout key={id} {...b} />
            ))}
        </>
    )
}

const Blackout = React.forwardRef(function Blackout({ radius, coords, isVisible }: BlackoutWithAnimationState, ref) {
    const { gridHeight, gridWidth } = useMiniMap()
    const { map } = useGame()

    const mapScale = useMemo(() => (map ? map.Width / (map.Cells_X * GAME_CLIENT_TILE_SIZE) : 0), [map])
    const diameter = useMemo(() => radius * mapScale * 2, [mapScale, radius])

    return useMemo(
        () => (
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
                    pointerEvents: "none",
                }}
            />
        ),
        [coords.x, coords.y, diameter, gridHeight, gridWidth, isVisible, ref],
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
