import { Box } from "@mui/material"
import { useAuth, useGame } from "../../../../containers"
import { SectionCollapsible } from "../Common/SectionCollapsible"
import { BattleAbilityCountdown } from "./BattleAbilityCountdown"
import { BattleAbilityItem } from "./BattleAbilityItem"

export const BattleAbility = () => {
    const { factionID } = useAuth()
    const { bribeStage, isBattleStarted, isAIDrivenMatch } = useGame()

    if (!bribeStage) return null

    return (
        <Box sx={{ position: "relative" }}>
            <SectionCollapsible
                label={isAIDrivenMatch ? "BATTLE ABILITY" : <BattleAbilityCountdown bribeStage={bribeStage} />}
                tooltip="Opt into battle abilities and fight for your Faction!"
                initialExpanded={true}
                localStoragePrefix="battleAbility"
            >
                <Box sx={{ pointerEvents: isBattleStarted ? "all" : "none" }}>
                    <BattleAbilityItem key={factionID} />
                </Box>

                {(isAIDrivenMatch || !isBattleStarted) && (
                    <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#000000AA" }} />
                )}
            </SectionCollapsible>
        </Box>
    )
}
