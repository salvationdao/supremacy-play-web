import { SxProps, Typography } from "@mui/material"
import { colors, fonts } from "../../../theme/theme"
import { useAuth } from "../../../containers"
import { FancyButton } from "../.."

interface ConnectWalletProps {
    width?: string
    label?: string
    loadingLabel?: string
    sx?: SxProps
    typeSx?: SxProps
    clipBorderColor?: string
    clipBackgroundColor?: string
}

export const ConnectButton = ({ width, label, loadingLabel, sx, typeSx, clipBorderColor, clipBackgroundColor }: ConnectWalletProps) => {
    const { isLoggingIn, onLogInClick } = useAuth()

    return (
        <>
            {!isLoggingIn ? (
                <FancyButton
                    id="tutorial-connect"
                    clipThingsProps={{
                        clipSize: "7px",
                        backgroundColor: clipBackgroundColor || colors.neonBlue,
                        sx: { position: "relative", width },
                        border: { isFancy: true, borderColor: clipBorderColor || colors.neonBlue },
                    }}
                    sx={{
                        px: "2rem",
                        py: ".3rem",
                        color: colors.darkestNeonBlue,
                        ...sx,
                    }}
                    onClick={() => {
                        onLogInClick()
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: colors.darkestNeonBlue,
                            fontFamily: fonts.nostromoBlack,
                            whiteSpace: "nowrap",
                            ...typeSx,
                        }}
                    >
                        {label || "LOG IN"}
                    </Typography>
                </FancyButton>
            ) : (
                <Typography sx={{ ml: "2.1rem", mr: "1.6rem", fontFamily: fonts.nostromoBold, ...typeSx }} variant="caption">
                    {loadingLabel || "Logging in..."}
                </Typography>
            )}
        </>
    )
}
