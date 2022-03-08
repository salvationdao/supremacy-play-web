import { Box, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { SupsMultiplier, TooltipHelper } from "../.."
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
    MultiplierFiend,
    MultiplierJunkE,
    MultiplierMechHead,
    MultiplierSniper,
    MultiplierWonBattle,
    MultiplierWonLastThreeBattles,
} from "../../../assets"
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

const getMutiplierDeets = (multiplierKey: string): { image: string; description: string } => {
    let image
    let description

    switch (multiplierKey.toLowerCase()) {
        case "citizen":
            image = MultiplierCitizen
            description = "When a player is within the top 80% of voting average."
            break
        case "supporter":
            image = MultiplierSupporter
            description = "When a player is within the top 50% of voting average."
            break
        case "contributor":
            image = MultiplierSuperContributor
            description = "When a player is within the top 75% of voting average."
            break
        case "super contributor":
            image = MultiplierContributor
            description = "When a player is within the top 10% of voting average."
            break
        case "a fool and his money":
            image = MultiplierAFoolAndHisMoney
            description = "For a player who has put the most individual SUPS in to vote but still lost."
            break
        case "air support":
            image = MultiplierAirSupport
            description = "For a player who won an airstrike."
            break
        case "now i am become death":
            image = MultiplierNowIAmBecomeDeath
            description = "For a player who won a nuke."
            break
        case "destroyer of worlds":
            image = MultiplierDestroyerOfWorlds
            description = "For a player who has won the previous three nukes."
            break
        case "grease monkey":
            image = MultiplierGreaseMonkey
            description = "For a player who won a repair drop."
            break
        case "field mechanic":
            image = MultiplierFieldMechanic
            description = "For a player who has won the previous three repair drops."
            break
        case "combo breaker":
            image = MultiplierFieldMechanic
            description = "For a player who wins the vote for their syndicate after it has lost the last three rounds."
            break
        case "mech commander":
            image = MultiplierMechCommander
            description = "When a player's mech wins the battles."
            break
        case "admiral":
            image = MultiplierAdmiral
            description = "When a player's mech wins the last 3 battles."
            break
        case "fiend":
            image = MultiplierFiend
            description = "3 hours of active playing."
            break
        case "juke-e":
            image = MultiplierJunkE
            description = "6 hours of active playing."
            break
        case "mech head":
            image = MultiplierMechHead
            description = "10 hours of active playing."
            break
        case "sniper":
            image = MultiplierSniper
            description = "For a player who has won the vote by dropping in big."
            break
        case "won battle":
            image = MultiplierWonBattle
            description = "When a player's syndicate has won the last."
            break
        case "won last three battles":
            image = MultiplierWonLastThreeBattles
            description = "When a player's syndicate has won the last 3 battles."
            break
        case "offline":
        case "applause":
        case "picked location":
        case "battlerewardupdate":
        case "supsmultiplierget":
        case "checkmultiplierupdate":
        case "supstick":
        default:
            image = MultiplierCitizen
            description = multiplierKey
            break
    }

    return { image, description }
}
