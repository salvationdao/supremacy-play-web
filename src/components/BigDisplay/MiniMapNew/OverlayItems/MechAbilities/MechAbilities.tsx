import React, { useEffect, useMemo, useRef, useState } from "react"
import { useArena, useAuth, useGame, useMiniMapPixi } from "../../../../../containers"
import { useGameServerSubscription, useGameServerSubscriptionFaction } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { AIType, BattleState, AnyAbility, WarMachineLiveState, WarMachineState } from "../../../../../types"
import { MechAbility } from "./MechAbility"
import { PixiMechAbilities } from "./pixiMechAbilities"

// Outer component to determine whether to render the mech abilities or not
export const MechAbilities = React.memo(function MechAbilities() {
    const { userID } = useAuth()
    const { warMachines, spawnedAI, battleState } = useGame()
    const { pixiMiniMapPixi, highlightedMechParticipantID } = useMiniMapPixi()
    const [highlightedMech, setHighlightedMech] = useState<WarMachineState>()

    useEffect(() => {
        const mech = [...(warMachines || []), ...(spawnedAI || [])].find((m) => m.participantID === highlightedMechParticipantID && m.ownedByID === userID)
        if (mech) setHighlightedMech(mech)
    }, [highlightedMechParticipantID, spawnedAI, userID, warMachines])

    if (!pixiMiniMapPixi || !highlightedMech || battleState !== BattleState.BattlingState) {
        return null
    }

    return <MechAbilitiesInner key={highlightedMech.participantID} warMachine={highlightedMech} />
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
    const { pixiMiniMapPixi } = useMiniMapPixi()
    const { hash, participantID } = warMachine
    const tickIteration = useRef(0)

    const [pixiMechAbilities, setPixiMechAbilities] = useState<PixiMechAbilities>()
    const [anyAbilities, setAnyAbilities] = useState<AnyAbility[]>([])

    const isMiniMech = warMachine.aiType === AIType.MiniMech

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMiniMapPixi) return
        const pixiMechAbilities = new PixiMechAbilities()
        pixiMiniMapPixi.app.stage.addChild(pixiMechAbilities.root)
        setPixiMechAbilities(pixiMechAbilities)
    }, [pixiMiniMapPixi])

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
            if (!payload || payload.tick_order < tickIteration.current) return
            tickIteration.current = payload.tick_order

            if (payload?.health !== undefined) {
                pixiMechAbilities?.updateVisibility(payload.health > 0)
            }
        },
    )

    // Subscribe to war machine ability updates
    useGameServerSubscriptionFaction<AnyAbility[] | undefined>(
        {
            URI: `/arena/${currentArenaID}/mech/${participantID}/abilities`,
            key: GameServerKeys.SubWarMachineAbilitiesUpdated,
            ready: !!participantID && !!currentArenaID && !!pixiMechAbilities,
        },
        (payload) => {
            if (!payload || payload.length <= 0) {
                setAnyAbilities([])
                return
            }
            setAnyAbilities(payload)
        },
    )

    return useMemo(() => {
        // Mini mechs dont have abilities
        if (!pixiMechAbilities || isMiniMech) {
            return null
        }

        return (
            <>
                {anyAbilities &&
                    anyAbilities.map((aa, index) => {
                        return (
                            <MechAbility
                                key={aa.id}
                                pixiMechAbilities={pixiMechAbilities}
                                index={index}
                                anyAbility={aa}
                                hash={hash}
                                participantID={participantID}
                            />
                        )
                    })}
            </>
        )
    }, [anyAbilities, hash, participantID, pixiMechAbilities, isMiniMech])
}, propsAreEqual)
