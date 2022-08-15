import { Box, Stack } from "@mui/material"
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
        <Box>
            <SectionHeading label="VOTING" />
            <Stack
                spacing="1rem"
                sx={{
                    pointerEvents: isBattleStarted ? "all" : "none",
                    opacity: isBattleStarted ? 1 : 0.5,
                    p: "1.5rem 1.1rem",
                    backgroundColor: "#FFFFFF12",
                    boxShadow: 2,
                    border: "#FFFFFF20 1px solid",
                }}
            >
                <BattleAbilityItem key={factionID} />
                <PlayerAbilities />
            </Stack>
        </Box>
    )
}
