import { Box, Drawer, Stack, Theme, Typography, useTheme } from "@mui/material"
import { Dispatch, useState } from "react"
import { PlayerListContent } from ".."
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT, PASSPORT_SERVER_HOST_IMAGES, RIGHT_DRAWER_WIDTH } from "../../constants"
import { useDrawer, useGameServerAuth } from "../../containers"
import { acronym } from "../../helpers"
import { colors } from "../../theme/theme"
import { User } from "../../types"

const DrawerContent = ({
    user,
    activePlayers,
    setActivePlayers,
    inactivePlayers,
    setInactivePlayers,
}: {
    user?: User
    activePlayers: User[]
    setActivePlayers: Dispatch<React.SetStateAction<User[]>>
    inactivePlayers: User[]
    setInactivePlayers: Dispatch<React.SetStateAction<User[]>>
}) => {
    const theme = useTheme<Theme>()

    return (
        <Stack sx={{ flex: 1 }}>
            <Stack
                direction="row"
                spacing=".96rem"
                alignItems="center"
                sx={{
                    position: "relative",
                    pl: "2.2rem",
                    pr: "4.8rem",
                    height: `${GAME_BAR_HEIGHT}rem`,
                    background: `${theme.factionTheme.primary}40`,
                    boxShadow: 1.5,
                }}
            >
                {user && user.faction && (
                    <Box
                        sx={{
                            width: "3rem",
                            height: "3rem",
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
                )}
                <Stack spacing=".1rem">
                    <Typography variant="caption" sx={{ fontFamily: "Nostromo Regular Black" }}>
                        {user && user.faction ? `${acronym(user.faction.label)} ACTIVE PLAYERS` : "ACTIVE PLAYERS"}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing="1.3rem">
                        <Stack direction="row" alignItems="center" spacing=".4rem">
                            <Box sx={{ width: ".8rem", height: ".8rem", borderRadius: "50%", backgroundColor: colors.green }} />
                            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                                <strong>Active: </strong>
                                {activePlayers.length}
                            </Typography>
                        </Stack>
                        {/* <Stack direction="row" alignItems="center" spacing=".4rem">
                            <Box sx={{ width: ".8rem", height: ".8rem", borderRadius: "50%", backgroundColor: colors.yellow }} />
                            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                                <strong>Inactive: </strong>
                                {inactivePlayers.length}
                            </Typography>
                        </Stack> */}
                    </Stack>
                </Stack>
            </Stack>

            <Box
                sx={{
                    my: ".8rem",
                    ml: ".3rem",
                    pl: ".5rem",
                    mr: ".3rem",
                    pr: ".5rem",
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
                        background: theme.factionTheme.primary,
                        borderRadius: 3,
                    },
                }}
            >
                {user && (
                    <PlayerListContent
                        user={user}
                        activePlayers={activePlayers}
                        inactivePlayers={inactivePlayers}
                        setActivePlayers={setActivePlayers}
                        setInactivePlayers={setInactivePlayers}
                    />
                )}
            </Box>
        </Stack>
    )
}

export const PlayerList = () => {
    const { user } = useGameServerAuth()
    const { isPlayerListOpen, isAnyPanelOpen } = useDrawer()
    const theme = useTheme<Theme>()
    const [activePlayers, setActivePlayers] = useState<User[]>([])
    const [inactivePlayers, setInactivePlayers] = useState<User[]>([])

    return (
        <Drawer
            transitionDuration={DRAWER_TRANSITION_DURATION}
            open={isPlayerListOpen}
            variant="persistent"
            anchor="right"
            sx={{
                transition: `all ${DRAWER_TRANSITION_DURATION}ms cubic-bezier(0, 0, 0.2, 1) 0ms`,
                width: isAnyPanelOpen ? `${RIGHT_DRAWER_WIDTH}rem` : 0,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: `${RIGHT_DRAWER_WIDTH}rem`,
                    backgroundColor: theme.factionTheme.background,
                    position: "absolute",
                    borderLeft: 0,
                },
            }}
        >
            <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
                {isPlayerListOpen && (
                    <DrawerContent
                        user={user}
                        activePlayers={activePlayers}
                        inactivePlayers={inactivePlayers}
                        setActivePlayers={setActivePlayers}
                        setInactivePlayers={setInactivePlayers}
                    />
                )}
            </Stack>
        </Drawer>
    )
}
