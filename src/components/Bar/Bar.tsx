import { Box, Button, Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { Enlist, Logo, ProfileCard, WalletDetails } from ".."
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT } from "../../constants"
import { SocketState, useBar, useGameServerWebsocket, usePassportServerAuth, usePassportServerWebsocket, useSnackbar } from "../../containers"
import { shadeColor } from "../../helpers"
import { useToggle } from "../../hooks"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { HowToPlay } from "../HowToPlay/HowToPlay"
import { SaleAbilitiesModal } from "./SaleAbilitiesModal"

const BarContent = () => {
    const { user } = usePassportServerAuth()
    const { state, isServerUp } = usePassportServerWebsocket()
    const { state: gsState, subscribe: gsSubscribe } = useGameServerWebsocket()
    const { newSnackbarMessage } = useSnackbar()
    const [showSaleAbilities, toggleShowSaleAbilities] = useToggle()

    useEffect(() => {
        if (gsState !== SocketState.OPEN || !gsSubscribe || !user) return

        return gsSubscribe(GameServerKeys.TriggerSaleAbilitiesListUpdated, () => newSnackbarMessage("Player abilities market has been refreshed.", "info"))
    }, [gsState, gsSubscribe, user])

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
            {<Logo />}
            <Box sx={{ flexGrow: 1 }} />
            <HowToPlay />
            {user && (
                <>
                    {process.env.NODE_ENV === "development" && (
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

export const Bar = () => {
    const { user } = usePassportServerAuth()
    const { gameBarRef } = useBar()

    return (
        <Stack
            ref={gameBarRef}
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 9999,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    position: "relative",
                    pl: ".8rem",
                    pr: "1.6rem",
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
                <BarContent />
            </Stack>
        </Stack>
    )
}
