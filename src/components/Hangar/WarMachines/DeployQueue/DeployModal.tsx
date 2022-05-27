import { Box, Checkbox, Stack, Switch, TextField, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useState } from "react"
import { FancyButton, TooltipHelper } from "../../.."
import { SvgInfoCircular, SvgSupToken } from "../../../../assets"
import { useAuth, useSnackbar } from "../../../../containers"
import { useHangarWarMachine } from "../../../../containers/hangar/hangarWarMachines"
import { supFormatter } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsFaction, useGameServerCommandsUser, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { usePassportCommandsUser } from "../../../../hooks/usePassport"
import { GameServerKeys, PassportServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MechModal } from "../Common/MechModal"

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

export const DeployModal = () => {
    const { deployMechDetails, setDeployMechDetails } = useHangarWarMachine()
    const { newSnackbarMessage } = useSnackbar()
    const { userID, user } = useAuth()
    const { send: sendUserCommander } = useGameServerCommandsUser("/user_commander")
    const { send: sendFactionCommander } = useGameServerCommandsFaction("/faction_commander")
    const { send: sendPassportUser } = usePassportCommandsUser("xxxxxxxxx")

    // Queuing cost, queue length win reward etc.
    const queueFeed = useGameServerSubscriptionFaction<QueueFeed>({
        URI: "/queue",
        key: GameServerKeys.SubQueueFeed,
    })

    const [deployQueueError, setDeployQueueError] = useState<string>()
    const [actualQueueCost, setActualQueueCost] = useState(supFormatter(queueFeed?.queue_cost || "0", 2))

    // Notification settings
    const [dbSettings, setDbSettings] = useState<NotificationSettings | null>(null)
    const [currentSettings, setCurrentSettings] = useState<NotificationSettings>(initialSettings)
    const [, setTelegramShortcode] = useState<string>()

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

    const onDeployQueue = useCallback(
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

                    newSnackbarMessage("Successfully deployed war machine.", "success")
                    setDeployMechDetails(undefined)
                    setDeployQueueError("")
                }
            } catch (e) {
                setDeployQueueError(typeof e === "string" ? e : "Failed to deploy war machine.")
                console.error(e)
                return
            }
        },
        [
            currentSettings,
            newSnackbarMessage,
            sendFactionCommander,
            sendPassportUser,
            sendUserCommander,
            setDeployMechDetails,
            user.id,
            user.mobile_number,
            userID,
        ],
    )

    const onClose = useCallback(() => {
        setDeployMechDetails(undefined)
        setDeployQueueError("")
    }, [setDeployQueueError, setDeployMechDetails])

    const [mobile, setMobile] = useState(user.mobile_number || "")
    const [saveSettings, toggleSaveSettings] = useToggle(false)
    const [saveMobile, toggleSaveMobile] = useToggle(false)

    if (!deployMechDetails) return null

    const queueLength = queueFeed?.queue_length || 0
    const contractReward = queueFeed?.contract_reward || ""
    const { hash } = deployMechDetails

    return (
        <MechModal mechDetails={deployMechDetails} onClose={onClose}>
            <Stack spacing="1.5rem">
                <Stack spacing=".2rem">
                    {queueLength >= 0 && (
                        <AmountItem
                            key={`${queueLength}-queue_length`}
                            title={"Position: "}
                            color="#FFFFFF"
                            value={`${queueLength + 1}`}
                            tooltip="The queue position of your war machine if you deploy now."
                            disableIcon
                        />
                    )}

                    <AmountItem
                        key={`${contractReward}-contract_reward`}
                        title={"Contract reward: "}
                        color={colors.yellow}
                        value={supFormatter(contractReward, 2)}
                        tooltip="Your reward if your mech survives the battle giving your syndicate a victory."
                    />

                    <AmountItem title={"Fee: "} color={"#FF4136"} value={actualQueueCost} tooltip="The cost to place your war machine into the battle queue." />
                </Stack>

                <Stack>
                    <Stack direction="row" alignItems="center">
                        <Typography
                            variant="caption"
                            sx={{
                                pt: ".08rem",
                                lineHeight: 1,
                                color: colors.green,
                                fontFamily: fonts.nostromoBlack,
                            }}
                        >
                            Enable Telegram notifications:
                        </Typography>
                        <Switch
                            size="small"
                            checked={currentSettings.telegram_notifications}
                            onChange={(e) => {
                                setCurrentSettings((prev) => {
                                    const newSettings = { ...prev }
                                    newSettings.telegram_notifications = e.currentTarget.checked
                                    return newSettings
                                })
                            }}
                            sx={{
                                transform: "scale(.6)",
                                ".Mui-checked": { color: `${colors.green} !important` },
                                ".Mui-checked+.MuiSwitch-track": {
                                    backgroundColor: `${colors.green}50 !important`,
                                },
                            }}
                        />
                        <Box ml="auto" />

                        <TooltipHelper
                            placement="right-start"
                            text={
                                <>
                                    Enabling notifications will add&nbsp;<strong>10%</strong> to the queue cost. We will notify you via your chosen notification
                                    preference when your war machine is within the top 10 in queue. The notification fee <strong>will not</strong> be refunded
                                    if your war machine exits the queue.
                                </>
                            }
                        >
                            <Box>
                                <SvgInfoCircular
                                    size="1.2rem"
                                    sx={{
                                        marginLeft: ".5rem",
                                        paddingBottom: 0,
                                        opacity: 0.4,
                                        ":hover": { opacity: 1 },
                                    }}
                                />
                            </Box>
                        </TooltipHelper>
                    </Stack>

                    <Box>
                        <Stack direction="row" alignItems="center">
                            <Typography
                                variant="caption"
                                sx={{
                                    pt: ".08rem",
                                    lineHeight: 1,
                                    color: colors.green,
                                    fontWeight: "fontWeightBold",
                                    fontFamily: fonts.nostromoBlack,
                                }}
                            >
                                Enable SMS notifications:
                            </Typography>
                            <Switch
                                size="small"
                                checked={currentSettings.sms_notifications}
                                onChange={(e) => {
                                    setCurrentSettings((prev) => {
                                        const newSettings = { ...prev }
                                        newSettings.sms_notifications = e.currentTarget.checked
                                        return newSettings
                                    })
                                    setMobile(user.mobile_number || "")
                                    toggleSaveMobile(false)
                                }}
                                sx={{
                                    transform: "scale(.6)",
                                    ".Mui-checked": { color: `${colors.green} !important` },
                                    ".Mui-checked+.MuiSwitch-track": {
                                        backgroundColor: `${colors.green}50 !important`,
                                    },
                                }}
                            />
                            <TooltipHelper
                                placement="right-start"
                                text={
                                    <>
                                        Enabling notifications will add&nbsp;<strong>10%</strong> to the queue fee. We will notify you via your chosen
                                        notification preference when your war machine is within top 10 in queue. The notification fee <strong>will not</strong>{" "}
                                        be refunded if your war machine exits the queue.
                                    </>
                                }
                            >
                                <Box sx={{ ml: "auto" }}>
                                    <SvgInfoCircular
                                        size="1.2rem"
                                        sx={{
                                            ml: ".5rem",
                                            pb: 0,
                                            opacity: 0.4,
                                            ":hover": { opacity: 1 },
                                        }}
                                    />
                                </Box>
                            </TooltipHelper>
                        </Stack>

                        <Stack
                            spacing=".3rem"
                            sx={{
                                mt: ".2rem",
                                mb: "1rem",
                                ml: ".3rem",
                                pl: "1rem",
                                borderLeft: "#FFFFFF35 1px solid",
                            }}
                        >
                            {currentSettings.sms_notifications && (
                                <>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Typography>Phone number: </Typography>
                                        <TextField
                                            sx={{
                                                flexGrow: "2",
                                                mt: "-1px",
                                                pl: "1rem",
                                                input: { px: ".5rem", py: "1px" },
                                            }}
                                            value={mobile}
                                            onChange={(e) => {
                                                setMobile(e.target.value)
                                                if (e.target.value === user.mobile_number) {
                                                    toggleSaveMobile(false)
                                                }
                                            }}
                                        />
                                    </Box>
                                    {user.mobile_number != mobile && (
                                        <Stack direction="row" spacing=".5rem" alignItems="center">
                                            <Typography>Save number to profile?</Typography>
                                            <Checkbox checked={saveMobile} onClick={() => toggleSaveMobile()} sx={{ m: 0, p: 0, color: colors.green }} />
                                        </Stack>
                                    )}
                                </>
                            )}

                            {!settingsMatch && (
                                <Stack direction="row" spacing=".5rem" alignItems="center">
                                    <Typography>Save notification settings as default?</Typography>
                                    <Checkbox checked={saveSettings} onClick={() => toggleSaveSettings()} sx={{ m: 0, p: 0, color: colors.green }} />
                                </Stack>
                            )}
                        </Stack>
                    </Box>
                </Stack>

                <Stack direction="row" spacing="2rem" alignItems="center" sx={{ mt: "auto" }}>
                    <FancyButton
                        excludeCaret
                        clipThingsProps={{
                            clipSize: "5px",
                            backgroundColor: colors.green,
                            border: { isFancy: true, borderColor: colors.green },
                            sx: { position: "relative", width: "100%" },
                        }}
                        sx={{ px: "1.6rem", py: ".5rem", color: "#FFFFFF" }}
                        onClick={() => onDeployQueue({ hash, mobile, saveMobile, saveSettings })}
                    >
                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                            DEPLOY
                        </Typography>
                    </FancyButton>
                </Stack>

                {deployQueueError && (
                    <Typography
                        variant="body2"
                        sx={{
                            mt: ".3rem",
                            color: "red",
                        }}
                    >
                        {deployQueueError}
                    </Typography>
                )}
            </Stack>
        </MechModal>
    )
}

const AmountItem = ({
    title,
    color,
    value,
    tooltip,
    disableIcon,
}: {
    title: string
    color: string
    value: string | number
    tooltip: string
    disableIcon?: boolean
}) => {
    return (
        <Stack direction="row" alignItems="center">
            <Typography variant="caption" sx={{ mr: ".4rem", fontFamily: fonts.nostromoBlack }}>
                {title}
            </Typography>

            {!disableIcon && <SvgSupToken size="1.4rem" fill={color} sx={{ mr: ".1rem", pb: ".4rem" }} />}

            <Typography variant="caption" sx={{ mr: "3.2rem", color: color, fontFamily: fonts.nostromoBold }}>
                {value || "---"}
            </Typography>

            <TooltipHelper placement="right-start" text={tooltip}>
                <Box sx={{ ml: "auto" }}>
                    <SvgInfoCircular size="1.2rem" sx={{ opacity: 0.4, ":hover": { opacity: 1 } }} />
                </Box>
            </TooltipHelper>
        </Stack>
    )
}
