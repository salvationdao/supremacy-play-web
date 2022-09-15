import { DashLine } from "pixi-dashed-line"
import { ease } from "pixi-ease"
import * as PIXI from "pixi.js"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { CrossPNG } from "../../../../../assets"
import { useArena, useAuth, useGame, useMiniMapPixi, useSupremacy } from "../../../../../containers"
import { closestAngle, deg2rad, HEXToVBColor } from "../../../../../helpers"
import { PixiProgressBar } from "../../../../../helpers/pixiHelpers"
import { useGameServerSubscription, useGameServerSubscriptionFaction } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts } from "../../../../../theme/theme"
import { LocationSelectType, WarMachineLiveState, WarMachineState } from "../../../../../types"
import { MechMoveCommand } from "../../../../WarMachine/WarMachineItem/MoveCommand"

interface PixiItems {
    container: PIXI.Container<PIXI.DisplayObject>
    rectGraphics: PIXI.Graphics
    arrowGraphics: PIXI.Graphics
    numberText: PIXI.Text
    hpBar: PixiProgressBar
    shieldBar: PixiProgressBar
    mechMoveSprite: PIXI.Sprite
    mechMoveDashedLine: PIXI.Graphics
    highlightedCircle: PIXI.Graphics
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
    const { pixiMainItems, gridSizeRef, getPositionInViewport, highlightedMechParticipantID, isTargeting, selection, selectionInstant, playerAbility } =
        useMiniMapPixi()
    const { id, hash, participantID, factionID: warMachineFactionID, maxHealth, maxShield, ownedByID } = warMachine

    const [pixiItems, setPixiItems] = useState<PixiItems>()

    const prevRotation = useRef(warMachine.rotation)
    const [isAlive, setIsAlive] = useState(warMachine.health > 0)
    const isMechHighlighted = useMemo(
        () => highlightedMechParticipantID === warMachine.participantID || selection?.mechHash === hash || playerAbility?.mechHash === hash,
        [hash, highlightedMechParticipantID, playerAbility?.mechHash, selection?.mechHash, warMachine.participantID],
    )
    const primaryColor = useMemo(
        () => (ownedByID === userID ? colors.gold : getFaction(warMachineFactionID).primary_color || colors.neonBlue),
        [ownedByID, userID, getFaction, warMachineFactionID],
    )

    // Mech move command related
    const mechMoveCommand = useRef<MechMoveCommand>()
    const tempMechMoveCommand = useRef<MechMoveCommand>()

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
        container.sortableChildren = true

        // Rect
        const rectGraphics = new PIXI.Graphics()

        // Rotation arrow
        const arrowGraphics = new PIXI.Graphics()
        arrowGraphics.zIndex = 9

        // Number text
        const numberTextStyle = new PIXI.TextStyle({
            fontFamily: fonts.nostromoBlack,
            fontSize: 15,
            fill: "#FFFFFF",
            lineHeight: 1,
        })
        const numberText = new PIXI.Text(label, numberTextStyle)
        numberText.anchor.set(0.5, 0.5)
        numberText.resolution = 4

        // Progress bars
        const hpBar = new PixiProgressBar(0, 0, colors.health, 0)
        const shieldBar = new PixiProgressBar(0, 0, colors.shield, 0)

        // Mech move sprite
        const mechMoveDashedLine = new PIXI.Graphics()
        const mechMoveSprite = PIXI.Sprite.from(CrossPNG)
        mechMoveSprite.visible = false

        // Highlighted mech circle
        const highlightedCircle = new PIXI.Graphics()
        highlightedCircle.zIndex = 20
        ease.add(highlightedCircle, { rotation: deg2rad(360) }, { duration: 3000, ease: "linear", repeat: true })
        ease.add(highlightedCircle, { scale: 1.3 }, { duration: 1000, ease: "linear", repeat: true, reverse: true })

        // Add everything to container
        container.addChild(rectGraphics)
        container.addChild(arrowGraphics)
        container.addChild(numberText)
        container.addChild(hpBar.container)
        container.addChild(shieldBar.container)
        container.addChild(mechMoveSprite)
        container.addChild(highlightedCircle)
        pixiMainItems.viewport.addChild(container)
        setPixiItems({ container, rectGraphics, arrowGraphics, numberText, hpBar, shieldBar, mechMoveSprite, mechMoveDashedLine, highlightedCircle })
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
        pixiItems.numberText.style.fontSize = gridSizeRef.current.height / 1.8
        pixiItems.numberText.position.set(gridSizeRef.current.width / 2, gridSizeRef.current.height / 2.3)

        // Draw the box
        pixiItems.rectGraphics.clear()
        pixiItems.rectGraphics.beginFill(HEXToVBColor("#000000"), 0.8)
        pixiItems.rectGraphics.lineStyle(gridSizeRef.current.height * 0.08, HEXToVBColor(primaryColor))
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

        // Update bars dimension and position
        const barHeight = gridSizeRef.current.height / 5
        const barGap = gridSizeRef.current.height * 0.1
        pixiItems.hpBar.updateDimension(gridSizeRef.current.width, barHeight)
        pixiItems.shieldBar.updateDimension(gridSizeRef.current.width, barHeight)
        pixiItems.hpBar.updatePosition(0, gridSizeRef.current.height + barGap)
        pixiItems.shieldBar.updatePosition(0, gridSizeRef.current.height + barHeight + 2 * barGap)

        // Update the mech move sprite dimension
        pixiItems.mechMoveSprite.width = gridSizeRef.current.width / 2
        pixiItems.mechMoveSprite.height = gridSizeRef.current.height / 2
        pixiItems.mechMoveSprite.tint = HEXToVBColor(primaryColor)
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

