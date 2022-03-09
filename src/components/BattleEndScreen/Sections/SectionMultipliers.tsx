import { Box, Stack, Typography } from "@mui/material"
import { BattleEndTooltip, StyledImageText } from "../.."
import { GenericWarMachinePNG } from "../../../assets"
import { colors } from "../../../theme/theme"
import { BattleEndDetail } from "../../../types"

export const SectionMultipliers = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { winning_war_machines } = battleEndDetail

    return (
        <Stack>
            <Box sx={{ px: 2.5, py: 1.5, pr: 4, backgroundColor: "#FFFFFF15" }}>
                <Typography
                    component="span"
                    variant="h4"
                    sx={{
                        position: "relative",
                        fontFamily: "Nostromo Regular Black",
                        fontWeight: "fontWeightBold",
                        color: colors.yellow,
                    }}
                >
                    Your Multipliers
                    <BattleEndTooltip
                        text={`These are the multipliers that you will get for the next battle based on your participation in this battle.`}
                        color={colors.yellow}
                    />
                </Typography>
            </Box>

            <Stack spacing={3.2} sx={{ px: 2.3, py: 2.5, backgroundColor: "#FFFFFF05" }}>
                {winning_war_machines && winning_war_machines.length > 0 ? (
                    <Stack spacing={2} sx={{ pl: 1 }}>
                        {winning_war_machines.map((wm) => (
                            <StyledImageText
                                key={`${wm.hash}-${wm.participantID}`}
                                color={colors.text}
                                imageBorderColor={wm.faction.theme.primary}
                                imageBackgroundColor={`${wm.faction.theme.primary}60`}
                                text={wm.name.toUpperCase()}
                                imageUrl={wm.imageAvatar || GenericWarMachinePNG}
                                variant="h5"
                                imageSize={29}
                                imageBorderThickness="2px"
                                fontWeight="normal"
                                truncateLine
                                imageMb={-0.8}
                            />
                        ))}
                    </Stack>
                ) : (
                    <Typography variant="h5" sx={{ pl: 1 }}>
                        Nothing to show...
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}
