import { Box, Slide } from "@mui/material"
import { ReactElement, useEffect } from "react"
import { useDebounce } from "../../hooks"

export const NotificationItem = ({ duration, children }: { duration: number; children: ReactElement }) => {
    const [isShowing, setIsShowing] = useDebounce<boolean>(true, duration)

    useEffect(() => {
        setIsShowing(false)
    }, [])

    return (
        <Slide in={isShowing} direction="left">
            <Box sx={{ width: "32rem", opacity: 0.9, filter: "drop-shadow(0 3px 3px #00000050)" }}>{children}</Box>
        </Slide>
    )
}
