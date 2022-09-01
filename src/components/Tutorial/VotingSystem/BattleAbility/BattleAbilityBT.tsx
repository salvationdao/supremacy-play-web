import { Box } from "@mui/material"
import { useEffect, useRef } from "react"
import { useAuth, useTraining } from "../../../../containers"
import { TrainingVotingSystem } from "../../../../types"
import { SectionCollapsibleBT } from "../../SectionCollapsibleBT"
import { BattleAbilityCountdownBT } from "./BattleAbilityCountdownBT"
import { BattleAbilityItemBT } from "./BattleAbilityItemBT"

export const BattleAbilityBT = () => {
    const { factionID } = useAuth()
    const { bribeStage, trainingStage, setTutorialRef } = useTraining()

    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (trainingStage in TrainingVotingSystem) setTutorialRef(ref)
    }, [trainingStage, setTutorialRef])
    if (!bribeStage) return null

    return (
        <Box ref={ref} sx={{ position: "relative" }}>
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
