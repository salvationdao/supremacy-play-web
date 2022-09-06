import { Map as GameMap } from "../../../../types"
import { useEffect, useMemo, useRef } from "react"
import { HiveHexLocations } from "../../../../types/hive"
import { Box } from "@mui/material"

interface HiveHexesProps {
    map: GameMap
    state: boolean[]
    poppedOutContainerRef?: React.MutableRefObject<HTMLElement | null>
}

const hexSize = 80

export const HiveHexes = ({ map, state, poppedOutContainerRef }: HiveHexesProps) => {
    const cachedHexState = useRef<boolean[]>(new Array(589).fill(false))
    useEffect(() => {
        const mapScale = map ? map.Width / (map.Cells_X * 2000) : 0

        for (let i = 0; i < HiveHexLocations.length; i++) {
            const hexEl = (poppedOutContainerRef?.current || document).querySelector(`#map-hex-${i}`) as HTMLElement
            if (!hexEl) continue

            const hex = HiveHexLocations[i]
            const x = (hex.x - (map ? map.Pixel_Left : 0)) * mapScale
            const y = (hex.y - (map ? map.Pixel_Top : 0)) * mapScale

            hexEl.style.transform = `translate(${x - hexSize / 2}px, ${y - hexSize / 2}px) rotate(${hex.yaw}deg)`

            const hexInner = hexEl.firstChild as HTMLElement
            if (!hexInner) continue
            hexInner.style.clipPath = hex.half ? "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%)" : "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)"
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
            <Box>
                {[...Array(589)].map((_, i) => {
                    return (
                        <Box
                            id={`map-hex-${i}`}
                            key={`map-hex-${i}`}
                            sx={{
                                position: "absolute",
                                filter: "drop-shadow(0px 0px 10px #000)",
                                opacity: 0,
                                transition: "opacity 0.5s ease-in-out",
                                pointerEvents: "none",
                            }}
                        >
                            <Box
                                sx={{
                                    height: `${hexSize}px`,
                                    width: `${hexSize}px`,
                                    backgroundColor: "#000000",
                                    zIndex: 2,
                                }}
                            />
                        </Box>
                    )
                })}
            </Box>
        )
    }, [])
}
