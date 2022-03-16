import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import BigNumber from "bignumber.js"

export const WalletContainer = createContainer(() => {
    const [onWorldSupsRaw, setOnWorldSupsRaw] = useState<string>("")
    const [onWorldSups, setOnworldSups] = useState<BigNumber | undefined>()

    // Sup tokens
    useEffect(() => {
        if (!onWorldSupsRaw) return
        setOnworldSups(new BigNumber(onWorldSupsRaw))
    }, [onWorldSupsRaw])

    return {
        onWorldSups,
        setOnWorldSupsRaw,
    }
})

export const WalletProvider = WalletContainer.Provider
export const useWallet = WalletContainer.useContainer
