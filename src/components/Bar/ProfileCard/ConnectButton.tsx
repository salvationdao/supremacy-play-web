import { Button, Typography } from "@mui/material"
import { useTour } from "@reactour/tour"
import { colors, fonts } from "../../../theme/theme"
import { useAuth } from "../../../containers"
import { FancyButton } from "../.."

export const ConnectButton = () => {
    const { isLoggingIn, onLogInClick } = useAuth()
    const { setIsOpen } = useTour()

    return (
        <>
            {!isLoggingIn ? (
                <FancyButton
                    id="tutorial-connect"
                    excludeCaret
                    clipThingsProps={{
                        clipSize: "7px",
                        backgroundColor: colors.neonBlue,
                        sx: { position: "relative" },
                    }}
                    sx={{
                        px: "1.4rem",
                        py: ".3rem",
                        color: colors.darkestNeonBlue,
                    }}
                    onClick={() => {
                        setIsOpen(false)
                        onLogInClick()
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: colors.darkestNeonBlue,
                            fontFamily: fonts.nostromoBold,
                            whiteSpace: "nowrap",
                        }}
                    >
                        CONNECT
                    </Typography>
                </FancyButton>
            ) : (
                <Typography sx={{ ml: "2.1rem", mr: "1.6rem", fontFamily: fonts.nostromoBold }} variant="caption">
                    Signing in...
                </Typography>
            )}
        </>
    )
    return (
        <Button
            id="tutorial-connect"
            sx={{
                px: "1.76rem",
                pt: ".32rem",
                pb: ".16rem",
                flexShrink: 0,
                justifyContent: "flex-start",
                borderRadius: 0.2,
                border: `1px solid ${colors.neonBlue}`,
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
    )
}
