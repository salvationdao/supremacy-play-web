import { Box, Stack, Typography } from "@mui/material"
import { BattleEndTooltip, StyledImageText } from "../.."
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { useGame } from "../../../containers"
import { colors } from "../../../theme/theme"
import { BattleEndDetail } from "../../../types"

export const SectionTopSups = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { factionsAll } = useGame()
    const { top_sups_contributors } = battleEndDetail

    return (
        <Stack spacing={2}>
            <Box sx={{ px: 2.5, py: 1.1, pr: 4, backgroundColor: "#FFFFFF15" }}>
                <Typography
                    component="span"
                    variant="h5"
                    sx={{
                        position: "relative",
                        fontFamily: "Nostromo Regular Black",
                        fontWeight: "fontWeightBold",
                        color: colors.neonBlue,
                    }}
                >
                    BATTLE INFLUENCERS
                    <BattleEndTooltip
                        text="The players that had spent the most SUPS during the battle."
                        color={colors.neonBlue}
                    />
                </Typography>
            </Box>

            {top_sups_contributors && top_sups_contributors.length > 0 ? (
                <Stack spacing={1.5} sx={{ pl: 1 }}>
                    {top_sups_contributors.map((u, index) => (
                        <Stack key={index} direction="row" spacing={1.3} alignItems="center">
                            <Typography variant="h5" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                                {index + 1}.
                            </Typography>
                            <StyledImageText
                                color={u.faction_colour}
                                text={u.username}
                                imageUrl={`${PASSPORT_SERVER_HOST_IMAGES}/api/files/${
                                    factionsAll[u.faction_id]?.logo_blob_id
                                }`}
                                variant="h5"
                                imageSize={29}
                                imageBorderThickness="2px"
                                fontWeight="normal"
                                truncateLine
                                imageMb={-0.8}
                            />
                        </Stack>
                    ))}
                </Stack>
            ) : (
                <Typography variant="h6" sx={{ pl: 1, opacity: 0.8 }}>
                    Nothing to show...
                </Typography>
            )}
        </Stack>
    )
}