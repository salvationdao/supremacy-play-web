import { Box, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { SupsMultiplier } from "../.."
import {
    MultiplierAdmiral,
    MultiplierAFoolAndHisMoney,
    MultiplierAirSupport,
    MultiplierCitizen,
    MultiplierContributor,
    MultiplierDestroyerOfWorlds,
    MultiplierFieldMechanic,
    MultiplierGreaseMonkey,
    MultiplierMechCommander,
    MultiplierNowIAmBecomeDeath,
    MultiplierSuperContributor,
    MultiplierSupporter,
} from "../../../assets"
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
            <Stack direction="row" spacing={0.5} sx={{ flex: 1 }}>
                <Box
                    sx={{
                        mt: "-0.8px !important",
                        width: 20,
                        height: 20,
                        flexShrink: 0,
                        backgroundImage: `url(${getMutiplierImage(supsMultiplier.key)})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        borderRadius: 0.8,
                        border: "#FFFFFF60 1px solid",
                    }}
                />
                <Typography sx={{ fontFamily: "Share Tech" }} variant="body2">
                    {keyTitle(supsMultiplier.key).toUpperCase()}:
                </Typography>
            </Stack>

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
                    {timeRemain < 86400 ? `${timeRemain}s` : "∞"}
                </Typography>
            </Stack>
        </Stack>
    )
}

const getMutiplierImage = (multiplierKey: string) => {
    let image

    switch (multiplierKey) {
        case "Citizen":
            image = MultiplierCitizen
            break
        case "Supporter":
            image = MultiplierSupporter
            break
        case "Contributor":
            image = MultiplierSuperContributor
            break
        case "Super Contributor":
            image = MultiplierContributor
            break
        case "A fool and his money":
            image = MultiplierAFoolAndHisMoney
            break
        case "Air Support":
            image = MultiplierAirSupport
            break
        case "Now I am become Death":
            image = MultiplierNowIAmBecomeDeath
            break
        case "Destroyer of worlds":
            image = MultiplierDestroyerOfWorlds
            break
        case "Grease Monkey":
            image = MultiplierGreaseMonkey
            break
        case "Field Mechanic":
            image = MultiplierFieldMechanic
            break
        case "Mech Commander":
            image = MultiplierMechCommander
            break
        case "Admiral":
            image = MultiplierAdmiral
            break

        case "Online":
        case "Offline":
        case "Applause":
        case "Picked Location":
        case "BattleRewardUpdate":
        case "SupsMultiplierGet":
        case "CheckMultiplierUpdate":
        case "SupsTick":
        default:
            image = MultiplierCitizen
            break
    }

    return image
}
