import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import Marquee from "react-fast-marquee"
import { BuySupsButton, Logo, ProfileCard, WalletDetails } from ".."
import { SvgDisconnected } from "../../assets"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT, IS_TESTING_MODE, STAGING_OR_DEV_ONLY } from "../../constants"
import { useAuth, useSupremacy } from "../../containers"
import { hexToRGB } from "../../helpers"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { User } from "../../types"
import { BarSocials } from "./BarSocials"
import { Messages } from "./Messages/Messages"
import { NavLinks } from "./NavLinks/NavLinks"
import { Quests } from "./Quests/Quests"
import { ShoppingCart } from "./ShoppingCart/ShoppingCart"
import { Tutorial } from "./Tutorial"

export const Bar = () => {
    const { userID, user } = useAuth()
    const rgb = hexToRGB(colors.lightRed)

    return (
        <>
            {IS_TESTING_MODE && (
                <>
                    <Box
                        sx={{
                            position: "relative",
                            flexShrink: 0,
                            p: ".6rem",
                            width: "100vw",
                            backgroundColor: colors.lightRed,
                            zIndex: siteZIndex.TopBar,
                        }}
                    >
                        <Marquee direction="left" gradientColor={[rgb.r, rgb.g, rgb.b]} gradientWidth={50} style={{ overflow: "hidden" }}>
                            <Typography variant="body2" sx={{ pr: "100px", fontFamily: fonts.nostromoBlack, lineHeight: 1 }}>
                                Welcome to the Proving Grounds. Test new features. Report bugs and submit ideas via the feedback form. 🦾🦾
                            </Typography>
                        </Marquee>
                    </Box>

                    <Box
                        sx={{
                            position: "fixed",
                            height: "100%",
                            width: "100%",
                            border: `${colors.lightRed} 3px solid`,
                            zIndex: siteZIndex.Modal * 99,
                            pointerEvents: "none",
                        }}
                    />
                </>
            )}

            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    position: "relative",
                    pl: ".8rem",
                    pr: "1.6rem",
                    flexShrink: 0,
                    height: `${GAME_BAR_HEIGHT}rem`,
                    width: "100vw",
                    color: "#FFFFFF",
                    backgroundColor: (theme) => theme.factionTheme.background,
                    transition: `all ${DRAWER_TRANSITION_DURATION / 1000}s`,

                    zIndex: siteZIndex.TopBar,
                    "::-webkit-scrollbar": {
                        height: ".6rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: "#FFFFFF50",
                    },
                }}
            >
                <BarContent userID={userID} user={user} />

                {/* Background gradient */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: (theme) => `linear-gradient(#FFFFFF10 26%, ${theme.factionTheme.background})`,
                        pointerEvents: "none",
                        zIndex: -1,
                    }}
                />
            </Stack>
        </>
    )
}

const BarContent = ({ userID, user }: { userID?: string; user: User }) => {
    const { isReconnecting, isServerDown } = useSupremacy()

    if (isServerDown) {
        return (
            <>
                <Logo />
                <Box sx={{ flexGrow: 1 }} />
                <Tutorial />
                <BuySupsButton />
                <BarSocials />
                <Stack direction="row" alignItems="center" spacing="1.3rem" sx={{ mx: "1.6rem" }}>
                    <SvgDisconnected size="1.7rem" sx={{ pb: ".6rem" }} />
                    <Typography sx={{ fontFamily: fonts.nostromoBold }} variant="caption">
                        DISCONNECTED
                    </Typography>
                </Stack>
            </>
        )
    }

    if (isReconnecting) {
        return (
            <>
                <Logo />
                <Box sx={{ flexGrow: 1 }} />
                <Tutorial />
                <BuySupsButton />
                <BarSocials />
                <Stack direction="row" alignItems="center" spacing="1.3rem" sx={{ mx: "1.6rem" }}>
                    <CircularProgress size="1.9rem" sx={{ color: colors.neonBlue, mb: ".5rem !important" }} />
                    <Typography sx={{ color: colors.neonBlue, fontFamily: fonts.nostromoBold }} variant="caption">
                        RECONNECTING...
                    </Typography>
                </Stack>
            </>
        )
    }

    return (
        <>
            <Logo />
            <NavLinks />
            <Box sx={{ flexGrow: 1 }} />
            <Tutorial />
            {userID && <WalletDetails />}
            <BuySupsButton />
            {userID && <Quests />}
            <BarSocials />
            {userID && <Messages />}
            {userID && STAGING_OR_DEV_ONLY && <ShoppingCart />}
            <ProfileCard userID={userID} user={user} />
        </>
    )
}
