import { Box, Stack } from "@mui/material"
import {
    BattleAbilityAlert,
    FactionAbilityAlert,
    KillAlert,
    BattleFactionAbilityAlertProps,
    LocationSelectAlertProps,
    WarMachineAbilityAlertProps,
    KillAlertProps,
    LocationSelectAlert,
    NotificationItem,
    TextAlert,
    WarMachineAbilityAlert,
} from ".."
import { MINI_MAP_DEFAULT_SIZE, NOTIFICATION_LINGER, NOTIFICATION_TIME } from "../../constants"
import { makeid, useGameServerAuth, useDimension, useGameServerWebsocket, useSupremacy, useGame } from "../../containers"
import { useCallback, useEffect, useMemo } from "react"
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
    killNoti3,
} from "./testData"

const SPAWN_TEST_NOTIFICATIONS = true

/*
    WAR_MACHINE_DESTROYED: when a war machine is destroyed
    LOCATION_SELECTING: user is choosing a target location on map
    BATTLE_ABILITY: when a faction has initiated a battle ability
    FACTION_ABILITY: when a faction has initiated a faction ability
    WARMACHINE_ABILITY: when a faction has initiated a war machine ability
    TEXT: generic notification with no styles, just text
*/

type NotificationType = "TEXT" | "LOCATION_SELECT" | "BATTLE_ABILITY" | "FACTION_ABILITY" | "WAR_MACHINE_ABILITY" | "WAR_MACHINE_DESTROYED"

export interface NotificationResponse {
    type: NotificationType
    data: BattleFactionAbilityAlertProps | KillAlertProps | LocationSelectAlertProps | WarMachineAbilityAlertProps | string
}

export const Notifications = () => {
    const { factionsAll } = useSupremacy()
    const { state, subscribe } = useGameServerWebsocket()
    const { user } = useGameServerAuth()
    const { setForceDisplay100Percentage } = useGame()
    const {
        gameUIDimensions: { height },
    } = useDimension()

    // Notification array
    const { value: notifications, add: addNotification, removeByID } = useArray([], "notiID")

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
        newNotification(killNoti3)
    }, [])

    // Notifications
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<NotificationResponse | undefined>(
            GameServerKeys.SubGameNotification,
            (payload) => {
                newNotification(payload)

                if (payload?.type === "BATTLE_ABILITY") {
                    const p = payload as { type: NotificationType; data: BattleFactionAbilityAlertProps }
                    setForceDisplay100Percentage(p?.data?.user?.faction_id || "")
                }
            },
            null,
        )
    }, [state, subscribe, user])

    // Function to add new notification to array, and will clear itself out after certain time
    const newNotification = useCallback(
        (notification: NotificationResponse | undefined, justOne?: boolean) => {
            if (!notification) return

            const notiID = makeid()
            const duration = SPAWN_TEST_NOTIFICATIONS ? NOTIFICATION_TIME * 10000 : NOTIFICATION_TIME
            addNotification({ notiID, ...notification, duration })

            // Linger is for the slide animation to play before clearing off the component
            setTimeout(() => {
                removeByID(notiID)
            }, duration + NOTIFICATION_LINGER)

            if (justOne) return

            // These cases renders another notification (so two)
            if (notification.type == "LOCATION_SELECT") {
                const noti = notification as { type: NotificationType; data: LocationSelectAlertProps }
                if (noti.data.type != "FAILED_TIMEOUT" && noti.data.type != "FAILED_DISCONNECTED") return

                const {
                    data: { ability, nextUser },
                } = noti
                newNotification(
                    {
                        type: "LOCATION_SELECT",
                        data: {
                            type: "ASSIGNED",
                            currentUser: nextUser,
                            ability,
                        },
                    },
                    true,
                )
            }

            if (notification.type == "BATTLE_ABILITY") {
                const {
                    data: { ability, user },
                } = notification as { type: NotificationType; data: BattleFactionAbilityAlertProps }
                newNotification(
                    {
                        type: "LOCATION_SELECT",
                        data: {
                            type: "ASSIGNED",
                            currentUser: user,
                            ability,
                        },
                    },
                    true,
                )
            }
        },
        [addNotification],
    )

    const notificationsJsx = useMemo(
        () =>
            notifications
                .filter((n) => !!n)
                .reverse()
                .slice(0, 5)
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
                                    <WarMachineAbilityAlert data={n.data} factionsAll={factionsAll} />
                                </NotificationItem>
                            )
                        case "WAR_MACHINE_DESTROYED":
                            return (
                                <NotificationItem key={n.notiID} duration={n.duration}>
                                    <KillAlert data={n.data} factionsAll={factionsAll} />
                                </NotificationItem>
                            )
                    }
                }),
        [notifications],
    )

    return <NotificationsInner height={height} notificationsJsx={notificationsJsx} />
}

const NotificationsInner = ({ height, notificationsJsx }: { height: number; notificationsJsx: (JSX.Element | undefined | null)[] }) => {
    return (
        <Stack
            sx={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                zIndex: 15,
                overflow: "hidden",
            }}
        >
            <Box>
                <Box
                    sx={{
                        flex: 1,
                        maxHeight: `calc(${height}px - ${MINI_MAP_DEFAULT_SIZE + 40 + 30}px)`,
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
                            background: (theme) => theme.factionTheme.primary,
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
