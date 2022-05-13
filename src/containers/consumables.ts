import { useState } from "react"
import { createContainer } from "unstated-next"
import { PlayerAbility } from "../types"

export const UserConsumablesContainer = createContainer(() => {
    const [playerAbility, setPlayerAbility] = useState<PlayerAbility>()

    return {
        playerAbility,
        setPlayerAbility,
    }
})

export const UserConsumablesProvider = UserConsumablesContainer.Provider
export const useConsumables = UserConsumablesContainer.useContainer
