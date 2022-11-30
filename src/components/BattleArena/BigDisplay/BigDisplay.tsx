import { Box, Fade } from "@mui/material"
import { useMemo } from "react"
import { useGame, useUI } from "../../../containers"
import { siteZIndex } from "../../../theme/theme"
import { BattleIntro } from "./BattleIntro/BattleIntro"
import { MiniMapNew } from "./MiniMapNew/MiniMapNew"
import { Stream } from "./Stream/Stream"

export const BigDisplay = () => {
    const { setBigDisplayRef } = useUI()
    const { nextBattle } = useGame()

    return useMemo(() => {
        return (
            <>
                <Fade in={!!nextBattle}>
                    <Box
                        sx={{
                            zIndex: siteZIndex.Modal,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            overflowY: "auto",
                        }}
                    >
                        {nextBattle && <BattleIntro currentBattle={nextBattle} />}
                    </Box>
                </Fade>

                <Box ref={setBigDisplayRef} sx={{ position: "relative", width: "100%", height: "100%" }}>
                    {/* One of the stream and minimap will mount itself to the left drawer, not both are rendered here */}
                    <Stream />
                    <MiniMapNew />
                </Box>
            </>
        )
    }, [nextBattle, setBigDisplayRef])
}
