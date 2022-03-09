import { Box, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { SupsMultiplier, TooltipHelper } from "../.."
import { getMutiplierDeets } from "../../../helpers"
import { useInterval } from "../../../hooks"

export const MultiplierItem = ({
    supsMultiplier,
    selfDestroyed,
}: {
    supsMultiplier: SupsMultiplier
    selfDestroyed: (key: string) => void
}) => {
    const getRemainSecond = (date: Date): number => {
        return Math.floor((supsMultiplier.expired_at.getTime() - new Date().getTime()) / 1000)
    }

    const [timeRemain, setTimeRemain] = useState<number>(getRemainSecond(supsMultiplier.expired_at))
    useInterval(() => {
        const t = getRemainSecond(supsMultiplier.expired_at)
        if (t <= 0) {
            selfDestroyed(supsMultiplier.key)
        }
        setTimeRemain(getRemainSecond(supsMultiplier.expired_at))
    }, 1000)

    const keyTitle = (key: string) => {
        const index = supsMultiplier.key.indexOf("_")
        if (index === -1) return key
        return key.substring(0, index)
    }

    if (timeRemain <= 0) return null

    const multiplierDeets = getMutiplierDeets(keyTitle(supsMultiplier.key))

    return (
        <TooltipHelper text={multiplierDeets.description} placement="left">
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
                    <Typography variant="body1">{keyTitle(supsMultiplier.key).toUpperCase()}:</Typography>
                </Stack>

                <Typography sx={{ minWidth: 25, textAlign: "end" }} variant="body2">
                    +{supsMultiplier.value}x
                </Typography>

                <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ minWidth: 50, alignSelf: "stretch", background: "#00000075", borderRadius: 1 }}
                >
                    <Typography sx={{ textAlign: "center", lineHeight: 1, color: "grey !important" }} variant="caption">
                        {timeRemain < 86400 ? `${timeRemain}s` : "∞"}
                    </Typography>
                </Stack>
            </Stack>
        </TooltipHelper>
    )
}
