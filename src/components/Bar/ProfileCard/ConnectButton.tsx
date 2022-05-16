import { Button, Typography } from "@mui/material"
import { useTour } from "@reactour/tour"
import { colors, fonts } from "../../../theme/theme"
import { useAuth } from "../../../containers"

export const ConnectButton = () => {
    const { isLoggingIn, onLogInClick } = useAuth()
    const { setIsOpen } = useTour()

    return (
        <>
            {!isLoggingIn ? (
                <Button
                    id="tutorial-connect"
                    sx={{
                        ml: "2.1rem",
                        px: "1.76rem",
                        pt: ".32rem",
                        pb: ".16rem",
                        flexShrink: 0,
                        justifyContent: "flex-start",
                        whiteSpace: "nowrap",
                        borderRadius: 0.2,
                        border: `1px solid ${colors.neonBlue}`,
                        fontFamily: fonts.nostromoBold,
                        color: colors.darkestNeonBlue,
                        backgroundColor: colors.neonBlue,
                        ":hover": {
                            opacity: 0.75,
                            color: colors.darkestNeonBlue,
                            backgroundColor: colors.neonBlue,
                            transition: "all .2s",
                        },
                    }}
                    onClick={() => {
                        setIsOpen(false)
                        onLogInClick()
                    }}
                >
                    Connect
                </Button>
            ) : (
                <Typography sx={{ ml: "2.1rem", mr: "1.6rem", fontFamily: fonts.nostromoBold }} variant="caption">
                    Signing in...
                </Typography>
            )}
        </>
    )
}
