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
    const below600 = useMediaQuery("(max-width:600px)")
    const below792 = useMediaQuery("(max-width:792px)")
    const below892 = useMediaQuery("(max-width:892px)")
    const below1350 = useMediaQuery("(max-width:1350px)")
    const below1500 = useMediaQuery("(max-width:1500px)")

    const [activeBars, setActiveBars] = useState<ActiveBars>({
        enlist: true,
        wallet: true,
        profile: true,
    })

    useEffect(() => {
        // This waits for the transition to occur before calculating the responsive stuff
        const timeout = setTimeout(() => {
            if (below600) {
                setActiveBars({
                    enlist: false,
                    wallet: false,
                    profile: false,
                })
            } else if (below792) {
                setActiveBars({
                    enlist: false,
                    wallet: false,
                    profile: true,
                })
            } else if (below892) {
                setActiveBars({
                    enlist: false,
                    wallet: true,
                    profile: false,
                })
            } else if (below1350) {
                setActiveBars({
                    enlist: false,
                    wallet: true,
                    profile: true,
                })
            } else if (below1500) {
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
    }, [below600, below792, below892, below1350, below1500])

    // Make sure that the bar is limited to only 1, 2, or 3 things expanded at the same time, depending on screen size
    const toggleActiveBar = useCallback(
        (barName: keyof ActiveBars, newStatus: boolean) => {
            const newState = { ...activeBars, [barName]: newStatus }
            const count = Object.values(newState).filter(Boolean).length

            if (newStatus) {
                if (below1350) {
                    setActiveBars({
                        enlist: false,
                        wallet: false,
                        profile: false,
                        [barName]: newStatus,
                    })
                } else if (below1500 && count > 2) {
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
        [activeBars, setActiveBars, below600, below792, below892, below1350, below1500],
    )

    return {
        activeBars,
        toggleActiveBar,
    }
})

export const BarProvider = BarContainer.Provider
export const useBar = BarContainer.useContainer
