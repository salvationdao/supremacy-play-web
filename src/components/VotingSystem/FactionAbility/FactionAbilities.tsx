import { Box, Fade, Divider, Stack, Typography } from "@mui/material"
import { FactionAbilityItem } from "../.."
import { useSupremacy, useAuth } from "../../../containers"
import { useGameServerSubscriptionAbilityFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { GameAbility } from "../../../types"

export const FactionAbilities = () => {
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()

    // Subscribe to faction ability updates
    const factionAbilities = useGameServerSubscriptionAbilityFaction<GameAbility[] | undefined>({
        URI: "/faction",
        key: GameServerKeys.SubFactionUniqueAbilities,
    })

    if (!factionAbilities || factionAbilities.length <= 0) return null

    return (
        <Fade in={true}>
            <Box>
                <Divider sx={{ mb: "2rem", borderBottomWidth: ".25rem", borderColor: (theme) => theme.factionTheme.primary, opacity: 0.15 }} />

                <Stack spacing="1rem">
                    <Stack direction="row" spacing=".48rem" alignItems="center">
                        {factionID && (
                            <Box
                                sx={{
                                    width: "1.9rem",
                                    height: "1.9rem",
                                    backgroundImage: `url(${getFaction(factionID).logo_url})`,
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
                        {factionAbilities.map((ga) => (
                            <FactionAbilityItem key={ga.identity} gameAbility={ga} />
                        ))}
                    </Stack>
                </Stack>
            </Box>
        </Fade>
    )
}
