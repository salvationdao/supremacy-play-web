import { Stack } from "@mui/material"
import { useMemo } from "react"
import { BattleAbilityItem } from "../../.."
import { useAuth, useGame } from "../../../../containers"
import { SectionHeading } from "../Common/SectionHeading"
import { PlayerAbilities } from "./PlayerAbilities/PlayerAbilities"

export const VotingSystem = () => {
    const { factionID } = useAuth()
    const { bribeStage } = useGame()
    const isBattleStarted = useMemo(() => bribeStage && bribeStage.phase !== "HOLD", [bribeStage])

    if (!bribeStage) return null

    return (
        <Stack spacing="2rem">
            <SectionHeading label="VOTING" />
            <Stack spacing="1rem">
                <BattleAbilityItem key={factionID} />
                <PlayerAbilities />
            </Stack>
        </Stack>
    )
}
