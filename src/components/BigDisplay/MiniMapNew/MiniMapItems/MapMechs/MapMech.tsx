import { ease } from "pixi-ease"
import * as PIXI from "pixi.js"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useArena, useAuth, useGame, useMiniMapPixi, useSupremacy } from "../../../../../containers"
import { closestAngle, deg2rad, HEXToVBColor } from "../../../../../helpers"
import { useGameServerSubscription } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts } from "../../../../../theme/theme"
import { WarMachineLiveState, WarMachineState } from "../../../../../types"

interface PixiItems {
    container: PIXI.Container<PIXI.DisplayObject>
    rectGraphics: PIXI.Graphics
    arrowGraphics: PIXI.Graphics
    numberText: PIXI.Text
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

    const prevRotation = useRef(warMachine.rotation)
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
        container.x = -100
        container.y = -100
        container.zIndex = 10
        container.interactive = true
        container.buttonMode = true

        // Rect
        const rectGraphics = new PIXI.Graphics()

        // Rotation arrow
        const arrowGraphics = new PIXI.Graphics()

        // Number text
        const numberTextStyle = new PIXI.TextStyle({
            fontFamily: fonts.nostromoBlack,
            fontSize: 15,
            fill: "#FFFFFF",
        })
        const numberText = new PIXI.Text(label, numberTextStyle)
        numberText.anchor.set(0.5, 0.5)
        numberText.resolution = 4

        // Add everything to container
        container.addChild(rectGraphics)
        container.addChild(arrowGraphics)
        container.addChild(numberText)
        pixiMainItems.viewport.addChild(container)
        setPixiItems({ container, rectGraphics, arrowGraphics, numberText })
    }, [label, pixiMainItems])

    // Cleanup
    useEffect(() => {
        return () => pixiItems?.container.destroy(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Update graphics
    useEffect(() => {
        if (!pixiItems) return

        // Update number text
        pixiItems.numberText.style.fill = primaryColor
        pixiItems.numberText.position.set(gridSizeRef.current.width / 2, gridSizeRef.current.height / 2)

        // Draw the box
        pixiItems.rectGraphics.clear()
        pixiItems.rectGraphics.beginFill(HEXToVBColor("#000000"), 0.8)
        pixiItems.rectGraphics.lineStyle(2, HEXToVBColor(primaryColor))
        pixiItems.rectGraphics.drawRoundedRect(0, 0, gridSizeRef.current.width, gridSizeRef.current.height, 6)
        pixiItems.rectGraphics.endFill()

        // Draw the rotation arrow
        const triangleWidth = gridSizeRef.current.width / 4.2
        const triangleHeight = triangleWidth * 0.9
        const triangleHalfway = triangleWidth / 2

        const triPoint1 = [0, 0]
        const triPoint2 = [triangleWidth, 0]
        const triPoint3 = [triangleHalfway, -triangleHeight]
        // Draw the triangle
        pixiItems.arrowGraphics.beginFill(HEXToVBColor(primaryColor))
        pixiItems.arrowGraphics.lineStyle(1, HEXToVBColor(primaryColor))
        pixiItems.arrowGraphics.moveTo(triPoint1[0], triPoint1[1])
        pixiItems.arrowGraphics.lineTo(triPoint2[0], triPoint2[1])
        pixiItems.arrowGraphics.lineTo(triPoint3[0], triPoint3[1])
        pixiItems.arrowGraphics.lineTo(triPoint1[0], triPoint1[1])
        pixiItems.arrowGraphics.closePath()
        pixiItems.arrowGraphics.endFill()
        pixiItems.arrowGraphics.position.set(gridSizeRef.current.width / 2, gridSizeRef.current.height / 2)
        pixiItems.arrowGraphics.pivot.set(triangleHalfway, gridSizeRef.current.height / 2 + gridSizeRef.current.height / 3.4)
    }, [gridSizeRef, pixiItems, primaryColor, map])

    // Update the

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
                    const newPos = getViewportPosition.current(payload.position.x, payload.position.y)
                    // Default its the top left corner, so center it
                    newPos.x -= pixiItems.rectGraphics.width / 2
                    newPos.y -= pixiItems.rectGraphics.height / 2
                    ease.add(pixiItems.container, { x: newPos.x, y: newPos.y }, { duration: 275, ease: "linear" })
                }

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

            if (payload?.rotation !== undefined) {
                if (pixiItems?.container) {
                    const newRot = closestAngle(prevRotation.current, payload.rotation || 0)
                    const newRotRad = deg2rad(newRot)
                    ease.add(pixiItems.arrowGraphics, { rotation: newRotRad }, { duration: 275, ease: "linear" })
                    prevRotation.current = newRot
                }
                //     // 0 is east, and goes CW, can be negative and above 360
                //     const newRotation = closestAngle(prevRotation.current, payload.rotation || 0)
                //     rotationEl.style.transform = `translate(-50%, -50%) rotate(${newRotation + 90}deg)`
                //     prevRotation.current = newRotation
            }

            // if (payload?.is_hidden !== undefined) {
            //     setIsHidden(payload.is_hidden)
            // }
        },
    )

    return null
}, propsAreEqual)
