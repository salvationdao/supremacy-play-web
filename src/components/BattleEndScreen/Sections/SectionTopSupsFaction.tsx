import { Box, Stack, Typography } from "@mui/material"
import { BattleEndTooltip, StyledImageText } from "../.."
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { colors } from "../../../theme/theme"
import { BattleEndDetail } from "../../../types"

export const SectionTopSupsFaction = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { top_sups_contribute_factions } = battleEndDetail

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
                    MOST SUPS SPENT (SYNDICATE)
                    <BattleEndTooltip
                        text="The syndicates that had spent the most SUPS, ranked in order."
                        color={colors.neonBlue}
                    />
                </Typography>
            </Box>

            {top_sups_contribute_factions && top_sups_contribute_factions.length > 0 ? (
                <Stack spacing={1.5} sx={{ pl: 1 }}>
                    {top_sups_contribute_factions.map((f, index) => (
                        <Stack key={index} direction="row" spacing={1.3} alignItems="center">
                            <Typography variant="h5" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                                {index + 1}.
                            </Typography>
                            <StyledImageText
                                color={f.theme.primary}
                                text={f.label}
                                imageUrl={
                                    f.logo_blob_id
                                        ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${f.logo_blob_id}`
                                        : undefined
                                }
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
