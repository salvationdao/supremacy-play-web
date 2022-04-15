import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo } from "react"
import { TooltipHelper } from "../.."
import { getMutiplierDeets } from "../../../helpers"
import { useTimer } from "../../../hooks"
import { Multiplier } from "../../../types"

export const MultiplierItem = ({
    multiplier,
}: {
    multiplier: Multiplier
}) => {
    const multiplierDeets = useMemo(() => getMutiplierDeets(multiplier.key), [multiplier])

    // const startTime =
    //     battleEndTime && battleEndTime.getTime() != multipliersStartTime.getTime()
    //         ? new Date(new Date().getTime() - battleEndTime.getTime() + multipliersStartTime.getTime())
    //         : multipliersStartTime
    // const endTime = new Date(startTime.getTime() + multiplier.expires_in_seconds * 1000)

    // if (new Date().getTime() > endTime.getTime()) return null

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

            {/*<Stack*/}
            {/*    alignItems="center"*/}
            {/*    justifyContent="center"*/}
            {/*    sx={{ minWidth: 50, ml: ".6rem", alignSelf: "stretch", background: "#00000075", borderRadius: 1 }}*/}
            {/*>*/}
            {/*    /!*<Typography sx={{ textAlign: "center", lineHeight: 1, color: "grey !important" }} variant="caption">*!/*/}
            {/*    /!*    <TimeLeft endTime={endTime} battleEndTime={battleEndTime} />*!/*/}
            {/*    /!*</Typography>*!/*/}
            {/*</Stack>*/}
        </Stack>
    )
}

