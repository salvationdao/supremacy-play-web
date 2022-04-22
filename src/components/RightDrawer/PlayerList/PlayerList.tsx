import { Box, Fade, Stack, Theme, Typography, useTheme } from "@mui/material"
import { Dispatch, useState } from "react"
import { PlayerListContent } from "../.."
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { useGameServerAuth } from "../../../containers"
import { acronym } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { User } from "../../../types"

const Content = ({
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
                    height: `${5}rem`,
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
    const [activePlayers, setActivePlayers] = useState<User[]>([])
    const [inactivePlayers, setInactivePlayers] = useState<User[]>([])

    return (
        <Fade in>
            <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
                <Content
                    user={user}
                    activePlayers={activePlayers}
                    inactivePlayers={inactivePlayers}
                    setActivePlayers={setActivePlayers}
                    setInactivePlayers={setInactivePlayers}
                />
            </Stack>
        </Fade>
    )
}
