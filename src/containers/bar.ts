import { useMediaQuery } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { DRAWER_TRANSITION_DURATION } from "../constants"

export interface ActiveBars {
    wallet: boolean
    profile: boolean
}

export const BarContainer = createContainer(() => {
    const below650 = useMediaQuery("(max-width:650px)")
    const below820 = useMediaQuery("(max-width:820px)")

    const [activeBars, setActiveBars] = useState<ActiveBars>({
        wallet: true,
        profile: true,
    })

    useEffect(() => {
        // This waits for the transition to occur before calculating the responsive stuff
        const timeout = setTimeout(() => {
            if (below650) {
                setActiveBars({
                    wallet: false,
                    profile: false,
                })
            } else if (below820) {
                setActiveBars({
                    wallet: true,
                    profile: false,
                })
            } else {
                setActiveBars({
                    wallet: true,
                    profile: true,
                })
            }
        }, DRAWER_TRANSITION_DURATION + 50)

        return () => clearTimeout(timeout)
    }, [below650, below820])

    // Make sure that the bar is limited to only 1, 2, or 3 things expanded at the same time, depending on screen size
    const toggleActiveBar = useCallback(
        (barName: keyof ActiveBars, newStatus: boolean) => {
            setActiveBars((prev) => {
                return { ...prev, [barName]: newStatus }
            })
        },
        [setActiveBars],
    )

    return {
        activeBars,
        toggleActiveBar,
    }
})

export const BarProvider = BarContainer.Provider
export const useBar = BarContainer.useContainer
