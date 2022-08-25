import { Box, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { useArena, useGame, useMiniMap } from "../../../../containers"
import { useTimer } from "../../../../hooks"
import { useGameServerSubscription } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { fonts } from "../../../../theme/theme"
import { MapIcon } from "./Common/MapIcon"

interface DisplayedAbility {
    offering_id: string
    image_url: string
    colour: string
    location_select_type: string
    radius?: number
    mech_id: string
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

            setAbilityList(payload.filter((a) => !a.mech_id))
        },
    )

    return <>{abilityList.length > 0 && abilityList.map((da) => <MiniMapAbilityDisplay key={da.offering_id} {...da} />)}</>
}

const MiniMapAbilityDisplay = ({ image_url, colour, radius, launching_at, location }: DisplayedAbility) => {
    const { gridHeight } = useMiniMap()

    const { map } = useGame()

    const mapScale = useMemo(() => (map ? map.width / (map.cells_x * 2000) : 0), [map])
    const diameter = useMemo(() => (radius ? radius * mapScale * 2 : 0), [mapScale, radius])

    return (
        <MapIcon
            position={location}
            sizeGrid={1.5}
            primaryColor={colour}
            backgroundImageUrl={image_url}
            insideRender={
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
                                fontSize: gridHeight * 1.4,
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
                                position: "absolute",
                                width: diameter,
                                height: diameter,
                                borderRadius: "50%",
                                pointerEvents: "none",
                                border: `3px ${colour}`,
                                borderStyle: "dashed solid",
                                backgroundColor: "#00000015",
                                zIndex: 90,
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
