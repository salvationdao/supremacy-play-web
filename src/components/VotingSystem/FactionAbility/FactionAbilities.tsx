import { Box, Fade, Divider, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { FactionAbilityItem } from "../.."
import { NullUUID, PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { useSupremacy, useGameServerAuth, useGameServerWebsocket } from "../../../containers"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { GameAbility } from "../../../types"

export const FactionAbilities = () => {
    const { state, subscribe } = useGameServerWebsocket()
    const { factionID } = useGameServerAuth()
    const { factionsAll } = useSupremacy()
    const [gameAbilities, setGameAbilities] = useState<GameAbility[]>()

    // Subscribe to faction ability updates
    useEffect(() => {
        if (state !== WebSocket.OPEN || !factionID || factionID === NullUUID) return
        return subscribe<GameAbility[] | undefined>(GameServerKeys.SubFactionUniqueAbilities, (payload) => setGameAbilities(payload), null)
    }, [subscribe, state, factionID])

    if (!gameAbilities || gameAbilities.length <= 0) return null

    return (
        <Fade in={true}>
            <Box>
                <Divider sx={{ mb: 2.3, borderColor: (theme) => theme.factionTheme.primary, opacity: 0.28 }} />
                <Stack spacing=".56rem">
                    <Stack direction="row" spacing=".48rem" alignItems="center">
                        {factionID && (
                            <Box
                                sx={{
                                    width: "1.9rem",
                                    height: "1.9rem",
                                    backgroundImage: factionsAll[factionID]
                                        ? `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[factionID].logo_blob_id})`
                                        : "",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "contain",
                                    mb: ".24rem",
                                }}
                            />
                        )}
                        <Typography sx={{ lineHeight: 1, color: colors.text, fontWeight: "fontWeightBold" }}>SYNDICATE UNIQUE SKILLS</Typography>
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
