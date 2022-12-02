import { theme } from "../../../theme/theme"
import { AnyAbility, FactionWithPalette, LocationSelectType, NotificationStruct, RarityEnum, RoleType, User, UserRank } from "../../../types"

enum NotificationType {
    Text = "TEXT",
    LocationSelect = "LOCATION_SELECT",
    BattleAbility = "BATTLE_ABILITY",
    FactionAbility = "FACTION_ABILITY",
    WarMachineAbility = "WAR_MACHINE_ABILITY",
    WarMachineDestroyed = "WAR_MACHINE_DESTROYED",
}

export enum LocationSelectAlertType {
    CancelledNoPlayer = "CANCELLED_NO_PLAYER",
    CancelledDisconnect = "CANCELLED_DISCONNECT",
    FailedTimeOut = "FAILED_TIMEOUT",
    FailedDisconnected = "FAILED_DISCONNECTED",
    Trigger = "TRIGGER",
    Assigned = "ASSIGNED",
}

const faction1: FactionWithPalette = {
    id: "aaa",
    background_url: "aaa",
    label: "Red Mountain Offworld Mining Corporation",
    logo_url: "91dae11d-eb07-4906-bbdd-6417b880770a",
    description: "aaa",
    wallpaper_url: "",
    palette: theme.factionTheme,
}

const user1: User = {
    id: "aaa",
    username: "johnsmith",
    faction_id: "123123",
    gid: 3871,
    rank: "NEW_RECRUIT" as UserRank,
    features: [],
    role_type: RoleType.player,
}

const user2 = {
    id: "aaa",
    username: "didNot_write65",
    faction_id: "123123",
    gid: 6519,
    rank: "NEW_RECRUIT" as UserRank,
    features: [],
    role_type: RoleType.player,
}

const ability1: AnyAbility = {
    label: "AIRSTRIKE",
    image_url: "https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg",
    colour: "#428EC1",
    id: "aaaaaa",
    text_colour: "#FFFFFF",
    description: "mmmmmmmmmmm",
    game_client_ability_id: 1,
    location_select_type: LocationSelectType.LineSelect,
}

const ability2: AnyAbility = {
    label: "OVERCHARGE",
    image_url: "https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg",
    colour: "#FFFFFF",
    id: "aaaaaa",
    text_colour: "#FFFFFF",
    description: "mmmmmmmmmmm",
    game_client_ability_id: 2,
    location_select_type: LocationSelectType.MechSelect,
}

const wm1 = {
    name: "Zaibatsu WREX Tenshi Mk1",
    faction: faction1,
    hash: "aaaaa",
    participantID: 3,
    factionID: "qweqwe",
    image: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
    maxHealth: 1,
    maxShield: 1,
    imageAvatar: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
    tier: RarityEnum.Colossal,
    ownerUsername: "noob-0x14dc3eb9#12443",
    modelID: "ac27f3b9-753d-4ace-84a9-21c041195344",
    health: 1,
    shield: 1,
    position: { x: 1, y: 1 },
    rotation: 1,
    isHidden: false,
    id: "a797a8c1-157c-4540-a0e6-4b944e07f383",
    energy: 0,
    ownedByID: "15f29ee9-e834-4f76-aff8-31e39faabe2d",
    description: null,
    externalUrl: "",
    model: "XFVS",
    skin: "Ukraine",
    shieldRechargeRate: 80,
    speed: 2750,
    durability: 1000,
    powerGrid: 1,
    cpu: 1,
    weaponHardpoint: 2,
    turretHardpoint: 0,
    utilitySlots: 1,
    weaponNames: ["Plasma Rifle", "Sword"],
}

const wm2 = {
    name: "Olympus Mons LY07",
    faction: faction1,
    hash: "aaaaa",
    participantID: 3,
    ownerUsername: "noob-0x14dc3eb9#12443",
    modelID: "ac27f3b9-753d-4ace-84a9-21c041195344",
    factionID: "qweqwe",
    image: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
    maxHealth: 1,
    maxShield: 1,
    imageAvatar: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
    tier: RarityEnum.Colossal,
    health: 1,
    shield: 1,
    position: { x: 1, y: 1 },
    rotation: 1,
    isHidden: false,
    id: "a797a8c1-157c-4540-a0e6-4b944e07f383",
    energy: 0,
    ownedByID: "15f29ee9-e834-4f76-aff8-31e39faabe2d",
    description: null,
    externalUrl: "",
    model: "XFVS",
    skin: "Ukraine",
    shieldRechargeRate: 80,
    speed: 2750,
    durability: 1000,
    powerGrid: 1,
    cpu: 1,
    weaponHardpoint: 2,
    turretHardpoint: 0,
    utilitySlots: 1,
    weaponNames: ["Plasma Rifle", "Sword"],
}

// Notifications
export const locationSelectNoti: NotificationStruct = {
    type: NotificationType.LocationSelect,
    data: {
        type: LocationSelectAlertType.Trigger,
        x: 7,
        y: 5,
        currentUser: user1,
        ability: ability1,
    },
}

export const locationSelectNoti2: NotificationStruct = {
    type: NotificationType.LocationSelect,
    data: {
        type: LocationSelectAlertType.FailedTimeOut,
        x: 7,
        y: 5,
        currentUser: user1,
        nextUser: user2,
        ability: ability1,
    },
}

export const locationSelectNoti3: NotificationStruct = {
    type: NotificationType.LocationSelect,
    data: {
        type: LocationSelectAlertType.FailedDisconnected,
        x: 7,
        y: 5,
        currentUser: user1,
        nextUser: user2,
        ability: ability1,
    },
}

export const locationSelectNoti4: NotificationStruct = {
    type: NotificationType.LocationSelect,
    data: {
        type: LocationSelectAlertType.CancelledNoPlayer,
        x: 7,
        y: 5,
        currentUser: user1,
        ability: ability1,
    },
}

export const locationSelectNoti5: NotificationStruct = {
    type: NotificationType.LocationSelect,
    data: {
        type: LocationSelectAlertType.CancelledDisconnect,
        x: 7,
        y: 5,
        currentUser: user1,
        ability: ability1,
    },
}

export const battleAbilityNoti: NotificationStruct = {
    type: NotificationType.BattleAbility,
    data: {
        user: user1,
        ability: ability1,
    },
}

export const factionAbilityNoti: NotificationStruct = {
    type: NotificationType.FactionAbility,
    data: {
        user: user1,
        ability: ability1,
    },
}

export const warMachineAbilityNoti: NotificationStruct = {
    type: NotificationType.WarMachineAbility,
    data: {
        user: user1,
        ability: ability2,
        warMachine: wm1,
    },
}

export const textNoti: NotificationStruct = {
    type: NotificationType.Text,
    data: "Just a test notification text to see how it looks.",
}

export const killNoti: NotificationStruct = {
    type: NotificationType.WarMachineDestroyed,
    data: {
        destroyed_war_machine: wm2,
        killed_by_war_machine: wm1,
    },
}

export const killNoti2: NotificationStruct = {
    type: NotificationType.WarMachineDestroyed,
    data: {
        destroyed_war_machine: wm2,
        killed_by: "NUKE",
    },
}

export const killNoti3: NotificationStruct = {
    type: NotificationType.WarMachineDestroyed,
    data: {
        destroyed_war_machine: wm2,
        killed_by: "NUKE",
        killed_by_user: user1,
    },
}
