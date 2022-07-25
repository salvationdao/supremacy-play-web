import { Box, Stack, Typography, useMediaQuery } from "@mui/material"
import { Enlist, Logo, ProfileCard, WalletDetails } from ".."
import { SvgDisconnected } from "../../assets"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT } from "../../constants"
import { useAuth, useSupremacy } from "../../containers"
import { fonts, siteZIndex } from "../../theme/theme"
import { FeatureName, User } from "../../types"
import { HowToPlay } from "../HowToPlay/HowToPlay"
import { Messages } from "./Messages/Messages"

export const Bar = () => {
    const { userID, user, userHasFeature } = useAuth()

    return (
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
                background: (theme) => `linear-gradient(#FFFFFF10 26%, ${theme.factionTheme.background})`,

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
                width: "100vw",
                transition: `all ${DRAWER_TRANSITION_DURATION / 1000}s`,
            }}
        >
            <BarContent userID={userID} user={user} userHasFeature={userHasFeature} />
        </Stack>
    )
}

const BarContent = ({ userID, user, userHasFeature }: { userID?: string; user: User; userHasFeature: (featureName: FeatureName) => boolean }) => {
    const below580 = useMediaQuery("(max-width:580px)")
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
            {!below580 && <Logo />}
            <Box sx={{ flexGrow: 1 }} />
            <HowToPlay />
            {userID && <Enlist />}
            {userID && <WalletDetails />}
            {userID && userHasFeature(FeatureName.systemMessages) && <Messages />}
            <ProfileCard userID={userID} user={user} />
        </>
    )
}
