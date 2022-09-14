import { ease } from "pixi-ease"
import * as PIXI from "pixi.js"
import React, { useEffect, useMemo, useState } from "react"
import { useArena, useAuth, useGame, useMiniMapPixi, useSupremacy } from "../../../../../containers"
import { HEXToVBColor } from "../../../../../helpers"
import { useGameServerSubscription } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors } from "../../../../../theme/theme"
import { WarMachineLiveState, WarMachineState } from "../../../../../types"

interface PixiItems {
    container: PIXI.Container<PIXI.DisplayObject>
    graphics: PIXI.Graphics
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
    const { pixiMainItems, gridSizeRef, getViewportPosition, highlightedMechParticipantID, isTargeting, selection, playerAbility } = useMiniMapPixi()
    const { id, hash, participantID, factionID: warMachineFactionID, maxHealth, maxShield, ownedByID } = warMachine

    const [pixiItems, setPixiItems] = useState<PixiItems>()

    const [isAlive, setIsAlive] = useState(warMachine.health > 0)
    const [isHidden, setIsHidden] = useState<boolean>(warMachine.isHidden)
    const isMechHighlighted = useMemo(
        () => highlightedMechParticipantID === warMachine.participantID || selection?.mechHash === hash || playerAbility?.mechHash === hash,
        [hash, highlightedMechParticipantID, playerAbility?.mechHash, selection?.mechHash, warMachine.participantID],
    )
    const primaryColor = useMemo(
        () => (ownedByID === userID ? colors.gold : getFaction(warMachineFactionID).primary_color || colors.neonBlue),
        [ownedByID, userID, getFaction, warMachineFactionID],
    )

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMainItems) return

        // Create container for everything
        const container = new PIXI.Container()
        const graphics = new PIXI.Graphics()

        container.x = -100
        container.y = -100
        container.zIndex = 10
        container.interactive = true
        container.buttonMode = true

        container.addChild(graphics)
        pixiMainItems.viewport.addChild(container)
        setPixiItems({ container, graphics })
    }, [pixiMainItems])

    // Cleanup
    useEffect(() => {
        return () => pixiItems?.container.destroy(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Update graphics
    useEffect(() => {
        if (!pixiItems) return

        // Draw the box
        pixiItems.graphics.clear()
        pixiItems.graphics.beginFill(HEXToVBColor("#000000"), 0.8)
        pixiItems.graphics.lineStyle(2, HEXToVBColor(primaryColor))
        pixiItems.graphics.drawRoundedRect(0, 0, gridSizeRef.current.width, gridSizeRef.current.height, 2)
        pixiItems.graphics.endFill()

        // Draw the rotation arrow
        const triangleWidth = gridSizeRef.current.width / 5
        const triangleHeight = triangleWidth
        const triangleHalfway = triangleWidth / 2
        const point1 = [gridSizeRef.current.width / 2 - triangleHalfway, -gridSizeRef.current.width / 3.5]
        const point2 = [point1[0] + triangleWidth, point1[1]]
        const point3 = [point1[0] + triangleHalfway, point1[1] - triangleHeight]

        pixiItems.graphics.beginFill(HEXToVBColor(primaryColor))
        pixiItems.graphics.lineStyle(2, HEXToVBColor(primaryColor))
        pixiItems.graphics.moveTo(point1[0], point1[1])
        pixiItems.graphics.lineTo(point2[0], point2[1])
        pixiItems.graphics.lineTo(point3[0], point3[1])
        pixiItems.graphics.lineTo(point1[0], point1[1])
        pixiItems.graphics.closePath()
        pixiItems.graphics.endFill()
    }, [gridSizeRef, pixiItems, primaryColor, map])

    // Update zIndex
    useEffect(() => {
        if (!pixiItems) return

        let zIndex = 4
        if (isMechHighlighted) zIndex = 7
        if (isAlive && factionID === warMachineFactionID) zIndex = 6
        if (isAlive) zIndex = 5

        pixiItems.container.zIndex = zIndex
    }, [factionID, isAlive, isMechHighlighted, pixiItems, warMachineFactionID])

    // Listen on mech stats
    useGameServerSubscription<WarMachineLiveState | undefined>(
        {
            URI: `/public/arena/${currentArenaID}/mech/${participantID}`,
            key: GameServerKeys.SubMechLiveStats,
            ready: !!participantID && !!currentArenaID && !!pixiItems,
            batchURI: `/public/arena/${currentArenaID}/mech`,
        },
        (payload) => {
            // Direct DOM manipulation is a lot more optimized than re-rendering
            // if (payload?.health !== undefined) {
            //     setIsAlive(payload.health > 0)

            //     const healthBarEl = (poppedOutContainerRef?.current || document).querySelector(`#map-mech-health-bar-${hash}`) as HTMLElement
            //     if (healthBarEl) {
            //         const percent = Math.min((payload.health / maxHealth) * 100, 100)
            //         healthBarEl.style.width = `${percent}%`
            //         healthBarEl.style.backgroundColor = percent <= 45 ? colors.red : colors.health
            //     }
            // }

            // if (payload?.shield !== undefined) {
            //     const shieldBarEl = (poppedOutContainerRef?.current || document).querySelector(`#map-mech-shield-bar-${hash}`) as HTMLElement
            //     if (shieldBarEl) {
            //         const percent = Math.min((payload.shield / maxShield) * 100, 100)
            //         shieldBarEl.style.width = `${percent}%`
            //     }
            // }

            if (payload?.position !== undefined) {
                if (pixiItems?.container) {
                    const pos = getViewportPosition.current(payload.position.x, payload.position.y)
                    ease.add(pixiItems.container, { x: pos.x, y: pos.y }, { duration: 275, ease: "linear" })
                }

                // const positionEl = (poppedOutContainerRef?.current || document).querySelector(`#map-mech-position-${hash}`) as HTMLElement
                // if (positionEl) {
                //     const mechMapX = ((payload.position?.x || 0) - map.Pixel_Left) * mapScale
                //     const mechMapY = ((payload.position?.y || 0) - map.Pixel_Top) * mapScale
                //     positionEl.style.transform = `translate(-50%, -50%) translate3d(${mechMapX}px, ${mechMapY}px, 0)`

                //     // Update the mech move dash line length and rotation
                //     const moveCommandEl = (poppedOutContainerRef?.current || document).querySelector(`#map-mech-move-command-${hash}`) as HTMLElement
                //     if (moveCommandEl) {
                //         const mCommand = tempMechMoveCommand.current || mechMoveCommand.current
                //         if (mCommand?.cell_x && mCommand?.cell_y && !mCommand?.reached_at) {
                //             const commandMapX = mCommand.cell_x * gridWidth
                //             const commandMapY = mCommand.cell_y * gridHeight
                //             const x = Math.abs(mechMapX - commandMapX)
                //             const y = Math.abs(mechMapY - commandMapY)
                //             moveCommandEl.style.display = "block"
                //             moveCommandEl.style.height = `${2 * Math.sqrt(x * x + y * y)}px`

                //             const rotation = (Math.atan2(commandMapY - mechMapY, commandMapX - mechMapX) * 180) / Math.PI
                //             const newRotation = closestAngle(prevMechMoveCommandRotation.current, rotation || 0)
                //             moveCommandEl.style.transform = `translate(-50%, -50%) rotate(${newRotation + 90}deg)`
                //             prevMechMoveCommandRotation.current = newRotation
                //         } else {
                //             moveCommandEl.style.display = "none"
                //         }
                //     }
                // }
            }

            // if (payload?.rotation !== undefined) {
            //     const rotationEl = (poppedOutContainerRef?.current || document).querySelector(`#map-mech-rotation-${hash}`) as HTMLElement
            //     if (rotationEl) {
            //         // 0 is east, and goes CW, can be negative and above 360
            //         const newRotation = closestAngle(prevRotation.current, payload.rotation || 0)
            //         rotationEl.style.transform = `translate(-50%, -50%) rotate(${newRotation + 90}deg)`
            //         prevRotation.current = newRotation
            //     }
            // }

            // if (payload?.is_hidden !== undefined) {
            //     setIsHidden(payload.is_hidden)
            // }
        },
    )

    return null
}, propsAreEqual)
