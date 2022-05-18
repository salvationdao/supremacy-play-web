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
                        LOG IN
                    </Typography>
                </FancyButton>
            ) : (
                <Typography sx={{ ml: "2.1rem", mr: "1.6rem", fontFamily: fonts.nostromoBold }} variant="caption">
                    Signing in...
                </Typography>
            )}
        </>
    )
}
