import { Box, Button, Stack, Typography, useTheme, Theme } from "@mui/material"
import { useEffect } from "react"
import { Enlist, Logo, ProfileCard, WalletDetails } from ".."
import { DEV_ONLY, DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT } from "../../constants"
import { SocketState, useGameServerWebsocket, usePassportServerAuth, usePassportServerWebsocket, useSnackbar } from "../../containers"
import { useToggle } from "../../hooks"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { UserData } from "../../types/passport"
import { HowToPlay } from "../HowToPlay/HowToPlay"
import { SaleAbilitiesModal } from "../PlayerAbilities/SaleAbilitiesModal"

export const Bar = () => {
    const theme = useTheme<Theme>()
    const { user } = usePassportServerAuth()
    const { state, subscribe } = useGameServerWebsocket()
    const { newSnackbarMessage } = useSnackbar()

    useEffect(() => {
        if (state !== SocketState.OPEN || !subscribe || !user || !DEV_ONLY) return
        return subscribe(GameServerKeys.TriggerSaleAbilitiesListUpdated, () => newSnackbarMessage("Player abilities market has been refreshed.", "info"))
    }, [state, subscribe, user])

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
                backgroundColor: theme.factionTheme.background,
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
    )
}

const BarContent = ({ user }: { user?: UserData }) => {
    const { state, isServerUp } = usePassportServerWebsocket()
    const [showSaleAbilities, toggleShowSaleAbilities] = useToggle()

    if (state !== WebSocket.OPEN) {
        return (
            <>
                <Logo />
                <Box sx={{ flexGrow: 1 }} />
                <Typography sx={{ mr: "1.6rem", fontFamily: fonts.nostromoBold }} variant="caption">
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
                    {DEV_ONLY && (
                        <Button variant="outlined" onClick={() => toggleShowSaleAbilities(true)}>
                            Purchase Abilities
                        </Button>
                    )}
                    <Enlist />
                    <WalletDetails />
                </>
            )}
            <ProfileCard />

            {showSaleAbilities && <SaleAbilitiesModal open={showSaleAbilities} onClose={() => toggleShowSaleAbilities(false)} />}
        </>
    )
}
