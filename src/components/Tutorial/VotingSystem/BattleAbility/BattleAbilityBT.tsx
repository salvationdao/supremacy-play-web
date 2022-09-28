import { Box } from "@mui/material"
import { useEffect, useRef } from "react"
import { useAuth, useGame, useTraining } from "../../../../containers"
import { glowEffect } from "../../../../theme/keyframes"
import { BattleAbilityHighlight } from "../../../../types"
import { SectionCollapsibleBT } from "../../SectionCollapsibleBT"
import { BattleAbilityCountdownBT } from "./BattleAbilityCountdownBT"
import { BattleAbilityItemBT } from "./BattleAbilityItemBT"

export const BattleAbilityBT = () => {
    const { factionID } = useAuth()
    const { bribeStage, trainingStage, setTutorialRef } = useTraining()

    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (trainingStage in BattleAbilityHighlight) setTutorialRef(ref)
    }, [trainingStage, setTutorialRef])
    if (!bribeStage) return null

    return (
        <Box
            ref={ref}
            sx={{
                position: "relative",
                animation: trainingStage in BattleAbilityHighlight ? (theme) => `${glowEffect(`${theme.factionTheme.primary}80`)} 2s infinite` : "unset",
            }}
        >
            <SectionCollapsibleBT
                label={<BattleAbilityCountdownBT bribeStage={bribeStage} />}
                tooltip="Opt into battle abilities and fight for your Faction!"
                initialExpanded={true}
                localStoragePrefix="battleAbility"
            >
                <BattleAbilityItemBT key={factionID} />
            </SectionCollapsibleBT>
        </Box>
    )
}
