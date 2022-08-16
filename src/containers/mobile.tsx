import { useEffect, useMemo, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useWindowDimensions } from "../hooks"
import { SideTabsStruct } from "../routes"

const configureViewPort = (width: number) => {
    document.querySelector('meta[name="viewport"]')?.setAttribute("content", "width=" + Math.max(980, width))
}

export const MobileContainer = createContainer(() => {
    const { width, height } = useWindowDimensions()
    const [isNavOpen, setIsNavOpen] = useState(true)
    const allowCloseNav = useRef(true)
    const [additionalTabs, setAdditionalTabs] = useState<SideTabsStruct[]>([])

    useEffect(() => {
        configureViewPort(width)
    }, [width])

    // For displaying a mobile layout
    const isMobile = useMemo(() => {
        return width <= 480 || height <= 480
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
