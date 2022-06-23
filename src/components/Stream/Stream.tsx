import { useTour } from "@reactour/tour"
import { useStream } from "../../containers"
import { StreamService } from "../../types"
import { AntMediaStream } from "./AntMediaStream"
import { NoStreamScreen } from "./NoStreamScreen"
import { OvenplayerStream } from "./OvenPlayerStream"

export const Stream = () => {
    const { currentStream } = useStream()
    const { isOpen } = useTour()

    if (isOpen) return null

    if (currentStream?.service === StreamService.OvenMediaEngine) {
        return <OvenplayerStream />
    }

    if (currentStream?.service === StreamService.AntMedia) {
        return <AntMediaStream />
    }

    return <NoStreamScreen />
}
