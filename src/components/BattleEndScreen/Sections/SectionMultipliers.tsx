import { Box, Divider, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { BattleEndTooltip, StyledImageText, TooltipHelper } from "../.."
import { getMutiplierDeets } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { BattleEndDetail, Multiplier } from "../../../types"

export const SectionMultipliers = ({ battleEndDetail }: { battleEndDetail: BattleEndDetail }) => {
    const { battle_multipliers } = battleEndDetail

    const [, setMultiplicative] = useState<Multiplier[]>([])
    const [multiplierList, setMultiplierList] = useState<Multiplier[]>([])
    const [totalMultiplierValue, setTotalMultiplierValue] = useState(0)
    const [, setTotalMultiplicativeValue] = useState(0)

    useEffect(() => {
        if (!battle_multipliers) return
        const m1 = battle_multipliers.battles[0].multipliers.filter((m) => !m.is_multiplicative)
        const m2 = battle_multipliers.battles[0].multipliers.filter((m) => m.is_multiplicative)
        setMultiplierList(m1)
        setMultiplicative(m2)

        const total1 = m1.reduce((acc, m) => acc + Math.round(parseFloat(m.value) * 10) / 10, 0)
        const total2 = m2.reduce((acc, m) => acc + Math.round(parseFloat(m.value) * 10) / 10, 0)
        setTotalMultiplierValue(total1)
        setTotalMultiplicativeValue(total2)
    }, [battle_multipliers])

    return (
        <Stack>
            <Box sx={{ px: "2rem", py: ".88rem", pr: "3.2rem", backgroundColor: "#FFFFFF15" }}>
                <Typography
                    component="span"
                    variant="h5"
                    sx={{
                        position: "relative",
                        fontFamily: fonts.nostromoBlack,
                        fontWeight: "fontWeightBold",
                        color: colors.yellow,
                    }}
                >
                    NEW REWARDS ({battle_multipliers.battles[0].total_multipliers}x)
                    <BattleEndTooltip
                        text={`These are the multipliers that you have earned based on your participation in this battle.`}
                        color={colors.yellow}
                    />
                </Typography>
            </Box>

            <Stack spacing="2.56rem" sx={{ pl: "1.44rem", pr: "1.84rem", pt: "2rem", pb: "1.6rem", backgroundColor: "#FFFFFF05" }}>
                {multiplierList && multiplierList.length > 0 ? (
                    <Stack spacing="3.5rem" sx={{ pl: ".8rem" }}>
                        <Stack spacing="1.2rem">
                            <Typography
                                variant="h6"
                                sx={{
                                    color: colors.neonBlue,
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                MULTIPLIERS
                            </Typography>

                            {multiplierList.map((m, index) => {
                                const deets = getMutiplierDeets(m.key)
                                return (
                                    <TooltipHelper key={`${m.key}-${index}`} placement="right" text={m.description}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: ".8rem" }}>
                                            <StyledImageText
                                                color={colors.text}
                                                imageBorderColor="#FFFFFF60"
                                                imageBackgroundColor="#FFFFFF"
                                                text={m.key.toUpperCase()}
                                                imageUrl={deets.image}
                                                variant="h6"
                                                imageSize={2.9}
                                                imageBorderThickness=".2rem"
                                                fontWeight="normal"
                                                truncateLine
                                                imageMb={-0.8}
                                            />
                                            <Typography variant="h6">{m.value}x</Typography>
                                        </Stack>
                                    </TooltipHelper>
                                )
                            })}

                            <Divider sx={{ py: ".24rem", borderColor: "#FFFFFF", opacity: 0.1 }} />

                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                    TOTAL:{" "}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: "fontWeightBold", color: colors.yellow }}>
                                    {totalMultiplierValue}x
                                </Typography>
                            </Stack>
                        </Stack>

                        {/* {multiplicative && multiplicative.length > 0 && (
                            <Stack spacing="1.2rem">
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: colors.neonBlue,
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    BONUSES
                                </Typography>

                                {multiplicative.map((m) => {
                                    const deets = getMutiplierDeets(m.key)
                                    return (
                                        <TooltipHelper key={m.key} placement="right" text={m.description}>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: ".8rem" }}>
                                                <StyledImageText
                                                    color={colors.text}
                                                    imageBorderColor="#FFFFFF60"
                                                    imageBackgroundColor="#FFFFFF"
                                                    text={m.key.toUpperCase()}
                                                    imageUrl={deets.image}
                                                    variant="h6"
                                                    imageSize={2.9}
                                                    imageBorderThickness=".2rem"
                                                    fontWeight="normal"
                                                    truncateLine
                                                    imageMb={-0.8}
                                                />
                                                <Typography variant="h6">{parseInt(m.value) * 100}%</Typography>
                                            </Stack>
                                        </TooltipHelper>
                                    )
                                })}

                                <Divider sx={{ py: ".24rem", borderColor: "#FFFFFF", opacity: 0.1 }} />

                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                        SUBTOTAL:{" "}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: "fontWeightBold", color: colors.yellow }}>
                                        {totalMultiplicativeValue * 100}%
                                    </Typography>
                                </Stack>
                            </Stack>
                        )} */}

                        {/* <Stack spacing="1.2rem">
                            <Typography
                                variant="h6"
                                sx={{
                                    color: colors.neonBlue,
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                TOTAL MULTIPLIERS
                            </Typography>

                            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold", span: { color: colors.yellow } }}>
                                {multiplicative && multiplicative.length > 0 ? (
                                    <>
                                        <span>{totalMultiplierValue}x</span> x <span>{totalMultiplicativeValue * 100}%</span> ={" "}
                                        <span>{battle_multipliers.battles[0].total_multipliers}</span>
                                    </>
                                ) : (
                                    <span>{battle_multipliers.battles[0].total_multipliers}x</span>
                                )}
                            </Typography>
                        </Stack> */}
                    </Stack>
                ) : (
                    <Typography variant="h6" sx={{ pl: ".8rem", opacity: 0.8 }}>
                        {"You didn't get any multipliers."} Multipliers are awarded to players who participate in the battle.
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}
