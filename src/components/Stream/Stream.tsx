import { Box } from "@mui/material"
import { useTour } from "@reactour/tour"
import { useStream } from "../../containers"
import { siteZIndex } from "../../theme/theme"
import { StreamService } from "../../types"
import { AntMediaStream } from "./AntMediaStream"
import { NoStreamScreen } from "./NoStreamScreen"
import { OvenplayerStream } from "./OvenPlayerStream"
import { SLPDStream } from "./SLPDStream"

export const Stream = () => {
    const { currentStream } = useStream()
    const { isOpen } = useTour()

    const isGreenScreen = localStorage.getItem("greenScreen") === "true"

    if (isGreenScreen) {
        return (
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    pointerEvents: "none",
                    backgroundColor: "green",
                    zIndex: siteZIndex.Stream + 1,
                }}
            />
        )
    }

    if (isOpen) return null

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
