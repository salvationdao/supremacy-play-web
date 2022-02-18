import { createContainer } from 'unstated-next'
import { useToggle } from '../hooks'

// Control left side bar button and open states
export const LeftSideBarContainer = createContainer(() => {
    const [isEndBattleDetailOpen, toggleIsEndBattleDetailOpen] = useToggle()

    return {
        isEndBattleDetailOpen,
        toggleIsEndBattleDetailOpen,
    }
})

export const LeftSideBarProvider = LeftSideBarContainer.Provider
export const useLeftSideBar = LeftSideBarContainer.useContainer
