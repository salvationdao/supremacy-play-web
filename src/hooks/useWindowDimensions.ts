import { useEffect } from "react"
import { useDebounce } from "."

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window
    return {
        width,
        height,
    }
}

export const useWindowDimensions = (debounceValue = 300) => {
    const [windowDimensions, setWindowDimensions] = useDebounce(getWindowDimensions(), debounceValue)

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(getWindowDimensions())
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [setWindowDimensions])

    return windowDimensions
}
