import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { NullUUID } from "../constants"
import HubKey from "../keys"
import { VotingState, Map, WarMachineState, NetMessageType, GameAbility } from "../types"
import { useAuth } from "./auth"
import { useWebsocket } from "./socket"
import BigNumber from "bignumber.js"

interface VtotingStateResponse {
    phase: VotingState
    endTime: Date
}

export interface GameSettingsResponse {
    gameMap: Map
    warMachines: WarMachineState[]
    spawnedAI: WarMachineState[]
}

interface WinnerAnnouncementResponse {
    gameAbility: GameAbility
    endTime: Date
}

interface FactionsColorResponse {
    redMountain: string
    boston: string
    zaibatsu: string
}

// Game data that needs to be shared between different components
export const GameContainer = createContainer(() => {
    const { state, send, subscribe, subscribeNetMessage } = useWebsocket()
    const { factionID } = useAuth()
    const [factionsColor, setFactionsColor] = useState<FactionsColorResponse>()
    const [map, setMap] = useState<Map>()
    const [warMachines, setWarMachines] = useState<WarMachineState[] | undefined>([])
    const [spawnedAI, setSpawnedAI] = useState<WarMachineState[] | undefined>([])
    const [factionVotePrice, setFactionVotePrice] = useState<BigNumber>(new BigNumber("0"))
    const [prevFactionVotePrice, setPrevFactionVotePrice] = useState<BigNumber>(new BigNumber("0"))
    const [votingState, setVotingState] = useState<VtotingStateResponse | undefined>()
    const [winner, setWinner] = useState<WinnerAnnouncementResponse>()
    const [queuingWarMachines, setQueuingWarMachines] = useState<WarMachineState[]>([])

    // Subscribe for game settings
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<GameSettingsResponse | undefined>(
            HubKey.SubGameSettings,
            (payload) => {
                if (!payload) return
                setMap(payload.gameMap)
                setWarMachines(payload.warMachines)
                setSpawnedAI(payload.spawnedAI)
            },
            null,
            true,
        )
    }, [state, subscribe])

    // Triggered faction ability or war machine ability price ticking
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !factionID || factionID === NullUUID) return
        return subscribe(HubKey.TriggerFactionAbilityPriceUpdated, () => console.log(""), null)
    }, [state, subscribe, factionID])

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
        if (state !== WebSocket.OPEN || !factionID || factionID === NullUUID) return
        ;(async () => {
            try {
                const resp = await send<string>(HubKey.GetFactionVotePrice)
                if (resp) {
                    setFactionVotePrice(new BigNumber(resp).dividedBy(new BigNumber("1000000000000000000")))
                }
            } catch (e) {
                console.log(e)
                return false
            }
        })()
    }, [send, state, factionID])

    // Trigger faction vote price net message listener
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !factionID || factionID === NullUUID) return
        return subscribe(HubKey.TriggerFactionVotePriceUpdated, () => console.log("just placeholder"))
    }, [state, subscribe, factionID])

    // Listen on current price change
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeNetMessage || !factionID || factionID === NullUUID) return
        return subscribeNetMessage<string | undefined>(NetMessageType.VotePriceTick, (payload) => {
            if (!payload) return
            setFactionVotePrice((prev) => {
                setPrevFactionVotePrice(prev)
                return new BigNumber(payload).dividedBy(new BigNumber("1000000000000000000"))
            })
        })
    }, [state, subscribeNetMessage, factionID])

    // Subscirbe on current voting state
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !factionID || factionID === NullUUID) return
        return subscribe<VtotingStateResponse | undefined>(
            HubKey.SubVoteStageUpdated,
            (payload) => {
                setVotingState(payload)
            },
            null,
        )
    }, [state, subscribe, factionID])

    // Subscribe on winner announcements
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !factionID || factionID === NullUUID) return
        return subscribe<WinnerAnnouncementResponse | undefined>(
            HubKey.SubVoteWinnerAnnouncement,
            (payload) => setWinner(payload),
            null,
        )
    }, [state, subscribe, factionID])

    // Subscribe on war machine queue updates
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !factionID || factionID === NullUUID) return
        return subscribe<WarMachineState[]>(
            HubKey.SubFactionWarMachineQueueUpdated,
            (payload) => {
                if (!payload) return
                setQueuingWarMachines(payload)
            },
            null,
        )
    }, [state, subscribe, factionID])

    // Subscribe to spawned AI events
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<WarMachineState | undefined>(
            HubKey.SubAISpawned,
            (payload) => {
                if (!payload) return
                setSpawnedAI((prev) => (prev === undefined ? [payload] : [...prev, payload]))
            },
            null,
        )
    }, [state, subscribe])

    return {
        votingState,
        factionsColor,
        factionVotePrice,
        prevFactionVotePrice,
        winner,
        setWinner,
        map,
        setMap,
        warMachines,
        spawnedAI,
        queuingWarMachines,
    }
})

export const GameProvider = GameContainer.Provider
export const useGame = GameContainer.useContainer
