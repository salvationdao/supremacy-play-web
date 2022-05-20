import BigNumber from "bignumber.js"
import { useState, useEffect, useCallback, useMemo } from "react"
import { createContainer } from "unstated-next"
import { useAuth, useSnackbar } from ".."
import { supFormatter } from "../../helpers"
import { useGameServerCommandsBattleFaction, useGameServerCommandsUser, useGameServerSubscriptionBattleFaction } from "../../hooks/useGameServer"
import { usePassportCommandsUser } from "../../hooks/usePassport"
import { GameServerKeys, PassportServerKeys } from "../../keys"
import { MechDetails } from "../../types"

export interface QueueFeed {
    queue_length: number
    queue_cost: string
    contract_reward: string
}

interface MobileNumberSave {
    id: string
    mobile_number: string
}

interface NotificationSettings {
    push_notifications: boolean
    sms_notifications: boolean
    telegram_notifications: boolean
}

const initialSettings: NotificationSettings = {
    sms_notifications: false,
    push_notifications: false,
    telegram_notifications: false,
}

export const HangarWarMachineContainer = createContainer(() => {
    const { newSnackbarMessage } = useSnackbar()
    const { userID, user } = useAuth()
    const { send: sendFactionCommander } = useGameServerCommandsBattleFaction("/faction_commander")
    const { send: sendUserCommander } = useGameServerCommandsUser("/user_commander")
    const { send: sendPassportUser } = usePassportCommandsUser("xxxxxxxxx")

    // Queuing cost, queue length win reward etc.
    const queueFeed = useGameServerSubscriptionBattleFaction<QueueFeed>({
        URI: "/queue",
        key: GameServerKeys.SubQueueFeed,
    })
    const [actualQueueCost, setActualQueueCost] = useState(supFormatter(queueFeed?.queue_cost || "0", 2))

    // Notification settings
    const [dbSettings, setDbSettings] = useState<NotificationSettings | null>(null)
    const [currentSettings, setCurrentSettings] = useState<NotificationSettings>(initialSettings)
    const [telegramShortcode, setTelegramShortcode] = useState<string>()

    const notificationsOn = useMemo(
        () => currentSettings.push_notifications || currentSettings.sms_notifications || currentSettings.telegram_notifications,
        [currentSettings],
    )
    const settingsMatch = useMemo(
        () =>
            currentSettings.push_notifications === dbSettings?.push_notifications &&
            currentSettings.sms_notifications === dbSettings.sms_notifications &&
            currentSettings.telegram_notifications === dbSettings.telegram_notifications,
        [currentSettings, dbSettings],
    )

    // Modals
    const [deployMechDetails, setDeployMechDetails] = useState<MechDetails>()
    const [deployError, setDeployError] = useState<string>()

    // Fetch user notification settings
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await sendUserCommander<NotificationSettings | null>(GameServerKeys.GetSettings, {
                    key: "notification_settings",
                })

                if (!resp) return setDbSettings(null)
                setDbSettings(resp)
                setCurrentSettings(resp)
            } catch (err) {
                console.error(err)
                newSnackbarMessage(typeof err === "string" ? err : "Failed to get user notification settings, try again or contact support.", "error")
            }
        })()
    }, [newSnackbarMessage, sendUserCommander])

    // If notification is turned on, add 10% to the queue cost
    useEffect(() => {
        let qc = new BigNumber(queueFeed?.queue_cost || "0").shiftedBy(-18)
        if (notificationsOn) qc = qc.multipliedBy(1.1)
        setActualQueueCost(qc.toFixed(3))
    }, [notificationsOn, queueFeed?.queue_cost])

    const onDeploy = useCallback(
        async ({ hash, mobile, saveMobile, saveSettings }: { hash: string; mobile?: string; saveMobile?: boolean; saveSettings?: boolean }) => {
            if (!userID) return

            try {
                // Save mobile number if checked
                if (saveMobile && mobile != user.mobile_number) {
                    try {
                        const resp = await sendPassportUser<MobileNumberSave>(PassportServerKeys.UserUpdate, {
                            id: user.id,
                            mobile_number: mobile,
                        })
                        if (resp) newSnackbarMessage("Updated mobile number", "success")
                    } catch (err) {
                        newSnackbarMessage(typeof err === "string" ? err : "Failed to updating mobile number.", "error")
                    }
                }

                // If saveSettings is true, send an updated settings
                if (saveSettings) {
                    const updatedSettings = { key: "notification_settings", value: currentSettings }
                    try {
                        const resp = await sendUserCommander<NotificationSettings>(GameServerKeys.UpdateSettings, updatedSettings)
                        setDbSettings(resp)
                        setCurrentSettings(resp)
                    } catch (err) {
                        newSnackbarMessage(typeof err === "string" ? err : "Issue getting settings, try again or contact support.", "error")
                    }
                }

                // Deploy the mech into queue, with the notification settings
                const resp = await sendFactionCommander<{ success: boolean; code: string }>(GameServerKeys.JoinQueue, {
                    asset_hash: hash,
                    enable_push_notifications: currentSettings.push_notifications,
                    mobile_number: currentSettings.sms_notifications ? mobile : undefined,
                    enable_telegram_notifications: currentSettings.telegram_notifications,
                })

                if (resp && resp.success) {
                    if (resp.code !== "" && setTelegramShortcode) {
                        setTelegramShortcode(resp.code)
                    }

                    setDeployMechDetails(undefined)
                    newSnackbarMessage("Successfully deployed war machine.", "success")
                    setDeployError("")
                }
            } catch (e) {
                setDeployError(typeof e === "string" ? e : "Failed to deploy war machine.")
                console.error(e)
                return
            }
        },
        [currentSettings, newSnackbarMessage, sendFactionCommander, sendPassportUser, sendUserCommander, user.id, user.mobile_number, userID],
    )

    return {
        queueFeed,
        settingsMatch,
        currentSettings,
        setCurrentSettings,
        deployMechDetails,
        setDeployMechDetails,
        setDeployError,
        actualQueueCost,
        telegramShortcode,
        deployError,
        onDeploy,
    }
})

export const HangarWarMachineProvider = HangarWarMachineContainer.Provider
export const useHangarWarMachine = HangarWarMachineContainer.useContainer
