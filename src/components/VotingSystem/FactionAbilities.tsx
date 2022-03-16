import { Box, Fade, Divider, Stack, Typography } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { useTheme } from "@mui/styles"
import { useEffect, useState } from "react"
import { FactionAbilityItem } from ".."
import { NullUUID, PASSPORT_SERVER_HOST_IMAGES } from "../../constants"
import { useGame, useGameServerAuth, useGameServerWebsocket } from "../../containers"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { GameAbility } from "../../types"

export const FactionAbilities = () => {
    const { state, subscribe } = useGameServerWebsocket()
    const theme = useTheme<Theme>()
    const { factionsAll } = useGame()
    const [gameAbilities, setGameAbilities] = useState<GameAbility[]>()
    const { user, faction_id } = useGameServerAuth()

    // Subscribe to faction ability updates
    useEffect(() => {
        if (state !== WebSocket.OPEN || !faction_id || faction_id === NullUUID) return
        return subscribe<GameAbility[] | undefined>(
            GameServerKeys.SubFactionUniqueAbilities,
            (payload) => setGameAbilities(payload),
            null,
        )
    }, [subscribe, state, faction_id])

    if (!gameAbilities || gameAbilities.length <= 0) return null

    return (
        <Fade in={true}>
            <Box>
                <Divider sx={{ mb: 2.3, borderColor: theme.factionTheme.primary, opacity: 0.28 }} />
                <Stack spacing=".56rem">
                    <Stack direction="row" spacing=".48rem" alignItems="center">
                        {user && (
                            <Box
                                sx={{
                                    width: "1.9rem",
                                    height: "1.9rem",
                                    backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${
                                        factionsAll[user.faction_id].logo_blob_id
                                    })`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "contain",
                                    mb: ".24rem",
                                }}
                            />
                        )}
                        <Typography sx={{ lineHeight: 1, color: colors.text, fontWeight: "fontWeightBold" }}>
                            SYNDICATE UNIQUE SKILLS
                        </Typography>
                    </Stack>

                    <Stack spacing="1.04rem">
                        {gameAbilities.map((ga) => (
                            <FactionAbilityItem key={ga.identity} gameAbility={ga} />
                        ))}
                    </Stack>
                </Stack>
            </Box>
        </Fade>
    )
}