    // Highlight the mech circle
    useEffect(() => {
        if (!pixiItems) return
        pixiItems.highlightedCircle.clear()
        if (isMechHighlighted) {
            const dash = new DashLine(pixiItems.highlightedCircle, {
                dash: [4, 2],
                width: gridSizeRef.current.height * 0.09,
                color: HEXToVBColor(colors.orange),
                alpha: 1,
            })

            const center = [gridSizeRef.current.width / 2, gridSizeRef.current.height / 2]
            const radius = gridSizeRef.current.width / 1.4
            dash.drawCircle(0, 0, radius)
            pixiItems.highlightedCircle.position.set(center[0], center[1])

            // Enlarge the map mech
            pixiItems.container.scale.set(1.5, 1.5)
        } else {
            pixiItems.container.scale.set(1, 1)
        }
    }, [gridSizeRef, isMechHighlighted, pixiItems, primaryColor])

    // Listen on mech stats
    useGameServerSubscription<WarMachineLiveState | undefined>(
        {
            URI: `/public/arena/${currentArenaID}/mech/${participantID}`,
            key: GameServerKeys.SubMechLiveStats,
            ready: !!participantID && !!currentArenaID && !!pixiItems,
            batchURI: `/public/arena/${currentArenaID}/mech`,
        },
        (payload) => {
            if (payload?.health !== undefined && pixiItems?.container) {
                setIsAlive(payload.health > 0)
                const percent = (payload.health / maxHealth) * 100
                if (percent < 45) pixiItems.hpBar.updateColor(colors.red)
                pixiItems.hpBar.updatePercent(percent)
            }

            if (payload?.shield !== undefined && pixiItems?.container) {
                const percent = (payload.shield / maxShield) * 100
                pixiItems.shieldBar.updatePercent(percent)
            }

            // Update position
            if (payload?.position !== undefined && pixiItems?.container) {
                const newPos = getPositionInViewport.current(payload.position.x, payload.position.y)
                // Default its the top left corner, so center it
                newPos.x -= pixiItems.rectGraphics.width / 2
                newPos.y -= pixiItems.rectGraphics.height / 2
                ease.add(pixiItems.container, { x: newPos.x, y: newPos.y }, { duration: 275, ease: "linear" })

                // Update the mech move dash line length and rotation
                const mCommand = tempMechMoveCommand.current || mechMoveCommand.current
                pixiItems.mechMoveDashedLine.clear()
                if (mCommand?.cell_x && mCommand?.cell_y && !mCommand?.reached_at) {
                    const mapPos = getPositionInViewport.current(mCommand.cell_x, mCommand.cell_y)
                    // Default its the top left corner, so center it
                    mapPos.x -= pixiItems.mechMoveSprite.width / 2
                    mapPos.y -= pixiItems.mechMoveSprite.height / 2
                    pixiItems.mechMoveSprite.position.set(mapPos.x, mapPos.y)
                    pixiItems.mechMoveSprite.visible = true
                    // Draw dashed line
                    const dash = new DashLine(pixiItems.mechMoveDashedLine, {
                        dash: [2, 1],
                        width: gridSizeRef.current.height * 0.08,
                        color: HEXToVBColor(primaryColor),
                        alpha: 0.8,
                    })
                    dash.moveTo(newPos.x, newPos.y).lineTo(mapPos.x, mapPos.y)
                } else {
                    pixiItems.mechMoveSprite.visible = false
                }
            }

            // Update rotation
            if (payload?.rotation !== undefined && pixiItems?.container) {
                const newRot = closestAngle(prevRotation.current, payload.rotation || 0)
                const newRotRad = deg2rad(newRot + 90)
                ease.add(pixiItems.arrowGraphics, { rotation: newRotRad }, { duration: 275, ease: "linear" })
                prevRotation.current = newRot
            }

            // Update visibility
            if (pixiItems?.container) {
                pixiItems.container.visible = !payload?.is_hidden
            }
        },
    )

    // Listen on mech move command positions for this mech
    useGameServerSubscriptionFaction<MechMoveCommand>(
        {
            URI: `/arena/${currentArenaID}/mech_command/${hash}`,
            key: GameServerKeys.SubMechMoveCommand,
            ready: factionID === warMachineFactionID && !!participantID && !!currentArenaID,
        },
        (payload) => {
            if (!payload) {
                mechMoveCommand.current = undefined
                return
            }
            tempMechMoveCommand.current = undefined
            mechMoveCommand.current = payload
        },
    )

    // Immediately render the mech move dashed line when player selects it for fast UX
    useEffect(() => {
        if (playerAbility?.ability.location_select_type === LocationSelectType.MechCommand && playerAbility.mechHash === hash) {
            if (selectionInstant?.startCoords) {
                const mCommand: MechMoveCommand = {
                    id: "move_command",
                    mech_id: id,
                    triggered_by_id: "x",
                    cell_x: selectionInstant.startCoords.x,
                    cell_y: selectionInstant.startCoords.y,
                    is_moving: true,
                    remain_cooldown_seconds: 0,
                    is_mini_mech: false,
                }
                mechMoveCommand.current = undefined
                tempMechMoveCommand.current = mCommand
            }
        } else {
            tempMechMoveCommand.current = undefined
        }
    }, [id, hash, playerAbility?.ability, playerAbility?.ability.location_select_type, selectionInstant, playerAbility?.mechHash])

    return null
}, propsAreEqual)
