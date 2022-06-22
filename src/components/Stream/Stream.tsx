import { useTour } from "@reactour/tour"
import { useStream } from "../../containers"
import { StreamService } from "../../types"
import { AntMediaStream } from "./AntMediaStream"
import { NoStreamScreen } from "./NoStreamScreen"
import { OverPlayerStream } from "./OverPlayerStream"

export const Stream = () => {
    const { currentStream } = useStream()
    const { isOpen } = useTour()

    if (isOpen) return null

    if (currentStream?.service === StreamService.OvenMediaEngine) {
        return <OverPlayerStream />
    }

    if (currentStream?.service === StreamService.AntMedia) {
        return <AntMediaStream />
    }

    return <NoStreamScreen />
}
