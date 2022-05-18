import { useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import BigNumber from "bignumber.js"
import { PassportServerKeys } from "../keys"
import { useSupremacy } from "."
import { usePassportSubscriptionUser } from "../hooks/usePassport"

export const WalletContainer = createContainer(() => {
    const { haveSups, toggleHaveSups } = useSupremacy()
    const [onWorldSupsRaw, setOnWorldSupsRaw] = useState<string>("")
    const [onWorldSups, setOnworldSups] = useState<BigNumber>()
    const firstIteration = useRef(true)

    usePassportSubscriptionUser<string>(
        {
            URI: "/sups",
            key: PassportServerKeys.SubscribeWallet,
        },
        (payload) => {
            setOnWorldSupsRaw(payload)
            setOnworldSups(new BigNumber(payload))
        },
    )

    useEffect(() => {
        if (!onWorldSups || onWorldSups.isNaN()) return

        const supsAboveZero = onWorldSups.isGreaterThan(0)

        if (firstIteration.current) {
            toggleHaveSups(supsAboveZero)
            firstIteration.current = false
            return
        }

        // Only update the have sups state when there's a change
        if (supsAboveZero && !haveSups) return toggleHaveSups(true)
        if (!supsAboveZero && haveSups) return toggleHaveSups(false)
    }, [onWorldSups, haveSups, toggleHaveSups])

    return {
        onWorldSups,
        onWorldSupsRaw,
    }
})

export const WalletProvider = WalletContainer.Provider
export const useWallet = WalletContainer.useContainer
