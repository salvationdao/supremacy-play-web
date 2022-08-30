import { Box, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useArena, useGame, useMiniMap } from "../../../../containers"
import { useTimer } from "../../../../hooks"
import { useGameServerSubscription } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { dropEffect, explosionEffect, rippleEffect } from "../../../../theme/keyframes"
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
                switch (type) {
                    case MapEventType.AirstrikeExplosions: {
                        const explosionCount = dv.getUint8(offset)
                        offset++

                        let firstTimeOffset = 0
                        for (let i = 0; i < explosionCount; i++) {
                            let timeOffset = dv.getUint16(offset)
                            offset += 2
                            const x = dv.getInt32(offset, false)
                            offset += 4
                            const y = dv.getInt32(offset, false)
                            offset += 4

                            // Delay subsequent explosions based on time offset
                            // timeOffset = time in ms since explosion happened.
                            // Since map events are sent via ticks which occur every 0.25s, multiple explosions come in per tick.
                            // First explosion is generally happening around 200ms ago, show that first then delay the rest based on this and their time offset
                            if (i === 0) {
                                firstTimeOffset = timeOffset
                                timeOffset = 0
                            } else {
                                timeOffset = firstTimeOffset - timeOffset
                            }

                            // Show airstrike impact after time offset
                            const now = Date.now()
                            setTimeout(
                                (x: number, y: number, remove_at: number) => {
                                    const explosion: DisplayedAbility = {
                                        offering_id: `explosion-${x}-${y}-${now}`,
                                        image_url: "",
                                        mini_map_display_effect_type: MiniMapDisplayEffectType.Explosion,
                                        mech_display_effect_type: MechDisplayEffectType.None,
                                        location_select_type: LocationSelectType.LocationSelect,
                                        location: { x, y },
                                        location_in_pixels: true,
                                        radius: 3100,
                                        colour: "#FF6600",
                                        border_width: 2,
                                        remove_at: remove_at,
                                    }
                                    setAbilityList((list) => [...list, explosion])
                                },
                                timeOffset,
                                x,
                                y,
                                now + timeOffset + 4500, // remove after 4.5s
                            )
                        }
                        break
                    }
                }
            }
        },
    )

    // Attempt cleanup every 10s
    useEffect(() => {
        const cleanupTimer = setInterval(() => {
            const now = Date.now()
            setAbilityList((list) => list.filter((item) => item.remove_at === undefined || item.remove_at > now))
        }, 2000)

        return () => {
            clearInterval(cleanupTimer)
        }
    })

    return (
        <>
            {abilityList.length > 0 &&
                abilityList.map((displayAbility) => <MiniMapAbilityDisplay key={displayAbility.offering_id} displayAbility={displayAbility} />)}
        </>
    )
}

const MiniMapAbilityDisplay = ({ displayAbility }: { displayAbility: DisplayedAbility }) => {
    const { image_url, colour, radius, launching_at, location, location_in_pixels, mini_map_display_effect_type, border_width } = displayAbility
    const { gridHeight } = useMiniMap()
    const { map } = useGame()

    const mapScale = useMemo(() => (map ? map.Width / (map.Cells_X * 2000) : 0), [map])
    const position = useMemo(
        () =>
            location_in_pixels ? { x: (location.x - (map ? map.Pixel_Left : 0)) * mapScale, y: (location.y - (map ? map.Pixel_Top : 0)) * mapScale } : location,
        [map, mapScale, radius, location_in_pixels],
    )
    const diameter = useMemo(() => (radius ? radius * mapScale * 2 : 0), [mapScale, radius])

    return useMemo(
        () => (
            <MapIcon
                position={position}
                locationInPixels={location_in_pixels || false}
                sizeGrid={1.5}
                primaryColor={colour}
                backgroundImageUrl={image_url}
                iconSx={{
                    animation: mini_map_display_effect_type === MiniMapDisplayEffectType.Drop ? `${dropEffect(3)} 2s ease-out` : "none",
                }}
                sx={{
                    pointerEvents: "none",
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
                                    border: `${border_width || 8}px`,
                                    borderColor: colour,
                                    borderStyle: "dashed solid",
                                    backgroundColor: "#00000010",
                                    animation: (() => {
                                        switch (mini_map_display_effect_type) {
                                            case MiniMapDisplayEffectType.Range:
                                                return `${rippleEffect(colour)} 10s ease-out`
                                            case MiniMapDisplayEffectType.Pulse:
                                                return `${explosionEffect(colour)} 1.2s infinite`
                                            case MiniMapDisplayEffectType.Explosion:
                                                return `${explosionEffect(colour)} 4s forwards`
                                            default:
                                                return "none"
                                        }
                                    })(),
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
