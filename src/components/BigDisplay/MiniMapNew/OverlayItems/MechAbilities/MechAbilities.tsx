import React, { useEffect, useMemo, useState } from "react"
import { useArena, useAuth, useGame, useMiniMapPixi } from "../../../../../containers"
import { useGameServerSubscription, useGameServerSubscriptionFaction } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { AIType, BribeStage, GameAbility, WarMachineLiveState, WarMachineState } from "../../../../../types"
import { MechAbility } from "./MechAbility"
import { PixiMechAbilities } from "./pixiMechAbilities"

// Outer component to determine whether to render the mech abilities or not
export const MechAbilities = React.memo(function MechAbilities() {
    const { userID } = useAuth()
    const { bribeStage, warMachines, spawnedAI } = useGame()
    const { pixiMainItems, highlightedMechParticipantID } = useMiniMapPixi()

    const isVoting = useMemo(() => bribeStage && bribeStage?.phase !== BribeStage.Hold, [bribeStage])

    const highlightedMech = useMemo(() => {
        return [...(warMachines || []), ...(spawnedAI || [])].find((m) => m.participantID === highlightedMechParticipantID)
    }, [highlightedMechParticipantID, spawnedAI, warMachines])

    if (!pixiMainItems || !highlightedMechParticipantID || !highlightedMech || highlightedMech?.ownedByID !== userID || !isVoting) {
        return null
    }

    return <MechAbilitiesInner key={highlightedMechParticipantID} warMachine={highlightedMech} />
})

// Inner component starts here
interface MechAbilitiesInnerProps {
    warMachine: WarMachineState
}

const propsAreEqual = (prevProps: MechAbilitiesInnerProps, nextProps: MechAbilitiesInnerProps) => {
    return prevProps.warMachine.id === nextProps.warMachine.id
}

const MechAbilitiesInner = React.memo(function MechAbilitiesInner({ warMachine }: MechAbilitiesInnerProps) {
    const { currentArenaID } = useArena()
    const { pixiMainItems } = useMiniMapPixi()
    const { hash, participantID } = warMachine

    const [pixiMechAbilities, setPixiMechAbilities] = useState<PixiMechAbilities>()
    const [gameAbilities, setGameAbilities] = useState<GameAbility[]>([])

    const isMiniMech = warMachine.aiType === AIType.MiniMech

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMainItems) return
        const pixiMechAbilities = new PixiMechAbilities()
        pixiMainItems.app.stage.addChild(pixiMechAbilities.root)
        setPixiMechAbilities(pixiMechAbilities)
    }, [pixiMainItems])

    // Cleanup
    useEffect(() => {
        return () => pixiMechAbilities?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiMechAbilities])

    // Listen on current war machine changes
    useGameServerSubscription<WarMachineLiveState | undefined>(
        {
            URI: `/public/arena/${currentArenaID}/mech/${participantID}`,
            key: GameServerKeys.SubMechLiveStats,
            ready: !!participantID && !!currentArenaID && !!pixiMechAbilities,
            batchURI: `/public/arena/${currentArenaID}/mech`,
        },
        (payload) => {
            if (payload?.health !== undefined) {
                pixiMechAbilities?.updateVisibility(payload.health > 0)
            }
        },
    )

    // Subscribe to war machine ability updates
    useGameServerSubscriptionFaction<GameAbility[] | undefined>(
        {
            URI: `/arena/${currentArenaID}/mech/${participantID}/abilities`,
            key: GameServerKeys.SubWarMachineAbilitiesUpdated,
            ready: !!participantID && !!currentArenaID && !!pixiMechAbilities,
        },
        (payload) => {
            if (!payload || payload.length <= 0) {
                setGameAbilities([])
                return
            }
            setGameAbilities(payload)
        },
    )

    return useMemo(() => {
        // Mini mechs dont have abilities
        if (!pixiMechAbilities || isMiniMech) {
            return null
        }

        return (
            <>
                {gameAbilities &&
                    gameAbilities.map((ga, index) => {
                        return (
                            <MechAbility
                                key={ga.id}
                                pixiMechAbilities={pixiMechAbilities}
                                index={index}
                                gameAbility={ga}
                                hash={hash}
                                participantID={participantID}
                            />
                        )
                    })}
            </>
        )
    }, [gameAbilities, hash, participantID, pixiMechAbilities, isMiniMech])
}, propsAreEqual)
