import { Box, Stack, Typography } from "@mui/material"
import { FancyButton, Logo, ProfileCard, WalletDetails } from ".."
import { SvgDisconnected } from "../../assets"
import { DRAWER_TRANSITION_DURATION, FEEDBACK_FORM_URL, GAME_BAR_HEIGHT, NEXT_RESET_TIME, STAGING_OR_DEV_ONLY } from "../../constants"
import { useAuth, useSupremacy } from "../../containers"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { User } from "../../types"
import { Messages } from "./Messages/Messages"
import { NavLinks } from "./NavLinks/NavLinks"
import Marquee from "react-fast-marquee"
import { hexToRGBArray } from "../../helpers"
import Countdown from "react-countdown"
import { CountdownRendererFn } from "react-countdown/dist/Countdown"

// Renderer callback with condition
const renderer: CountdownRendererFn = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
        // Render a completed state
        return <span>very shortly.</span>
    } else {
        // Render a countdown
        return (
            <span style={{ paddingRight: "100px" }}>
                in {days === 1 ? <>{days} day </> : <>{days} days </>} {hours} hours {minutes} minutes and {seconds} seconds
            </span>
        )
    }
}

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
                        <Marquee direction="left" gradientColor={hexToRGBArray(colors.lightRed)} gradientWidth={50} style={{ overflow: "hidden" }}>
                            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, lineHeight: 1 }}>
                                Welcome to the proving grounds! Win up to 150,000 SUPS by helping us play-test incoming mechanisms and features. This round will
                                reset <Countdown date={NEXT_RESET_TIME} renderer={renderer} />
                            </Typography>
                        </Marquee>
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

            {userID && (
                <FancyButton
                    clipThingsProps={{
                        clipSize: "6px",
                        backgroundColor: colors.neonBlue,
                        opacity: 1,
                        border: { borderColor: colors.neonBlue, borderThickness: "2px" },
                        sx: { position: "relative", mx: "2rem" },
                    }}
                    sx={{ px: "1.6rem", py: ".1rem", color: colors.darkestNeonBlue }}
                    href={FEEDBACK_FORM_URL}
                    target="_blank"
                >
                    <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBold, color: colors.darkestNeonBlue }}>
                        FEEDBACK
                    </Typography>
                </FancyButton>
            )}

            {/* <HowToPlay /> */}
            {/* {userID && <Enlist />} */}
            {userID && <WalletDetails />}
            {userID && <Messages />}
            <ProfileCard userID={userID} user={user} />
        </>
    )
}
