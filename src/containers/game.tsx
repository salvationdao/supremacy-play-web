import { useEffect, useState } from 'react'
import { GAME_SERVER_HOSTNAME } from '../constants'
import { createContainer } from 'unstated-next'
import { NullUUID } from '../constants'
import HubKey from '../keys'
import { VotingState, BattleAbility, Map, WarMachineState, NetMessageType } from '../types'
import { useAuth } from './auth'
import { useWebsocket } from './socket'
import { httpProtocol } from '.'
import BigNumber from 'bignumber.js'

interface VtotingStateResponse {
    phase: VotingState
    endTime: Date
}

export interface GameSettingsResponse {
    gameMap: Map
    warMachines: WarMachineState[]
}

interface WinnerAnnouncementResponse {
    factionAbility: BattleAbility
    endTime: Date
}

interface FactionsColorResponse {
    redMountain: string
    boston: string
    zaibatsu: string
}

export const GameContainer = createContainer(() => {
    const { state, send, subscribe, subscribeNetMessage } = useWebsocket()
    const { user } = useAuth()
    const [factionsColor, setFactionsColor] = useState<FactionsColorResponse>()
    const [map, setMap] = useState<Map>()
    const [warMachines, setWarMachines] = useState<WarMachineState[] | undefined>([])
    const [factionVotePrice, setFactionVotePrice] = useState<BigNumber>(new BigNumber('0'))
    const [prevFactionVotePrice, setPrevFactionVotePrice] = useState<BigNumber>(new BigNumber('0'))
    const [battleAbility, setBattleAbility] = useState<BattleAbility>()
    const [votingState, setVotingState] = useState<VtotingStateResponse | undefined>()
    const [winner, setWinner] = useState<WinnerAnnouncementResponse>()
    const [queuingWarMachines, setQueuingWarMachines] = useState<WarMachineState[]>([])

    const userID = user?.id
    const factionID = user?.factionID

    // Subscribe for game settings
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
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
    }, [state, subscribe])

    // Get main color of each factions
    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        ;(async () => {
            try {
                const resp = await send<FactionsColorResponse>(HubKey.GetFactionsColor)
                if (resp) {
                    setFactionsColor(resp)
                }
            } catch (e) {
                console.log(e)
                return false
            }
        })()
    }, [send, state])

    // Get very first faction vote price
    useEffect(() => {
        if (state !== WebSocket.OPEN || !userID || userID === NullUUID || !factionID || factionID === NullUUID) return
        ;(async () => {
            try {
                const resp = await send<string>(HubKey.GetFactionVotePrice)
                if (resp) {
                    setFactionVotePrice(new BigNumber(resp).dividedBy(new BigNumber('1000000000000000000')))
                }
            } catch (e) {
                console.log(e)
                return false
            }
        })()
    }, [send, state, userID, factionID])

    // Listen on current price change
    useEffect(() => {
        if (
            state !== WebSocket.OPEN ||
            !subscribeNetMessage ||
            !userID ||
            userID === '' ||
            !factionID ||
            factionID === NullUUID
        )
            return
        return subscribeNetMessage<string | undefined>(NetMessageType.VotePriceTick, (payload) => {
            if (!payload) return
            setFactionVotePrice((prev) => {
                setPrevFactionVotePrice(prev)
                return new BigNumber(payload).dividedBy(new BigNumber('1000000000000000000'))
            })
        })
    }, [state, subscribeNetMessage, userID, factionID])

    // Subscirbe on current voting state
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID || userID === '' || !factionID || factionID === NullUUID)
            return
        return subscribe<VtotingStateResponse | undefined>(
            HubKey.SubVoteStageUpdated,
            (payload) => {
                setVotingState(payload)
            },
            null,
        )
    }, [state, subscribe, userID, factionID])

    // Subscribe to battle ability updates
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID || userID === '' || !factionID || factionID === NullUUID)
            return
        return subscribe<BattleAbility>(HubKey.SubBattleAbility, (payload) => setBattleAbility(payload), null)
    }, [state, subscribe, userID, factionID])

    // Subscribe on winner announcements
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID || userID === '' || !factionID || factionID === NullUUID)
            return
        return subscribe<WinnerAnnouncementResponse | undefined>(
            HubKey.SubVoteWinnerAnnouncement,
            (payload) => setWinner(payload),
            null,
        )
    }, [state, subscribe, userID, factionID])

    // Subscribe on war machine queue updates
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID || userID === '' || !factionID || factionID === NullUUID)
            return
        return subscribe<WarMachineState[]>(
            HubKey.SubFactionWarMachineQueueUpdated,
            (payload) => {
                if (!payload) return
                setQueuingWarMachines(payload)
            },
            null,
        )
    }, [state, subscribe, userID, factionID])

    return {
        factionsColor,
        votingState,
        factionVotePrice,
        prevFactionVotePrice,
        battleAbility,
        winner,
        setWinner,
        map,
        warMachines,
        queuingWarMachines,
    }
})

export const GameProvider = GameContainer.Provider
export const useGame = GameContainer.useContainer
