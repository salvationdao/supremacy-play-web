import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { useWindowDimensions } from '../hooks'

export const DimensionContainer = createContainer(() => {
    const { width, height } = useWindowDimensions()
    const [streamDimensions, setStreamDimensions] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0,
    })

    useEffect(() => {
        setStreamDimensions({ width, height })
    }, [width, height])

    return {
        streamDimensions,
    }
})

export const DimensionProvider = DimensionContainer.Provider
export const useDimension = DimensionContainer.useContainer
