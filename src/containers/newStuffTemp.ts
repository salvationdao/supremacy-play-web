import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { NullUUID } from '../constants'
import HubKey from '../keys'
import { AbilityCollection, NetMessageType, WarMachineState } from '../types'
import { useAuth } from './auth'
import { useWebsocket } from './socket'

/**
 * A Container contain NEW STUFF
 */
export const NewStuffTempContainer = createContainer(() => {
    const { state, send, subscribe, subscribeNetMessage } = useWebsocket()
    const { user } = useAuth()
    const userID = user?.id
    const factionID = user?.factionID
    // Vote Ability Right

    // input
    interface abilityRightRequest {
        voteAmount: number // 1, 10, 100
    }

    // function
    const voteAbilityRight = useCallback(async () => {
        try {
            const resp = await send<boolean, abilityRightRequest>(HubKey.VoteAbilityRight, {
                voteAmount: 1,
            })

            if (resp) {
                return true
            } else {
                throw new Error()
            }
        } catch (e) {
            console.log(e)
            return false
        }
    }, [])

    // Ability collection update
    const [abilityCollection, setAbilityCollection] = useState<AbilityCollection>()
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID || userID === '' || !factionID || factionID === NullUUID)
            return
        return subscribe<AbilityCollection>(
            HubKey.SubVoteAbilityCollectionUpdated,
            (payload) => setAbilityCollection(payload),
            null,
        )
    }, [state, subscribe, userID, factionID])

    // War Machine queue update
    const [queuingWarMachines, setQueuingWarMachines] = useState<WarMachineState[]>([])
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

    // ability right voting ratio
    // faction order is [Red Mountain, Boston, Zaibatsu]
    const [abilityRightVoteRatio, setAbilityRightVoteRatio] = useState<[number, number, number]>([33, 33, 33])
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeNetMessage) return
        return subscribeNetMessage<[number, number, number] | undefined>(
            NetMessageType.AbilityRightRatioTick,
            (payload) => {
                if (!payload) return
                setAbilityRightVoteRatio(payload)
            },
        )
    }, [state, subscribeNetMessage])

    // Current vote price
    const [currentFactionVotePrice, setCurrentFactionVotePrice] = useState<BigNumber>(new BigNumber('0'))

    // Get very first faction vote price
    useEffect(() => {
        if (state !== WebSocket.OPEN || !userID || userID === NullUUID || !factionID || factionID === NullUUID) return
        ;(async () => {
            try {
                const resp = await send<string>(HubKey.FactionVotePrice)
                if (resp) {
                    setCurrentFactionVotePrice(new BigNumber(resp).dividedBy(new BigNumber('1000000000000000000')))
                }
            } catch (e) {
                console.log(e)
                return false
            }
        })()
    }, [send, state, userID, factionID])

    // listen on current price change
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
            setCurrentFactionVotePrice(new BigNumber(payload).dividedBy(new BigNumber('1000000000000000000')))
        })
    }, [state, subscribeNetMessage, userID, factionID])

    // Forecast next vote price
    const [factionVotePriceIndicator, setFactionVotePriceIndicator] = useState<BigNumber>(new BigNumber('0'))
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
        return subscribeNetMessage<string | undefined>(NetMessageType.VotePriceForecastTick, (payload) => {
            if (!payload) return
            setFactionVotePriceIndicator(new BigNumber(payload).dividedBy(new BigNumber('1000000000000000000')))
        })
    }, [state, subscribeNetMessage, userID, factionID])

    return {
        voteAbilityRight,
        abilityCollection,
        queuingWarMachines,
        abilityRightVoteRatio,
        currentFactionVotePrice,
        factionVotePriceIndicator,
    }
})

export const NewStuffTempProvider = NewStuffTempContainer.Provider
export const useNewStuffTemp = NewStuffTempContainer.useContainer
