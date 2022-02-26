import { useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useDrawer } from "./drawer"
import { DRAWER_TRANSITION_DURATION } from "../constants"
import { BarPosition } from "../GameBar"
import { useToggle, useWindowDimensions } from "../hooks"

export interface ActiveBars {
	logo: boolean
	enlist: boolean
	wallet: boolean
	profile: boolean
}

export const BarContainer = createContainer((initialState?: BarPosition) => {
	const gameBarRef = useRef<HTMLDivElement>()
	const windowDimensions = useWindowDimensions()
	const { isAnyPanelOpen } = useDrawer()

	const [barPosition, setBarPosition] = useState<BarPosition>(initialState || "top")
	const [below1625, toggleBelow1625] = useToggle()
	const [below1300, toggleBelow1300] = useToggle()
	const [below896, toggleBelow896] = useToggle()
	const [below470, toggleBelow470] = useToggle()
	const [activeBars, setActiveBars] = useState<ActiveBars>({
		logo: true,
		enlist: true,
		wallet: true,
		profile: true,
	})

	const activeAll = () => {
		setActiveBars({
			logo: true,
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
			if (below896) {
				setActiveBars({
					logo: false,
					enlist: false,
					wallet: false,
					profile: false,
					[barName]: newStatus,
				})
			} else if (below1300 && count > 2) {
				setActiveBars({
					logo: false,
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
			toggleBelow1625(el.offsetWidth < 1625)
			toggleBelow1300(el.offsetWidth < 1300)
			toggleBelow896(el.offsetWidth < 896)
			toggleBelow470(el.offsetWidth < 470)
		}, DRAWER_TRANSITION_DURATION + 50)
	}, [windowDimensions, isAnyPanelOpen, toggleBelow1625, toggleBelow1300, toggleBelow896, toggleBelow470])

	useEffect(() => {
		if (below470) {
			setActiveBars({
				logo: false,
				enlist: false,
				wallet: false,
				profile: false,
			})
		} else if (below896) {
			setActiveBars({
				logo: false,
				enlist: false,
				wallet: false,
				profile: true,
			})
		} else if (below1300) {
			setActiveBars({
				logo: false,
				enlist: false,
				wallet: true,
				profile: true,
			})
		} else if (below1625) {
			setActiveBars({
				logo: false,
				enlist: true,
				wallet: true,
				profile: true,
			})
		} else {
			activeAll()
		}
	}, [below1625, below1300, below896, below470])

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
