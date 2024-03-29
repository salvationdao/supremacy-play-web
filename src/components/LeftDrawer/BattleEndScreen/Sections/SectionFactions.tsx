import { Box, Stack, Typography } from "@mui/material"
import { BattleEndTooltip } from "../../.."
import { useSupremacy } from "../../../../containers"
import { colors, fonts } from "../../../../theme/theme"
import { BattleEndDetail } from "../../../../types"
import { TypographyTruncated } from "../../../Common/TypographyTruncated"

export const SectionFactions = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
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
                    }}
                >
                    FACTION RANKING
                    <BattleEndTooltip text="Best to worst performing faction." />
                </Typography>
            </Box>

            {winning_faction_id_order && winning_faction_id_order.length > 0 ? (
                <Stack spacing="1.2rem" sx={{ px: "1.6rem" }}>
                    {winning_faction_id_order.map((fid, index) => {
                        const rank = index + 1
                        const faction = getFaction(fid)

                        let color = "#FFFFFF"
                        if (rank === 1) color = colors.yellow
                        if (rank === 2) color = colors.silver
                        if (rank === 3) color = colors.bronze

                        return (
                            <Stack key={index} direction="row" spacing="1.04rem" alignItems="center">
                                <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: "bold", color }}>
                                    {index + 1}.
                                </Typography>

                                <TypographyTruncated variant="h6" fontWeight="bold">
                                    <Box
                                        sx={{
                                            display: "inline-block",
                                            width: "2.8rem",
                                            height: "2.8rem",
                                            verticalAlign: "middle",
                                            background: `url(${faction.logo_url})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            backgroundSize: "contain",
                                        }}
                                    />{" "}
                                    {faction.label}
                                </TypographyTruncated>
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
