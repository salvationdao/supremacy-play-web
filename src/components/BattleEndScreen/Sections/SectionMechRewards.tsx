import { Box, Stack, Typography } from "@mui/material"
import { BattleEndTooltip, StyledImageText } from "../.."
import { GenericWarMachinePNG } from "../../../assets"
import { useSupremacy } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"
import { BattleEndDetail } from "../../../types"

export const SectionMechRewards = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { getFaction } = useSupremacy()
    const { mech_rewards } = battleEndDetail

    return (
        <Stack spacing={2}>
            <Box sx={{ px: "2rem", py: ".88rem", pr: "3.2rem", backgroundColor: "#FFFFFF15" }}>
                <Typography
                    component="span"
                    variant="h6"
                    sx={{
                        position: "relative",
                        fontFamily: fonts.nostromoBlack,
                        fontWeight: "fontWeightBold",
                    }}
                >
                    FACTION RANKING
                    <BattleEndTooltip text="Best to worst performing faction." />
                </Typography>
            </Box>

            {mech_rewards && mech_rewards.length > 0 ? (
                <Stack spacing=".8rem" sx={{ pl: ".5rem" }}>
                    {mech_rewards.map((wm) => {
                        const faction = getFaction(wm.faction_id)
                        return (
                            <StyledImageText
                                key={wm.id}
                                color={colors.text}
                                imageBorderColor={faction.primary_color}
                                imageBackgroundColor={`${faction.primary_color}60`}
                                text={(wm.name || wm.label).toUpperCase()}
                                imageUrl={wm.avatar_url || GenericWarMachinePNG}
                                variant="h6"
                                imageSize={2.9}
                                imageBorderThickness=".2rem"
                                fontWeight="normal"
                                truncateLine
                                imageMb={-0.8}
                            />
                        )
                    })}
                </Stack>
            ) : (
                <Typography variant="h6" sx={{ pl: ".8rem", opacity: 0.8 }}>
                    Nothing to show...
                </Typography>
            )}
        </Stack>
    )
}
