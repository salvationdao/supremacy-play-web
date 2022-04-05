import { useCallback, useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useDrawer } from "."
import { DRAWER_TRANSITION_DURATION } from "../constants"
import { useWindowDimensions } from "../hooks"

export interface ActiveBars {
    enlist: boolean
    wallet: boolean
    profile: boolean
}

export const BarContainer = createContainer(() => {
    const gameBarRef = useRef<HTMLDivElement>()
    const windowDimensions = useWindowDimensions()

    const { isAnyPanelOpen } = useDrawer()
    const [activeBars, setActiveBars] = useState<ActiveBars>({
        enlist: true,
        wallet: true,
        profile: true,
    })

    const getBarWidth = () => {
        const el = gameBarRef.current
        if (!el) return
        return el.offsetWidth
    }

    useEffect(() => {
        const width = getBarWidth()
        if (!width) return

        // This waits for the transition to occur before calculating the responsive stuff
        setTimeout(() => {
            if (width < 530) {
                setActiveBars({
                    enlist: false,
                    wallet: false,
                    profile: false,
                })
            } else if (width < 757) {
                setActiveBars({
                    enlist: false,
                    wallet: false,
                    profile: true,
                })
            } else if (width < 1345) {
                setActiveBars({
                    enlist: false,
                    wallet: true,
                    profile: true,
                })
            } else if (width < 1665) {
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
    }, [windowDimensions, isAnyPanelOpen])

    // Make sure that the bar is limited to only 1, 2, or 3 things expanded at the same time, depending on screen size
    const toggleActiveBar = useCallback(
        (barName: keyof ActiveBars, newStatus: boolean) => {
            const newState = { ...activeBars, [barName]: newStatus }
            const count = Object.values(newState).filter(Boolean).length

            if (newStatus) {
                const width = getBarWidth()
                if (!width) return

                if (width < 1345) {
                    setActiveBars({
                        enlist: false,
                        wallet: false,
                        profile: false,
                        [barName]: newStatus,
                    })
                } else if (width < 1665 && count > 2) {
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
        gameBarRef,
        activeBars,
        toggleActiveBar,
    }
})

export const BarProvider = BarContainer.Provider
export const useBar = BarContainer.useContainer
