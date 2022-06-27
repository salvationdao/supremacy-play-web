import { Stack, Typography } from "@mui/material"
import { HangarBg } from "../assets"
import { ClipThing, ConnectButton } from "../components"
import { colors, fonts, siteZIndex } from "../theme/theme"

export const AuthPage = ({ authTitle, authDescription }: { authTitle?: string; authDescription?: string }) => {
    return (
        <Stack
            alignItems="center"
            sx={{
                height: "100%",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                boxShadow: `inset 0 0 50px 60px #00000090`,
            }}
        >
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: colors.neonBlue,
                    borderThickness: ".3rem",
                }}
                sx={{ position: "relative", maxWidth: "70rem", my: "auto", mx: "2.6rem" }}
                backgroundColor={colors.darkerNavy}
                opacity={0.7}
            >
                <Stack spacing="1.8rem" alignItems="center" sx={{ px: "3.6rem", py: "2.8rem", textAlign: "center" }}>
                    <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                        {authTitle || "PLEASE CONNECT YOUR WALLET TO CONTINUE"}
                    </Typography>

                    {authDescription && <Typography>{authDescription}</Typography>}

                    <ConnectButton label="Connect Wallet" loadingLabel="Connecting Wallet..." sx={{ px: "3rem", py: ".8rem" }} />
                </Stack>
            </ClipThing>
        </Stack>
    )
}
