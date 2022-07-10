import { Box, Stack } from "@mui/material"
import { useCallback, useEffect, useMemo } from "react"
import {
    BattleAbilityAlert,
    BattleFactionAbilityAlertProps,
    FactionAbilityAlert,
    KillAlert,
    KillAlertProps,
    LocationSelectAlert,
    LocationSelectAlertProps,
    LocationSelectAlertType,
    NotificationItem,
    TextAlert,
    WarMachineAbilityAlert,
    WarMachineAbilityAlertProps,
} from ".."
import { NOTIFICATION_LINGER, NOTIFICATION_TIME } from "../../constants"
import { useGame, useMobile, useSupremacy } from "../../containers"
import { makeid } from "../../containers/ws/util"
import { useArray } from "../../hooks"
import { useGameServerSubscription, useGameServerSubscriptionFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { siteZIndex } from "../../theme/theme"
import { WarMachineCommandAlert, WarMachineCommandAlertProps } from "./Alerts/WarMachineCommandAlert"
import {
    battleAbilityNoti,
    factionAbilityNoti,
    killNoti,
    killNoti2,
    killNoti3,
    locationSelectNoti,
    locationSelectNoti2,
    locationSelectNoti3,
    locationSelectNoti4,
    locationSelectNoti5,
    textNoti,
    warMachineAbilityNoti,
} from "./testData"

const SPAWN_TEST_NOTIFICATIONS = false

/*
    WAR_MACHINE_DESTROYED: when a war machine is destroyed
    LOCATION_SELECTING: user is choosing a target location on map
    BATTLE_ABILITY: when a faction has initiated a battle ability
    FACTION_ABILITY: when a faction has initiated a faction ability
    WARMACHINE_ABILITY: when a faction has initiated a war machine ability
    TEXT: generic notification with no styles, just text
*/

export enum NotificationType {
    Text = "TEXT",
    LocationSelect = "LOCATION_SELECT",
    BattleAbility = "BATTLE_ABILITY",
    FactionAbility = "FACTION_ABILITY",
    WarMachineAbility = "WAR_MACHINE_ABILITY",
    WarMachineDestroyed = "WAR_MACHINE_DESTROYED",
    WarMachineCommand = "WAR_MACHINE_COMMAND",
}

export interface NotificationResponse {
    type: NotificationType
    data: BattleFactionAbilityAlertProps | KillAlertProps | LocationSelectAlertProps | WarMachineAbilityAlertProps | WarMachineCommandAlertProps | string
}

export const Notifications = () => {
    const { getFaction } = useSupremacy()
    const { setForceDisplay100Percentage } = useGame()

    // Notification array
    const { value: notifications, add: addNotification, removeByID } = useArray([], "notiID")

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
            if (notification.type === NotificationType.LocationSelect) {
                const noti = notification as { type: NotificationType; data: LocationSelectAlertProps }
                if (noti.data.type !== LocationSelectAlertType.FailedTimeOut && noti.data.type !== LocationSelectAlertType.FailedDisconnected) return

                const {
                    data: { ability, nextUser },
                } = noti
                newNotification(
                    {
                        type: NotificationType.LocationSelect,
                        data: {
                            type: LocationSelectAlertType.Assigned,
                            currentUser: nextUser,
                            ability,
                        },
                    },
                    true,
                )
            }

            if (notification.type === NotificationType.BattleAbility) {
                const {
                    data: { ability, user },
                } = notification as { type: NotificationType; data: BattleFactionAbilityAlertProps }
                newNotification(
                    {
                        type: NotificationType.LocationSelect,
                        data: {
                            type: LocationSelectAlertType.Assigned,
                            currentUser: user,
                            ability,
                        },
                    },
                    true,
                )
            }
        },
        [addNotification, removeByID],
    )

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
    }, [newNotification])

    // Notifications
    useGameServerSubscription<NotificationResponse | undefined>(
        {
            URI: "/public/notification",
            key: GameServerKeys.SubGameNotification,
        },
        (payload) => {
            if (!payload) return
            newNotification(payload)

            if (payload?.type === NotificationType.BattleAbility) {
                const p = payload as { type: NotificationType; data: BattleFactionAbilityAlertProps }
                setForceDisplay100Percentage(p?.data?.user?.faction_id || "")
            }
        },
    )

    // Faction specific notifications
    useGameServerSubscriptionFaction<NotificationResponse | undefined>(
        {
            URI: "/mech_command_notification",
            key: GameServerKeys.SubGameNotification,
        },
        (payload) => {
            if (!payload) return
            newNotification(payload)
        },
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
                        case NotificationType.Text:
                            return (
                                <NotificationItem key={n.notiID} duration={n.duration}>
                                    <TextAlert data={n.data} />
                                </NotificationItem>
                            )
                        case NotificationType.LocationSelect:
                            return (
                                <NotificationItem key={n.notiID} duration={n.duration}>
                                    <LocationSelectAlert data={n.data} getFaction={getFaction} />
                                </NotificationItem>
                            )
                        case NotificationType.BattleAbility:
                            return (
                                <NotificationItem key={n.notiID} duration={n.duration}>
                                    <BattleAbilityAlert data={n.data} getFaction={getFaction} />
                                </NotificationItem>
                            )
                        case NotificationType.FactionAbility:
                            return (
                                <NotificationItem key={n.notiID} duration={n.duration}>
                                    <FactionAbilityAlert data={n.data} getFaction={getFaction} />
                                </NotificationItem>
                            )
                        case NotificationType.WarMachineAbility:
                            return (
                                <NotificationItem key={n.notiID} duration={n.duration}>
                                    <WarMachineAbilityAlert data={n.data} getFaction={getFaction} />
                                </NotificationItem>
                            )
                        case NotificationType.WarMachineDestroyed:
                            return (
                                <NotificationItem key={n.notiID} duration={n.duration}>
                                    <KillAlert data={n.data} getFaction={getFaction} />
                                </NotificationItem>
                            )
                        case NotificationType.WarMachineCommand:
                            return (
                                <NotificationItem key={n.notiID} duration={n.duration}>
                                    <WarMachineCommandAlert data={n.data} getFaction={getFaction} />
                                </NotificationItem>
                            )
                    }
                }),
        [getFaction, notifications],
    )

    return <NotificationsInner notificationsJsx={notificationsJsx} />
}

const NotificationsInner = ({ notificationsJsx }: { notificationsJsx: (JSX.Element | undefined | null)[] }) => {
    const { isMobile } = useMobile()
    return (
        <Stack
            sx={{
                position: isMobile ? "unset" : "absolute",
                top: "1rem",
                right: "1rem",
                zIndex: siteZIndex.Notifications,
                overflow: "hidden",
            }}
        >
            <Box>
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        pr: ".8rem",
                        py: ".16rem",
                        direction: "ltr",

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
                        <Stack spacing=".8rem">{notificationsJsx}</Stack>
                    </Box>
                </Box>
            </Box>
        </Stack>
    )
}
