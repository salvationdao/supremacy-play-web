import { SxProps, Typography } from "@mui/material"
import { useAuth } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"
import { NiceButton } from "../../Common/Nice/NiceButton"

interface ConnectWalletProps {
    label?: string
    loadingLabel?: string
    sx?: SxProps
    typeSx?: SxProps
    changeColor?: string
}

export const ConnectButton = ({ label, loadingLabel, sx, typeSx, changeColor }: ConnectWalletProps) => {
    const { isLoggingIn, onLogInClick } = useAuth()

    return (
        <>
            {!isLoggingIn ? (
                <NiceButton
                    buttonColor={changeColor || colors.neonBlue}
                    sx={{
                        px: "2rem",
                        py: ".4rem",
                        mx: "1.2rem",
                        ...sx,
                    }}
                    onClick={onLogInClick}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            whiteSpace: "nowrap",
                            ...typeSx,
                        }}
                    >
                        {label || "LOG IN"}
                    </Typography>
                </NiceButton>
            ) : (
                <Typography sx={{ mx: "1.2rem", fontFamily: fonts.nostromoBold, ...typeSx }} variant="subtitle1">
                    <i>{loadingLabel || "Logging in..."}</i>
                </Typography>
            )}
        </>
    )
}
