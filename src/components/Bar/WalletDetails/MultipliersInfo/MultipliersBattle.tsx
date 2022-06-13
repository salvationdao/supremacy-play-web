import { Box, Button, Collapse, Stack, Typography } from "@mui/material"
import { SvgExpandLessIcon, SvgExpandMoreIcon } from "../../../../assets"
import { MultiplierItem } from "../../.."
import { colors } from "../../../../theme/theme"
import { BattleMultipliers } from "../../../../types"
import { useState } from "react"
import { useToggle } from "../../../../hooks"

export const MultipliersBattle = ({ bm }: { bm: BattleMultipliers }) => {
    const [open, toggleOpen] = useToggle()
    const [multiplierList] = useState(bm.multipliers.filter((m) => !m.is_multiplicative))
    const [multiplicative] = useState(bm.multipliers.filter((m) => m.is_multiplicative))
    const [total1] = useState(multiplierList.reduce((acc, m) => acc + Math.round(parseFloat(m.value) * 10) / 10, 0))
    const [total2] = useState(multiplicative.reduce((acc, m) => acc + Math.round(parseFloat(m.value) * 10) / 10, 0))
    const [totalMultipliers] = useState(total1 * (total2 || 1))

    return (
        <Box>
            <Button
                fullWidth
                onClick={() => toggleOpen()}
                sx={{
                    px: "1.2rem",
                    border: `#FFFFFF30 1px dashed`,
                    borderRadius: 0.2,
                    ":hover": {
                        border: `#FFFFFF60 1px dashed`,
                    },
                }}
            >
                <Stack direction="row" alignItems="center" sx={{ flex: 1 }}>
                    <Typography
                        sx={{
                            fontWeight: "bold",
                            color: colors.offWhite,
                            span: { color: colors.yellow },
                        }}
                    >
                        BATTLE: <span>#{bm.battle_number}</span>
                    </Typography>
                    <Typography
                        sx={{
                            ml: "1.2rem",
                            fontWeight: "bold",
                            color: colors.offWhite,
                            span: { color: colors.yellow },
                        }}
                    >
                        MULTIPLIERS: <span>{totalMultipliers}x</span>
                    </Typography>
                    {open ? <SvgExpandLessIcon size="1.5rem" sx={{ ml: "auto" }} /> : <SvgExpandMoreIcon size="1.5rem" sx={{ ml: "auto" }} />}
                </Stack>
            </Button>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box
                    sx={{
                        maxHeight: "16rem",
                        ml: "1rem",
                        mr: ".5rem",
                        pr: ".5rem",
                        my: ".8rem",
                        overflowY: "auto",
                        overflowX: "hidden",
                        direction: "ltr",

                        "::-webkit-scrollbar": {
                            width: ".4rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                            borderRadius: 3,
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: "#FFFFFF96",
                            borderRadius: 3,
                        },
                    }}
                >
                    <Stack spacing="1.2rem">
                        <Stack spacing=".2rem">
                            <Stack spacing=".32rem">
                                {multiplierList.map((m, i) => (
                                    <MultiplierItem key={i} multiplier={m} />
                                ))}
                            </Stack>
                        </Stack>

                        {multiplicative && multiplicative.length > 0 && (
                            <Stack spacing=".2rem">
                                <Typography sx={{ color: "grey !important" }}>BONUSES</Typography>
                                <Stack spacing=".32rem">
                                    {multiplicative.map((m, i) => (
                                        <MultiplierItem key={i} multiplier={m} />
                                    ))}
                                </Stack>
                            </Stack>
                        )}
                    </Stack>
                </Box>
            </Collapse>
        </Box>
    )
}
