import { NotificationResponse } from "./components"
import { BattleEndDetail } from "./types"

const playerArray = [
    {
        id: "311c6f68-498c-449b-b012-5ae3d114d619",
        username: "jayli3n",
        avatarID: "66a9e8c6-9924-4d9e-9b78-2d5a39ddcab9",
        factionID: "1",
        sups: 0,
        faction: {
            id: "1",
            backgroundBlobID: "",
            label: "Red Mountain Offworld Mining Corporation",
            logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
            theme: {
                primary: "#C24242",
                secondary: "#FFFFFF",
                background: "#120E0E",
            },
        },
    },
    {
        id: "af50eb52-8ed2-4c4c-8cdd-b8db8cade622",
        username: "lolivise",
        avatarID: "66a9e8c6-9924-4d9e-9b78-2d5a39ddcab9",
        factionID: "1",
        sups: 0,
        faction: {
            id: "1",
            backgroundBlobID: "",
            label: "Boston Cybernetics",
            logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
            theme: {
                primary: "#428EC1",
                secondary: "#FFFFFF",
                background: "#080C12",
            },
        },
    },
    {
        id: "af50eb52-8ed2-4c4c-8cdd-b8db8cade622",
        username: "Grumpy-oldi218",
        avatarID: "66a9e8c6-9924-4d9e-9b78-2d5a39ddcab9",
        factionID: "1",
        sups: 0,
        faction: {
            id: "1",
            backgroundBlobID: "",
            label: "Zaibatsu Heavy Industries",
            logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
            theme: {
                primary: "#FFFFFF",
                secondary: "#000000",
                background: "#080C12",
            },
        },
    },
    {
        id: "af50eb52-8ed2-4c4c-8cdd-b8db8cade622",
        username: "pewdiepie2",
        avatarID: "66a9e8c6-9924-4d9e-9b78-2d5a39ddcab9",
        factionID: "1",
        sups: 0,
        faction: {
            id: "1",
            backgroundBlobID: "",
            label: "Boston Cybernetics",
            logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
            theme: {
                primary: "#428EC1",
                secondary: "#FFFFFF",
                background: "#080C12",
            },
        },
    },
    {
        id: "311c6f68-498c-449b-b012-5ae3d114d619",
        username: "markiplier83",
        avatarID: "66a9e8c6-9924-4d9e-9b78-2d5a39ddcab9",
        factionID: "1",
        sups: 0,
        faction: {
            id: "1",
            backgroundBlobID: "",
            label: "Red Mountain Offworld Mining Corporation",
            logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
            theme: {
                primary: "#C24242",
                secondary: "#FFFFFF",
                background: "#120E0E",
            },
        },
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
        avatarID: "66a9e8c6-9924-4d9e-9b78-2d5a39ddcab9",
        factionID: "1",
        sups: 0,
        faction: {
            id: "1",
            backgroundBlobID: "",
            label: "Boston Cybernetics",
            logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
            theme: {
                primary: "#428EC1",
                secondary: "#FFFFFF",
                background: "#080C12",
            },
        },
    },
}

