import merge from "deepmerge"
import { DashLine } from "pixi-dashed-line"
import { ease } from "pixi-ease"
import * as particles from "pixi-particles"
import * as PIXI from "pixi.js"
import { CircleParticle, DeadSkullPNG } from "../../../../../assets"
import { pixiViewportZIndexes } from "../../../../../containers"
import { deg2rad, HEXToVBColor } from "../../../../../helpers"
import { pulseParticlesConfig } from "../../../../../pixi/particleConfigs"
import { PixiImageIcon } from "../../../../../pixi/pixiImageIcon"
import { PixiProgressBar } from "../../../../../pixi/pixiProgressBar"
import { colors, fonts } from "../../../../../theme/theme"
import { BlueprintPlayerAbility, Dimension, DisplayedAbility, GameAbility, Position } from "../../../../../types"
import { PlayerSupporterAbility } from "../../../../LeftDrawer/BattleArena/BattleAbility/SupporterAbilities"

export class PixiMapMech {
    root: PIXI.Container<PIXI.DisplayObject>
    rootInner: PIXI.Container<PIXI.DisplayObject>
    rootInner2: PIXI.Container<PIXI.DisplayObject>
    private rectGraphics: PIXI.Graphics
    private blinkingBorder: PIXI.Graphics
    private arrowGraphics: PIXI.Graphics
    private numberText: PIXI.Text
    private hpBar: PixiProgressBar
    private shieldBar: PixiProgressBar
    private mechMoveDashedLine: PIXI.Graphics
    private highlightedCircle: PIXI.Graphics
    private skull: PIXI.Sprite
    private mechMovePosition: Position | undefined
    private animationFrame: number | undefined
    private iconDimension: Dimension | undefined
    private mechHash: string
    private gridSizeRef: React.MutableRefObject<Dimension>
    private primaryColor: string | undefined
    private cachedZIndex = 10
    private abilityToApply: PixiImageIcon | undefined
    private dashedBox: PIXI.Graphics
    private particlesContainer: PIXI.Container<PIXI.DisplayObject>
    private emitter: particles.Emitter | undefined

    onTargetConfirm:
        | undefined
        | (({ startCoord, endCoord, mechHash }: { startCoord?: Position | undefined; endCoord?: Position | undefined; mechHash?: string | undefined }) => void)

    constructor(label: number, mechHash: string, gridSizeRef: React.MutableRefObject<Dimension>) {
        this.gridSizeRef = gridSizeRef
        this.mechHash = mechHash

        // Create container for everything
        this.root = new PIXI.Container()
        this.root.sortableChildren = true
        this.root.zIndex = pixiViewportZIndexes.mapMech + this.cachedZIndex

        // Root inner
        this.rootInner = new PIXI.Container()
        this.rootInner.x = -100
        this.rootInner.y = -100
        this.rootInner.interactive = true
        this.rootInner.buttonMode = true
        this.rootInner.zIndex = 3
        this.rootInner2 = new PIXI.Container()
        this.rootInner2.sortableChildren = true

        // Rect
        this.rectGraphics = new PIXI.Graphics()
        this.blinkingBorder = new PIXI.Graphics()
        this.blinkingBorder.zIndex = 12
        ease.add(this.blinkingBorder, { alpha: 0 }, { duration: 700, repeat: true, reverse: true, ease: "linear", removeExisting: true })

        // Rotation arrow
        this.arrowGraphics = new PIXI.Graphics()
        this.arrowGraphics.zIndex = 9

        // Number text
        this.numberText = new PIXI.Text(label, {
            fontFamily: fonts.nostromoBlack,
            fontSize: gridSizeRef.current.height * 1.05,
            fill: "#FFFFFF",
            lineHeight: 1,
        })
        this.numberText.anchor.set(0.5, 0.5)
        this.numberText.resolution = 4

        // Progress bars
        this.hpBar = new PixiProgressBar(0, 0, colors.health, 0)
        this.shieldBar = new PixiProgressBar(0, 0, colors.shield, 0)

        // Highlighted mech circle
        this.highlightedCircle = new PIXI.Graphics()
        this.highlightedCircle.zIndex = 20
        ease.add(this.highlightedCircle, { rotation: deg2rad(360) }, { duration: 3000, ease: "linear", repeat: true, removeExisting: true })
        ease.add(this.highlightedCircle, { scale: 1.2 }, { duration: 1000, ease: "linear", repeat: true, reverse: true, removeExisting: true })

        // Skull
        this.skull = PIXI.Sprite.from(DeadSkullPNG)
        this.skull.anchor.set(0.5, 0.42)
        this.skull.width = 3
        this.skull.height = 3
        this.skull.zIndex = 15

        // Mech move sprite
        this.mechMoveDashedLine = new PIXI.Graphics()
        this.mechMoveDashedLine.zIndex = 1

        // Dashed border box for mech ability select
        this.dashedBox = new PIXI.Graphics()
        ease.add(this.dashedBox, { scale: 1.1 }, { duration: 1000, ease: "linear", repeat: true, reverse: true, removeExisting: true })

        // Particles container
        this.particlesContainer = new PIXI.Container()

        // Add everything to container
        this.rootInner2.addChild(this.particlesContainer)
        this.rootInner2.addChild(this.rectGraphics)
        this.rootInner2.addChild(this.blinkingBorder)
        this.rootInner2.addChild(this.arrowGraphics)
        this.rootInner2.addChild(this.numberText)
        this.rootInner2.addChild(this.hpBar.root)
        this.rootInner2.addChild(this.shieldBar.root)
        this.rootInner2.addChild(this.highlightedCircle)
        this.rootInner2.addChild(this.dashedBox)
        this.rootInner2.addChild(this.skull)
        this.rootInner.addChild(this.rootInner2)
        this.root.addChild(this.rootInner)
        this.root.addChild(this.mechMoveDashedLine)

        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.emitter?.destroy()
        this.root.destroy()
    }

