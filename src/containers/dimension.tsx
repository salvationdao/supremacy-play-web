import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { useWindowDimensions } from '../hooks'

export const DimensionContainer = createContainer(() => {
    const { width, height } = useWindowDimensions()
    const [iframeDimensions, setIframeDimensions] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0,
    })

    useEffect(() => {
        setIframeDimensions({ width, height })
    }, [width, height])

    return {
        iframeDimensions,
    }
})

export const DimensionProvider = DimensionContainer.Provider
export const useDimension = DimensionContainer.useContainer
