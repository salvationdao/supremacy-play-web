import React, { useEffect, useMemo, useRef } from "react"
import { Map as GameMap, GAME_CLIENT_TILE_SIZE } from "../../../../types"
import { HiveHexLocations } from "../../../../types/hive"

interface HiveHexesProps {
    map: GameMap
    state: boolean[]
    poppedOutContainerRef?: React.MutableRefObject<HTMLElement | null>
}

const propsAreEqual = (prevProps: HiveHexesProps, nextProps: HiveHexesProps) => {
    return prevProps.map.Name === nextProps.map.Name && prevProps.state === nextProps.state
}

const hexSize = 80

export const HiveHexes = React.memo(function HiveHexes({ map, state, poppedOutContainerRef }: HiveHexesProps) {
    const cachedHexState = useRef<boolean[]>(new Array(589).fill(false))

    useEffect(() => {
        const mapScale = map ? map.Width / (map.Cells_X * GAME_CLIENT_TILE_SIZE) : 0

        for (let i = 0; i < HiveHexLocations.length; i++) {
            const hexEl = (poppedOutContainerRef?.current || document).querySelector(`#map-hex-${i}`) as HTMLElement
            if (!hexEl) continue

            const hex = HiveHexLocations[i]
            const x = (hex.x - (map ? map.Pixel_Left : 0)) * mapScale
            const y = (hex.y - (map ? map.Pixel_Top : 0)) * mapScale

            hexEl.style.transform = `translate(${x - hexSize / 2}px, ${y - hexSize / 2}px) rotate(${hex.yaw}deg)`
            hexEl.style.clipPath = hex.half ? "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%)" : "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)"
        }
    }, [map, poppedOutContainerRef])

    useEffect(() => {
        for (let i = 0; i < state.length; i++) {
            const hexEl = (poppedOutContainerRef?.current || document).querySelector(`#map-hex-${i}`) as HTMLElement
            if (!hexEl) continue
            const raised = state[i]
            if (cachedHexState.current && cachedHexState.current[i] != raised) {
                hexEl.style.opacity = raised ? "0.6" : "0"
                cachedHexState.current[i] = raised
            }
        }
    }, [state, poppedOutContainerRef])

    return useMemo(() => {
        return (
            <div>
                {[...Array(589)].map((_, i) => {
                    return (
                        <div
                            id={`map-hex-${i}`}
                            key={`map-hex-${i}`}
                            style={{
                                position: "absolute",
                                height: `${hexSize}px`,
                                width: `${hexSize}px`,
                                backgroundColor: "#000000",
                                zIndex: 2,
                                opacity: 0,
                                transition: "opacity 0.5s ease-in-out",
                                pointerEvents: "none",
                            }}
                        />
                    )
                })}
            </div>
        )
    }, [])
}, propsAreEqual)
