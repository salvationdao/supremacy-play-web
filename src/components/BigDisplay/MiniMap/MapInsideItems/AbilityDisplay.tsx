import { Box, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { useArena, useGame, useMiniMap } from "../../../../containers"
import { useTimer } from "../../../../hooks"
import { useGameServerSubscription } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { rippleEffect } from "../../../../theme/keyframes"
import { fonts } from "../../../../theme/theme"
import { DisplayedAbility, DisplayEffectType } from "../../../../types"
import { MapIcon } from "./Common/MapIcon"

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

            // Only show the ones that are not on a mech
            setAbilityList(payload.filter((a) => !a.mech_id))
        },
    )

    return (
        <>
            {abilityList.length > 0 &&
                abilityList.map((displayAbility) => <MiniMapAbilityDisplay key={displayAbility.offering_id} displayAbility={displayAbility} />)}
        </>
    )
}

const MiniMapAbilityDisplay = ({ displayAbility }: { displayAbility: DisplayedAbility }) => {
    const { image_url, colour, radius, launching_at, location, display_effect_type } = displayAbility
    const { gridHeight } = useMiniMap()
    const { map } = useGame()

    const mapScale = useMemo(() => (map ? map.width / (map.cells_x * 2000) : 0), [map])
    const diameter = useMemo(() => (radius ? radius * mapScale * 2 : 0), [mapScale, radius])

    return useMemo(
        () => (
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
                                    fontSize: gridHeight * 0.8,
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
                                    border: `8px ${colour}`,
                                    borderStyle: "dashed solid",
                                    backgroundColor: `${colour}18`,
                                    animation: display_effect_type === DisplayEffectType.Range ? `${rippleEffect(colour)} 10s ease-out` : "none",
                                    zIndex: 90,
                                }}
                            />
                        )}
                    </>
                }
            />
        ),
        [colour, diameter, display_effect_type, gridHeight, image_url, launching_at, location],
    )
}

const Countdown = ({ launchDate }: { launchDate: Date }) => {
    const { totalSecRemain } = useTimer(launchDate)
    return <>{totalSecRemain}</>
}