    updateStyles(primaryColor: string, iconDimension: Dimension) {
        this.iconDimension = iconDimension
        this.primaryColor = primaryColor

        this.rootInner.pivot.set(this.iconDimension.width / 2, this.iconDimension.height / 2)

        // Update number text
        this.numberText.style.fill = primaryColor
        this.numberText.style.fontSize = iconDimension.height / 1.8
        this.numberText.position.set(iconDimension.width / 2, iconDimension.height / 2.3)

        // Update rect box
        this.rectGraphics.clear()
        this.rectGraphics.beginFill(HEXToVBColor("#000000"), 0.8)
        this.rectGraphics.lineStyle(iconDimension.height * 0.08, HEXToVBColor(primaryColor))
        this.rectGraphics.drawRoundedRect(0, 0, iconDimension.width, iconDimension.height, iconDimension.width / 5)
        this.rectGraphics.endFill()
        this.skull.position.set(iconDimension.width / 2, iconDimension.height / 2.3)
        this.skull.width = iconDimension.width / 1.5
        this.skull.height = iconDimension.height / 1.5
        this.skull.tint = HEXToVBColor(primaryColor)
        this.particlesContainer.position.set(iconDimension.width / 2, iconDimension.height / 2.3)

        // Update rotation arrow
        // Draw the rotation arrow
        const triangleWidth = iconDimension.width / 4.2
        const triangleHeight = triangleWidth * 0.9
        const triangleHalfway = triangleWidth / 2

        const triPoint1 = [0, 0]
        const triPoint2 = [triangleWidth, 0]
        const triPoint3 = [triangleHalfway, -triangleHeight]
        // Draw the triangle
        this.arrowGraphics.beginFill(HEXToVBColor(primaryColor))
        this.arrowGraphics.lineStyle(1, HEXToVBColor(primaryColor))
        this.arrowGraphics.moveTo(triPoint1[0], triPoint1[1])
        this.arrowGraphics.lineTo(triPoint2[0], triPoint2[1])
        this.arrowGraphics.lineTo(triPoint3[0], triPoint3[1])
        this.arrowGraphics.lineTo(triPoint1[0], triPoint1[1])
        this.arrowGraphics.closePath()
        this.arrowGraphics.endFill()
        this.arrowGraphics.position.set(iconDimension.width / 2, iconDimension.height / 2)
        this.arrowGraphics.pivot.set(triangleHalfway, iconDimension.height / 2 + iconDimension.height / 3.4)
    }

