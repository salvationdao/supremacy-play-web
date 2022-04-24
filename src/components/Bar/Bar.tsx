import { Box, Stack, Typography } from "@mui/material"
import { Enlist, Logo, ProfileCard, WalletDetails } from ".."
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT } from "../../constants"
import { BarProvider, usePassportServerAuth, usePassportServerWebsocket } from "../../containers"
import { shadeColor } from "../../helpers"
import { colors } from "../../theme/theme"
import { UserData } from "../../types/passport"
import { HowToPlay } from "../HowToPlay/HowToPlay"

const BarContent = ({ user }: { user?: UserData }) => {
    const { state, isServerUp } = usePassportServerWebsocket()

    if (state !== WebSocket.OPEN) {
        return (
            <>
                <Logo />
                <Box sx={{ flexGrow: 1 }} />
                <Typography sx={{ mr: "1.6rem", fontFamily: "Nostromo Regular Bold" }} variant="caption">
                    {isServerUp ? "Connecting to passport..." : "Passport offline."}
                </Typography>
            </>
        )
    }

    return (
        <>
            <Logo />
            <Box sx={{ flexGrow: 1 }} />
            <HowToPlay />
            {user && (
                <>
                    <Enlist />
                    <WalletDetails />
                </>
            )}
            <ProfileCard />
        </>
    )
}

export const Bar = () => {
    const { user } = usePassportServerAuth()

    return (
        <BarProvider>
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    position: "relative",
                    pl: ".8rem",
                    pr: "1.6rem",
                    flexShrink: 0,
                    height: `${GAME_BAR_HEIGHT}rem`,
                    color: "#FFFFFF",
                    backgroundColor: user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavyBlue,
                    scrollbarWidth: "none",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    "::-webkit-scrollbar": {
                        height: ".4rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                        borderRadius: 3,
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: colors.darkNeonBlue,
                        borderRadius: 3,
                    },
                    width: "100vw",
                    transition: `all ${DRAWER_TRANSITION_DURATION / 1000}s`,
                }}
            >
                <BarContent user={user} />
            </Stack>
        </BarProvider>
    )
}
