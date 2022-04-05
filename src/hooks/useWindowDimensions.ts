import { useEffect } from "react"
import { useDebounce } from "."

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window
    return {
        width,
        height,
    }
}

export const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useDebounce(getWindowDimensions(), 350)

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(getWindowDimensions())
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return windowDimensions
}
