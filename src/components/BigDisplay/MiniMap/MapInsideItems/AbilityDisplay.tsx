import { Box, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { useArena, useGame, useMiniMap } from "../../../../containers"
import { useTimer } from "../../../../hooks"
import { useGameServerSubscription } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { dropEffect, rippleEffect } from "../../../../theme/keyframes"
import { fonts } from "../../../../theme/theme"
import { DisplayedAbility, LocationSelectType, MechDisplayEffectType, MiniMapDisplayEffectType } from "../../../../types"
import { MapIcon } from "./Common/MapIcon"
import { decode } from "base64-arraybuffer"

export enum MapEventType {
    AirstrikeExplosions,
    LandmineActivations,
    LandmineExplosions,
    PickupLanded,
    PickupUsed,
    HiveHexUpdate,
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

            // Only show the ones that are not on a mech
            setAbilityList(payload.filter((da) => !da.mech_id))
        },
    )

    useGameServerSubscription<string>(
        {
            URI: `/public/arena/${currentArenaID}/minimap_events`,
            key: GameServerKeys.MinimapEventsSubscribe,
            ready: !!currentArenaID,
        },
        (payload) => {
            if (!payload) return

            const buffer = decode(payload)
            const dv = new DataView(buffer)

            const count = dv.getUint8(0)
            let offset = 1
            for (let c = 0; c < count; c++) {
                const type = dv.getUint8(offset) as MapEventType
                offset++
                console.log(`type: ${type}`)
                switch (type) {
                    case MapEventType.AirstrikeExplosions: {
                        const explosionCount = dv.getUint8(offset)
                        offset++
                        for (let i = 0; i < explosionCount; i++) {
                            const timeOffset = dv.getUint16(offset)
                            offset += 2
                            const x = dv.getInt32(offset, false)
                            offset += 4
                            const y = dv.getInt32(offset, false)
                            offset += 4

                            const explosion: DisplayedAbility = {
                                offering_id: `explosion-${i}`, // temp
                                mini_map_display_effect_type: MiniMapDisplayEffectType.Pulse,
                                mech_display_effect_type: MechDisplayEffectType.None,
                                location_select_type: LocationSelectType.LocationSelect,
                                image_url: "",
                                location: { x, y },
                                radius: 1000,
                                colour: "#FF6600",
                            }
                            console.log(`airstrike - ${x}, ${y}`)

                            setAbilityList((list) => [...list, explosion])
                        }
                        break
                    }
                }
            }
        },
    )

    return (
        <>
            {abilityList.length > 0 &&
                abilityList.map((displayAbility, index) => <MiniMapAbilityDisplay key={`ability-${index}`} displayAbility={displayAbility} />)}
        </>
    )
}

const MiniMapAbilityDisplay = ({ displayAbility }: { displayAbility: DisplayedAbility }) => {
    const { image_url, colour, radius, launching_at, location, mini_map_display_effect_type } = displayAbility
    const { gridHeight } = useMiniMap()
    const { map } = useGame()

    const mapScale = useMemo(() => (map ? map.Width / (map.Cells_X * 2000) : 0), [map])
    const position = useMemo(
        () => ({ x: (location.x - (map ? map.Pixel_Left : 0)) * mapScale, y: (location.y - (map ? map.Pixel_Top : 0)) * mapScale }),
        [mapScale, radius],
    )
    const diameter = useMemo(() => (radius ? radius * mapScale * 2 : 0), [mapScale, radius])

    return useMemo(
        () => (
            <MapIcon
                position={position}
                sizeGrid={1.5}
                primaryColor={colour}
                backgroundImageUrl={image_url}
                iconSx={{
                    animation: mini_map_display_effect_type === MiniMapDisplayEffectType.Drop ? `${dropEffect(3)} 2s ease-out` : "none",
                }}
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
                                    zIndex: 10,
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
                                    backgroundColor: "#00000010",
                                    animation:
                                        mini_map_display_effect_type === MiniMapDisplayEffectType.Range
                                            ? `${rippleEffect(colour)} 10s ease-out`
                                            : mini_map_display_effect_type === MiniMapDisplayEffectType.Pulse
                                            ? `${rippleEffect(colour)} 1.2s infinite`
                                            : "none",
                                    zIndex: 90,
                                }}
                            />
                        )}
                    </>
                }
            />
        ),
        [colour, diameter, mini_map_display_effect_type, gridHeight, image_url, launching_at, location],
    )
}

const Countdown = ({ launchDate }: { launchDate: Date }) => {
    const { totalSecRemain } = useTimer(launchDate)
    return <>{totalSecRemain}</>
}
