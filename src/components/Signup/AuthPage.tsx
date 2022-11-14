import { Stack, Typography } from "@mui/material"
import { ClaimsBg, SvgSupremacyLogo } from "../../assets"
import { ConnectButton } from "../../components"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { NiceBoxThing } from "../Common/Nice/NiceBoxThing"

export const AuthPage = ({ authTitle, authDescription }: { authTitle?: string; authDescription?: string }) => {
    return (
        <Stack
            alignItems="center"
            sx={{
                height: "100%",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${ClaimsBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                boxShadow: `inset 0 0 50px 60px #00000090`,
            }}
        >
            <NiceBoxThing
                border={{ color: colors.neonBlue }}
                background={{ colors: [colors.darkerNavy], opacity: 0.7 }}
                sx={{ position: "relative", maxWidth: "70rem", my: "auto", mx: "2.6rem" }}
            >
                <Stack spacing="1.8rem" alignItems="center" sx={{ px: "3.6rem", py: "3.6rem", textAlign: "center" }}>
                    <SvgSupremacyLogo width="100%" height="3rem" />

                    <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBold }}>
                        {authTitle || "PLEASE CONNECT TO XSYN TO CONTINUE"}
                    </Typography>

                    {authDescription && <Typography>{authDescription}</Typography>}

                    <ConnectButton label="LOG IN" loadingLabel="LOGGING IN..." sx={{ px: "6rem", py: ".8rem" }} />
                </Stack>
            </NiceBoxThing>
        </Stack>
    )
}
