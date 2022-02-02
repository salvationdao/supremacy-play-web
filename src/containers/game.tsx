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
    const { state, subscribe, subscribeNetMessage } = useWebsocket()
    const { user } = useAuth()
    const [map, setMap] = useState<Map>()
    const [warMachines, setWarMachines] = useState<WarMachineState[] | undefined>([])
    const [factionAbilities, setFactionAbilities] = useState<FactionAbility[]>()
    const [battleState, setBattleState] = useState<TwitchEventResponse | undefined>()
    const [winner, setWinner] = useState<VoteWinnerResponse>()
    const [liveVotingData, setLiveVotingData] = useState<LiveVotingData[]>([])
    const userID = user?.id
    const factionID = user?.factionID

    // initialize live voting data
    useEffect(() => {
        const zeroArray: LiveVotingData[] = []
        for (let i = 0; i < MaxLiveVotingDataLength; i++) zeroArray.push({ rawData: 0, smoothData: 0 })
        setLiveVotingData(zeroArray)
    }, [])

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

    // live voting data
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeNetMessage) return
        return subscribeNetMessage<string | undefined>(NetMessageType.LiveVoting, (payload) => {
            if (!payload) return
            const rawData = new BigNumber(payload).dividedBy(new BigNumber('1000000000000000000')).toNumber()
            setLiveVotingData((lvd) => {
                if (lvd.length === MaxLiveVotingDataLength) lvd.shift()
                // get latest two data
                const latestData: number[] = [rawData]
                if (lvd.length >= 2) {
                    latestData.concat(lvd[lvd.length - 1].rawData, lvd[lvd.length - 2].rawData)
                } else if (lvd.length === 1) {
                    latestData.concat(lvd[lvd.length - 1].rawData, 0)
                } else {
                    latestData.concat(0, 0)
                }

                let sum = 0
                latestData.forEach((d) => {
                    sum += d
                })
                const smoothData = sum / 3

                return lvd.concat({ rawData, smoothData })
            })
        })
    }, [state, subscribeNetMessage])

    return {
        battleState,
        factionAbilities,
        winner,
        map,
        warMachines,
        liveVotingData,
    }
})

export const GameProvider = GameContainer.Provider
export const useGame = GameContainer.useContainer
