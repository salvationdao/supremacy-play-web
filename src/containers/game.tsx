import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import HubKey from '../keys'
import { BattleState, Faction, FactionAbility, Map, NetMessageType, WarMachineState } from '../types'
import { useWebsocket } from './socket'
import { useAuth } from './auth'
import BigNumber from 'bignumber.js'
import { MaxLiveVotingDataLength } from '../constants'

interface TwitchEventResponse {
    phase: BattleState
    endTime: Date
}

export interface GameSettingsResponse {
    gameMap: Map
    warMachines: WarMachineState[]
}

interface VoteWinnerResponse {
    faction: Faction
    factionAbility: FactionAbility
    endTime: Date
}

export interface Vote {
    faction: Faction
    factionAbility: FactionAbility
    endTime: Date
}

export interface NotificationResponse {
    type: 'KILL' | 'ACTION' | 'SECOND_VOTE' | 'TEXT'
    data: string | Vote
}

export interface LiveVotingData {
    rawData: number
    smoothData: number
}

export const GameContainer = createContainer(() => {
    const { state, subscribe } = useWebsocket()
    const { user } = useAuth()
    const [map, setMap] = useState<Map>()
    const [warMachines, setWarMachines] = useState<WarMachineState[] | undefined>([])
    const [factionAbilities, setFactionAbilities] = useState<FactionAbility[]>()
    const [battleState, setBattleState] = useState<TwitchEventResponse | undefined>()
    const [winner, setWinner] = useState<VoteWinnerResponse>()
    const userID = user?.id
    const factionID = user?.factionID

    // Faction abilities
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID || userID === '' || !factionID || factionID === '') return
        return subscribe<FactionAbility[] | undefined>(
            HubKey.SubFactionAbilities,
            (payload) => setFactionAbilities(payload),
            null,
        )
    }, [state, subscribe, userID, factionID])

    // voting stage (the phases)
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID || userID === '' || !factionID || factionID === '') return
        return subscribe<TwitchEventResponse | undefined>(
            HubKey.SubFactionStage,
            (payload) => {
                setBattleState(payload)
            },
            null,
        )
    }, [state, subscribe, userID, factionID])

    // Winner announcement
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID || userID === '') return
        return subscribe<VoteWinnerResponse | undefined>(
            HubKey.SubWinnerAnnouncement,
            (payload) => setWinner(payload),
            null,
        )
    }, [state, subscribe, userID])

    // REST call for game settings
    useEffect(() => {
        ;(async () => {
            try {
                const result = await fetch(`/api/game_settings`)
                const payload: GameSettingsResponse = await result.json()

                if (!payload) return
                setMap(payload.gameMap)
                setWarMachines(payload.warMachines)
            } catch (e) {
                console.log(e)
            }
        })()
    }, [])

    // Subscribe for game settings
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID || userID == '') return
        return subscribe<GameSettingsResponse | undefined>(
            HubKey.SubGameSettings,
            (payload) => {
                if (!payload) return
                setMap(payload.gameMap)
                setWarMachines(payload.warMachines)
            },
            null,
            true,
        )
    }, [state, subscribe, userID])

    return {
        battleState,
        factionAbilities,
        winner,
        map,
        warMachines,
    }
})

export const GameProvider = GameContainer.Provider
export const useGame = GameContainer.useContainer
