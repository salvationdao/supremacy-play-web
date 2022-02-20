import { useState } from "react"
import { createContainer } from "unstated-next"
import { Stream } from "../types"

export interface StreamContainerType {
    currentStream: Stream | undefined
    setCurrentStream: React.Dispatch<React.SetStateAction<Stream | undefined>>
    selectedWsURL: string
    setSelectedWsURL: React.Dispatch<React.SetStateAction<string>>
    selectedStreamID: string
    setSelectedStreamID: React.Dispatch<React.SetStateAction<string>>
    streamResolutions: number[]
    setStreamResolutions: React.Dispatch<React.SetStateAction<number[]>>
    volume: number
    setVolume: React.Dispatch<React.SetStateAction<number>>
    isMute: boolean
    setIsMute: React.Dispatch<React.SetStateAction<boolean>>
    muteToggle: () => void
    currentResolution: number | undefined
    setCurrentResolution: React.Dispatch<React.SetStateAction<number | undefined>>
    defaultStreamID: string
    defaultWSURL: string
    defaultResolution: number
}
export const StreamContainer = createContainer((): StreamContainerType => {
    const defaultStreamID = "886200805704583109786601"
    const defaultWSURL = "wss://staging-watch-syd02.supremacy.game/WebRTCAppEE/websocket"
    const defaultResolution = 720

    // stream
    const [currentStream, setCurrentStream] = useState<Stream>()
    const [selectedWsURL, setSelectedWsURL] = useState(defaultWSURL)
    const [selectedStreamID, setSelectedStreamID] = useState(defaultStreamID)

    // volume
    const [volume, setVolume] = useState(0.0)
    const [isMute, setIsMute] = useState(true)
    const muteToggle = () => {
        setIsMute(!isMute)
    }

    // resolution
    const [streamResolutions, setStreamResolutions] = useState<number[]>([])
    const [currentResolution, setCurrentResolution] = useState<number>()

    return {
        currentStream,
        setCurrentStream,

        selectedWsURL,
        setSelectedWsURL,

        selectedStreamID,
        setSelectedStreamID,

        currentResolution,
        setCurrentResolution,

        streamResolutions,
        setStreamResolutions,

        volume,
        setVolume,
        isMute,
        setIsMute,
        muteToggle,

        defaultStreamID,
        defaultWSURL,
        defaultResolution,
    }
})

export const StreamProvider = StreamContainer.Provider
export const useStream = StreamContainer.useContainer
