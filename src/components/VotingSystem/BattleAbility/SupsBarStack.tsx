import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { BattleAbilityProgressBigNum, ContributionBar } from "../.."
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { FactionsAll } from "../../../containers"
import { zoomEffect } from "../../../theme/keyframes"

interface SubsBarStackProps {
    battleAbilityProgress: BattleAbilityProgressBigNum[]
    factionsAll: FactionsAll
    forceDisplay100Percentage: string
}

export const SupsBarStack = ({ battleAbilityProgress, factionsAll, forceDisplay100Percentage }: SubsBarStackProps) => {
    const progressBars = useMemo(() => {
        if (!battleAbilityProgress || !Array.isArray(battleAbilityProgress) || battleAbilityProgress.length === 0) {
            return null
        }
        return battleAbilityProgress.map((a) => {
            return <SupsBar key={a.faction_id} forceDisplay100Percentage={forceDisplay100Percentage} factionsAll={factionsAll} abilityProgress={a} />
        })
    }, [factionsAll, battleAbilityProgress, forceDisplay100Percentage])

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
    factionsAll: FactionsAll
    abilityProgress: BattleAbilityProgressBigNum
}

const SupsBar = ({ forceDisplay100Percentage, factionsAll, abilityProgress }: SupsBarProps) => {
    const { faction_id, sups_cost, current_sups } = abilityProgress
    const primaryColor = useMemo(() => factionsAll[faction_id]?.theme.primary, [factionsAll])

    return (
        <Stack key={faction_id} spacing=".96rem" direction="row" alignItems="center">
            <Box
                sx={{
                    height: "1.6rem",
                    width: "1.6rem",
                    backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionsAll[faction_id]?.logo_blob_id})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundColor: primaryColor,
                    border: `${primaryColor} 1px solid`,
                    borderRadius: 0.6,
                    mb: ".24rem",
                }}
            />
            <ContributionBar
                color={primaryColor}
                initialTargetCost={sups_cost}
                currentSups={current_sups}
                supsCost={sups_cost}
                hideRedBar
                forceHundredPercent={forceDisplay100Percentage === faction_id}
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
