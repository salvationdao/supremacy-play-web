import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import BigNumber from "bignumber.js"
import { PassportServerKeys } from "../keys"
import { usePassportServerWebsocket } from "./passportServerSocket"
import { usePassportServerAuth } from "./passportServerAuth"

export const WalletContainer = createContainer(() => {
    const { state, subscribe } = usePassportServerWebsocket()
    const { user } = usePassportServerAuth()
    const [onWorldSupsRaw, setOnWorldSupsRaw] = useState<string>("")
    const [onWorldSups, setOnworldSups] = useState<BigNumber>()

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !user) return
        return subscribe<string>(PassportServerKeys.SubscribeWallet, (payload) => {
            if (!payload) return
            setOnWorldSupsRaw(payload)
            setOnworldSups(new BigNumber(onWorldSupsRaw))
        })
    }, [state, subscribe, user])

    return {
        onWorldSups,
        onWorldSupsRaw,
    }
})

export const WalletProvider = WalletContainer.Provider
export const useWallet = WalletContainer.useContainer
