import { Box, Drawer, Stack, Theme, Typography, useTheme } from "@mui/material"
import { useEffect } from "react"
import { DrawerButtons, PlayerListContent } from ".."
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT, PASSPORT_SERVER_HOST_IMAGES, RIGHT_DRAWER_WIDTH } from "../../constants"
import { useDrawer, useGameServerAuth } from "../../containers"
import { acronym } from "../../helpers"
import { colors } from "../../theme/theme"
import { User } from "../../types"

const DrawerContent = ({ user }: { user?: User }) => {
    const theme = useTheme<Theme>()

    if (!user || !user.faction) return null

    return (
        <Stack sx={{ flex: 1 }}>
            <Stack
                direction="row"
                spacing=".96rem"
                alignItems="center"
                sx={{
                    position: "relative",
                    pl: "2rem",
                    pr: "4.8rem",
                    height: `${GAME_BAR_HEIGHT}rem`,
                    background: `${theme.factionTheme.primary}40`,
                    boxShadow: 1.5,
                }}
            >
                <Box
                    sx={{
                        width: "2.1rem",
                        height: "2.1rem",
                        flexShrink: 0,
                        mb: ".16rem",
                        backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${user.faction.logo_blob_id})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        backgroundColor: theme.factionTheme.primary,
                        borderRadius: 0.5,
                        border: `${theme.factionTheme.primary} solid 1px`,
                    }}
                />
                <Typography variant="caption" sx={{ fontFamily: "Nostromo Regular Black" }}>
                    {acronym(user.faction.label)} ACTIVE PLAYERS
                </Typography>
            </Stack>

            <Box
                sx={{
                    m: ".4rem",
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    direction: "ltr",
                    scrollbarWidth: "none",
                    "::-webkit-scrollbar": {
                        width: ".4rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                        borderRadius: 3,
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: colors.assetsBanner,
                        borderRadius: 3,
                    },
                }}
            >
                <PlayerListContent />
            </Box>
        </Stack>
    )
}

export const PlayerList = () => {
    const { user } = useGameServerAuth()
    const { isPlayerListOpen, toggleIsPlayerListOpen } = useDrawer()
    const theme = useTheme<Theme>()

    useEffect(() => {
        if (!user) toggleIsPlayerListOpen(false)
    }, [user])

    if (!isPlayerListOpen) return null

    return (
        <Drawer
            transitionDuration={DRAWER_TRANSITION_DURATION}
            open={isPlayerListOpen}
            variant="persistent"
            anchor="right"
            sx={{
                width: `${RIGHT_DRAWER_WIDTH}rem`,
                flexShrink: 0,
                zIndex: 9999,
                "& .MuiDrawer-paper": {
                    width: `${RIGHT_DRAWER_WIDTH}rem`,
                    backgroundColor: theme.factionTheme.background,
                },
            }}
        >
            <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
                <DrawerButtons isFixed={false} />
                <DrawerContent user={user} />
            </Stack>
        </Drawer>
    )
}
