import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { BattleAbilityProgressBigNum } from "../.."
import { zoomEffect } from "../../../theme/keyframes"
import { Faction } from "../../../types"
import { ProgressBar } from "../../Common/ProgressBar"

interface SubsBarStackProps {
    battleAbilityProgress: BattleAbilityProgressBigNum[]
    getFaction: (factionID: string) => Faction
    forceDisplay100Percentage: string
}

export const SupsBarStack = ({ battleAbilityProgress, getFaction, forceDisplay100Percentage }: SubsBarStackProps) => {
    const progressBars = useMemo(() => {
        if (!battleAbilityProgress || !Array.isArray(battleAbilityProgress) || battleAbilityProgress.length === 0) {
            return null
        }
        return battleAbilityProgress.map((a) => {
            return <SupsBar key={a.faction_id} forceDisplay100Percentage={forceDisplay100Percentage} getFaction={getFaction} abilityProgress={a} />
        })
    }, [getFaction, battleAbilityProgress, forceDisplay100Percentage])

    if (!progressBars || progressBars.length <= 0) return null

    return (
        <Stack
            spacing=".4rem"
            sx={{
                width: "100%",
                px: "1.2rem",
                py: ".96rem",
                backgroundColor: "#00000030",
                borderRadius: 1,
            }}
        >
            {progressBars}
        </Stack>
    )
}

interface SupsBarProps {
    forceDisplay100Percentage: string
    getFaction: (factionID: string) => Faction
    abilityProgress: BattleAbilityProgressBigNum
}

const SupsBar = ({ forceDisplay100Percentage, getFaction, abilityProgress }: SupsBarProps) => {
    const { faction_id, sups_cost, current_sups } = abilityProgress
    const primaryColor = useMemo(() => getFaction(faction_id).primary_color, [faction_id, getFaction])

    return (
        <Stack key={faction_id} spacing=".96rem" direction="row" alignItems="center">
            <Box
                sx={{
                    height: "1.6rem",
                    width: "1.6rem",
                    backgroundImage: `url(${getFaction(faction_id).logo_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundColor: primaryColor,
                    border: `${primaryColor} 1px solid`,
                    borderRadius: 0.6,
                    mb: ".24rem",
                }}
            />
            <ProgressBar
                percent={forceDisplay100Percentage ? 100 : sups_cost.isZero() ? 0 : +current_sups.dividedBy(sups_cost) * 100}
                linePercent={sups_cost.isZero() ? 0 : sups_cost.dividedBy(sups_cost).toNumber() * 100}
                color={primaryColor}
                backgroundColor="#FFFFFF10"
                thickness=".7rem"
                orientation="horizontal"
            />

            <Stack direction="row" alignItems="center" justifyContent="center" style={{ minWidth: "11rem" }}>
                <Typography
                    key={`currentSups-${current_sups.toFixed()}`}
                    variant="body2"
                    style={{
                        lineHeight: 1,
                        color: `${primaryColor} !important`,
                        animation: `${zoomEffect(1.2)} 300ms ease-out`,
                    }}
                >
                    {forceDisplay100Percentage === faction_id ? sups_cost.toFixed(2) : current_sups.toFixed(2)}
                </Typography>
                <Typography
                    variant="body2"
                    style={{
                        lineHeight: 1,
                        color: `${primaryColor} !important`,
                    }}
                >
                    &nbsp;/&nbsp;
                </Typography>
                <Typography
                    key={`supsCost-${sups_cost.toFixed()}`}
                    variant="body2"
                    style={{
                        lineHeight: 1,
                        color: `${primaryColor} !important`,
                        animation: `${zoomEffect(1.2)} 300ms ease-out`,
                    }}
                >
                    {sups_cost.toFixed(2)}
                </Typography>
                <Typography
                    variant="body2"
                    style={{
                        lineHeight: 1,
                        color: `${primaryColor} !important`,
                    }}
                >
                    &nbsp;SUP{sups_cost.eq(1) ? "" : "S"}
                </Typography>
            </Stack>
        </Stack>
    )
}