export const sampleBattleEndDetail: BattleEndDetail = {
    battleID: "2f1f14f2-b89a-4c15-a197-a86c013399f4",
    battleIdentifier: 3,
    startedAt: new Date("2022-02-22T07:54:11.944Z"),
    endedAt: new Date("2022-02-22T08:06:30.762Z"),
    winningCondition: "LAST_ALIVE",
    winningFaction: {
        id: "1",
        backgroundBlobID: "",
        label: "Red Mountain Offworld Mining Corporation",
        logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
        theme: {
            primary: "#C24242",
            secondary: "#FFFFFF",
            background: "#120E0E",
        },
    },
    winningWarMachines: [
        {
            imageUrl: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
            imageAvatar: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
            name: "Olympus Mons LY07",
            faction: {
                id: "1",
                backgroundBlobID: "",
                label: "Red Mountain Offworld Mining Corporation",
                logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
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
        {
            imageUrl: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
            imageAvatar: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
            name: "Tenshi Mk1 B",
            faction: {
                id: "1",
                backgroundBlobID: "",
                label: "Red Mountain Offworld Mining Corporation",
                logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
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
        },
        {
            imageUrl: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
            imageAvatar: "http://localhost:5005/static/media/GenericWarMachinePNG.df93230e7e423976eda9.png",
            name: "Law Enforcer X-1000",
            faction: {
                id: "1",
                backgroundBlobID: "",
                label: "Red Mountain Offworld Mining Corporation",
                logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
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
        },
    ],
    topSupsContributeFactions: [
        {
            id: "1",
            backgroundBlobID: "",
            label: "Red Mountain Offworld Mining Corporation",
            logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
            theme: {
                primary: "#C24242",
                secondary: "#FFFFFF",
                background: "#120E0E",
            },
        },
        {
            id: "2",
            backgroundBlobID: "",
            label: "Boston Cybernetics",
            logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
            theme: {
                primary: "#428EC1",
                secondary: "#FFFFFF",
                background: "#080C12",
            },
        },
        {
            id: "3",
            backgroundBlobID: "",
            label: "Zaibatsu Heavy Industries",
            logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
            theme: {
                primary: "#FFFFFF",
                secondary: "#000000",
                background: "#080C12",
            },
        },
    ],
    topSupsContributors: playerArray,
    mostFrequentAbilityExecutors: playerArray,
    battleEvents: [
        {
            type: "GAME_ABILITY",
            createdAt: new Date("2022-02-17T07:54:06.727Z"),
            event: gameAbilityEvent,
        },
        {
            type: "GAME_ABILITY",
            createdAt: new Date("2022-02-17T07:54:11.944Z"),
            event: gameAbilityEvent,
        },
        {
            type: "GAME_ABILITY",
            createdAt: new Date("2022-02-17T07:54:28.923Z"),
            event: gameAbilityEvent,
        },
        {
            type: "GAME_ABILITY",
            createdAt: new Date("2022-02-17T07:54:33.366Z"),
            event: gameAbilityEvent,
        },
    ],
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
            avatarID: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Red Mountain Offworld Mining Corporation",
                logoBlobID: "91dae11d-eb07-4906-bbdd-6417b880770a",
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
            avatarID: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Red Mountain Offworld Mining Corporation",
                logoBlobID: "91dae11d-eb07-4906-bbdd-6417b880770a",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#0D0404",
                },
            },
        },
        nextUser: {
            username: "Darren-Hung",
            avatarID: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Boston Cybernetics",
                logoBlobID: "91dae11d-eb07-4906-bbdd-6417b880770a",
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
            avatarID: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Red Mountain Offworld Mining Corporation",
                logoBlobID: "91dae11d-eb07-4906-bbdd-6417b880770a",
                theme: {
                    primary: "#C24242",
                    secondary: "#FFFFFF",
                    background: "#0D0404",
                },
            },
        },
        nextUser: {
            username: "Darren-Hung",
            avatarID: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Boston Cybernetics",
                logoBlobID: "91dae11d-eb07-4906-bbdd-6417b880770a",
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
            avatarID: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Red Mountain Offworld Mining Corporation",
                logoBlobID: "91dae11d-eb07-4906-bbdd-6417b880770a",
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
            avatarID: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Red Mountain Offworld Mining Corporation",
                logoBlobID: "91dae11d-eb07-4906-bbdd-6417b880770a",
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
            avatarID: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Zaibatsu Industries",
                logoBlobID: "91dae11d-eb07-4906-bbdd-6417b880770a",
                theme: {
                    primary: "#FFFFF",
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
            avatarID: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Red Mountain Offworld Mining Corporation",
                logoBlobID: "91dae11d-eb07-4906-bbdd-6417b880770a",
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
            avatarID: "949fd2b8-1c8f-4938-8c78-d4d40f8e12ef",
            faction: {
                sups: 0,
                label: "Red Mountain Offworld Mining Corporation",
                logoBlobID: "91dae11d-eb07-4906-bbdd-6417b880770a",
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
                logoBlobID: "91dae11d-eb07-4906-bbdd-6417b880770a",
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
                backgroundBlobID: "",
                label: "Red Mountain Offworld Mining Corporation",
                logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
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
                backgroundBlobID: "",
                label: "Boston Cybernetics",
                logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
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
                backgroundBlobID: "",
                label: "Red Mountain Offworld Mining Corporation",
                logoBlobID: "ac540e1f-98a2-44b3-babf-779b4a9d595f",
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
