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
                    sheen={{ autoSheen: true, sheenSpeedFactor: 0.8 }}
                    border={{ color: changeColor || colors.neonBlue }}
                    background={{ color: [changeColor || colors.neonBlue] }}
                    sx={{
                        px: "2rem",
                        py: ".3rem",
                        color: colors.darkestNeonBlue,
                        ...sx,
                    }}
                    onClick={onLogInClick}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: colors.darkestNeonBlue,
                            fontFamily: fonts.nostromoBlack,
                            whiteSpace: "nowrap",
                            ...typeSx,
                        }}
                    >
                        {label || "LOG IN"}
                    </Typography>
                </NiceButton>
            ) : (
                <Typography sx={{ ml: "2.1rem", mr: "1.6rem", fontFamily: fonts.nostromoBold, ...typeSx }} variant="subtitle1">
                    <i>{loadingLabel || "Logging in..."}</i>
                </Typography>
            )}
        </>
    )
}
