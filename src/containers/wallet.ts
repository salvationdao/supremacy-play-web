import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import BigNumber from "bignumber.js"
import { usePassportServerSecureSubscription } from "../hooks"
import { PassportServerKeys } from "../keys"

export const WalletContainer = createContainer(() => {
    const { payload: sups } = usePassportServerSecureSubscription<string>(PassportServerKeys.SubscribeWallet)
    const [onWorldSupsRaw, setOnWorldSupsRaw] = useState<string>("")
    const [onWorldSups, setOnworldSups] = useState<BigNumber | undefined>()

    // Set the sups amount
    useEffect(() => {
        if (!sups) return
        setOnWorldSupsRaw(sups)
    }, [sups, setOnWorldSupsRaw])

    // Sup tokens
    useEffect(() => {
        if (!onWorldSupsRaw) return
        setOnworldSups(new BigNumber(onWorldSupsRaw))
    }, [onWorldSupsRaw])

    return {
        onWorldSups,
        onWorldSupsRaw,
    }
})

export const WalletProvider = WalletContainer.Provider
export const useWallet = WalletContainer.useContainer
