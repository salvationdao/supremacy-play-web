import { Box, Fade, Divider, Stack, Typography } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { useTheme } from "@mui/styles"
import { useEffect, useState } from "react"
import { FactionAbilityItem } from ".."
import { NullUUID, PASSPORT_SERVER_HOST_IMAGES } from "../../constants"
import { useGameServerAuth, useGameServerWebsocket } from "../../containers"
import { GameServerKeys } from "../../keys"
import { GameAbility } from "../../types"

export const FactionAbilities = () => {
    const { state, subscribe } = useGameServerWebsocket()
    const theme = useTheme<Theme>()
    const [gameAbilities, setGameAbilities] = useState<GameAbility[]>()
    const { user, factionID } = useGameServerAuth()

    // Subscribe to faction ability updates
    useEffect(() => {
        if (state !== WebSocket.OPEN || !factionID || factionID === NullUUID) return
        return subscribe<GameAbility[] | undefined>(
            GameServerKeys.SubFactionAbilities,
            (payload) => setGameAbilities(payload),
            null,
        )
    }, [subscribe, state, factionID])

    if (!gameAbilities || gameAbilities.length <= 0) return null

    return (
        <Fade in={true}>
            <Box>
                <Divider sx={{ mb: 1.6, borderColor: theme.factionTheme.primary, opacity: 0.28 }} />
                <Stack spacing={0.7}>
                    <Stack direction="row" spacing={0.6} alignItems="center">
                        <Box
                            sx={{
                                width: 19,
                                height: 19,
                                backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${user?.faction.logo_blob_id})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                                mb: 0.3,
                            }}
                        />
                        <Typography
                            sx={{ lineHeight: 1, color: theme.factionTheme.primary, fontWeight: "fontWeightBold" }}
                        >
                            SYNDICATE UNIQUE SKILLS
                        </Typography>
                    </Stack>

                    <Stack spacing={1.3}>
                        {gameAbilities.map((ga) => (
                            <FactionAbilityItem key={ga.identity} gameAbility={ga} />
                        ))}
                    </Stack>
                </Stack>
            </Box>
        </Fade>
    )
}
