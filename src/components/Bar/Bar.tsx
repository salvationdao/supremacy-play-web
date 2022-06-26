import { Box, Stack, Typography } from "@mui/material"
import { Enlist, Logo, ProfileCard, WalletDetails } from ".."
import { SvgDisconnected } from "../../assets"
import { DEV_ONLY, DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT } from "../../constants"
import { useAuth, useSupremacy } from "../../containers"
import { useTheme } from "../../containers/theme"
import { useToggle } from "../../hooks"
import { fonts, siteZIndex } from "../../theme/theme"
import { User } from "../../types"
import { FancyButton } from "../Common/FancyButton"
import { HowToPlay } from "../HowToPlay/HowToPlay"
import { SaleAbilitiesModal } from "../PlayerAbilities/SaleAbilitiesModal"

export const Bar = () => {
    const { userID, user } = useAuth()

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
            <BarContent userID={userID} user={user} />
        </Stack>
    )
}

const BarContent = ({ userID, user }: { userID?: string; user: User }) => {
    const theme = useTheme()
    const { isServerUp } = useSupremacy()
    const [showSaleAbilities, toggleShowSaleAbilities] = useToggle()

    if (isServerUp === false) {
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
            <Box sx={{ flexGrow: 1 }} />
            <HowToPlay />
            {userID && (
                <>
                    <Enlist />
                    <WalletDetails />
                    {DEV_ONLY && (
                        <FancyButton
                            clipThingsProps={{
                                clipSize: "7px",
                                backgroundColor: theme.factionTheme.background,
                                opacity: 0.8,
                                border: { borderColor: theme.factionTheme.primary, borderThickness: "1px" },
                                sx: { position: "relative", mx: "1rem" },
                            }}
                            sx={{ px: "1.2rem", pb: ".05rem", pt: ".1rem", color: theme.factionTheme.primary }}
                            onClick={() => toggleShowSaleAbilities(true)}
                        >
                            <Typography variant="body1" sx={{ fontWeight: "fontWeightBold", color: theme.factionTheme.primary }}>
                                Purchase Abilities
                            </Typography>
                        </FancyButton>
                    )}
                </>
            )}
            <ProfileCard userID={userID} user={user} />
            {showSaleAbilities && <SaleAbilitiesModal open={showSaleAbilities} onClose={() => toggleShowSaleAbilities(false)} />}
        </>
    )
}
