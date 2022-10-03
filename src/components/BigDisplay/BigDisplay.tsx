import { Box } from "@mui/material"
import { useMemo } from "react"
import { useUI } from "../../containers"
import { siteZIndex } from "../../theme/theme"
import { UpcomingBattle } from "../UpcomingBattle/UpcomingBattle"
import { MiniMapNew } from "./MiniMapNew/MiniMapNew"
import { Stream } from "./Stream/Stream"

export const BigDisplay = () => {
    const { setBigDisplayRef, showUpcomingBattle } = useUI()

    return useMemo(() => {
        return (
            <>
                {showUpcomingBattle && (
                    <Box sx={{ position: "relative", height: "100%", width: "100%", zIndex: siteZIndex.Modal }}>
                        <UpcomingBattle />
                    </Box>
                )}

                <Box ref={setBigDisplayRef} sx={{ position: "relative", width: "100%", height: "100%" }}>
                    {/* One of the stream and minimap will mount itself to the left drawer, not both are rendered here */}
                    <Stream />
                    <MiniMapNew />
                </Box>
            </>
        )
    }, [setBigDisplayRef, showUpcomingBattle])
}
