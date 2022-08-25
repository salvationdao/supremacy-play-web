import { useArena, useMiniMap } from "../../../../containers"
import { useGameServerSubscription } from "../../../../hooks/useGameServer"
import { GameAbility } from "../../../../types"
import { GameServerKeys } from "../../../../keys"
import React, { useState } from "react"
import { Typography } from "@mui/material"
import { MapIcon } from "./Common/MapIcon"
import { useTimer } from "../../../../hooks"
import { fonts } from "../../../../theme/theme"

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

            setDeadlyAbilities(payload)
        },
    )

    return <>{deadlyAbilities.length > 0 && deadlyAbilities.map((da, i) => <DeadlyAbilityDisplay key={i} {...da} />)}</>
}

const DeadlyAbilityDisplay = ({ ability, launching_at, location }: DeadlyAbility) => {
    const { gridHeight } = useMiniMap()

    return (
        <MapIcon
            primaryColor={ability.colour}
            imageUrl={ability.image_url}
            sizeGrid={3}
            position={location}
            icon={
                <Typography
                    variant={"caption"}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontFamily: fonts.nostromoBold,
                        fontSize: gridHeight * 1.8,
                        lineHeight: 1,
                        backgroundColor: "#00000080",
                    }}
                >
                    <Countdown launchDate={launching_at} />
                </Typography>
            }
        />
    )
}

const Countdown = ({ launchDate }: { launchDate: Date }) => {
    const { totalSecRemain } = useTimer(launchDate)
    return <>{totalSecRemain}</>
}
