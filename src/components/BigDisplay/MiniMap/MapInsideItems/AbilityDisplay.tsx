import { Box, Typography } from "@mui/material"
import { decode } from "base64-arraybuffer"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useArena, useGame, useMiniMap } from "../../../../containers"
import { useTimer } from "../../../../hooks"
import { useGameServerSubscription } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { dropEffect, explosionEffect, fadeEffect, landmineEffect, rippleEffect } from "../../../../theme/keyframes"
import { fonts } from "../../../../theme/theme"
import { DisplayedAbility, GAME_CLIENT_TILE_SIZE, LocationSelectType, Map as GameMap, MechDisplayEffectType, MiniMapDisplayEffectType } from "../../../../types"
import { MapIcon } from "./Common/MapIcon"
import { HiveHexes } from "./HiveHexes"

export enum MapEventType {
    // Airstrike Explosions - The locations of airstrike missile impacts.
    AirstrikeExplosions,
    // Landmine Activations - The id, location and faction of a mine that got activated.
    LandmineActivations,
    // Landmine Explosions - The ids of mines that exploded.
    LandmineExplosions,
    // Hive State - The full state of The Hive map.
    HiveState,
    // Hive Hex Raised - The ids of the hexes that have recently raised.
    HiveHexRaised,
    // Hive Hex Lowered - The ids of the hexes that have recently lowered.
    HiveHexLowered,
}

const TheHiveMapName: string = "TheHive"

interface PendingMapEvent {
    ability: DisplayedAbility
    delay: number
    replace?: boolean // if set, will replace existing ability
    remove_after?: number
}
interface PendingHiveStateChange {
    id: number
    raised: boolean
    delay: number
}

const propsAreEqual = (prevProps: MiniMapAbilitiesDisplayProps, nextProps: MiniMapAbilitiesDisplayProps) => {
    return prevProps.map.Name === nextProps.map.Name
}

interface MiniMapAbilitiesDisplayProps {
    map: GameMap
    poppedOutContainerRef?: React.MutableRefObject<HTMLElement | null>
}

