import { decode } from "base64-arraybuffer"
import React, { useEffect, useRef, useState } from "react"
import { useArena, useMiniMapPixi } from "../../../../../containers"
import { useGameServerSubscription } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { DisplayedAbility, LocationSelectType, MechDisplayEffectType, MiniMapDisplayEffectType } from "../../../../../types"
import { PixiMapAbilities } from "./pixiMapAbilities"

export enum MapEventType {
    // Airstrike Explosions - The locations of airstrike missile impacts.
    AirstrikeExplosions = 0,
    // Landmine Activations - The id, location and faction of a mine that got activated.
    LandmineActivations = 1,
    // Landmine Explosions - The ids of mines that exploded.
    LandmineExplosions = 2,
    // Hive State - The full state of The Hive map.
    HiveState = 3,
    // Hive Hex Raised - The ids of the hexes that have recently raised.
    HiveHexRaised = 4,
    // Hive Hex Lowered - The ids of the hexes that have recently lowered.
    HiveHexLowered = 5,
}

interface PendingMapEvent {
    ability: DisplayedAbility
    delay: number // Milliseconds
    replace?: boolean // If set, will replace existing ability
    remove_after?: number // Milliseconds
}
interface PendingHiveStateChange {
    id: number
    raised: boolean
    delay: number
}

export const MapAbilities = React.memo(function MapAbilities() {
    const { currentArenaID } = useArena()
    const { pixiMainItems, gridSizeRef, gridCellToViewportPosition } = useMiniMapPixi()
    const [pixiMapAbilities, setPixiMapAbilities] = useState<PixiMapAbilities>()

    // Refs, doesnt cause re-render
    const basicAbilities = useRef<DisplayedAbility[]>([])
    const complexAbilities = useRef<DisplayedAbility[]>([])
    const hiveStatus = useRef<boolean[]>([])
    const timeouts = useRef<Map<string, NodeJS.Timeout>>(new Map<string, NodeJS.Timeout>())

    // Initial setup
    useEffect(() => {
        if (!pixiMainItems) return
        const pixiMapAbilities = new PixiMapAbilities(gridSizeRef, gridCellToViewportPosition, basicAbilities, complexAbilities)
        pixiMainItems.viewport.addChild(pixiMapAbilities.root)
        setPixiMapAbilities((prev) => {
            prev?.destroy()
            return pixiMapAbilities
        })
    }, [pixiMainItems, gridSizeRef, gridCellToViewportPosition])

    // Cleanup
    useEffect(() => {
        return () => pixiMapAbilities?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiMapAbilities])

    // Clear timeouts on unmount
    useEffect(() => {
        const timeoutsRef = timeouts.current
        return () => {
            timeoutsRef.forEach((t) => clearTimeout(t))
        }
    }, [])

    // Subscribe on basic map abilities like repair, emp etc.
    useGameServerSubscription<DisplayedAbility[]>(
        {
            URI: `/public/arena/${currentArenaID}/mini_map_ability_display_list`,
            key: GameServerKeys.SubMiniMapAbilityDisplayList,
            ready: !!currentArenaID,
        },
        (payload) => {
            if (!payload) {
                basicAbilities.current = []
                return
            }

            // Only show the ones that are not on a mech
            basicAbilities.current = payload.filter((da) => !da.mech_id)
            console.log(payload)
        },
    )

    // Other complex map abilities are sent through as byte array to save bandwidth
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

            const newMapEvents: DisplayedAbility[] = [] // Events to be added
            const pendingMapEvents: PendingMapEvent[] = [] // Events to be added after their individual timeout
            const pendingHiveState: PendingHiveStateChange[] = []

            do {
                const count = dv.getUint8(offset)
                offset++
                for (let c = 0; c < count; c++) {
                    const type = dv.getUint8(offset) as MapEventType
                    offset++
                    switch (type) {
                        // Airstrikes
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
                                    radius: 2500,
                                    colour: "#FF6600",
                                    border_width: 1,
                                    show_below_mechs: true,
                                    location_in_pixels: true,
                                }
                                pendingMapEvents.push({ ability, delay: timeOffset, remove_after: 4000 })
                            }
                            break
                        }
                        // Landmines activations
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
                                    colour,
                                    border_width: 1,
                                    show_below_mechs: true,
                                    grid_size_multiplier: 0.5,
                                    location_in_pixels: true,
                                }
                                if (timeOffset === 0) {
                                    newMapEvents.push(ability)
                                } else {
                                    pendingMapEvents.push({ ability, delay: timeOffset })
                                }
                            }
                            break
                        }
                        // Landmine explosions
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
                                    location: { x: -1, y: -1 }, // Location is taken from existing landmine on the mini-map (using id)
                                    radius: 1000,
                                    colour: "#FF6600",
                                    border_width: 1,
                                    show_below_mechs: false, // Too hard to see landmine explosions as they are small and always under mechs
                                    location_in_pixels: true,
                                }
                                pendingMapEvents.push({ ability, delay: timeOffset, replace: true, remove_after: 4000 })
                            }
                            break
                        }
                        // Hive state
                        case MapEventType.HiveState: {
                            // Hive state is 589 booleans packed into 74 bytes (589 / 8 bits)
                            const newHiveState: boolean[] = []
                            for (let b = 0; b < 74; b++) {
                                const byte = dv.getUint8(offset)
                                offset++
                                for (let i = 0; i < 8; i++) {
                                    newHiveState.push((byte & (1 << i)) != 0)
                                    if (newHiveState.length >= 589) break
                                }
                            }

                            hiveStatus.current = newHiveState
                            break
                        }
                        // Hive raised
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
                        // Hive lowered
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
            complexAbilities.current = [...complexAbilities.current, ...newMapEvents]

            // Add new map events after the delayed (map events come with time offsets, so they can
            // 	show on the map in the same order as they occurred in-game)
            for (const pendingMapEvent of pendingMapEvents) {
                const t = setTimeout(
                    (pendingMapEvent: PendingMapEvent) => {
                        if (pendingMapEvent.replace) {
                            // Replace existing ability
                            complexAbilities.current = complexAbilities.current.map((item) => {
                                if (item.offering_id === pendingMapEvent.ability.offering_id) {
                                    return { ...pendingMapEvent.ability, location: item.location }
                                }
                                return item
                            })
                        } else {
                            // Add ability
                            complexAbilities.current = [...complexAbilities.current, pendingMapEvent.ability]
                        }

                        // Remove after delay
                        if (pendingMapEvent.remove_after) {
                            const rt = setTimeout(() => {
                                complexAbilities.current = complexAbilities.current.filter((item) => item.offering_id !== pendingMapEvent.ability.offering_id)
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
                        hiveStatus.current = [...hiveStatus.current.slice(0, id), raised, ...hiveStatus.current.slice(id + 1)]
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

    return null
})
