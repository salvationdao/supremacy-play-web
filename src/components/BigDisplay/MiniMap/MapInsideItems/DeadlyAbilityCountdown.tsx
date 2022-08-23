import { useArena, useGame, useMiniMap } from "../../../../containers"
import { useGameServerSubscription } from "../../../../hooks/useGameServer"
import { GameAbility } from "../../../../types"
import { GameServerKeys } from "../../../../keys"
import React, { useMemo, useState } from "react"
import { Box } from "@mui/material"
import { colors } from "../../../../theme/theme"

interface DeadlyAbility {
    ability: GameAbility
    location: {
        x: number
        y: number
    }
    launching_at: Date
}

export const DeadlyAbilityCountdowns = () => {
    const { currentArenaID } = useArena()
    const [deadlyAbilities, setDeadlyAbilities] = useState<DeadlyAbility[]>([])

    useGameServerSubscription<DeadlyAbility[]>(
        {
            URI: `/public/arena/${currentArenaID}/deadly_ability_countdown_list`,
            key: GameServerKeys.SubDeadlyAbilityCountdownList,
            ready: !!currentArenaID,
        },
        (payload) => {
            if (!payload) {
                setDeadlyAbilities([])
                return
            }

            console.log(payload)

            setDeadlyAbilities(payload)
        },
    )

    return <>{deadlyAbilities.length > 0 && deadlyAbilities.map((da, i) => <DeadlyAbilityDisplay key={i} {...da} />)}</>
}

const DeadlyAbilityDisplay = React.forwardRef(function DeadlyAbilityDisplay({ ability, launching_at, location }: DeadlyAbility, ref) {
    const { gridHeight, gridWidth } = useMiniMap()

    return (
        <Box
            ref={ref}
            sx={{
                zIndex: 900,
                position: "absolute",
                width: gridWidth * 2,
                height: gridHeight * 2,
                transform: `translate(${(location.x - 1) * gridWidth}px, ${(location.y - 1) * gridHeight}px)`,
                borderRadius: "3px",
                backgroundImage: `url(${ability.image_url})`,
                backgroundSize: "auto",
                backgroundRepeat: "no-repeat",
                pointerEvents: "none",
            }}
        />
    )
})
