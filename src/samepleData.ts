import { NotificationResponse } from "./components"
import { BattleEndDetail } from "./types"

const playerArray = [
    {
        username: "jayli3n",
        avatar_id: "66a9e8c6-9924-4d9e-9b78-2d5a39ddcab9",
        faction_colour: "#C24242",
        faction_id: "red_mountain_logo",
    },
    {
        username: "lolivise",
        avatar_id: "66a9e8c6-9924-4d9e-9b78-2d5a39ddcab9",
        faction_colour: "#428EC1",
        faction_id: "boston_cybernetics_logo",
    },
    {
        username: "Grumpy-oldi218",
        avatar_id: "66a9e8c6-9924-4d9e-9b78-2d5a39ddcab9",
        faction_colour: "#FFFFFF",
        faction_id: "zaibatsu_logo",
    },
    {
        username: "pewdiepie2",
        avatar_id: "66a9e8c6-9924-4d9e-9b78-2d5a39ddcab9",
        faction_colour: "#428EC1",
        faction_id: "boston_cybernetics_logo",
    },
    {
        username: "markiplier83",
        avatar_id: "66a9e8c6-9924-4d9e-9b78-2d5a39ddcab9",
        faction_colour: "#C24242",
        faction_id: "red_mountain_logo",
    },
]

const gameAbilityEvent: any = {
    ability: {
        id: "1",
        supsCost: "",
        currentSups: "",
        label: "ROBOT DOGS",
        imageUrl: "https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg",
        colour: "#428EC1",
    },
    triggeredByUser: {
        id: "00000000-0000-0000-0000-000000000000",
        username: "lolivise",
        avatar_id: "66a9e8c6-9924-4d9e-9b78-2d5a39ddcab9",
        factionID: "1",
        sups: 0,
        faction: {
            id: "1",
            background_blob_id: "",
            label: "Boston Cybernetics",
            logo_blob_id: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
            theme: {
                primary: "#428EC1",
                secondary: "#FFFFFF",
                background: "#080C12",
            },
        },
    },
}

export const sampleBattleEndDetail: BattleEndDetail = {
    battle_id: "2f1f14f2-b89a-4c15-a197-a86c013399f4",
    battle_identifier: 3,
    started_at: new Date("2022-02-22T07:54:11.944Z"),
    ended_at: new Date("2022-02-22T08:06:30.762Z"),
    total_multipliers: "+56x",
    multipliers: [
        { key: "contributor", value: "+1x", description: "XXXXXXXXXXXXXXXX" },
        { key: "super contributor", value: "+10x", description: "XXXXXXXXXXXXXXXX" },
        { key: "grease monkey", value: "+5x", description: "XXXXXXXXXXXXXXXX" },
        { key: "combo breaker", value: "+15x", description: "XXXXXXXXXXXXXXXX" },
        { key: "won battle", value: "+25x", description: "XXXXXXXXXXXXXXXX" },
    ],
    winning_condition: "LAST_ALIVE",
    winning_faction: {
        id: "1",
        background_blob_id: "",
        label: "Red Mountain Offworld Mining Corporation",
        logo_blob_id: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
        theme: {
            primary: "#C24242",
            secondary: "#FFFFFF",
            background: "#120E0E",
        },
    },
    winning_war_machines: [
        {
            image: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
            imageAvatar: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
            name: "Olympus Mons LY07",
            faction: {
                id: "1",
                background_blob_id: "",
                label: "Red Mountain Offworld Mining Corporation",
                logo_blob_id: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#120E0E",
                },
            },
            hash: "3",
            participantID: 3,
            factionID: "",
            maxHealth: 100,
            maxShield: 100,
            health: 60,
            shield: 50,
            position: { x: 0, y: 0 },
            rotation: 10,
            tier: "MEGA",
        },
        {
            image: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
            imageAvatar: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
            name: "Tenshi Mk1 B",
            faction: {
                id: "1",
                background_blob_id: "",
                label: "Red Mountain Offworld Mining Corporation",
                logo_blob_id: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#120E0E",
                },
            },
            hash: "",
            participantID: 1,
            factionID: "",
            maxHealth: 100,
            maxShield: 100,
            health: 60,
            shield: 50,
            position: { x: 0, y: 0 },
            rotation: 10,
            tier: "MEGA",
        },
        {
            image: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
            imageAvatar: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
            name: "Law Enforcer X-1000",
            faction: {
                id: "1",
                background_blob_id: "",
                label: "Red Mountain Offworld Mining Corporation",
                logo_blob_id: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#120E0E",
                },
            },
            hash: "2",
            participantID: 2,
            factionID: "",
            maxHealth: 100,
            maxShield: 100,
            health: 60,
            shield: 50,
            position: { x: 0, y: 0 },
            rotation: 10,
            tier: "MEGA",
        },
    ],
    top_sups_contribute_factions: [
        {
            id: "1",
            background_blob_id: "",
            label: "Red Mountain Offworld Mining Corporation",
            logo_blob_id: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
            theme: {
                primary: "#C24242",
                secondary: "#FFFFFF",
                background: "#120E0E",
            },
        },
        {
            id: "2",
            background_blob_id: "",
            label: "Boston Cybernetics",
            logo_blob_id: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
            theme: {
                primary: "#428EC1",
                secondary: "#FFFFFF",
                background: "#080C12",
            },
        },
        {
            id: "3",
            background_blob_id: "",
            label: "Zaibatsu Heavy Industries",
            logo_blob_id: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
            theme: {
                primary: "#FFFFFF",
                secondary: "#000000",
                background: "#080C12",
            },
        },
    ],
    top_sups_contributors: playerArray,
    most_frequent_ability_executors: playerArray,
}

