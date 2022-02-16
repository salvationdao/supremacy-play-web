import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { Stream } from '../types'

export const StreamContainer = createContainer(() => {
    const [currentStream, setCurrentStream] = useState<Stream>()

    return {
        currentStream,
        setCurrentStream,
    }
})

export const StreamProvider = StreamContainer.Provider
export const useStream = StreamContainer.useContainer
