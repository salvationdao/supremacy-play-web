import { useTour } from "@reactour/tour"
import { useStream } from "../../containers"
import { StreamService } from "../../types"
import { AntMediaStream } from "./AntMediaStream"
import { NoStreamScreen } from "./NoStreamScreen"
import { OvenplayerStream } from "./OvenPlayerStream"
import { SLPDStream } from "./SLPDStream"

export const Stream = () => {
    const { currentStream } = useStream()
    const { isOpen } = useTour()

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

    return <AntMediaStream /> // TODO: remove later
    return <NoStreamScreen />
}
