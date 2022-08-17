import { Box } from "@mui/material"
import { useOverlayToggles, useStream } from "../../../containers"
import { siteZIndex } from "../../../theme/theme"
import { StreamService } from "../../../types"
import { AntMediaStream } from "./AntMediaStream"
import { NoStreamScreen } from "./NoStreamScreen"
import { OvenplayerStream } from "./OvenPlayerStream"
import { SLPDStream } from "./SLPDStream"
import { Trailer } from "./Trailer"

export const Stream = () => {
    const { showTrailer } = useOverlayToggles()
    const { currentStream } = useStream()

    const isGreenScreen = localStorage.getItem("greenScreen") === "true"

    if (showTrailer) {
        return <Trailer />
    }

    if (isGreenScreen) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    backgroundColor: "green",
                    zIndex: siteZIndex.Stream + 1,
                }}
            />
        )
    }

    if (currentStream?.service === StreamService.OvenMediaEngine) {
        return <OvenplayerStream />
    }

    if (currentStream?.service === StreamService.Softvelum) {
        return <SLPDStream />
    }

    if (currentStream?.service === StreamService.AntMedia) {
        return <AntMediaStream />
    }

    return <NoStreamScreen />
}
