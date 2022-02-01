import React from 'react'
import { Dispatch } from 'react'

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

export type BattleState = 'FIRST_VOTE' | 'TIE' | 'VOTE_COOLDOWN' | 'LOCATION_SELECT' | 'HOLD'

export interface FactionAbility {
    id: string
    label: string
    colour: string
    imageUrl: string
    type: 'AIRSTRIKE' | 'NUKE' | 'HEALING'
    cooldownDurationSecond: number
}

export interface Vector3i {
    x: number
    y: number
    z: number
}

export interface WarMachineState {
    tokenID: string
    factionID: string
    faction: Faction
    name: string
    imageUrl: string
    maxHitPoint: number
    maxShield: number

    // Updated in subscription
    remainHitPoint: number
    remainShield: number
    position: Vector3i
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
