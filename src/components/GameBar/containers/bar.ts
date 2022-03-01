import { useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useDrawer } from "./drawer"
import { DRAWER_TRANSITION_DURATION } from "../constants"
import { BarPosition } from "../GameBar"
import { useToggle, useWindowDimensions } from "../hooks"

export interface ActiveBars {
    enlist: boolean
    wallet: boolean
    profile: boolean
}

export const BarContainer = createContainer((initialState?: BarPosition) => {
    const gameBarRef = useRef<HTMLDivElement>()
    const windowDimensions = useWindowDimensions()
    const { isAnyPanelOpen } = useDrawer()

    const [barPosition, setBarPosition] = useState<BarPosition>(initialState || "top")
    const [below1380, toggleBelow1380] = useToggle()
    const [below925, toggleBelow925] = useToggle()
    const [below812, toggleBelow812] = useToggle()
    const [activeBars, setActiveBars] = useState<ActiveBars>({
        enlist: true,
        wallet: true,
        profile: true,
    })

    const activeAll = () => {
        setActiveBars({
            enlist: true,
            wallet: true,
            profile: true,
        })
    }

    // Make sure that the bar is limited to only 1, 2, or 3 things expanded at the same time, depending on screen size
    const toggleActiveBar = (barName: keyof ActiveBars, newStatus: boolean) => {
        const newState = { ...activeBars, [barName]: newStatus }
        const count = Object.values(newState).filter(Boolean).length

        if (newStatus) {
            if (below925) {
                setActiveBars({
                    enlist: false,
                    wallet: false,
                    profile: false,
                    [barName]: newStatus,
                })
            } else if (below1380 && count > 2) {
                setActiveBars({
                    enlist: barName !== "wallet",
                    wallet: barName === "wallet",
                    profile: true,
                    [barName]: newStatus,
                })
            } else {
                setActiveBars((prev) => ({ ...prev, [barName]: newStatus }))
            }
        } else {
            setActiveBars((prev) => ({ ...prev, [barName]: newStatus }))
        }
    }

    useEffect(() => {
        // This waits for the transition to occur before calculating the responsive stuff
        setTimeout(() => {
            const el = gameBarRef.current
            if (!el) return
            toggleBelow1380(el.offsetWidth < 1380)
            toggleBelow925(el.offsetWidth < 925)
            toggleBelow812(el.offsetWidth < 812)
        }, DRAWER_TRANSITION_DURATION + 50)
    }, [windowDimensions, isAnyPanelOpen, toggleBelow1380, toggleBelow925, toggleBelow812])

    useEffect(() => {
        if (below812) {
            setActiveBars({
                enlist: false,
                wallet: false,
                profile: false,
            })
        } else if (below925) {
            setActiveBars({
                enlist: false,
                wallet: true,
                profile: false,
            })
        } else if (below1380) {
            setActiveBars({
                enlist: false,
                wallet: true,
                profile: true,
            })
        } else {
            activeAll()
        }
    }, [below1380, below925, below812])

    return {
        gameBarRef,
        activeBars,
        toggleActiveBar,
        barPosition,
        setBarPosition,
    }
})

export const BarProvider = BarContainer.Provider
export const useBar = BarContainer.useContainer
