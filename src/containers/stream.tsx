import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { Stream } from '../types'

export const StreamContainer = createContainer(() => {
    const [currentStream, setCurrentStream] = useState<Stream>(
        localStorage.getItem('streamServer') ? JSON.parse(localStorage.getItem('streamServer') || '{}') : undefined,
    )

    // Save user selection to local storage
    useEffect(() => {
        localStorage.setItem('streamServer', JSON.stringify(currentStream))
    }, [currentStream])

    return {
        currentStream,
        setCurrentStream,
    }
})

export const StreamProvider = StreamContainer.Provider
export const useStream = StreamContainer.useContainer
