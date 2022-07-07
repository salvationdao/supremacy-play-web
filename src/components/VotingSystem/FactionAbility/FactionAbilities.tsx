import { Box, Collapse, Fade, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { FactionAbilityItem, FancyButton } from "../.."
import { SvgDropdownArrow } from "../../../assets"
import { useAuth, useSupremacy } from "../../../containers"
import { useGameServerSubscriptionAbilityFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { GameAbility } from "../../../types"

export const FactionAbilities = () => {
    const { factionID } = useAuth()
    const { getFaction } = useSupremacy()
    const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem("isFactionAbilitiesCollapsed") === "true")

    // Subscribe to faction ability updates
    const factionAbilities = useGameServerSubscriptionAbilityFaction<GameAbility[] | undefined>({
        URI: "/faction",
        key: GameServerKeys.SubFactionUniqueAbilities,
    })

    if (!factionAbilities || factionAbilities.length <= 0) return null

    return (
        <Fade in={true}>
            <Box>
                <Box>
                    <FancyButton
                        clipThingsProps={{
                            clipSize: "0",
                            backgroundColor: "#FFFFFF",
                            opacity: 0.05,
                            sx: { position: "relative" },
                        }}
                        sx={{ px: "1rem", py: ".4rem", color: "#FFFFFF" }}
                        onClick={() => {
                            setIsCollapsed((prev) => {
                                localStorage.setItem("isFactionAbilitiesCollapsed", (!prev).toString())
                                return !prev
                            })
                        }}
                    >
                        <Stack direction="row" spacing=".8rem" alignItems="center">
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
                            <Typography sx={{ lineHeight: 1, color: colors.text, fontWeight: "fontWeightBold" }}>FACTION UNIQUE ABILITIES</Typography>

                            <SvgDropdownArrow size="1.3rem" sx={{ ml: "auto !important", transform: isCollapsed ? "scaleY(-1) translateY(2px)" : "unset" }} />
                        </Stack>
                    </FancyButton>

                    <Collapse in={isCollapsed}>
                        <Stack spacing="1.04rem" sx={{ my: "1rem", px: ".6rem" }}>
                            {factionAbilities.map((ga) => (
                                <FactionAbilityItem key={ga.identity} gameAbility={ga} />
                            ))}
                        </Stack>
                    </Collapse>
                </Box>
            </Box>
        </Fade>
    )
}
