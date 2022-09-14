import * as PIXI from "pixi.js"
import React, { useEffect, useMemo, useState } from "react"
import { useArena, useAuth, useGame, useMiniMapPixi, useSupremacy } from "../../../../../containers"
import { colors } from "../../../../../theme/theme"
import { WarMachineState } from "../../../../../types"

interface PixiItems {
    container: PIXI.Container<PIXI.DisplayObject>
    rect: PIXI.Graphics
}

interface MapMechProps {
    warMachine: WarMachineState
    label: number
    isAI?: boolean
}

const propsAreEqual = (prevProps: MapMechProps, nextProps: MapMechProps) => {
    return prevProps.warMachine.id === nextProps.warMachine.id && prevProps.label === nextProps.label && prevProps.isAI === nextProps.isAI
}

export const MapMech = React.memo(function MapMech({ warMachine, label, isAI }: MapMechProps) {
    const { map } = useGame()
    const { userID, factionID } = useAuth()
    const { currentArenaID } = useArena()
    const { getFaction } = useSupremacy()
    const { pixiMainItems } = useMiniMapPixi()
    const { id, hash, participantID, factionID: warMachineFactionID, maxHealth, maxShield, ownedByID } = warMachine

    const [pixiItems, setPixiItems] = useState<PixiItems>()

    const primaryColor = useMemo(
        () => (ownedByID === userID ? colors.gold : getFaction(warMachineFactionID).primary_color || colors.neonBlue),
        [ownedByID, userID, getFaction, warMachineFactionID],
    )

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMainItems) return

        // Create container for everything
        const container = new PIXI.Container()
        const rect = new PIXI.Graphics()

        pixiMainItems.viewport.addChild(rect)

        setPixiItems({ container, rect })
    }, [pixiMainItems])

    // Cleanup
    useEffect(() => {
        return () => pixiItems?.container.destroy(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Update some basic styles of the mech
    // useEffect(() => {

    //     rectRef.current.beginFill
    // }, [])

    // Listen on mech stats
    // useGameServerSubscription<WarMachineLiveState | undefined>(
    //     {
    //         URI: `/public/arena/${currentArenaID}/mech/${participantID}`,
    //         key: GameServerKeys.SubMechLiveStats,
    //         ready: !!participantID && !!currentArenaID,
    //         batchURI: `/public/arena/${currentArenaID}/mech`,
    //     },
    //     (payload) => {
    //         // Direct DOM manipulation is a lot more optimized than re-rendering
    //         if (payload?.health !== undefined) {
    //             setIsAlive(payload.health > 0)

    //             const healthBarEl = (poppedOutContainerRef?.current || document).querySelector(`#map-mech-health-bar-${hash}`) as HTMLElement
    //             if (healthBarEl) {
    //                 const percent = Math.min((payload.health / maxHealth) * 100, 100)
    //                 healthBarEl.style.width = `${percent}%`
    //                 healthBarEl.style.backgroundColor = percent <= 45 ? colors.red : colors.health
    //             }
    //         }

    //         if (payload?.shield !== undefined) {
    //             const shieldBarEl = (poppedOutContainerRef?.current || document).querySelector(`#map-mech-shield-bar-${hash}`) as HTMLElement
    //             if (shieldBarEl) {
    //                 const percent = Math.min((payload.shield / maxShield) * 100, 100)
    //                 shieldBarEl.style.width = `${percent}%`
    //             }
    //         }

    //         if (payload?.position !== undefined) {
    //             const positionEl = (poppedOutContainerRef?.current || document).querySelector(`#map-mech-position-${hash}`) as HTMLElement
    //             if (positionEl) {
    //                 const mechMapX = ((payload.position?.x || 0) - map.Pixel_Left) * mapScale
    //                 const mechMapY = ((payload.position?.y || 0) - map.Pixel_Top) * mapScale
    //                 positionEl.style.transform = `translate(-50%, -50%) translate3d(${mechMapX}px, ${mechMapY}px, 0)`

    //                 // Update the mech move dash line length and rotation
    //                 const moveCommandEl = (poppedOutContainerRef?.current || document).querySelector(`#map-mech-move-command-${hash}`) as HTMLElement
    //                 if (moveCommandEl) {
    //                     const mCommand = tempMechMoveCommand.current || mechMoveCommand.current
    //                     if (mCommand?.cell_x && mCommand?.cell_y && !mCommand?.reached_at) {
    //                         const commandMapX = mCommand.cell_x * gridWidth
    //                         const commandMapY = mCommand.cell_y * gridHeight
    //                         const x = Math.abs(mechMapX - commandMapX)
    //                         const y = Math.abs(mechMapY - commandMapY)
    //                         moveCommandEl.style.display = "block"
    //                         moveCommandEl.style.height = `${2 * Math.sqrt(x * x + y * y)}px`

    //                         const rotation = (Math.atan2(commandMapY - mechMapY, commandMapX - mechMapX) * 180) / Math.PI
    //                         const newRotation = closestAngle(prevMechMoveCommandRotation.current, rotation || 0)
    //                         moveCommandEl.style.transform = `translate(-50%, -50%) rotate(${newRotation + 90}deg)`
    //                         prevMechMoveCommandRotation.current = newRotation
    //                     } else {
    //                         moveCommandEl.style.display = "none"
    //                     }
    //                 }
    //             }
    //         }

    //         if (payload?.rotation !== undefined) {
    //             const rotationEl = (poppedOutContainerRef?.current || document).querySelector(`#map-mech-rotation-${hash}`) as HTMLElement
    //             if (rotationEl) {
    //                 // 0 is east, and goes CW, can be negative and above 360
    //                 const newRotation = closestAngle(prevRotation.current, payload.rotation || 0)
    //                 rotationEl.style.transform = `translate(-50%, -50%) rotate(${newRotation + 90}deg)`
    //                 prevRotation.current = newRotation
    //             }
    //         }

    //         if (payload?.is_hidden !== undefined) {
    //             setIsHidden(payload.is_hidden)
    //         }
    //     },
    // )

    return null
}, propsAreEqual)
