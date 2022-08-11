import { useEffect } from "react"
import { useDebounce } from "."

const getWindowDimensions = () => {
    const { outerWidth: width, outerHeight: height } = window
    return {
        width,
        height,
    }
}

const configureViewPort = (width: number) => {
    document.querySelector('meta[name="viewport"]')?.setAttribute("content", "width=" + Math.max(980, width))
}

export const useWindowDimensions = (debounceValue = 300) => {
    const [windowDimensions, setWindowDimensions] = useDebounce(getWindowDimensions(), debounceValue)

    useEffect(() => {
        configureViewPort(windowDimensions.width)
    }, [windowDimensions.width])

    useEffect(() => {
        const handleResize = () => {
            const dimensions = getWindowDimensions()
            setWindowDimensions(dimensions)
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [setWindowDimensions])

    return windowDimensions
}
