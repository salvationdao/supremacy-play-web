import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { useTraining } from "../../../../containers"
import { PlayerAbilitiesBT } from "../../PlayerAbilities/PlayerAbilitiesBT"
import { QuickPlayerAbilitiesBT } from "../../QuickPlayerAbilities/QuickPlayerAbilitiesBT"
import { BattleAbilityBT } from "../../VotingSystem/BattleAbility/BattleAbilityBT"

export const BattleArenaBT = () => {
    const { setSmallDisplayRef } = useTraining()

    const content = useMemo(() => {
        return (
            <>
                {/* The minimap or the stream will mount here */}
                <Box ref={setSmallDisplayRef} sx={{ flexShrink: 0, position: "relative", mb: "1rem" }} />

                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        my: ".5rem",
                        mr: ".8rem",
                        pr: ".8rem",
                        pl: "1rem",
                        direction: "ltr",
                    }}
                >
                    <Box sx={{ direction: "ltr", height: 0 }}>
                        <Stack gap="1rem">
                            <BattleAbilityBT />
                            <PlayerAbilitiesBT />
                            <QuickPlayerAbilitiesBT />
                        </Stack>
                    </Box>
                </Box>
            </>
        )
    }, [setSmallDisplayRef])

    return useMemo(() => {
        return (
            <Stack spacing="1rem" sx={{ position: "relative", height: "100%", backgroundColor: (theme) => theme.factionTheme.background }}>
                {content}
            </Stack>
        )
    }, [content])
}
