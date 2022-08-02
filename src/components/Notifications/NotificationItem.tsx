import { Box, Slide } from "@mui/material"
import { ReactElement, useEffect } from "react"
import { useMobile } from "../../containers"
import { useToggle } from "../../hooks"

export const NotificationItem = ({ duration, children }: { duration: number; children: ReactElement }) => {
    const { isMobile } = useMobile()
    const [isShowing, toggleIsShowing] = useToggle(true)

    useEffect(() => {
        const timeout = setTimeout(() => {
            toggleIsShowing(false)
        }, duration)

        return () => clearTimeout(timeout)
    }, [duration, toggleIsShowing])

    return (
        <Slide in={isShowing} direction="left">
            <Box sx={{ width: isMobile ? "100%" : "unset", opacity: 1, filter: "drop-shadow(0 3px 3px #00000050)" }}>{children}</Box>
        </Slide>
    )
}