export const MiniMapAbilitiesDisplay = React.memo(function MiniMapAbilitiesDisplay({ map, poppedOutContainerRef }: MiniMapAbilitiesDisplayProps) {
    const { currentArenaID } = useArena()
    const [abilityList, setAbilityList] = useState<DisplayedAbility[]>([])
    const [mapEvents, setMapEvents] = useState<DisplayedAbility[]>([])
    const timeouts = useRef<Map<string, NodeJS.Timeout>>(new Map<string, NodeJS.Timeout>())
    const [hiveState, setHiveState] = useState<boolean[]>([])

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
            let offset = 0

            const newMapEvents: DisplayedAbility[] = [] // events to be added
            const pendingMapEvents: PendingMapEvent[] = [] // events to be added after their individual timeout
            const pendingHiveState: PendingHiveStateChange[] = []

            do {
                const count = dv.getUint8(offset)
                offset++
                for (let c = 0; c < count; c++) {
                    const type = dv.getUint8(offset) as MapEventType
                    offset++
                    switch (type) {
                        case MapEventType.AirstrikeExplosions: {
                            const explosionCount = dv.getUint8(offset)
                            offset++

                            let firstTimeOffset = 0
                            for (let i = 0; i < explosionCount; i++) {
                                let timeOffset = dv.getUint8(offset)
                                offset++
                                const x = dv.getInt32(offset)
                                offset += 4
                                const y = dv.getInt32(offset)
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
                                const id = `explosion-${x}-${y}`
                                const ability: DisplayedAbility = {
                                    offering_id: id,
                                    image_url: "",
                                    mini_map_display_effect_type: MiniMapDisplayEffectType.Explosion,
                                    mech_display_effect_type: MechDisplayEffectType.None,
                                    location_select_type: LocationSelectType.LocationSelect,
                                    location: { x, y },
                                    location_in_pixels: true,
                                    radius: 2500,
                                    colour: "#FF6600",
                                    border_width: 2,
                                    show_below_mechs: true,
                                }
                                pendingMapEvents.push({ ability, delay: timeOffset, remove_after: 4000 })
                            }
                            break
                        }
                        case MapEventType.LandmineActivations: {
                            const landmineCount = dv.getUint16(offset)
                            offset += 2
                            const factionNo = dv.getUint8(offset)
                            offset++

                            let firstTimeOffset = 0
                            for (let i = 0; i < landmineCount; i++) {
                                const landmineID = dv.getUint16(offset)
                                offset += 2
                                let timeOffset = dv.getUint8(offset)
                                offset++
                                const x = dv.getInt32(offset)
                                offset += 4
                                const y = dv.getInt32(offset)
                                offset += 4

                                let noAnim = false
                                if (timeOffset === 255) {
                                    // Time offset never go past 250, so 255 is used to mark an event that will spawn instantly with no animation
                                    noAnim = true
                                } else {
                                    if (i === 0) {
                                        firstTimeOffset = timeOffset
                                        timeOffset = 0
                                    } else if (firstTimeOffset > 0) {
                                        timeOffset = firstTimeOffset - timeOffset
                                    }
                                }

                                // Show landmine activation after time offset
                                let image_url = "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/mini-map/landmines/landmine.webp"
                                let colour = "#000000"
                                switch (factionNo) {
                                    case 1:
                                        image_url =
                                            "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/mini-map/landmines/landmine_redmountain.webp"
                                        colour = "#C24242"
                                        break
                                    case 2:
                                        image_url =
                                            "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/mini-map/landmines/landmine_boston.webp"
                                        colour = "#428EC1"
                                        break
                                    case 3:
                                        image_url =
                                            "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/mini-map/landmines/landmine_zai.webp"
                                        colour = "#FFFFFF"
                                        break
                                }

                                const id = `landmine-${landmineID}`
                                const ability: DisplayedAbility = {
                                    offering_id: id,
                                    image_url,
                                    mini_map_display_effect_type: noAnim ? MiniMapDisplayEffectType.None : MiniMapDisplayEffectType.Landmine,
                                    mech_display_effect_type: MechDisplayEffectType.None,
                                    location_select_type: LocationSelectType.LocationSelect,
                                    location: { x, y },
                                    location_in_pixels: true,
                                    colour,
                                    border_width: 2,
                                    show_below_mechs: true,
                                    no_background_colour: true,
                                    size_grid_override: 0.5,
                                }
                                if (timeOffset === 0) {
                                    newMapEvents.push(ability)
                                } else {
                                    pendingMapEvents.push({ ability, delay: timeOffset })
                                }
                            }
                            break
                        }
                        case MapEventType.LandmineExplosions: {
                            const landmineCount = dv.getUint16(offset)
                            offset += 2

                            let firstTimeOffset = 0
                            for (let i = 0; i < landmineCount; i++) {
                                const landmineID = dv.getUint16(offset)
                                offset += 2
                                let timeOffset = dv.getUint8(offset)
                                offset++

                                if (i === 0) {
                                    firstTimeOffset = timeOffset
                                    timeOffset = 0
                                } else {
                                    timeOffset = firstTimeOffset - timeOffset
                                }

                                // Landmine Explosion
                                const id = `landmine-${landmineID}`
                                const ability: DisplayedAbility = {
                                    offering_id: id,
                                    image_url: "",
                                    mini_map_display_effect_type: MiniMapDisplayEffectType.Explosion,
                                    mech_display_effect_type: MechDisplayEffectType.None,
                                    location_select_type: LocationSelectType.LocationSelect,
                                    location: { x: -1, y: -1 }, // location is taken from existing landmine on the mini-map (using id)
                                    location_in_pixels: true,
                                    radius: 1000,
                                    colour: "#FF6600",
                                    border_width: 2,
                                    show_below_mechs: false, // too hard to see landmine explosions as they are small and always under mechs
                                }
                                pendingMapEvents.push({ ability, delay: timeOffset, replace: true, remove_after: 4000 })
                            }
                            break
                        }
                        case MapEventType.HiveState: {
                            // Hive state is 589 booleans packed into 74 bytes (589 / 8bits)
                            const newHiveState: boolean[] = []
                            for (let b = 0; b < 74; b++) {
                                const byte = dv.getUint8(offset)
                                offset++
                                for (let i = 0; i < 8; i++) {
                                    newHiveState.push((byte & (1 << i)) != 0)
                                    if (newHiveState.length >= 589) break
                                }
                            }
                            setHiveState(newHiveState)
                            break
                        }
                        case MapEventType.HiveHexRaised: {
                            const changeCount = dv.getUint16(offset)
                            offset += 2

                            for (let i = 0; i < changeCount; i++) {
                                const hexID = dv.getUint16(offset)
                                offset += 2
                                let timeOffset = dv.getUint8(offset)
                                offset++

                                timeOffset = 250 - timeOffset

                                pendingHiveState.push({ id: hexID, raised: true, delay: timeOffset })
                            }
                            break
                        }
                        case MapEventType.HiveHexLowered: {
                            const changeCount = dv.getUint16(offset)
                            offset += 2

                            for (let i = 0; i < changeCount; i++) {
                                const hexID = dv.getUint16(offset)
                                offset += 2
                                let timeOffset = dv.getUint8(offset)
                                offset++

                                timeOffset = 250 - timeOffset

                                pendingHiveState.push({ id: hexID, raised: false, delay: timeOffset })
                            }
                            break
                        }
                    }
                }
            } while (offset < dv.byteLength)

            // Add new map events
            setMapEvents((events) => [...events, ...newMapEvents])

            // Delayed map events (map events come with time offsets, so they can show on the map in the same order as they occurred in-game)
            for (const pendingMapEvent of pendingMapEvents) {
                const t = setTimeout(
                    (pendingMapEvent: PendingMapEvent) => {
                        if (pendingMapEvent.replace) {
                            // Replace existing ability
                            setMapEvents((events) =>
                                events.map((item) => {
                                    if (item.offering_id === pendingMapEvent.ability.offering_id) {
                                        return { ...pendingMapEvent.ability, location: item.location }
                                    }
                                    return item
                                }),
                            )
                        } else {
                            // Add ability
                            setMapEvents((events) => [...events, pendingMapEvent.ability])
                        }

                        if (pendingMapEvent.remove_after) {
                            // Remove after delay
                            const rt = setTimeout(() => {
                                setMapEvents((events) => events.filter((item) => item.offering_id !== pendingMapEvent.ability.offering_id))
                                timeouts.current.delete(pendingMapEvent.ability.offering_id)
                            }, pendingMapEvent.remove_after)
                            timeouts.current.set(pendingMapEvent.ability.offering_id, rt)
                        } else {
                            timeouts.current.delete(pendingMapEvent.ability.offering_id)
                        }
                    },
                    pendingMapEvent.delay,
                    pendingMapEvent,
                )
                timeouts.current.set(pendingMapEvent.ability.offering_id, t)
            }

            // Delayed hive hex update
            for (const pendingChange of pendingHiveState) {
                const hiveTimeoutID = `hive-hex-${pendingChange.id}`
                const t = setTimeout(
                    (id: number, raised: boolean, hiveTimeoutID: string) => {
                        setHiveState((prev) => [...prev.slice(0, id), raised, ...prev.slice(id + 1)])
                        timeouts.current.delete(hiveTimeoutID)
                    },
                    pendingChange.delay,
                    pendingChange.id,
                    pendingChange.raised,
                    hiveTimeoutID,
                )
                timeouts.current.set(hiveTimeoutID, t)
            }
        },
    )

    // Clear timeouts on unmount
    useEffect(() => {
        const timeoutsRef = timeouts.current
        return () => {
            timeoutsRef.forEach((t) => clearTimeout(t))
        }
    }, [])

    return useMemo(
        () => (
            <>
                {abilityList.length > 0 &&
                    abilityList.map((displayAbility) => <MiniMapAbilityDisplay key={displayAbility.offering_id} displayAbility={displayAbility} />)}

                {mapEvents.length > 0 &&
                    mapEvents.map((displayAbility) => <MiniMapAbilityDisplay key={displayAbility.offering_id} displayAbility={displayAbility} />)}

                {map.Name === TheHiveMapName && <HiveHexes map={map} state={hiveState} poppedOutContainerRef={poppedOutContainerRef} />}
            </>
        ),
        [abilityList, hiveState, map, mapEvents, poppedOutContainerRef],
    )
}, propsAreEqual)

