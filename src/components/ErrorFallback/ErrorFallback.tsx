import { Box, Stack, Typography } from "@mui/material"
import { Gabs } from "../../assets"
import { FancyButton } from ".."
import { useTheme } from "../../containers/theme"
import { colors, fonts, siteZIndex } from "../../theme/theme"

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

            <Typography variant="h3">Oh no... an error occurred!</Typography>

            <FancyButton
                clipThingsProps={{
                    clipSize: "9px",
                    backgroundColor: theme.factionTheme.primary,
                    opacity: 1,
                    border: { borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                    sx: { position: "relative" },
                }}
                sx={{ px: "1.6rem", py: ".6rem", color: theme.factionTheme.secondary }}
                onClick={() => location.reload()}
            >
                <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack, color: theme.factionTheme.secondary }}>
                    RELOAD PAGE
                </Typography>
            </FancyButton>
        </Stack>
    )
}
