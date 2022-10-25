import { Box, Drawer, Fade } from "@mui/material"
import { useMemo } from "react"
import { useAuth, useUI } from "../../containers"
import { colors, siteZIndex } from "../../theme/theme"
import { UpcomingBattle } from "../UpcomingBattle/UpcomingBattle"
import { MiniMapNew } from "./MiniMapNew/MiniMapNew"
import { Stream } from "./Stream/Stream"
import { DRAWER_TRANSITION_DURATION } from "../../constants"
import { LEFT_DRAWER_WIDTH } from "../LeftDrawer/LeftDrawer"
import { LEFT_DRAWER_ARRAY } from "../../routes"
import { QuickDeploy } from "../LeftDrawer/QuickDeploy/QuickDeploy"

export const BigDisplay = () => {
    const { setBigDisplayRef, showUpcomingBattle } = useUI()

    return useMemo(() => {
        return (
            <>
                {showUpcomingBattle && (
                    <Box sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: siteZIndex.Modal }}>
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
