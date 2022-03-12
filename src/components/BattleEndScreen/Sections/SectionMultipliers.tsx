import { Box, Divider, Stack, Typography } from "@mui/material"
import { BattleEndTooltip, StyledImageText, TooltipHelper } from "../.."
import { getMutiplierDeets } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { BattleEndDetail } from "../../../types"

export const SectionMultipliers = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { total_multipliers, multipliers } = battleEndDetail

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
                    NEXT ROUND ({total_multipliers == "0.0x" ? "---" : total_multipliers})
                    <BattleEndTooltip
                        text={`These are the multipliers that you have earned based on your participation in the battle.`}
                        color={colors.yellow}
                    />
                </Typography>
            </Box>

            <Stack spacing={3.2} sx={{ pl: 1.8, pr: 2.3, pt: 2.5, pb: 2, backgroundColor: "#FFFFFF05" }}>
                {multipliers && multipliers.length > 0 ? (
                    <Stack spacing={1.5} sx={{ pl: 1 }}>
                        {multipliers.map((m) => {
                            const deets = getMutiplierDeets(m.key)
                            return (
                                <TooltipHelper key={m.key} placement="right" text={m.description}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
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
                                        <Typography variant="h6">{m.value}</Typography>
                                    </Stack>
                                </TooltipHelper>
                            )
                        })}

                        <Divider sx={{ py: 0.3, borderColor: "#FFFFFF", opacity: 0.15 }} />

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="h5" sx={{ fontWeight: "fontWeightBold" }}>
                                TOTAL:{" "}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: "fontWeightBold" }}>
                                {total_multipliers}
                            </Typography>
                        </Stack>
                    </Stack>
                ) : (
                    <Typography variant="h6" sx={{ pl: 1, opacity: 0.8 }}>
                        {"Sorry you didn't get any multipliers."}
                        <br />
                        You will receive multipliers when you participate in the battle...
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}
