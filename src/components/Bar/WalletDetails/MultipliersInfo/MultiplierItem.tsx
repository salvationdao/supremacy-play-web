import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { TooltipHelper } from "../../.."
import { getMutiplierDeets } from "../../../../helpers"
import { Multiplier } from "../../../../types"

export const MultiplierItem = ({ multiplier }: { multiplier: Multiplier }) => {
    const multiplierDeets = useMemo(() => getMutiplierDeets(multiplier.key), [multiplier.key])

    return (
        <Stack direction="row" alignItems="center">
            <Stack direction="row" spacing=".4rem" sx={{ flex: 1, mr: "1.6rem" }}>
                <TooltipHelper text={multiplier.description} placement="left">
                    <Box
                        sx={{
                            width: "2rem",
                            height: "2rem",
                            flexShrink: 0,
                            backgroundImage: `url(${multiplierDeets.image})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                            borderRadius: 0.8,
                            border: "#FFFFFF80 1px solid",
                        }}
                    />
                </TooltipHelper>
                <Typography variant="body1" sx={{ pt: ".1rem" }}>
                    {multiplier.key.toUpperCase()}
                </Typography>
            </Stack>

            <Typography sx={{ minWidth: "2.5rem", textAlign: "center", ml: "auto" }} variant="body1">
                {multiplier.is_multiplicative ? `${parseInt(multiplier.value) * 100}%` : `${multiplier.value}x`}
            </Typography>
        </Stack>
    )
}
