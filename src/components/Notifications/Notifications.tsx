import { Box, Stack } from "@mui/material"
import {
    BattleAbilityAlert,
    FactionAbilityAlert,
    KillAlert,
    LocationSelectAlert,
    NotificationItem,
    TextAlert,
    WarMachineAbilityAlert,
} from ".."
import { MINI_MAP_DEFAULT_HEIGHT, NOTIFICATION_LINGER, NOTIFICATION_TIME, UI_OPACITY } from "../../constants"
import { useTheme } from "@mui/styles"
import { Theme } from "@mui/material/styles"
import { makeid, useGameServerAuth, useDimension, useGameServerWebsocket, useGame } from "../../containers"
import { useEffect } from "react"
import { GameServerKeys } from "../../keys"
import { useArray } from "../../hooks"
import {
    locationSelectNoti,
    locationSelectNoti2,
    locationSelectNoti3,
    locationSelectNoti4,
    locationSelectNoti5,
    battleAbilityNoti,
    factionAbilityNoti,
    warMachineAbilityNoti,
    textNoti,
    killNoti,
    killNoti2,
} from "../../samepleData"

const SPAWN_TEST_NOTIFICATIONS = false

/*
WAR_MACHINE_DESTROYED: when a war machine is destroyed
LOCATION_SELECTING: user is choosing a target location on map
BATTLE_ABILITY: when a faction has initiated a battle ability
FACTION_ABILITY: when a faction has initiated a faction ability
WARMACHINE_ABILITY: when a faction has initiated a war machine ability
TEXT: generic notification with no styles, just text
*/
export interface NotificationResponse {
    type:
        | "TEXT"
        | "LOCATION_SELECT"
        | "BATTLE_ABILITY"
        | "FACTION_ABILITY"
        | "WAR_MACHINE_ABILITY"
        | "WAR_MACHINE_DESTROYED"
    data: any
}

export const Notifications = () => {
    const { factionsAll } = useGame()
    const { state, subscribe } = useGameServerWebsocket()
    const { user } = useGameServerAuth()
    const { setForceDisplay100Percentage } = useGame()
    const theme = useTheme<Theme>()
    const {
        streamDimensions: { height },
    } = useDimension()

    // Notification array
    const { value: notifications, add: addNotification, removeByID } = useArray([], "notiID")

    // Notifications
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<NotificationResponse | undefined>(
            GameServerKeys.SubGameNotification,
            (payload) => {
                newNotification(payload)

                if (payload?.type === "BATTLE_ABILITY") {
                    setForceDisplay100Percentage(payload?.data?.user?.faction_id || "")
                }
            },
            null,
        )
    }, [state, subscribe, user])

    // Test cases
    useEffect(() => {
        if (!SPAWN_TEST_NOTIFICATIONS) return

        newNotification(locationSelectNoti)
        newNotification(locationSelectNoti2)
        newNotification(locationSelectNoti3)
        newNotification(locationSelectNoti4)
        newNotification(locationSelectNoti5)
        newNotification(battleAbilityNoti)
        newNotification(factionAbilityNoti)
        newNotification(warMachineAbilityNoti)
        newNotification(textNoti)
        newNotification(killNoti)
        newNotification(killNoti2)
    }, [])

    // Function to add new notification to array, and will clear itself out after certain time
    const newNotification = (notification: NotificationResponse | undefined, justOne?: boolean) => {
        if (!notification) return

        const notiID = makeid()
        const duration = SPAWN_TEST_NOTIFICATIONS ? NOTIFICATION_TIME * 100 : NOTIFICATION_TIME
        addNotification({ notiID, ...notification, duration })

        // Linger is for the slide animation to play before clearing off the component
        setTimeout(() => {
            removeByID(notiID)
        }, duration + NOTIFICATION_LINGER)

        if (justOne) return

        // These cases renders another notification (so two)
        if (
            notification.type == "LOCATION_SELECT" &&
            (notification.data.type == "FAILED_TIMEOUT" || notification.data.type == "FAILED_DISCONNECTED")
        ) {
            const {
                data: { ability, nextUser },
            } = notification
            newNotification(
                {
                    type: "LOCATION_SELECT",
                    data: {
                        type: "ASSIGNED",
                        currentUser: nextUser,
                        ability,
                        reason: "",
                    },
                },
                true,
            )
        }

        if (notification.type == "BATTLE_ABILITY") {
            const {
                data: { ability, user },
            } = notification
            newNotification(
                {
                    type: "LOCATION_SELECT",
                    data: {
                        type: "ASSIGNED",
                        currentUser: user,
                        ability,
                        reason: "",
                    },
                },
                true,
            )
        }
    }

    const notificationsJsx = notifications
        .filter((n) => !!n)
        .reverse()
        .map((n) => {
            if (!n) return null

            switch (n.type) {
                case "TEXT":
                    return (
                        <NotificationItem key={n.notiID} duration={n.duration}>
                            <TextAlert data={n.data} />
                        </NotificationItem>
                    )
                case "LOCATION_SELECT":
                    return (
                        <NotificationItem key={n.notiID} duration={n.duration}>
                            <LocationSelectAlert data={n.data} factionsAll={factionsAll} />
                        </NotificationItem>
                    )
                case "BATTLE_ABILITY":
                    return (
                        <NotificationItem key={n.notiID} duration={n.duration}>
                            <BattleAbilityAlert data={n.data} factionsAll={factionsAll} />
                        </NotificationItem>
                    )
                case "FACTION_ABILITY":
                    return (
                        <NotificationItem key={n.notiID} duration={n.duration}>
                            <FactionAbilityAlert data={n.data} factionsAll={factionsAll} />
                        </NotificationItem>
                    )
                case "WAR_MACHINE_ABILITY":
                    return (
                        <NotificationItem key={n.notiID} duration={n.duration}>
                            <WarMachineAbilityAlert data={n.data} />
                        </NotificationItem>
                    )
                case "WAR_MACHINE_DESTROYED":
                    return (
                        <NotificationItem key={n.notiID} duration={n.duration}>
                            <KillAlert data={n.data} />
                        </NotificationItem>
                    )
            }
        })

    return (
        <Stack
            sx={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                zIndex: 15,
                overflow: "hidden",
                opacity: UI_OPACITY,
            }}
        >
            <Box>
                <Box
                    sx={{
                        flex: 1,
                        maxHeight: `calc(${height}px - ${MINI_MAP_DEFAULT_HEIGHT + 40}px)`,
                        overflowY: "auto",
                        overflowX: "hidden",
                        pr: ".8rem",
                        py: ".16rem",
                        direction: "ltr",
                        scrollbarWidth: "none",
                        "::-webkit-scrollbar": {
                            width: ".4rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                            borderRadius: 3,
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: theme.factionTheme.primary,
                            borderRadius: 3,
                        },
                    }}
                >
                    <Box sx={{ direction: "ltr" }}>
                        <Stack spacing=".48rem">{notificationsJsx}</Stack>
                    </Box>
                </Box>
            </Box>
        </Stack>
    )
}
