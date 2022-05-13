import { useState } from "react"
import { createContainer } from "unstated-next"
import { PlayerAbility } from "../types"

export const AssetContainer = createContainer(() => {
    const [playerAbility, setPlayerAbility] = useState<PlayerAbility>()

    return {
        playerAbility,
        setPlayerAbility,
    }
})

export const AssetProvider = AssetContainer.Provider
export const useAsset = AssetContainer.useContainer
