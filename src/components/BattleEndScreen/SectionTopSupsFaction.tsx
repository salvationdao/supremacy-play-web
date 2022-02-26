import { Box, Stack, Typography } from "@mui/material"
import { BattleEndTooltip, StyledImageText } from ".."
import { GAME_SERVER_HOSTNAME } from "../../constants"
import { colors } from "../../theme/theme"
import { BattleEndDetail } from "../../types"

export const SectionTopSupsFaction = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { topSupsContributeFactions } = battleEndDetail

    return (
        <Stack spacing={2}>
            <Box sx={{ px: 2.5, py: 1.1, backgroundColor: "#00000083" }}>
                <Typography
                    component="span"
                    variant="h4"
                    sx={{
                        position: "relative",
                        fontFamily: "Nostromo Regular Black",
                        fontWeight: "fontWeightBold",
                        color: colors.neonBlue,
                    }}
                >
                    MOST SUPS SPENT
                    <BattleEndTooltip
                        text="The syndicates that had spent the most SUPs, ranked in order."
                        color={colors.neonBlue}
                    />
                </Typography>
            </Box>

            {topSupsContributeFactions && topSupsContributeFactions.length > 0 ? (
                <Stack spacing={2}>
                    <Stack spacing={2} sx={{ pl: 1 }}>
                        {topSupsContributeFactions.map((f, index) => (
                            <Stack key={index} direction="row" spacing={1.3} alignItems="center">
                                <Typography variant="h5" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                                    {index + 1}.
                                </Typography>
                                <StyledImageText
                                    color={f.theme.primary}
                                    text={f.label}
                                    imageUrl={f.logoBlobID ? `${GAME_SERVER_HOSTNAME}/api/files/${f.logoBlobID}` : undefined}
                                    variant="h5"
                                    imageSize={29}
                                    imageBorderThickness="2px"
                                    fontWeight="normal"
                                    truncateLine
                                />
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            ) : (
                <Typography variant="h5" sx={{ pl: 1 }}>
                    Nothing to show...
                </Typography>
            )}
        </Stack>
    )
}
