import { Box, Stack, Typography } from "@mui/material"
import { BattleEndTooltip, StyledImageText, TooltipHelper } from "../.."
import { getMutiplierDeets } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { BattleEndDetail } from "../../../types"

export const SectionMultipliers = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { multipliers } = battleEndDetail

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
                {multipliers && multipliers.length > 0 ? (
                    <Stack spacing={1.5} sx={{ pl: 1 }}>
                        {multipliers.map((m) => {
                            const deets = getMutiplierDeets(m.key)
                            return (
                                <TooltipHelper key={m.key} placement="right" text={deets.description}>
                                    <Box sx={{ width: "fit-content" }}>
                                        <StyledImageText
                                            color={colors.text}
                                            imageBorderColor="#FFFFFF60"
                                            imageBackgroundColor="#FFFFFF"
                                            text={m.key.toUpperCase()}
                                            imageUrl={deets.image}
                                            variant="h5"
                                            imageSize={29}
                                            imageBorderThickness="2px"
                                            fontWeight="normal"
                                            truncateLine
                                            imageMb={-0.8}
                                        />
                                    </Box>
                                </TooltipHelper>
                            )
                        })}
                    </Stack>
                ) : (
                    <Typography variant="h6" sx={{ pl: 1, opacity: 0.8 }}>
                        {
                            "Sorry you didn't get any multipliers. You will receive multipliers when you participate in the battle..."
                        }
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}
