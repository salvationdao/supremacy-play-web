import { Box, Slide } from "@mui/material"
import { ReactElement, useEffect } from "react"
import { useToggle } from "../../hooks"

export const NotificationItem = ({ duration, children }: { duration: number; children: ReactElement }) => {
    const [isShowing, toggleIsShowing] = useToggle(true)

    useEffect(() => {
        const timeout = setTimeout(() => {
            toggleIsShowing(false)
        }, duration)

        return () => clearTimeout(timeout)
    }, [])

    return (
        <Slide in={isShowing} direction="left">
            <Box sx={{ width: "32rem", opacity: 1, filter: "drop-shadow(0 3px 3px #00000050)" }}>{children}</Box>
        </Slide>
    )
}
