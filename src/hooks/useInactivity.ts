import { useEffect, useState } from "react"

// Default is 15min (900k ms)
export const useInactivity = (duration: number = 900000) => {
    const [isActive, setIsActive] = useState(true)

    useEffect(() => {
        let timeout: NodeJS.Timeout

        const whenMouseMoves = () => {
            clearTimeout(timeout)
            setIsActive(true)

            timeout = setTimeout(() => {
                setIsActive(false)
            }, duration)
        }

        window.addEventListener("mousemove", whenMouseMoves)
        return () => {
            window.removeEventListener("mousemove", whenMouseMoves)
        }
    }, [])

    return isActive
}
