import { Box, Stack } from "@mui/material"
import { useCallback, useEffect, useMemo } from "react"
import { BattleAbilityAlert, FactionAbilityAlert, KillAlert, LocationSelectAlert, NotificationItem, TextAlert, WarMachineAbilityAlert } from ".."
import { NOTIFICATION_LINGER, NOTIFICATION_TIME } from "../../constants"
import { useGame, useMobile, useSupremacy } from "../../containers"
import { useArena } from "../../containers/arena"
import { makeid } from "../../containers/ws/util"
import { useArray } from "../../hooks"
import { useGameServerSubscription, useGameServerSubscriptionFaction } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { siteZIndex } from "../../theme/theme"
import {
    BattleFactionAbilityAlertProps,
    BattleZoneStruct,
    KillAlertProps,
    LocationSelectAlertProps,
    NotificationStruct,
    NotificationType,
    WarMachineAbilityAlertProps,
} from "../../types"
import { BattleZoneAlert } from "./Alerts/BattleZoneAlert"
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

interface Notification extends NotificationStruct {
    notiID: string
    duration: number
}

export const Notifications = () => {
    const { isMobile } = useMobile()
    const { getFaction } = useSupremacy()
    const { currentArenaID } = useArena()
    const { setForceDisplay100Percentage, setBattleZone } = useGame()

    // Notification array
    const { value: notifications, add: addNotification, removeByID } = useArray<Notification>([], "notiID")

    // Function to add new notification to array, and will clear itself out after certain time
    const newNotification = useCallback(
        (notification: NotificationStruct | undefined, justOne?: boolean) => {
            if (!notification) return

            const notiID = makeid()

            let duration = SPAWN_TEST_NOTIFICATIONS ? NOTIFICATION_TIME * 10000 : NOTIFICATION_TIME

            if (notification.type === NotificationType.BattleZoneChange) {
                const battleZoneChange = notification.data as BattleZoneStruct
                duration = battleZoneChange.warn_time * 1000
                setBattleZone(battleZoneChange)
            }

            addNotification({ notiID, ...notification, duration })

            // Linger is for the slide animation to play before clearing off the component
            setTimeout(() => {
                removeByID(notiID)
            }, duration + NOTIFICATION_LINGER)

            if (justOne) return
        },
        [addNotification, removeByID, setBattleZone],
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
    useGameServerSubscription<NotificationStruct | undefined>(
        {
            URI: `/public/arena/${currentArenaID}/notification`,
            key: GameServerKeys.SubGameNotification,
            ready: !!currentArenaID,
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
    useGameServerSubscriptionFaction<NotificationStruct | undefined>(
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
                .slice(0, isMobile ? 2 : 5)
                .map((n) => {
                    if (!n) return null

                    switch (n.type) {
                        case NotificationType.Text:
                            return (
                                <NotificationItem key={n.notiID} duration={n.duration}>
                                    <TextAlert data={n.data as string} />
                                </NotificationItem>
                            )
                        case NotificationType.LocationSelect:
                            return (
                                <NotificationItem key={n.notiID} duration={n.duration}>
                                    <LocationSelectAlert data={n.data as LocationSelectAlertProps} getFaction={getFaction} />
                                </NotificationItem>
                            )
                        case NotificationType.BattleAbility:
                            return (
                                <NotificationItem key={n.notiID} duration={n.duration}>
                                    <BattleAbilityAlert data={n.data as BattleFactionAbilityAlertProps} getFaction={getFaction} />
                                </NotificationItem>
                            )
                        case NotificationType.FactionAbility:
                            return (
                                <NotificationItem key={n.notiID} duration={n.duration}>
                                    <FactionAbilityAlert data={n.data as BattleFactionAbilityAlertProps} getFaction={getFaction} />
                                </NotificationItem>
                            )
                        case NotificationType.WarMachineAbility:
                            return (
                                <NotificationItem key={n.notiID} duration={n.duration}>
                                    <WarMachineAbilityAlert data={n.data as WarMachineAbilityAlertProps} getFaction={getFaction} />
                                </NotificationItem>
                            )
                        case NotificationType.WarMachineDestroyed:
                            return (
                                <NotificationItem key={n.notiID} duration={n.duration}>
                                    <KillAlert data={n.data as KillAlertProps} getFaction={getFaction} />
                                </NotificationItem>
                            )
                        case NotificationType.BattleZoneChange:
                            return (
                                <NotificationItem key={n.notiID} duration={n.duration}>
                                    <BattleZoneAlert data={n.data as BattleZoneStruct} />
                                </NotificationItem>
                            )
                    }
                }),
        [getFaction, isMobile, notifications],
    )

    return <NotificationsInner notificationsJsx={notificationsJsx} />
}

const NotificationsInner = ({ notificationsJsx }: { notificationsJsx: (JSX.Element | undefined | null)[] }) => {
    const { isMobile } = useMobile()
    return (
        <Stack
            sx={{
                position: "absolute",
                height: "100%",
                top: "1.5rem",
                right: "1rem",
                zIndex: siteZIndex.Notifications,
                overflow: "hidden",
                transform: isMobile ? "scale(.9)" : "unset",
                transformOrigin: "top right",
                pointerEvents: "none",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    height: "100%",
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
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Stack spacing=".5rem" alignItems="flex-end">
                        {notificationsJsx}
                    </Stack>
                </Box>
            </Box>
        </Stack>
    )
}
