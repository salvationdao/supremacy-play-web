export interface HangarSilo {
    faction: string
    silos: SiloType[]
}

export interface SiloObject {
    type: string
    ownership_id: string
    static_id: string
    skin?: SiloSkin
}

export interface SiloType extends SiloObject {
    accessories?: SiloObject[]
    can_open_on?: Date
}

export interface SiloSkin {
    type: string
    static_id: string
    ownership_id?: string
}
