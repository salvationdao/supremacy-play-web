import { useEffect, useRef, useState } from "react"
import { IWindowFeatures } from "react-new-window"
import { createContainer } from "unstated-next"

export interface WindowPortalConfig {
    features?: IWindowFeatures
    container: HTMLElement | null
}

export const WindowPortalContainer = createContainer((initialState: WindowPortalConfig | undefined) => {
    const containerRef = useRef<HTMLElement | null>(null)
    const [curWidth, setCurWidth] = useState(initialState?.features?.width || 0)
    const [curHeight, setCurHeight] = useState(initialState?.features?.height || 0)

    const resizeObserver = useRef<ResizeObserver>()

    // Popped out logic
    useEffect(() => {
        const ref = initialState?.container
        if (!ref) return

        const cleanup = () => resizeObserver.current && resizeObserver.current.unobserve(ref)

        resizeObserver.current = new ResizeObserver((entries) => {
            const rect = entries[0].contentRect
            setCurWidth(rect.width)
            setCurHeight(rect.height)
        })
        resizeObserver.current.observe(ref)

        return cleanup
    }, [initialState?.container])

    useEffect(() => {
        if (initialState?.container) containerRef.current = initialState?.container
    }, [initialState?.container])

    return {
        containerRef,
        curWidth,
        curHeight,
    }
})

export const WindowPortalProvider = WindowPortalContainer.Provider
export const useWindowPortal = WindowPortalContainer.useContainer
