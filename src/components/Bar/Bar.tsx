import { Box, Stack, Typography } from "@mui/material"
import { Logo, ProfileCard, WalletDetails } from ".."
import { SvgDisconnected } from "../../assets"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT, STAGING_OR_DEV_ONLY } from "../../constants"
import { useAuth, useSupremacy } from "../../containers"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { User } from "../../types"
import { Messages } from "./Messages/Messages"
import { NavLinks } from "./NavLinks/NavLinks"

export const Bar = () => {
    const { userID, user } = useAuth()

    return (
        <>
            {STAGING_OR_DEV_ONLY && (
                <>
                    <Box
                        sx={{
                            position: "relative",
                            flexShrink: 0,
                            p: ".6rem",
                            width: "100vw",
                            backgroundColor: colors.lightRed,
                            zIndex: siteZIndex.Popover,
                        }}
                    >
                        <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, lineHeight: 1, textAlign: "center" }}>
                            THIS IS A TESTING ENVIRONMENT
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            position: "fixed",
                            height: "100%",
                            width: "100%",
                            border: STAGING_OR_DEV_ONLY ? `${colors.lightRed} 3px solid` : "unset",
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
                    background: (theme) => `linear-gradient(#FFFFFF10 26%, ${theme.factionTheme.background})`,
                    transition: `all ${DRAWER_TRANSITION_DURATION / 1000}s`,

                    zIndex: siteZIndex.Popover,
                    "::-webkit-scrollbar": {
                        height: ".3rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                        borderRadius: 3,
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: "#FFFFFF50",
                        borderRadius: 3,
                    },
                }}
            >
                <BarContent userID={userID} user={user} />
            </Stack>
        </>
    )
}

const BarContent = ({ userID, user }: { userID?: string; user: User }) => {
    const { isServerUp } = useSupremacy()

    if (!isServerUp) {
        return (
            <>
                <Logo />
                <Box sx={{ flexGrow: 1 }} />
                <Stack direction="row" alignItems="center" spacing=".8rem" sx={{ mr: "1.6rem" }}>
                    <SvgDisconnected size="1.7rem" sx={{ pb: ".6rem" }} />
                    <Typography sx={{ fontFamily: fonts.nostromoBold }} variant="caption">
                        DISCONNECTED
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
            {/* <HowToPlay /> */}
            {/* {userID && <Enlist />} */}
            {userID && <WalletDetails />}
            {userID && <Messages />}
            <ProfileCard userID={userID} user={user} />
        </>
    )
}
