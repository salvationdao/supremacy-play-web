import { Box, Stack, Typography } from "@mui/material"
import { BattleEndTooltip, StyledImageText } from ".."
import { PASSPORT_SERVER_HOST_IMAGES } from "../../constants"
import { colors } from "../../theme/theme"
import { BattleEndDetail } from "../../types"

export const SectionTopSups = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { top_sups_contributors } = battleEndDetail

    return (
        <Stack spacing={2}>
            <Box sx={{ px: 2.5, py: 1.1, backgroundColor: "#FFFFFF15" }}>
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
                <Stack spacing={2}>
                    <Stack spacing={2} sx={{ pl: 1 }}>
                        {top_sups_contributors.map((u, index) => (
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
