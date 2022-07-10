import { useMemo, useState } from "react"
import { createContainer } from "unstated-next"
import { useToggle, useWindowDimensions } from "../hooks"
import { HashRouteStruct } from "../routes"

export const MobileContainer = createContainer(() => {
    const { width, height } = useWindowDimensions()
    const [isNavOpen, toggleIsNavOpen] = useToggle(true)
    const [additionalTabs, setAdditionalTabs] = useState<HashRouteStruct[]>([])

    // For displaying a mobile layout
    const isMobile = useMemo(() => width <= 650 && height > width, [width, height])

    return {
        isMobile,
        isNavOpen,
        toggleIsNavOpen,
        additionalTabs,
        setAdditionalTabs,
    }
})

export const MobileProvider = MobileContainer.Provider
export const useMobile = MobileContainer.useContainer