// Notifications
export const locationSelectNoti: NotificationResponse = {
    type: "LOCATION_SELECT",
    data: {
        type: "TRIGGER",
        x: 7,
        y: 5,
        currentUser: {
            username: "Jayli3n",
            avatar_id: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Red Mountain Offworld Mining Corporation",
                logo_blob_id: "91dae11d-eb07-4906-bbdd-6417b880770a",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#0D0404",
                },
            },
        },
        ability: {
            label: "AIRSTRIKE",
            imageUrl: "https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg",
            colour: "#428EC1",
        },
        reason: "",
    },
}

export const locationSelectNoti2: NotificationResponse = {
    type: "LOCATION_SELECT",
    data: {
        type: "FAILED_TIMEOUT",
        x: 7,
        y: 5,
        currentUser: {
            username: "Jayli3n",
            avatar_id: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Red Mountain Offworld Mining Corporation",
                logo_blob_id: "91dae11d-eb07-4906-bbdd-6417b880770a",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#0D0404",
                },
            },
        },
        nextUser: {
            username: "Darren-Hung",
            avatar_id: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Boston Cybernetics",
                logo_blob_id: "91dae11d-eb07-4906-bbdd-6417b880770a",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#0D0404",
                },
            },
        },
        ability: {
            label: "AIRSTRIKE",
            imageUrl: "https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg",
            colour: "#428EC1",
        },
        reason: "",
    },
}

export const locationSelectNoti3: NotificationResponse = {
    type: "LOCATION_SELECT",
    data: {
        type: "FAILED_DISCONNECTED",
        x: 7,
        y: 5,
        currentUser: {
            username: "Jayli3n",
            avatar_id: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Red Mountain Offworld Mining Corporation",
                logo_blob_id: "91dae11d-eb07-4906-bbdd-6417b880770a",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#0D0404",
                },
            },
        },
        nextUser: {
            username: "Darren-Hung",
            avatar_id: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Boston Cybernetics",
                logo_blob_id: "91dae11d-eb07-4906-bbdd-6417b880770a",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#0D0404",
                },
            },
        },
        ability: {
            label: "AIRSTRIKE",
            imageUrl: "https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg",
            colour: "#428EC1",
        },
        reason: "",
    },
}

export const locationSelectNoti4: NotificationResponse = {
    type: "LOCATION_SELECT",
    data: {
        type: "CANCELLED_NO_PLAYER",
        x: 7,
        y: 5,
        currentUser: {
            username: "Jayli3n",
            avatar_id: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Red Mountain Offworld Mining Corporation",
                logo_blob_id: "91dae11d-eb07-4906-bbdd-6417b880770a",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#0D0404",
                },
            },
        },
        ability: {
            label: "AIRSTRIKE",
            imageUrl: "https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg",
            colour: "#428EC1",
        },
        reason: "",
    },
}

