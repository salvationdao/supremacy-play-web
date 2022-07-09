import { useMemo } from "react"
import { createContainer } from "unstated-next"
import { useWindowDimensions } from "../hooks"

export const MobileContainer = createContainer(() => {
    const { width, height } = useWindowDimensions(900)

    // For displaying a mobile layout
    const isMobile = useMemo(() => width <= 650 && height > width, [width, height])

    return {
        isMobile,
    }
})

export const MobileProvider = MobileContainer.Provider
export const useMobile = MobileContainer.useContainer
