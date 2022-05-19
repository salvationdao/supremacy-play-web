import { Box, Stack, Theme, Typography, useTheme } from "@mui/material"
import { Enlist, FancyButton, Logo, ProfileCard, WalletDetails } from ".."
import { SvgDisconnected } from "../../assets"
import { DEV_ONLY, DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT } from "../../constants"
import { useAuth, useSnackbar, useSupremacy } from "../../containers"
import { useToggle } from "../../hooks"
import { useGameServerSubscription } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { fonts, siteZIndex } from "../../theme/theme"
import { User } from "../../types"
import { HowToPlay } from "../HowToPlay/HowToPlay"
import { SaleAbilitiesModal } from "../PlayerAbilities/SaleAbilitiesModal"

export const Bar = () => {
    const { userID, user } = useAuth()
    const { newSnackbarMessage } = useSnackbar()

    useGameServerSubscription(
        {
            URI: "xxxxxxxxx",
            key: GameServerKeys.TriggerSaleAbilitiesListUpdated,
        },
        () => {
            if (DEV_ONLY) return
            newSnackbarMessage("Player abilities market has been refreshed.", "info")
        },
    )

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
                backgroundColor: (theme) => theme.factionTheme.background,
                scrollbarWidth: "none",
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
    const theme = useTheme<Theme>()
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
                    {DEV_ONLY && (
                        <FancyButton
                            excludeCaret
                            clipThingsProps={{
                                clipSize: "5px",
                                opacity: 0.6,
                                backgroundColor: theme.factionTheme.background,
                                border: { isFancy: true, borderColor: theme.factionTheme.primary },
                                sx: { mr: "1rem", position: "relative", flexShrink: 0 },
                            }}
                            sx={{ px: "1.6rem", py: ".4rem", color: theme.factionTheme.primary }}
                            onClick={() => toggleShowSaleAbilities(true)}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: theme.factionTheme.primary,
                                    fontFamily: fonts.nostromoBold,
                                }}
                            >
                                PURCHASE ABILITIES
                            </Typography>
                        </FancyButton>
                    )}
                    <Enlist />
                    <WalletDetails />
                </>
            )}
            <ProfileCard userID={userID} user={user} />

            {showSaleAbilities && <SaleAbilitiesModal open={showSaleAbilities} onClose={() => toggleShowSaleAbilities(false)} />}
        </>
    )
}
