import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import { SocketState, useGameServerWebsocket } from "../../containers"
import { SaleAbility } from "../../types"

export interface AbilityCardProps {
    abilityID: string
}

export const SaleAbilityCard = ({ abilityID }: AbilityCardProps) => {
    const { state, subscribe } = useGameServerWebsocket()
    const [saleAbility, setSaleAbility] = useState<SaleAbility | null>(null)

    useEffect(() => {
        if (state !== SocketState.OPEN || !subscribe) return
    }, [state, subscribe])

    return <Box></Box>
}
