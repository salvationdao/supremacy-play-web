import { createContainer } from "unstated-next"
import { useToggle } from "../hooks"

// Control left side bar button and open states
export const LeftSideBarContainer = createContainer(() => {
    const [isEndBattleDetailOpen, toggleIsEndBattleDetailOpen] = useToggle()
    const [isEndBattleDetailEnabled, toggleIsEndBattleDetailEnabled] = useToggle()

    return {
        isEndBattleDetailOpen,
        isEndBattleDetailEnabled,
        toggleIsEndBattleDetailOpen,
        toggleIsEndBattleDetailEnabled,
    }
})

export const LeftSideBarProvider = LeftSideBarContainer.Provider
export const useLeftSideBar = LeftSideBarContainer.useContainer
