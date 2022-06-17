import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useAuth, useSupremacy } from "."
import { useGameServerCommandsUser, useGameServerSubscription, useGameServerSubscriptionUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { BattleEndDetail, BribeStage, GameAbility, Map, WarMachineState } from "../types"

export interface BribeStageResponse {
    phase: BribeStage
    end_time: Date
}

export interface GameSettingsResponse {
    battle_identifier: number
    game_map: Map
    war_machines: WarMachineState[]
}

export interface WinnerAnnouncementResponse {
    game_ability: GameAbility
    end_time: Date
}

// Game data that needs to be shared between different components
export const GameContainer = createContainer(() => {
    const { setBattleIdentifier } = useSupremacy()
    const { send } = useGameServerCommandsUser("/user_commander")
    const { factionID } = useAuth()

    // States
    const [map, setMap] = useState<Map>()
    const [warMachines, setWarMachines] = useState<WarMachineState[] | undefined>([])
    const [bribeStage, setBribeStage] = useState<BribeStageResponse | undefined>()
    const [winner, setWinner] = useState<WinnerAnnouncementResponse>()
    const [highlightedMechHash, setHighlightedMechHash] = useState<string | undefined>(undefined)
    const [battleEndDetail, setBattleEndDetail] = useState<BattleEndDetail>()

    const [forceDisplay100Percentage, setForceDisplay100Percentage] = useState<string>("")

    // Subscribe for game settings
    useGameServerSubscription<GameSettingsResponse | undefined>(
        {
            URI: "/battle",
            key: GameServerKeys.SubGameSettings,
        },
        (payload) => {
            if (!payload) return
            if (payload.battle_identifier > 0) setBattleIdentifier(payload.battle_identifier)
            setMap(payload.game_map)
            setWarMachines(payload.war_machines)
        },
    )

    useEffect(() => {
        if (!map) return
        send(GameServerKeys.GameUserOnline)
    }, [send, map])

    // Subscribe on battle end information
    useGameServerSubscriptionUser<BattleEndDetail>(
        {
            URI: "",
            key: GameServerKeys.SubBattleEndDetailUpdated,
        },
        (payload) => {
            if (!payload) return
            setBattleEndDetail(payload)
        },
    )

    // Subscirbe on current voting state
    useGameServerSubscription<BribeStageResponse | undefined>(
        {
            URI: "/battle/bribe_stage",
            key: GameServerKeys.SubBribeStageUpdated,
        },
        (payload) => {
            setBribeStage(payload)
            // reset force display, if
            if (payload?.phase === "COOLDOWN" || payload?.phase === "HOLD") setForceDisplay100Percentage("")
        },
    )

    // Subscribe on winner announcements
    useGameServerSubscriptionUser<WinnerAnnouncementResponse | undefined>(
        {
            URI: "",
            key: GameServerKeys.SubBribeWinnerAnnouncement,
            ready: !!factionID,
        },
        (payload) => {
            if (!payload) return

            let endTime = payload.end_time
            const dateNow = new Date()
            const diff = endTime.getTime() - dateNow.getTime()

            // Just a temp fix, if user's pc time is not correct then at least set for them
            // Checked by seeing if they have at least 8s to do stuff
            if (endTime < dateNow || diff < 8000 || diff > 20000) {
                endTime = new Date(dateNow.getTime() + 15000)
            }
            setWinner({ ...payload, end_time: endTime })
        },
    )

    return {
        bribeStage,
        winner,
        setWinner,
        map,
        setMap,
        warMachines,
        highlightedMechHash,
        setHighlightedMechHash,
        battleEndDetail,
        setBattleEndDetail,
        forceDisplay100Percentage,
        setForceDisplay100Percentage,
    }
})

export const GameProvider = GameContainer.Provider
export const useGame = GameContainer.useContainer