    updateHpShieldBars(iconDimension: Dimension) {
        // Update bars dimension and position
        const barHeight = iconDimension.height / 5
        const barGap = iconDimension.height * 0.1
        this.hpBar.updateDimension(iconDimension.width, barHeight)
        this.shieldBar.updateDimension(iconDimension.width, barHeight)
        this.hpBar.updatePosition(0, iconDimension.height + barGap)
        this.shieldBar.updatePosition(0, iconDimension.height + barHeight + 2 * barGap)
    }

    updateZIndex(zIndex: number, cache?: boolean) {
        if (cache) this.cachedZIndex = this.root.zIndex - pixiViewportZIndexes.mapMech
        this.root.zIndex = pixiViewportZIndexes.mapMech + zIndex
    }

    highlightMech(iconDimension: Dimension) {
        this.highlightedCircle.clear()
        const dash = new DashLine(this.highlightedCircle, {
            dash: [4, 2],
            width: iconDimension.height * 0.09,
            color: HEXToVBColor(colors.orange),
            alpha: 1,
        })

        const center = [iconDimension.width / 2, iconDimension.height / 2]
        const radius = iconDimension.width / 1.6
        dash.drawCircle(0, 0, radius)
        this.highlightedCircle.position.set(center[0], center[1])

        this.updateZIndex(10, true)

        // Enlarge the map mech
        ease.add(this.rootInner, { scale: 1.5 }, { duration: 100, ease: "linear", removeExisting: true })
    }

    unhighlightMech() {
        this.highlightedCircle.clear()
        ease.add(this.rootInner, { scale: 1 }, { duration: 100, ease: "linear", removeExisting: true })
        this.updateZIndex(this.cachedZIndex)
    }

    updateHpBar(percent: number) {
        this.hpBar.updateColor(percent < 45 ? colors.red : colors.health)
        this.hpBar.updatePercent(percent)

        // If it's dead, show dead stuff
        if (percent <= 0) {
            this.numberText.visible = false
            this.hpBar.root.visible = false
            this.shieldBar.root.visible = false
            this.arrowGraphics.visible = false
            this.mechMoveDashedLine.visible = false
            this.root.alpha = 0.6
            this.skull.visible = true
        } else {
            this.numberText.visible = true
            this.hpBar.root.visible = true
            this.shieldBar.root.visible = true
            this.arrowGraphics.visible = true
            this.mechMoveDashedLine.visible = true
            this.root.alpha = 1
            this.skull.visible = false
        }
    }

    updateShieldBar(percent: number) {
        this.shieldBar.updatePercent(percent)
    }

    updatePosition(x: number, y: number) {
        ease.add(this.rootInner, { x, y }, { duration: 275, ease: "linear", removeExisting: true })
    }

    updateRotation(newRotRad: number) {
        ease.add(this.arrowGraphics, { rotation: newRotRad }, { duration: 275, ease: "linear" })
    }

    updateMechMovePosition(x: number, y: number) {
        this.mechMovePosition = { x, y }
    }

    hideMechMovePosition() {
        this.mechMoveDashedLine.clear()
        this.mechMovePosition = undefined
    }

    updateVisibility(isVisible: boolean) {
        this.rootInner.visible = isVisible
    }

    render() {
        let elapsed = Date.now()

        const step = () => {
            if (this.iconDimension && this.primaryColor && this.mechMovePosition) {
                this.mechMoveDashedLine.clear()

                // Default its the top left corner, so center it
                const newX = this.mechMovePosition.x
                const newY = this.mechMovePosition.y

                // Draw dashed line
                const dash = new DashLine(this.mechMoveDashedLine, {
                    dash: [5, 4],
                    width: this.iconDimension.height * 0.08,
                    color: HEXToVBColor(this.primaryColor),
                    alpha: 0.8,
                })
                dash.moveTo(this.rootInner.x, this.rootInner.y).lineTo(newX, newY)
            }

            // Particles stuff
            const now = Date.now()
            this.emitter?.update((now - elapsed) * 0.001)
            elapsed = now

            this.animationFrame = requestAnimationFrame(step)
        }

        this.animationFrame = requestAnimationFrame(step)
    }

