import { NotificationResponse } from ".."

const faction1 = {
    id: "aaa",
    background_blob_id: "aaa",
    label: "Red Mountain Offworld Mining Corporation",
    logo_blob_id: "91dae11d-eb07-4906-bbdd-6417b880770a",
    theme: {
        primary: "#C24242",
        secondary: "#FFFFFF",
        background: "#0D0404",
    },
}

const faction2 = {
    id: "aaa",
    background_blob_id: "aaa",
    label: "Boston Cybernetics",
    logo_blob_id: "91dae11d-eb07-4906-bbdd-6417b880770a",
    theme: {
        primary: "#428EC1",
        secondary: "#FFFFFF",
        background: "#0D0404",
    },
}

const user1 = {
    id: "aaa",
    username: "johnsmith",
    avatar_id: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
    faction_id: "123123",
    faction: faction1,
    sups: 0,
    gid: 3871,
}

const user2 = {
    id: "aaa",
    username: "didNot_write65",
    avatar_id: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
    faction_id: "123123",
    faction: faction2,
    sups: 0,
    gid: 6519,
}

const ability1 = {
    label: "AIRSTRIKE",
    image_url: "https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg",
    colour: "#428EC1",
    id: "aaaaaa",
    text_colour: "#FFFFFF",
    description: "mmmmmmmmmmm",
    cooldown_duration_second: 30,
    ability_offering_id: "4c5cdc8c-4a11-40e6-981c-e2a83e0c9e15",
}

const ability2 = {
    label: "OVERCHARGE",
    image_url: "https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg",
    colour: "#FFFFFF",
    id: "aaaaaa",
    text_colour: "#FFFFFF",
    description: "mmmmmmmmmmm",
    cooldown_duration_second: 30,
    ability_offering_id: "6ed7a47b-a3b6-43a3-98ea-28b0855f03f5",
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
    tier: "string",
    health: 1,
    shield: 1,
    position: { x: 1, y: 1 },
    rotation: 1,
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
    factionID: "qweqwe",
    image: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
    maxHealth: 1,
    maxShield: 1,
    imageAvatar: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
    tier: "string",
    health: 1,
    shield: 1,
    position: { x: 1, y: 1 },
    rotation: 1,
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
export const locationSelectNoti: NotificationResponse = {
    type: "LOCATION_SELECT",
    data: {
        type: "TRIGGER",
        x: 7,
        y: 5,
        currentUser: user1,
        ability: ability1,
    },
}

export const locationSelectNoti2: NotificationResponse = {
    type: "LOCATION_SELECT",
    data: {
        type: "FAILED_TIMEOUT",
        x: 7,
        y: 5,
        currentUser: user1,
        nextUser: user2,
        ability: ability1,
    },
}

export const locationSelectNoti3: NotificationResponse = {
    type: "LOCATION_SELECT",
    data: {
        type: "FAILED_DISCONNECTED",
        x: 7,
        y: 5,
        currentUser: user1,
        nextUser: user2,
        ability: ability1,
    },
}

export const locationSelectNoti4: NotificationResponse = {
    type: "LOCATION_SELECT",
    data: {
        type: "CANCELLED_NO_PLAYER",
        x: 7,
        y: 5,
        currentUser: user1,
        ability: ability1,
    },
}

export const locationSelectNoti5: NotificationResponse = {
    type: "LOCATION_SELECT",
    data: {
        type: "CANCELLED_DISCONNECT",
        x: 7,
        y: 5,
        currentUser: user1,
        ability: ability1,
    },
}

export const battleAbilityNoti: NotificationResponse = {
    type: "BATTLE_ABILITY",
    data: {
        user: user1,
        ability: ability1,
    },
}

export const factionAbilityNoti: NotificationResponse = {
    type: "FACTION_ABILITY",
    data: {
        user: user1,
        ability: ability1,
    },
}

export const warMachineAbilityNoti: NotificationResponse = {
    type: "WAR_MACHINE_ABILITY",
    data: {
        user: user1,
        ability: ability2,
        warMachine: wm1,
    },
}

export const textNoti: NotificationResponse = {
    type: "TEXT",
    data: "Just a test notification text to see how it looks.",
}

export const killNoti: NotificationResponse = {
    type: "WAR_MACHINE_DESTROYED",
    data: {
        destroyed_war_machine: wm2,
        killed_by_war_machine: wm1,
    },
}

export const killNoti2: NotificationResponse = {
    type: "WAR_MACHINE_DESTROYED",
    data: {
        destroyed_war_machine: wm2,
        killed_by: "NUKE",
    },
}

export const killNoti3: NotificationResponse = {
    type: "WAR_MACHINE_DESTROYED",
    data: {
        destroyed_war_machine: wm2,
        killed_by: "NUKE",
        killed_by_user: user1,
    },
}
