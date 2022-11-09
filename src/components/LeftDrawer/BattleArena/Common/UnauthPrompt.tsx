import { Box, Stack, Typography } from "@mui/material"
import { CoinsLeftPNG, CoinsRightPNG, LightningBackgroundPNG } from "../../../../assets"
import { colors, fonts } from "../../../../theme/theme"
import { ConnectButton } from "../../../Bar/ProfileCard/ConnectButton"
import { ClipThing } from "../../../Common/Deprecated/ClipThing"

export const UnauthPrompt = () => {
    return (
        <Box sx={{ py: "1rem" }}>
            <ClipThing
                clipSize="6px"
                border={{
                    borderColor: `${colors.yellow}`,
                    borderThickness: ".3rem",
                }}
                opacity={0.6}
                backgroundColor={colors.darkestNeonBlue}
                sx={{ position: "relative" }}
            >
                <Stack
                    alignItems="center"
                    sx={{
                        flex: 1,
                        minWidth: "32.5rem",
                        p: "1.8rem 2.1rem",
                    }}
                >
                    <Typography fontFamily={fonts.nostromoBlack} variant="h5" textAlign={"center"} sx={{ mb: ".8rem" }}>
                        UNLOCK FEATURES
                    </Typography>
                    <Typography fontFamily={fonts.nostromoBold} variant="body2" textAlign={"center"} sx={{ mb: "1.6rem", fontSize: "1.4rem" }}>
                        log in for full access to the battle arena: claim and use abilities, visit the marketplace and deploy mechs!
                    </Typography>
                    <ConnectButton clipBorderColor={colors.yellow} clipBackgroundColor={colors.yellow} sx={{ minWidth: "18rem" }} />
                </Stack>

                {/* Coin left decorations */}
                <Box
                    sx={{
                        position: "absolute",
                        left: "2rem",
                        top: "2rem",
                        bottom: "2rem",
                        width: "10rem",
                        opacity: 0.3,
                        zIndex: -1,
                        background: `url(${CoinsLeftPNG})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom",
                        backgroundSize: "contain",
                    }}
                />

                {/* Coin right decorations */}
                <Box
                    sx={{
                        position: "absolute",
                        right: "2rem",
                        top: "2rem",
                        bottom: "2rem",
                        width: "10rem",
                        opacity: 0.3,
                        zIndex: -1,
                        background: `url(${CoinsRightPNG})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom",
                        backgroundSize: "contain",
                    }}
                />

                {/* Background */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.3,
                        zIndex: -2,
                        background: `url(${LightningBackgroundPNG})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}
                />
            </ClipThing>
        </Box>
    )
}
