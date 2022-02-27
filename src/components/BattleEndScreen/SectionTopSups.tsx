import { Box, Stack, Typography } from "@mui/material"
import { BattleEndTooltip, StyledImageText } from ".."
import { PASSPORT_SERVER_HOST_IMAGES } from "../../constants"
import { colors } from "../../theme/theme"
import { BattleEndDetail } from "../../types"

export const SectionTopSups = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { topSupsContributors } = battleEndDetail

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
                    BATTLE INFLUENCERS
                    <BattleEndTooltip
                        text="The players that had spent the most SUPs during the battle."
                        color={colors.neonBlue}
                    />
                </Typography>
            </Box>

            {topSupsContributors && topSupsContributors.length > 0 ? (
                <Stack spacing={2}>
                    <Stack spacing={2} sx={{ pl: 1 }}>
                        {topSupsContributors.map((u, index) => (
                            <Stack key={index} direction="row" spacing={1.3} alignItems="center">
                                <Typography variant="h5" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                                    {index + 1}.
                                </Typography>
                                <StyledImageText
                                    color={u.faction.theme.primary}
                                    text={u.username}
                                    imageUrl={
                                        u.avatarID
                                            ? `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${u.avatarID}`
                                            : undefined
                                    }
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
