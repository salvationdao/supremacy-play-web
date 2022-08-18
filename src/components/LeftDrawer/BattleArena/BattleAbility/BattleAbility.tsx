import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { useAuth, useGame } from "../../../../containers"
import { BattleAbilityCountdown } from "./BattleAbilityCountdown"
import { BattleAbilityItem } from "./BattleAbilityItem"

export const BattleAbility = () => {
    const { factionID } = useAuth()
    const { bribeStage } = useGame()
    const isBattleStarted = useMemo(() => bribeStage && bribeStage.phase !== "HOLD", [bribeStage])

    if (!bribeStage) return null

    return (
        <Box sx={{ position: "relative" }}>
            <BattleAbilityCountdown bribeStage={bribeStage} />
            <Stack
                spacing="1rem"
                sx={{
                    pointerEvents: isBattleStarted ? "all" : "none",
                    p: "1.5rem 1.1rem",
                    backgroundColor: "#FFFFFF12",
                    boxShadow: 2,
                    border: "#FFFFFF20 1px solid",
                }}
            >
                <BattleAbilityItem key={factionID} />
            </Stack>

            {!isBattleStarted && <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#000000AA" }} />}
        </Box>
    )
}
