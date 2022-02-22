import * as React from 'react'

export const useMousePosition = () => {
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    React.useEffect(() => {
        const setFromMouseEvent = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY })

        window.addEventListener('mousemove', setFromMouseEvent)

        return () => {
            window.removeEventListener('mousemove', setFromMouseEvent)
        }
    }, [])

    return position
}
