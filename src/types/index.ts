import React, { Dispatch } from 'react'

interface UpdateThemeContextProps {
    updateTheme: Dispatch<React.SetStateAction<FactionThemeColor>>
}
export const UpdateTheme = React.createContext({} as UpdateThemeContextProps)

export interface User {
    id: string
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
    logoUrl: string
    backgroundUrl: string
    theme: FactionThemeColor
}

// NEW STUFF
export type VotingState = 'HOLD' | 'VOTE_COOLDOWN' | 'VOTE_Ability_RIGHT' | 'NEXT_VOTE_WIN' | 'LOCATION_SELECT'

// NEW STUFF
export interface AbilityCollection {
    id: string
    label: string
    colour: string
    imageUrl: string
    cooldownDurationSecond: number
}

export interface FactionAbility {
    id: string
    label: string
    supsCost: string // big int
    colour: string // SHOULD BE REMOVED
    imageUrl: string // SHOULD BE REMOVED
    type: 'AIRSTRIKE' | 'NUKE' | 'HEALING' // SHOULD BE REMOVED
    cooldownDurationSecond: number // SHOULD BE REMOVED
}

// SHOULD BE REMOVED
export type BattleState = 'FIRST_VOTE' | 'TIE' | 'VOTE_COOLDOWN' | 'LOCATION_SELECT' | 'HOLD'

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

export enum NetMessageType {
    Default,
    Tick,
    LiveVoting,
    AbilityRightRatioTick,
    VotePriceTick,
    VotePriceForecastTick,
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
