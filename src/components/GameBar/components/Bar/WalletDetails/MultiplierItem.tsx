import { Stack, Typography } from "@mui/material"
import { useState } from "react"
import { SupsMultiplier } from "../.."
import { useInterval } from "../../../hooks/useInterval"

export const MultiplierItem = ({
    supsMultiplier,
    selfDestroyed,
}: {
    supsMultiplier: SupsMultiplier
    selfDestroyed: (key: string) => void
}) => {
    const getRemainSecond = (date: Date): number => {
        return Math.floor((supsMultiplier.expiredAt.getTime() - new Date().getTime()) / 1000)
    }

    const [timeRemain, setTimeRemain] = useState<number>(getRemainSecond(supsMultiplier.expiredAt))
    useInterval(() => {
        const t = getRemainSecond(supsMultiplier.expiredAt)
        if (t <= 0) {
            selfDestroyed(supsMultiplier.key)
        }
        setTimeRemain(getRemainSecond(supsMultiplier.expiredAt))
    }, 1000)

    const keyTitle = (key: string) => {
        const index = supsMultiplier.key.indexOf("_")
        if (index === -1) return key
        return key.substring(0, index)
    }

    if (timeRemain <= 0) return null

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ fontFamily: "Share Tech", flex: 1 }} variant="body2">
                &#8226; {keyTitle(supsMultiplier.key).toUpperCase()}:
            </Typography>

            <Typography sx={{ fontFamily: "Share Tech", minWidth: 25, textAlign: "end" }} variant="body2">
                +{supsMultiplier.value}x
            </Typography>

            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ minWidth: 50, alignSelf: "stretch", background: "#00000075", borderRadius: 1 }}
            >
                <Typography
                    sx={{ fontFamily: "Share Tech", textAlign: "center", lineHeight: 1, color: "grey !important" }}
                    variant="caption"
                >
                    {supsMultiplier.key !== "Online" ? `${timeRemain}s` : "∞"}
                </Typography>
            </Stack>
        </Stack>
    )
}
