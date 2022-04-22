import { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { DRAWER_TRANSITION_DURATION } from "../constants"
import { useWindowDimensions } from "../hooks"

export interface ActiveBars {
    enlist: boolean
    wallet: boolean
    profile: boolean
}

export const BarContainer = createContainer(() => {
    const windowDimensions = useWindowDimensions()

    const [activeBars, setActiveBars] = useState<ActiveBars>({
        enlist: true,
        wallet: true,
        profile: true,
    })

    const getBarWidth = () => {
        return windowDimensions.width
    }

    useEffect(() => {
        const width = getBarWidth()
        if (!width) return

        // This waits for the transition to occur before calculating the responsive stuff
        setTimeout(() => {
            if (width < 500) {
                setActiveBars({
                    enlist: false,
                    wallet: false,
                    profile: false,
                })
            } else if (width < 692) {
                setActiveBars({
                    enlist: false,
                    wallet: false,
                    profile: true,
                })
            } else if (width < 792) {
                setActiveBars({
                    enlist: false,
                    wallet: true,
                    profile: false,
                })
            } else if (width < 1620) {
                setActiveBars({
                    enlist: false,
                    wallet: true,
                    profile: true,
                })
            } else if (width < 1728) {
                setActiveBars({
                    enlist: true,
                    wallet: true,
                    profile: false,
                })
            } else {
                setActiveBars({
                    enlist: true,
                    wallet: true,
                    profile: true,
                })
            }
        }, DRAWER_TRANSITION_DURATION + 50)
    }, [windowDimensions])

    // Make sure that the bar is limited to only 1, 2, or 3 things expanded at the same time, depending on screen size
    const toggleActiveBar = useCallback(
        (barName: keyof ActiveBars, newStatus: boolean) => {
            const newState = { ...activeBars, [barName]: newStatus }
            const count = Object.values(newState).filter(Boolean).length

            if (newStatus) {
                const width = getBarWidth()
                if (!width) return

                if (width < 1620) {
                    setActiveBars({
                        enlist: false,
                        wallet: false,
                        profile: false,
                        [barName]: newStatus,
                    })
                } else if (width < 1728 && count > 2) {
                    setActiveBars({
                        enlist: barName !== "profile",
                        wallet: true,
                        profile: barName === "profile",
                        [barName]: newStatus,
                    })
                } else {
                    setActiveBars((prev) => ({ ...prev, [barName]: newStatus }))
                }
            } else {
                setActiveBars((prev) => ({ ...prev, [barName]: newStatus }))
            }
        },
        [activeBars, getBarWidth, setActiveBars],
    )

    return {
        activeBars,
        toggleActiveBar,
    }
})

export const BarProvider = BarContainer.Provider
export const useBar = BarContainer.useContainer
