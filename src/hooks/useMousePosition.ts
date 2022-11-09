import { useEffect, useState } from "react"

// Warning: this causes a lot of state changes, so use carefully!
export const useMousePosition = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const setFromMouseEvent = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY })
        window.addEventListener("mousemove", setFromMouseEvent)
        return () => {
            window.removeEventListener("mousemove", setFromMouseEvent)
        }
    }, [])

    return position
}
