import { useState } from 'react'
import { createContainer } from 'unstated-next'
import { Stream } from '../types'

export const StreamContainer = createContainer(() => {
    const [currentStream, setCurrentStream] = useState<Stream>()
    const [selectedWsURL, setSelectedWsURL] = useState('wss://staging-watch-syd02.supremacy.game/WebRTCAppEE/websocket')
    const [selectedStreamID, setSelectedStreamID] = useState('886200805704583109786601')

    return {
        currentStream,
        setCurrentStream,
        selectedWsURL,
        setSelectedWsURL,
        selectedStreamID,
        setSelectedStreamID,
    }
})

export const StreamProvider = StreamContainer.Provider
export const useStream = StreamContainer.useContainer