interface MiniMapAbilityDisplayProps {
    displayAbility: DisplayedAbility
}

const propsAreEqualMiniMapAbilityDisplay = (prevProps: MiniMapAbilityDisplayProps, nextProps: MiniMapAbilityDisplayProps) => {
    return (
        prevProps.displayAbility.offering_id === nextProps.displayAbility.offering_id &&
        prevProps.displayAbility.launching_at === nextProps.displayAbility.launching_at
    )
}

const MiniMapAbilityDisplay = React.memo(function MiniMapAbilityDisplay({ displayAbility }: MiniMapAbilityDisplayProps) {
    const {
        image_url,
        colour,
        radius,
        launching_at,
        location,
        location_in_pixels,
        mini_map_display_effect_type,
        border_width,
        show_below_mechs,
        no_background_colour,
        size_grid_override,
    } = displayAbility
    const { gridHeight } = useMiniMap()
    const { map } = useGame()

    const mapScale = useMemo(() => (map ? map.Width / (map.Cells_X * GAME_CLIENT_TILE_SIZE) : 0), [map])
    const position = useMemo(
        () =>
            location_in_pixels ? { x: (location.x - (map ? map.Pixel_Left : 0)) * mapScale, y: (location.y - (map ? map.Pixel_Top : 0)) * mapScale } : location,
        [map, mapScale, location, location_in_pixels],
    )
    const diameter = useMemo(() => (radius ? radius * mapScale * 2 : 0), [mapScale, radius])

    const iconAnimation = useMemo(() => {
        switch (mini_map_display_effect_type) {
            case MiniMapDisplayEffectType.Drop:
                return `${dropEffect(3)} 2s ease-out`
            case MiniMapDisplayEffectType.Landmine:
                return `${dropEffect(2)} 1.5s ease-out, ${landmineEffect("https://i.imgur.com/hL62NOp.png", image_url)} 3s ease-out forwards` // 3s landmine arm delay
            default:
                return "none"
        }
    }, [image_url, mini_map_display_effect_type])

    const diameterAnimation = useMemo(() => {
        switch (mini_map_display_effect_type) {
            case MiniMapDisplayEffectType.Range:
                return `${rippleEffect(colour)} 10s ease-out`
            case MiniMapDisplayEffectType.Pulse:
                return `${explosionEffect(colour)} 1.2s infinite`
            case MiniMapDisplayEffectType.Explosion:
                return `${explosionEffect(colour)} 3s forwards`
            case MiniMapDisplayEffectType.Fade:
                return `${fadeEffect()} 1s forwards`
            default:
                return "none"
        }
    }, [colour, mini_map_display_effect_type])

    return useMemo(() => {
        return (
            <MapIcon
                position={position}
                locationInPixels={location_in_pixels || false}
                sizeGrid={size_grid_override || (diameter ? 0.5 : 1.5)}
                primaryColor={colour}
                backgroundImageUrl={image_url}
                noBackgroundColour={!!no_background_colour}
                iconSx={{ animation: iconAnimation }}
                zIndex={show_below_mechs ? 1 : 100}
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
                                    borderWidth: `${border_width || 8}px`,
                                    borderColor: colour,
                                    borderStyle: "dashed solid",
                                    backgroundColor: "#00000010",
                                    animation: diameterAnimation,
                                    zIndex: 90,
                                }}
                            />
                        )}
                    </>
                }
            />
        )
    }, [position, location_in_pixels, size_grid_override, diameter, colour, image_url, no_background_colour, iconAnimation, show_below_mechs, launching_at, gridHeight, border_width, diameterAnimation])
}, propsAreEqualMiniMapAbilityDisplay)

const Countdown = ({ launchDate }: { launchDate: Date }) => {
    const { totalSecRemain } = useTimer(launchDate)
    if (totalSecRemain <= 0) return null
    return <>{totalSecRemain + 1}</>
}
