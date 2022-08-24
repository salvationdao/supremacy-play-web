import { useArena, useGame, useMiniMap } from "../../../../containers"
import { useGameServerSubscription } from "../../../../hooks/useGameServer"
import { GameAbility, LocationSelectType } from "../../../../types"
import { GameServerKeys } from "../../../../keys"
import React, { useMemo, useState } from "react"
import { Box, Typography } from "@mui/material"
import { MapIcon } from "./MapIcon/MapIcon"
import { useTimer } from "../../../../hooks"
import { colors, fonts } from "../../../../theme/theme"

interface DisplayedAbility {
    offering_id: string
    image_url: string
    colour: string
    location_select_type: string
    radius?: number
    location: {
        x: number
        y: number
    }
    launching_at?: Date
}

export const MiniMapAbilitiesDisplay = () => {
    const { currentArenaID } = useArena()
    const [abilityList, setAbilityList] = useState<DisplayedAbility[]>([])

    useGameServerSubscription<DisplayedAbility[]>(
        {
            URI: `/public/arena/${currentArenaID}/mini_map_ability_display_list`,
            key: GameServerKeys.SubMiniMapAbilityDisplayList,
            ready: !!currentArenaID,
        },
        (payload) => {
            if (!payload) {
                setAbilityList([])
                return
            }

            setAbilityList(
                payload.filter(
                    (a) => a.location_select_type === LocationSelectType.LOCATION_SELECT || a.location_select_type === LocationSelectType.LINE_SELECT,
                ),
            )
        },
    )

    return <>{abilityList.length > 0 && abilityList.map((da, i) => <MiniMapAbilityDisplay key={da.offering_id} {...da} />)}</>
}

const MiniMapAbilityDisplay = ({ image_url, colour, radius, launching_at, location }: DisplayedAbility) => {
    const { gridHeight } = useMiniMap()

    const { map } = useGame()

    console.log(radius)

    const mapScale = useMemo(() => (map ? map.width / (map.cells_x * 2000) : 0), [map])
    const diameter = useMemo(() => (radius ? radius * mapScale * 2 : 0), [mapScale, radius])

    return (
        <MapIcon
            primaryColor={colour}
            imageUrl={image_url}
            sizeGrid={2}
            position={location}
            icon={
                <>
                    {!!launching_at && (
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
                    )}
                    {!!diameter && (
                        <Box
                            sx={{
                                zIndex: 900,
                                position: "absolute",
                                width: diameter,
                                height: diameter,
                                borderRadius: "50%",
                                pointerEvents: "none",
                                border: `3px ${colour}`,
                                borderStyle: "dashed solid",
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                            }}
                        />
                    )}
                </>
            }
        />
    )
}

const Countdown = ({ launchDate }: { launchDate: Date }) => {
    const { totalSecRemain } = useTimer(launchDate)
    return <>{totalSecRemain}</>
}