export const locationSelectNoti5: NotificationResponse = {
    type: "LOCATION_SELECT",
    data: {
        type: "CANCELLED_DISCONNECT",
        x: 7,
        y: 5,
        currentUser: {
            username: "Jayli3n",
            avatar_id: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Red Mountain Offworld Mining Corporation",
                logo_blob_id: "91dae11d-eb07-4906-bbdd-6417b880770a",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#0D0404",
                },
            },
        },
        ability: {
            label: "AIRSTRIKE",
            imageUrl: "https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg",
            colour: "#428EC1",
        },
        reason: "",
    },
}

export const battleAbilityNoti: NotificationResponse = {
    type: "BATTLE_ABILITY",
    data: {
        user: {
            username: "Jayli3n",
            avatar_id: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Zaibatsu Industries",
                logo_blob_id: "91dae11d-eb07-4906-bbdd-6417b880770a",
                theme: {
                    primary: "#FFFFFF",
                    secondary: "#00000",
                    background: "#0D0404",
                },
            },
        },
        ability: {
            label: "AIRSTRIKE",
            imageUrl: "https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg",
            colour: "#428EC1",
        },
    },
}

export const factionAbilityNoti: NotificationResponse = {
    type: "FACTION_ABILITY",
    data: {
        user: {
            username: "Jayli3n",
            avatar_id: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Red Mountain Offworld Mining Corporation",
                logo_blob_id: "91dae11d-eb07-4906-bbdd-6417b880770a",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#0D0404",
                },
            },
        },
        ability: {
            label: "AIRSTRIKE",
            imageUrl: "https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg",
            colour: "#428EC1",
        },
    },
}

export const warMachineAbilityNoti: NotificationResponse = {
    type: "WAR_MACHINE_ABILITY",
    data: {
        user: {
            username: "Jayli3n",
            avatar_id: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Red Mountain Offworld Mining Corporation",
                logo_blob_id: "91dae11d-eb07-4906-bbdd-6417b880770a",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#0D0404",
                },
            },
        },
        ability: {
            label: "AIRSTRIKE",
            imageUrl: "https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg",
            colour: "#428EC1",
        },
        warMachine: {
            name: "Zaibatsu WREX Tenshi Mk1 B",
            imageUrl: "",
            faction: {
                label: "Red Mountain Offworld Mining Corporation",
                logo_blob_id: "91dae11d-eb07-4906-bbdd-6417b880770a",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#0D0404",
                },
            },
        },
    },
}

export const textNoti: NotificationResponse = {
    type: "TEXT",
    data: "Just a test notification text to see how it looks.",
}

export const killNoti: NotificationResponse = {
    type: "WAR_MACHINE_DESTROYED",
    data: {
        destroyedWarMachine: {
            imageUrl: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
            name: "Olympus Mons LY07",
            faction: {
                id: "1",
                background_blob_id: "",
                label: "Red Mountain Offworld Mining Corporation",
                logo_blob_id: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#120E0E",
                },
            },
            hash: "3",
            participantID: 3,
            factionID: "",
            maxHealth: 100,
            maxShield: 100,
            health: 60,
            shield: 50,
            position: { x: 0, y: 0 },
            rotation: 10,
        },
        killedByWarMachine: {
            imageUrl: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
            name: "MR Olympics",
            faction: {
                id: "1",
                background_blob_id: "",
                label: "Boston Cybernetics",
                logo_blob_id: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
                theme: {
                    primary: "#428EC1",
                    secondary: "#FFFFFF",
                    background: "#120E0E",
                },
            },
            hash: "3",
            participantID: 3,
            factionID: "",
            maxHealth: 100,
            maxShield: 100,
            health: 60,
            shield: 50,
            position: { x: 0, y: 0 },
            rotation: 10,
        },
    },
}

export const killNoti2: NotificationResponse = {
    type: "WAR_MACHINE_DESTROYED",
    data: {
        destroyedWarMachine: {
            imageUrl: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
            name: "Olympus Mons LY07",
            faction: {
                id: "1",
                background_blob_id: "",
                label: "Red Mountain Offworld Mining Corporation",
                logo_blob_id: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#120E0E",
                },
            },
            hash: "3",
            participantID: 3,
            factionID: "",
            maxHealth: 100,
            maxShield: 100,
            health: 60,
            shield: 50,
            position: { x: 0, y: 0 },
            rotation: 10,
        },
        killedBy: "HEAVY DUTY MACHINE GUN",
    },
}
