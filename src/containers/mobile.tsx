import { useMemo, useState } from "react"
import { createContainer } from "unstated-next"
import { BottomNavStruct } from "../components/BottomNav/BottomNav"
import { useWindowDimensions } from "../hooks"

export const MobileContainer = createContainer(() => {
    const { width, height } = useWindowDimensions()
    const [additionalTabs, setAdditionalTabs] = useState<BottomNavStruct[]>([])

    // For displaying a mobile layout
    const isMobile = useMemo(() => width <= 650 && height > width, [width, height])

    return {
        isMobile,
        additionalTabs,
        setAdditionalTabs,
    }
})

export const MobileProvider = MobileContainer.Provider
export const useMobile = MobileContainer.useContainer
