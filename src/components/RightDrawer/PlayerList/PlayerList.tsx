import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { PlayerListContent } from "../.."
import { useAuth, useChat, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { acronym, shadeColor } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { Faction, User } from "../../../types"

export const PlayerList = () => {
    const { getFaction } = useSupremacy()
    const { user } = useAuth()
    const { activePlayers } = useChat()

    return (
        <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
            <Content getFaction={getFaction} user={user} activePlayers={activePlayers} />
        </Stack>
    )
}

const Content = ({ getFaction, user, activePlayers }: { getFaction: (factionID: string) => Faction; user: User; activePlayers: User[] }) => {
    const theme = useTheme()
    const bannerColor = useMemo(() => shadeColor(theme.factionTheme.primary, -60), [theme.factionTheme.primary])

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
                    background: `linear-gradient(${bannerColor} 26%, ${bannerColor}95)`,
                    boxShadow: 1.5,
                }}
            >
                {user.faction_id && (
                    <Box
                        sx={{
                            width: "3rem",
                            height: "3rem",
                            flexShrink: 0,
                            mb: ".16rem",
                            backgroundImage: `url(${getFaction(user.faction_id).logo_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                            backgroundColor: (theme) => theme.factionTheme.primary,
                            borderRadius: 0.5,
                            border: (theme) => `${theme.factionTheme.primary} solid 1px`,
                        }}
                    />
                )}
                <Stack spacing=".1rem">
                    <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                        {user.faction_id ? `${acronym(getFaction(user.faction_id).label)} ACTIVE PLAYERS` : "ACTIVE PLAYERS"}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing="1.3rem">
                        <Stack direction="row" alignItems="center" spacing=".4rem">
                            <Box sx={{ width: ".8rem", height: ".8rem", borderRadius: "50%", backgroundColor: colors.green }} />
                            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                                <strong>Active: </strong>
                                {activePlayers.length}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>

            <Box
                sx={{
                    flex: 1,
                    ml: ".8rem",
                    mr: ".3rem",
                    pr: ".5rem",
                    my: "1rem",
                    overflowY: "auto",
                    overflowX: "hidden",
                    direction: "ltr",

                    "::-webkit-scrollbar": {
                        width: ".4rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                        borderRadius: 3,
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: (theme) => theme.factionTheme.primary,
                        borderRadius: 3,
                    },
                }}
            >
                <Box sx={{ height: 0 }}>
                    <PlayerListContent user={user} activePlayers={activePlayers} />
                </Box>
            </Box>
        </Stack>
    )
}
