import { Box, Stack, Typography } from "@mui/material"
import { BattleEndTooltip, StyledImageText } from "../.."
import { useSupremacy } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"
import { BattleEndDetail } from "../../../types"

export const SectionMostFrequentAbilityExecutor = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { getFaction } = useSupremacy()
    const { winning_faction_id_order } = battleEndDetail

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
                        color: colors.neonBlue,
                    }}
                >
                    EXECUTORS
                    <BattleEndTooltip text="The players that had executed the most abilities during the battle." color={colors.neonBlue} />
                </Typography>
            </Box>

            {winning_faction_id_order && winning_faction_id_order.length > 0 ? (
                <Stack spacing="1.2rem" sx={{ pl: ".8rem" }}>
                    {winning_faction_id_order.map((fid, index) => {
                        const faction = getFaction(fid)
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
