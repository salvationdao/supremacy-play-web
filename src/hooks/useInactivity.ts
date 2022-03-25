import { useEffect, useState } from "react"

// Default is 15min (900k ms)
export const useInactivity = (duration: number = 900000) => {
    const [inactive, setInactive] = useState(false)

    useEffect(() => {
        let timeout: NodeJS.Timeout

        const whenMouseMoves = () => {
            clearTimeout(timeout)

            timeout = setTimeout(() => {
                console.debug("User has been inactive.")
                setInactive(true)
            }, duration)
        }

        window.addEventListener("mousemove", whenMouseMoves)
        return () => {
            window.removeEventListener("mousemove", whenMouseMoves)
        }
    }, [])

    return inactive
}
