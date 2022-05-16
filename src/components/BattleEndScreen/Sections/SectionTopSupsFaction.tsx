import { Box, Stack, Typography } from "@mui/material"
import { BattleEndTooltip, StyledImageText } from "../.."
import { useSupremacy } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"
import { BattleEndDetail } from "../../../types"

export const SectionTopSupsFaction = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { getFaction } = useSupremacy()
    const { top_sups_contribute_factions } = battleEndDetail

    return (
        <Stack spacing="1.6rem">
            <Box sx={{ px: "2rem", py: ".88rem", pr: "3.2rem", backgroundColor: "#FFFFFF15" }}>
                <Typography
                    component="span"
                    variant="h6"
                    sx={{
                        position: "relative",
                        fontFamily: fonts.nostromoBlack,
                        fontWeight: "fontWeightBold",
                        color: colors.neonBlue,
                    }}
                >
                    MOST SUPS SPENT (SYNDICATE)
                    <BattleEndTooltip text="The syndicates that had spent the most SUPS, ranked in order." color={colors.neonBlue} />
                </Typography>
            </Box>

            {top_sups_contribute_factions && top_sups_contribute_factions.length > 0 ? (
                <Stack spacing="1.2rem" sx={{ pl: ".8rem" }}>
                    {top_sups_contribute_factions.map((f, index) => {
                        const faction = getFaction(f.id)
                        return (
                            <Stack key={index} direction="row" spacing="1.04rem" alignItems="center">
                                <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                                    {index + 1}.
                                </Typography>
                                <StyledImageText
                                    color={faction.primary_color}
                                    text={faction.label}
                                    imageUrl={faction.logo_url}
                                    variant="h6"
                                    imageSize={2.9}
                                    imageBorderThickness=".2rem"
                                    fontWeight="normal"
                                    truncateLine
                                    imageMb={-0.8}
                                />
                            </Stack>
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
