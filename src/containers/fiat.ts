import { useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerSubscriptionSecuredUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { ShoppingCart } from "../types/fiat"

export const FiatContainer = createContainer(() => {
    const [shoppingCart, setShoppingCart] = useState<ShoppingCart>()

    // Subscribe for cart updates
    useGameServerSubscriptionSecuredUser<ShoppingCart>(
        {
            URI: `/shopping_cart_updated`,
            key: GameServerKeys.FiatShoppingCartUpdated,
        },
        (payload) => {
            console.log("Cart Updated", payload)
            setShoppingCart(payload)
        },
    )

    // Subscribe whether cart expired
    useGameServerSubscriptionSecuredUser<boolean>(
        {
            URI: `/shopping_cart_expired`,
            key: GameServerKeys.FiatShoppingCartExpired,
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
