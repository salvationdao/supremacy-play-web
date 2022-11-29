import { Box } from "@mui/material"
import { useMemo } from "react"
import { useGame, useUI } from "../../../containers"
import { siteZIndex } from "../../../theme/theme"
import { BattleState } from "../../../types"
import { UpcomingBattle } from "../UpcomingBattle/UpcomingBattle"
import { BattleIntro } from "./BattleIntro"
import { MiniMapNew } from "./MiniMapNew/MiniMapNew"
import { Stream } from "./Stream/Stream"

export const BigDisplay = () => {
    const { setBigDisplayRef } = useUI()
    const { nextBattle, battleState } = useGame()

    return useMemo(() => {
        return (
            <>
                {battleState === BattleState.IntroState && nextBattle && (
                    <Box sx={{ position: "relative", height: "100%", width: "100%", zIndex: siteZIndex.Modal }}>
                        <BattleIntro currentBattle={nextBattle} />
                    </Box>
                )}

                {nextBattle && (
                    <Box sx={{ position: "relative", height: "100%", width: "100%", zIndex: siteZIndex.Modal }}>
                        <UpcomingBattle nextBattle={nextBattle} />
                    </Box>
                )}

                <Box ref={setBigDisplayRef} sx={{ position: "relative", width: "100%", height: "100%" }}>
                    {/* One of the stream and minimap will mount itself to the left drawer, not both are rendered here */}
                    <Stream />
                    <MiniMapNew />
                </Box>
            </>
        )
    }, [battleState, nextBattle, setBigDisplayRef])
}
