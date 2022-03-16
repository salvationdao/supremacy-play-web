import { Box, Fade, Slide } from "@mui/material"
import { ReactElement, useEffect } from "react"
import { ClipThing } from ".."
import { useDebounce } from "../../hooks"
import { colors } from "../../theme/theme"

export const NotificationItem = ({ duration, children }: { duration: number; children: ReactElement }) => {
    const [isShowing, setIsShowing] = useDebounce<boolean>(true, duration)

    useEffect(() => {
        setIsShowing(false)
    }, [])

    return (
        <Slide in={isShowing} direction="left">
            <Box sx={{ width: "32.5rem", filter: "drop-shadow(0 3px 3px #00000050)" }}>
                <ClipThing clipSize="8px">
                    <Box
                        sx={{
                            px: "1.44rem",
                            pt: "1.2rem",
                            pb: ".8rem",
                            backgroundColor: `${colors.darkNavy}99`,
                        }}
                    >
                        {children}
                    </Box>
                </ClipThing>
            </Box>
        </Slide>
    )
}
