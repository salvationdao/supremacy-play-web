import React, { Dispatch } from 'react'

interface UpdateThemeContextProps {
    updateTheme: Dispatch<React.SetStateAction<FactionThemeColor>>
}
export const UpdateTheme = React.createContext({} as UpdateThemeContextProps)

export interface User {
    id: string
    username: string
    avatarID: string
    factionID: string
    faction: Faction
}

export interface FactionThemeColor {
    primary: string
    secondary: string
    background: string
}

export interface Faction {
    id: string
    label: string
    logoBlobID: string
    backgroundBlobID: string
    theme: FactionThemeColor
}

export type VotingState =
    | 'HOLD'
    | 'VOTE_COOLDOWN'
    | 'VOTE_ABILITY_RIGHT'
    | 'NEXT_VOTE_WIN'
    | 'LOCATION_SELECT'
    | 'WAIT_MECH_INTRO'

export interface BattleAbility {
    id: string
    label: string
    colour: string
    imageUrl: string
    cooldownDurationSecond: number
}

export interface GameAbility {
    id: string
    label: string
    colour: string
    imageUrl: string
    supsCost: string
    currentSups: string
}

export interface GameAbilityTargetPrice {
    id: string
    supsCost: string
    currentSups: string
    shouldReset: boolean
}

export interface Vector2i {
    x: number
    y: number
}

export interface WarMachineState {
    // One off fetch on inital load
    tokenID: string
    participantID: number
    factionID: string
    faction: Faction
    name: string
    imageUrl: string
    maxHealth: number
    maxShield: number

    // Updated in subscription
    health: number
    shield: number
    position: Vector2i
    rotation: number
}

export interface Map {
    name: string
    imageUrl: string
    width: number
    height: number
    cellsX: number
    cellsY: number
    top: number
    left: number
    scale: number
    disabledCells: number[]
}

export interface ViewerLiveCount {
    RedMountain: number
    Boston: number
    Zaibatsu: number
    Other: number
}

export enum NetMessageType {
    Default,
    Tick,
    LiveVoting,
    AbilityRightRatioTick,
    VotePriceTick,
    VotePriceForecastTick,
    GameAbilityTargetPriceTick,
    ViewerLiveCountTick,
    SpoilOfWarTick,
}

export interface NetMessageTickWarMachine {
    participantID?: number
    position?: Vector2i
    rotation?: number
    health?: number
    shield?: number
}

export interface NetMessageTick {
    warmachines: NetMessageTickWarMachine[]
}

export interface BattleEndDetail {
    topSupsContributor: User // user who contribute the most sups
    topSupsContributeFaction: Faction // faction which contribute the most sups
    topApplauseContributor: User // user who contribute the most applause
    mostFrequentAbilityExecutor: User // user who trigger ability most frequent
    battleEvents: BattleEvent[]
}

export interface BattleEvent {
    type: 'GAME_ABILITY' | 'WAR_MACHINE_DESTROYED'
    createdAt: Date
    event: GameAbility | WarMachineDestroyedRecord
}

export interface GameAbilityEvent {
    ability: GameAbility
    triggeredByUser?: User
    x?: number
    y?: number
    triggeredOnWarMachine?: WarMachineState
}

export interface WarMachineDestroyedRecord {
    destroyedWarMachine: WarMachineState
    killedByWarMachine?: WarMachineState
    killedBy?: string
    damageRecords: DamageRecord[]
}

export interface DamageRecord {
    amount: number
    causedByWarMachine: WarMachineState
    sourceName: string // weapon/ability name
}

export interface Stream {
    id: string
    name: string
    wsUrl: string
    streamID: string
    region: string
    resolution: string
    bitRatesKBits: number
    userMax: number
    usersNow: number
    active: boolean
    status: string
    latitude: number
    longitude: number
    distance?: number
}
