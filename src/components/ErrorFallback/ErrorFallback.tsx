import { Box, Stack, Typography } from "@mui/material"
import { Gabs } from "../../assets"
import { useTheme } from "../../containers/theme"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { NiceButton } from "../Common/Nice/NiceButton"

export const ErrorFallback = () => {
    const theme = useTheme()

    return (
        <Stack
            spacing="2.6rem"
            alignItems="center"
            justifyContent="center"
            sx={{
                position: "fixed",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                p: "4rem",
                background: colors.darkNavyBlue,
                zIndex: siteZIndex.RoutePage,
            }}
        >
            <Box
                sx={{
                    backgroundImage: `url(${Gabs})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    boxShadow: `inset 0px 0px 20px 50px rgba(0,0,0,0.6)`,
                    width: "38rem",
                    height: "38rem",
                    maxWidth: "90vw",
                    maxHeight: "80vh",
                }}
            />

            <Typography variant="h4" fontFamily={fonts.nostromoBold}>
                Oh no... there&apos;s been a glitch!
            </Typography>

            <NiceButton
                corners
                buttonColor={theme.factionTheme.primary}
                sx={{
                    p: "1rem 2.5rem",
                }}
                onClick={() => location.reload()}
            >
                <Typography variant="h6" fontFamily={fonts.nostromoBold}>
                    RELOAD PAGE
                </Typography>
            </NiceButton>
        </Stack>
    )
}
