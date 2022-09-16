import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useArena, useAuth, useGame, useMiniMapPixi } from "../../../../../containers"
import { useTheme } from "../../../../../containers/theme"
import { useGameServerSubscription, useGameServerSubscriptionFaction } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { AIType, BribeStage, GameAbility, PlayerAbility, WarMachineLiveState, WarMachineState } from "../../../../../types"
import { MechMoveCommandAbility } from "../../../../WarMachine/WarMachineItem/MoveCommand"
import * as PIXI from "pixi.js"
import { HEXToVBColor } from "../../../../../helpers"
import { colors } from "../../../../../theme/theme"

// Outer component to determine whether to render the mech abilities or not
export const MechAbilities = React.memo(function MechAbilities() {
    const { userID } = useAuth()
    const { bribeStage, warMachines, spawnedAI } = useGame()
    const { pixiMainItems, setPlayerAbility, highlightedMechParticipantID } = useMiniMapPixi()

    const isVoting = useMemo(() => bribeStage && bribeStage?.phase !== BribeStage.Hold, [bribeStage])

    const highlightedMech = useMemo(() => {
        return [...(warMachines || []), ...(spawnedAI || [])].find((m) => m.participantID === highlightedMechParticipantID)
    }, [highlightedMechParticipantID, spawnedAI, warMachines])

    if (!pixiMainItems || !highlightedMechParticipantID || !highlightedMech || highlightedMech?.ownedByID !== userID || !isVoting) {
        return null
    }

    return <MechAbilitiesInner key={highlightedMechParticipantID} warMachine={highlightedMech} setPlayerAbility={setPlayerAbility} />
})

// Inner component starts here
interface PixiItems {
    container: PIXI.Container<PIXI.DisplayObject>
    bgRect: PIXI.Graphics
}

interface MechAbilitiesInnerProps {
    warMachine: WarMachineState
    setPlayerAbility: React.Dispatch<React.SetStateAction<PlayerAbility | undefined>>
}

const propsAreEqual = (prevProps: MechAbilitiesInnerProps, nextProps: MechAbilitiesInnerProps) => {
    return prevProps.warMachine.id === nextProps.warMachine.id
}

const MechAbilitiesInner = React.memo(function MechAbilitiesInner({ warMachine, setPlayerAbility }: MechAbilitiesInnerProps) {
    const theme = useTheme()
    const { userID } = useAuth()
    const { currentArenaID } = useArena()
    const { pixiMainItems } = useMiniMapPixi()
    const { participantID, ownedByID } = warMachine

    const [pixiItems, setPixiItems] = useState<PixiItems>()
    const [isAlive, setIsAlive] = useState(warMachine.health > 0)
    // const pixiMechAbilities = useRef<PixiMechAbility[]>([])

    const isMiniMech = warMachine.aiType === AIType.MiniMech

    // Subscribe to war machine ability updates
    const gameAbilities = useGameServerSubscriptionFaction<GameAbility[] | undefined>({
        URI: `/arena/${currentArenaID}/mech/${participantID}/abilities`,
        key: GameServerKeys.SubWarMachineAbilitiesUpdated,
        ready: !!participantID && !!currentArenaID,
    })

    // Listen on current war machine changes
    useGameServerSubscription<WarMachineLiveState | undefined>(
        {
            URI: `/public/arena/${currentArenaID}/mech/${participantID}`,
            key: GameServerKeys.SubMechLiveStats,
            ready: !!participantID && !!currentArenaID,
            batchURI: `/public/arena/${currentArenaID}/mech`,
        },
        (payload) => {
            if (payload?.health !== undefined) {
                if (payload.health <= 0) setIsAlive(false)
            }
        },
    )

    // On activate mech move command
    const activateMechMoveCommand = useCallback(() => {
        if (!isAlive || !currentArenaID) return

        setPlayerAbility({
            ...MechMoveCommandAbility,
            mechHash: warMachine.hash,
        })
    }, [isAlive, warMachine.hash, setPlayerAbility, currentArenaID])

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMainItems) return

        // Create container for everything
        const container = new PIXI.Container()
        container.x = 2
        container.y = 2
        container.zIndex = 20
        container.sortableChildren = true

        // Rect
        const bgRect = new PIXI.Graphics()

        // Add everything to container
        container.addChild(bgRect)
        pixiMainItems.viewport.addChild(container)
        setPixiItems({ container, bgRect })
    }, [pixiMainItems])

    // Cleanup
    useEffect(() => {
        return () => pixiItems?.container.destroy(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Render the individual ability items
    useEffect(() => {
        if (!pixiItems) return

        // Destroy existing and construct the individual mech abilities
        // pixiMechAbilities.current.forEach(pma => pma.container.destroy(true))
        // if (gameAbilities) {
        //     pixiMechAbilities.current = gameAbilities.map((ga, index) => {
        //         const item = new PixiMechAbility({hash, participantID, ability, index})
        //         pixiItems.container.addChild(item)
        //         return item
        //     })
        // }

        // Resize bg rectangle
        pixiItems.bgRect.beginFill(HEXToVBColor(colors.gold), 0.3)
        pixiItems.bgRect.drawRoundedRect(0, 0, pixiItems.container.width, pixiItems.container.height, 2.5)
        pixiItems.bgRect.endFill()
    }, [pixiItems, gameAbilities, theme, participantID])

    return null
}, propsAreEqual)
