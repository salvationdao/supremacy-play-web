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
    const below650 = useMediaQuery("(max-width:650px)")
    const below750 = useMediaQuery("(max-width:750px)")
    const below980 = useMediaQuery("(max-width:980px)")
    const below1550 = useMediaQuery("(max-width:1550px)")
    const below1750 = useMediaQuery("(max-width:1750px)")

    const [activeBars, setActiveBars] = useState<ActiveBars>({
        enlist: true,
        wallet: true,
        profile: true,
    })

    useEffect(() => {
        // This waits for the transition to occur before calculating the responsive stuff
        const timeout = setTimeout(() => {
            if (below650) {
                setActiveBars({
                    enlist: false,
                    wallet: true,
                    profile: false,
                })
            } else if (below750) {
                setActiveBars({
                    enlist: false,
                    wallet: true,
                    profile: false,
                })
            } else if (below980) {
                setActiveBars({
                    enlist: false,
                    wallet: true,
                    profile: false,
                })
            } else if (below1550) {
                setActiveBars({
                    enlist: false,
                    wallet: true,
                    profile: true,
                })
            } else if (below1750) {
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
    }, [below650, below750, below980, below1550, below1750])

    // Make sure that the bar is limited to only 1, 2, or 3 things expanded at the same time, depending on screen size
    const toggleActiveBar = useCallback(
        (barName: keyof ActiveBars, newStatus: boolean) => {
            setActiveBars((prev) => {
                const newState = { ...prev, [barName]: newStatus }
                const count = Object.values(newState).filter(Boolean).length

                if (newStatus) {
                    if (below1550) {
                        return {
                            enlist: false,
                            wallet: false,
                            profile: false,
                            [barName]: newStatus,
                        }
                    } else if (below1750 && count > 2) {
                        return {
                            enlist: barName !== "profile",
                            wallet: true,
                            profile: barName === "profile",
                            [barName]: newStatus,
                        }
                    } else {
                        return { ...prev, [barName]: newStatus }
                    }
                } else {
                    return { ...prev, [barName]: newStatus }
                }
            })
        },
        [setActiveBars, below1550, below1750],
    )

    return {
        activeBars,
        toggleActiveBar,
    }
})

export const BarProvider = BarContainer.Provider
export const useBar = BarContainer.useContainer
