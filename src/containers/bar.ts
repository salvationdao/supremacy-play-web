import { useMediaQuery } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { DRAWER_TRANSITION_DURATION } from "../constants"

export interface ActiveBars {
    enlist: boolean
    wallet: boolean
    profile: boolean
}

export const BarContainer = createContainer(() => {
    const below500 = useMediaQuery("(max-width:500px)")
    const below692 = useMediaQuery("(max-width:692px)")
    const below792 = useMediaQuery("(max-width:792px)")
    const below1250 = useMediaQuery("(max-width:1250px)")
    const below1400 = useMediaQuery("(max-width:1400px)")

    const [activeBars, setActiveBars] = useState<ActiveBars>({
        enlist: true,
        wallet: true,
        profile: true,
    })

    useEffect(() => {
        // This waits for the transition to occur before calculating the responsive stuff
        const timeout = setTimeout(() => {
            if (below500) {
                setActiveBars({
                    enlist: false,
                    wallet: false,
                    profile: false,
                })
            } else if (below692) {
                setActiveBars({
                    enlist: false,
                    wallet: false,
                    profile: true,
                })
            } else if (below792) {
                setActiveBars({
                    enlist: false,
                    wallet: true,
                    profile: false,
                })
            } else if (below1250) {
                setActiveBars({
                    enlist: false,
                    wallet: true,
                    profile: true,
                })
            } else if (below1400) {
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

        return () => clearTimeout(timeout)
    }, [below500, below692, below792, below1250, below1400])

    // Make sure that the bar is limited to only 1, 2, or 3 things expanded at the same time, depending on screen size
    const toggleActiveBar = useCallback(
        (barName: keyof ActiveBars, newStatus: boolean) => {
            const newState = { ...activeBars, [barName]: newStatus }
            const count = Object.values(newState).filter(Boolean).length

            if (newStatus) {
                if (below1250) {
                    setActiveBars({
                        enlist: false,
                        wallet: false,
                        profile: false,
                        [barName]: newStatus,
                    })
                } else if (below1400 && count > 2) {
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
        [activeBars, setActiveBars, below500, below692, below792, below1250, below1400],
    )

    return {
        activeBars,
        toggleActiveBar,
    }
})

export const BarProvider = BarContainer.Provider
export const useBar = BarContainer.useContainer
