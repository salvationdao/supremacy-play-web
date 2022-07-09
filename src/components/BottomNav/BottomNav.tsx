import { useMobile } from "../../containers"

export const BottomNav = () => {
    const { isMobile } = useMobile()
    if (!isMobile) return null
    // For mobile only
    return <BottomNavInner />
}

const BottomNavInner = () => {
    return null
}
