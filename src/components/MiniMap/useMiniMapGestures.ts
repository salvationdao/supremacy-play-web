import { useGesture } from "@use-gesture/react"
import { useCallback, useEffect, useState } from "react"
import { useGame } from "../../containers"
import { Dimension } from "../../types"

export const useMiniMapGestures = ({ gestureRef, containerDimensions }: { gestureRef: React.RefObject<HTMLDivElement>; containerDimensions: Dimension }) => {
    const { map } = useGame()
    const [dragX, setDragX] = useState(0)
    const [dragY, setDragY] = useState(0)
    const [mapScale, setMapScale] = useState(0)

    // --------------- Minimap - useGesture setup -------------------
    // Set map scale to minimum scale while staying in-bounds
    useEffect(() => {
        if (!map) return
        const minScale = Math.max(containerDimensions.width / map.width, containerDimensions.height / map.height)
        setDragX(0)
        setDragY(0)
        setMapScale(minScale)
    }, [containerDimensions, map])

    // Prevents map zooming from interfering with the browsers' accessibility zoom
    useEffect(() => {
        const callback: EventListenerOrEventListenerObject = (e) => e.preventDefault()

        document.addEventListener("gesturestart", callback)
        document.addEventListener("gesturechange", callback)
        document.addEventListener("gestureend", callback)

        return () => {
            document.removeEventListener("gesturestart", callback)
            document.removeEventListener("gesturechange", callback)
            document.removeEventListener("gestureend", callback)
        }
    }, [])

    // Setup map drag
    useGesture(
        {
            onDrag: ({ wheeling, cancel, offset: [x, y] }) => {
                if (wheeling || !map) return cancel()

                // Set [x,y] offset
                setDragX(Math.round(x))
                setDragY(Math.round(y))
            },
            onWheel: ({ delta: [, deltaY], pinching, wheeling, dragging, event: e }) => {
                if (pinching || dragging || !map || !wheeling) return

                const mapWidth = map.width
                const mapHeight = map.height

                // Calculate new scale
                const curScale = mapScale
                const newScale = curScale * (deltaY > 0 ? 0.96 : 1.04)

                // Cursors position in relation to the image
                const cursorX = e.offsetX
                const cursorY = e.offsetY

                // Change in x after scaling
                const displacementX = mapWidth * curScale - mapWidth * newScale

                // The ratio of image between the cursor and the side of the image (x)
                const sideRatioX = cursorX / mapWidth

                // The new position of x - keeps the ratio of image between the cursor and the edge
                const newX = dragX + displacementX * sideRatioX

                // Change in y after scaling
                const displacementY = mapHeight * curScale - mapHeight * newScale

                // The ratio of image between the cursor and the top of the image (y)
                const topRatioY = cursorY / mapHeight

                // The new position of y - keeps the ratio of image between the cursor and the top
                const newY = dragY + displacementY * topRatioY

                // Set new scale and positions
                setScale(newScale, newX, newY)
            },
            onPinch: ({ movement: [ms], dragging, wheeling, pinching }) => {
                if (dragging || wheeling || !pinching) return

                // Calculate new scale
                const curScale = mapScale
                const newScale = curScale * (ms > 0 ? 0.96 : 1.04)

                setScale(newScale, 0, 0)
            },
        },
        {
            target: gestureRef,
            eventOptions: { passive: false },
            drag: {
                from: () => [dragX, dragY],
                filterTaps: true,
                preventDefault: true,
                bounds: () => {
                    if (!map) return
                    return {
                        top:
                            containerDimensions.height <= map.height * mapScale
                                ? -(map.height * mapScale - containerDimensions.height)
                                : (containerDimensions.height - map.height * mapScale) / 2,
                        left:
                            containerDimensions.width <= map.width * mapScale
                                ? -(map.width * mapScale - containerDimensions.width)
                                : (containerDimensions.width - map.width * mapScale) / 2,
                        right: 0,
                        bottom: 0,
                    }
                },
            },
            wheel: {
                preventDefault: true,
                filterTaps: true,
                threshold: 20,
            },
            pinch: {
                preventDefault: true,
                filterTaps: true,
                threshold: 20,
            },
        },
    )

    // Set the zoom of the map
    const setScale = useCallback(
        (newScale: number, newX: number, newY: number) => {
            if (!map) return
            const minScale = Math.max(containerDimensions.width / map.width, containerDimensions.height / map.height)
            const maxScale = 1
            const curScale = mapScale

            // Keeps the map within scale bounds
            if (newScale >= maxScale || minScale >= newScale) {
                newScale >= maxScale ? (newScale = maxScale) : (newScale = minScale)
            }

            // Return if the map is already at zoom limit
            if ((curScale === minScale || curScale === maxScale) && (newScale >= maxScale || minScale >= newScale)) {
                return
            }

            // Calculate the new boundary
            const xBound =
                containerDimensions.width <= map.width * newScale
                    ? -(map.width * newScale - containerDimensions.width)
                    : (containerDimensions.width - map.width * newScale) / 2
            const yBound =
                containerDimensions.height <= map.height * newScale
                    ? -(map.height * newScale - containerDimensions.height)
                    : (containerDimensions.height - map.height * newScale) / 2

            // Keep the map in-bounds
            newX = xBound >= newX ? xBound : newX > 0 ? 0 : newX
            newY = yBound >= newY ? yBound : newY > 0 ? 0 : newY

            // Set scale and [x,y] offset
            setDragX(Math.round(newX))
            setDragY(Math.round(newY))
            setMapScale(newScale)
        },
        [map, containerDimensions, mapScale],
    )

    return {
        mapScale,
        dragX,
        dragY,
    }
}
