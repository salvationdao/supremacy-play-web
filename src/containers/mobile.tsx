import { useMemo, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useWindowDimensions } from "../hooks"
import { HashRouteStruct } from "../routes"

export const MobileContainer = createContainer(() => {
    const { width, height } = useWindowDimensions()
    const [isNavOpen, setIsNavOpen] = useState(true)
    const allowCloseNav = useRef(true)
    const [additionalTabs, setAdditionalTabs] = useState<HashRouteStruct[]>([])

    // For displaying a mobile layout
    const isMobile = useMemo(() => {
        return width <= 650 || height <= 650
    }, [width, height])

    const isMobileHorizontal = useMemo(() => {
        return isMobile && height < width
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile, width, height])

    return {
        isMobile,
        isMobileHorizontal,
        isNavOpen,
        setIsNavOpen,
        additionalTabs,
        setAdditionalTabs,
        allowCloseNav,
    }
})

export const MobileProvider = MobileContainer.Provider
export const useMobile = MobileContainer.useContainer