    // Ability to by applied to the mech
    applyAbility(ability: GameAbility | BlueprintPlayerAbility | PlayerSupporterAbility) {
        if (!this.iconDimension) return

        this.abilityToApply = new PixiImageIcon(ability.image_url, this.iconDimension.width / 1.6, this.iconDimension.height / 1.6, ability.colour, true, 1)
        this.abilityToApply.startCountdown(2, 3, () => {
            this.onTargetConfirm && this.onTargetConfirm({ mechHash: this.mechHash })
            this.unApplyAbility()
        })
        this.abilityToApply.showIcon(true)
        this.abilityToApply.root.position.set(this.iconDimension.width / 1.9, 0)
        this.rootInner2.addChild(this.abilityToApply.root)
    }

    unApplyAbility() {
        if (!this.abilityToApply) return
        this.abilityToApply.root.visible = false
        this.abilityToApply.destroy()
        this.abilityToApply = undefined
    }

    // If the mech is clickable for an ability, show the dashed line border box
    showDashedBox(show: boolean) {
        this.dashedBox.clear()
        this.highlightedCircle.visible = true
        if (show && this.iconDimension && this.primaryColor) {
            // Prevent the dashed box and highlight from both showing at same time
            this.highlightedCircle.visible = false

            this.dashedBox.lineStyle()

            const dash = new DashLine(this.dashedBox, {
                dash: [5, 4],
                width: this.iconDimension.height * 0.08,
                color: HEXToVBColor(this.primaryColor),
                alpha: 1,
            })

            const width = this.iconDimension.width * 1.5
            const height = this.iconDimension.height * 1.5
            dash.drawRect(0, 0, width, height)
            this.dashedBox.pivot.set(width / 2, height / 2)
            this.dashedBox.position.set(this.iconDimension.width / 2, this.iconDimension.height / 2)
        }
    }

    // Border effect
    borderEffect(displayAbility: DisplayedAbility | undefined) {
        if (displayAbility && this.iconDimension) {
            this.blinkingBorder.clear()
            this.blinkingBorder.lineStyle(this.iconDimension.height * 0.08, HEXToVBColor(colors.darkRed), 0.9)
            this.blinkingBorder.beginFill(HEXToVBColor(colors.darkRed), 0.4)
            this.blinkingBorder.drawRoundedRect(0, 0, this.iconDimension.width, this.iconDimension.height, this.iconDimension.width / 5)
            this.blinkingBorder.endFill()
        } else {
            this.blinkingBorder.clear()
        }
    }

    // Shake effect
    shakeEffect(displayAbility: DisplayedAbility | undefined) {
        if (displayAbility) {
            this.rootInner2.alpha = 0.6
            ease.add(this.rootInner2, { shake: 2 }, { repeat: true, removeExisting: true })
        } else {
            this.rootInner2.alpha = 1
            ease.add(this.rootInner2, { shake: 1 }, { repeat: true, removeExisting: true })
        }
    }

    // Pulse effect
    pulseEffect(displayAbility: DisplayedAbility | undefined) {
        if (displayAbility) {
            const config = merge(pulseParticlesConfig, {
                color: { start: this.primaryColor, end: this.primaryColor },
                alpha: {
                    start: 1,
                    end: 0.3,
                },
                scale: {
                    start: (0.3 * this.gridSizeRef.current.width) / 10,
                    end: (0.1 * this.gridSizeRef.current.width) / 10,
                },
                speed: {
                    start: 24,
                    end: 12,
                },
                lifetime: {
                    min: (this.gridSizeRef.current.width * 2.3) / 20,
                    max: (this.gridSizeRef.current.width * 2.3) / 20,
                },
                frequency: 0.9,
            })
            this.emitter?.destroy()
            this.emitter = new particles.Emitter(this.particlesContainer, CircleParticle, config)
            this.emitter.emit = true

            // Fades in
            this.particlesContainer.alpha = 0
            ease.add(this.particlesContainer, { alpha: 1 }, { duration: 500, ease: "linear", removeExisting: true })
        } else {
            ease.add(this.particlesContainer, { alpha: 0 }, { duration: 500, ease: "linear", removeExisting: true })
            setTimeout(() => {
                this.emitter?.destroy()
            }, 1000)
        }
    }
}
