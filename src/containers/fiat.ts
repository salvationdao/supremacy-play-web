import { useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerSubscription } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { ShoppingCart } from "../types/fiat"
import { useAuth } from "./auth"

export const FiatContainer = createContainer(() => {
    const { userID } = useAuth()

    const [shoppingCart, setShoppingCart] = useState<ShoppingCart>()

    // Subscribe for cart updates
    useGameServerSubscription<ShoppingCart>(
        {
            URI: `/user/${userID}/shopping_cart_updated`,
            key: GameServerKeys.FiatShoppingCartUpdated,
            ready: !!userID,
        },
        (payload) => {
            setShoppingCart(payload)
        },
    )

    // Subscribe whether cart expired
    useGameServerSubscription<boolean>(
        {
            URI: `/user/${userID}/shopping_cart_expired`,
            key: GameServerKeys.FiatShoppingCartExpired,
            ready: !!userID,
        },
        () => {
            // TODO: Maybe notify about that to user
            setShoppingCart(undefined)
        },
    )

    return {
        shoppingCart,
        itemsCount: shoppingCart?.items?.length || 0,
    }
})

export const FiatProvider = FiatContainer.Provider
export const useFiat = FiatContainer.useContainer
