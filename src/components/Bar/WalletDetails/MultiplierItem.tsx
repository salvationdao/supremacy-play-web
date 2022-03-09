import { Box, Stack, Typography } from "@mui/material"
import { TooltipHelper } from "../.."
import { getMutiplierDeets } from "../../../helpers"

export const MultiplierItem = ({ multiplier }: { multiplier: { key: string; value: string; description: string } }) => {
    const multiplierDeets = getMutiplierDeets(multiplier.key)

    return (
        <TooltipHelper text={multiplier.description} placement="left">
            <Stack direction="row" alignItems="center" spacing={2}>
                <Stack direction="row" spacing={0.5} sx={{ flex: 1 }}>
                    <Box
                        sx={{
                            mt: "-0.8px !important",
                            width: 20,
                            height: 20,
                            flexShrink: 0,
                            backgroundImage: `url(${multiplierDeets.image})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                            borderRadius: 0.8,
                            border: "#FFFFFF60 1px solid",
                        }}
                    />
                    <Typography variant="body1">{multiplier.key.toUpperCase()}:</Typography>
                </Stack>

                <Typography sx={{ minWidth: 25, textAlign: "end" }} variant="body2">
                    {multiplier.value}
                </Typography>
            </Stack>
        </TooltipHelper>
    )
}
