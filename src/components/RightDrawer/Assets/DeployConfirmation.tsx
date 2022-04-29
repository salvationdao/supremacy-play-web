import { Box, Button, Checkbox, IconButton, Link, Modal, Stack, Switch, TextField, Theme, Typography, useTheme } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useState } from "react"
import QRCode from "react-qr-code"
import { ClipThing, QueueFeedResponse, TooltipHelper } from "../.."
import { SvgClose, SvgContentCopyIcon, SvgExternalLink, SvgInfoCircular, SvgSupToken } from "../../../assets"
import { PASSPORT_WEB, TELEGRAM_BOT_URL } from "../../../constants"
import { useGameServerWebsocket, usePassportServerAuth, usePassportServerWebsocket, useSnackbar } from "../../../containers"
import { getRarityDeets, supFormatter } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { GameServerKeys, PassportServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { Asset } from "../../../types/assets"

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
            <Typography sx={{ mr: ".4rem", fontWeight: "fontWeightBold" }}>{title}</Typography>
            {!disableIcon && <SvgSupToken size="1.4rem" fill={color} sx={{ mr: ".1rem", pb: ".4rem" }} />}
            <Typography sx={{ mr: "3.2rem", color: color }}>{value}</Typography>
            <TooltipHelper placement="right-start" text={tooltip}>
                <Box sx={{ ml: "auto" }}>
                    <SvgInfoCircular size="1.2rem" sx={{ opacity: 0.4, ":hover": { opacity: 1 } }} />
                </Box>
            </TooltipHelper>
        </Stack>
    )
}

interface MobileNumberSave {
    id: string
    mobile_number: string
}

interface NotificationsSettings {
    telegram_notifications: boolean
    push_notifications: boolean
    sms_notifications: boolean
}

export const DeployConfirmation = ({
    open,
    asset,
    queueFeed,
    onClose,
    setTelegramShortcode,
}: {
    open: boolean
    asset: Asset
    queueFeed: QueueFeedResponse
    onClose: () => void
    setTelegramShortcode?: (s: string) => void
}) => {
    const theme = useTheme<Theme>()
    const queueLength = queueFeed?.queue_length || 0
    const queueCost = queueFeed?.queue_cost || ""
    const contractReward = queueFeed?.contract_reward || ""

    const { newSnackbarMessage } = useSnackbar()
    const { state, send } = useGameServerWebsocket()
    const { send: psSend } = usePassportServerWebsocket()
    const { user, userID } = usePassportServerAuth()
    const { hash, name, label, image_url, avatar_url, tier } = asset.data.mech
    const [isDeploying, toggleIsDeploying] = useToggle()
    const [deployFailed, setDeployFailed] = useState("")
    const [actualQueueCost, setActualQueueCost] = useState(supFormatter(queueCost, 2))

    const initialSettings: NotificationsSettings = {
        sms_notifications: false,
        push_notifications: false,
        telegram_notifications: false,
    }
    const [mobile, setMobile] = useState(user?.mobile_number)
    const [saveMobile, setSaveMobile] = useState(false)
    const [dbSettings, setDbSettings] = useState<NotificationsSettings | null>(null)
    const [currentSettings, setCurrentSettings] = useState<NotificationsSettings>(initialSettings)
    const [saveSettings, setSaveSettings] = useState(false)

    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])
    const notificationsOn = currentSettings.push_notifications || currentSettings.sms_notifications || currentSettings.telegram_notifications
    const settingsMatch =
        currentSettings.push_notifications === dbSettings?.push_notifications &&
        currentSettings.sms_notifications === dbSettings.sms_notifications &&
        currentSettings.telegram_notifications === dbSettings.telegram_notifications

    useEffect(() => {
        if (!userID || !send) return
        ;(async () => {
            try {
                const resp = await send<NotificationsSettings | null>(GameServerKeys.GetSettings, {
                    key: "notification_settings",
                })

                if (resp === null) {
                    setDbSettings(null)
                    return
                }
                setDbSettings(resp)
                setCurrentSettings(resp)
            } catch (err) {
                newSnackbarMessage(typeof err === "string" ? err : "Issue getting settings, try again or contact support.", "error")
            }
        })()
    }, [userID, send, newSnackbarMessage])

    useEffect(() => {
        let qc = new BigNumber(queueCost).shiftedBy(-18)
        if (notificationsOn) {
            qc = qc.multipliedBy(1.1)
        }
        setActualQueueCost(qc.toFixed(3))
    }, [notificationsOn, queueCost])

    useEffect(() => {
        if (!open) setDeployFailed("")
    }, [open])

    const onDeploy = useCallback(async () => {
        if (state !== WebSocket.OPEN || !user) return

        try {
            // save mobile number if checked
            if (saveMobile && mobile != user?.mobile_number) {
                const saveMobileNum = await psSend<MobileNumberSave>(PassportServerKeys.UserUpdate, {
                    id: user.id,
                    mobile_number: mobile,
                })
                saveMobileNum ? newSnackbarMessage("Updated mobile number", "success") : newSnackbarMessage("Issue updating mobile number.", "warning")
            }

            // if saveSettings is true, send an updated settings
            if (saveSettings) {
                const updatedSettings = { key: "notification_settings", value: currentSettings }
                ;(async () => {
                    try {
                        const resp = await send<NotificationsSettings>(GameServerKeys.UpdateSettings, updatedSettings)
                        setDbSettings(resp)
                        setCurrentSettings(resp)
                    } catch (err) {
                        newSnackbarMessage(typeof err === "string" ? err : "Issue getting settings, try again or contact support.", "error")
                    }
                })()
            }

            const resp = await send<{ success: boolean; code: string }>(GameServerKeys.JoinQueue, {
                asset_hash: hash,
                enable_push_notifications: currentSettings.push_notifications,
                mobile_number: currentSettings.sms_notifications ? mobile : undefined,
                enable_telegram_notifications: currentSettings.telegram_notifications,
            })
            if (resp && resp.success) {
                if (resp.code !== "" && setTelegramShortcode) {
                    setTelegramShortcode(resp.code)
                }
                onClose()
                newSnackbarMessage("Successfully deployed war machine.", "success")
                setDeployFailed("")
            }
        } catch (e) {
            setDeployFailed(typeof e === "string" ? e : "Failed to deploy war machine.")
            console.debug(e)
            return
        } finally {
            toggleIsDeploying(false)
        }
    }, [
        state,
        user,
        saveMobile,
        mobile,
        saveSettings,
        send,
        hash,
        currentSettings,
        psSend,
        newSnackbarMessage,
        setTelegramShortcode,
        onClose,
        toggleIsDeploying,
    ])

    return (
        <Modal open={open} onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "36rem",
                    boxShadow: 6,
                }}
            >
                <ClipThing
                    clipSize="0"
                    border={{
                        isFancy: true,
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".15rem",
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={theme.factionTheme.background}
                >
                    <Stack
                        spacing="1.6rem"
                        sx={{
                            position: "relative",
                            px: "2.5rem",
                            py: "2.4rem",
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                px: ".6rem",
                                py: "1rem",
                                borderRadius: 0.6,
                                boxShadow: "inset 0 0 12px 6px #00000040",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "13.8rem",
                                    backgroundImage: `url(${image_url})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "top center",
                                    backgroundSize: "contain",
                                }}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    left: "2rem",
                                    bottom: "1.3rem",
                                    width: "5rem",
                                    height: "5rem",
                                    border: "#FFFFFF60 1px solid",
                                    backgroundImage: `url(${avatar_url})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "top center",
                                    backgroundSize: "contain",
                                }}
                            />
                        </Box>

                        <Stack spacing=".8rem">
                            <Box>
                                <Box>
                                    <Typography sx={{ display: "inline", fontFamily: fonts.nostromoBold }}>{name || label}</Typography>
                                    {user && (
                                        <span>
                                            <Link
                                                href={`${PASSPORT_WEB}profile/${user.username}/asset/${hash}`}
                                                target="_blank"
                                                sx={{ display: "inline", ml: ".7rem" }}
                                            >
                                                <SvgExternalLink size="1rem" sx={{ display: "inline", opacity: 0.2, ":hover": { opacity: 0.6 } }} />
                                            </Link>
                                        </span>
                                    )}
                                </Box>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        mt: ".4rem",
                                        lineHeight: 1,
                                        color: rarityDeets.color,
                                        fontFamily: fonts.nostromoHeavy,
                                    }}
                                >
                                    {rarityDeets.label}
                                </Typography>
                            </Box>

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

                                <AmountItem
                                    title={"Fee: "}
                                    color={"#FF4136"}
                                    value={actualQueueCost}
                                    tooltip="The cost to place your war machine into the battle queue."
                                />
                            </Stack>

                            <Stack>
                                <Stack direction="row" alignItems="center">
                                    <Typography
                                        sx={{
                                            pt: ".08rem",
                                            lineHeight: 1,
                                            color: colors.green,
                                            fontWeight: "fontWeightBold",
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
                                                Enabling notifications will add&nbsp;<strong>10%</strong> to the queue cost. We will notify you via your chosen
                                                notification preference when your war machine is within the top 10 in queue. The notification fee{" "}
                                                <strong>will not</strong> be refunded if your war marchine exits the queue.
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
                                            sx={{
                                                pt: ".08rem",
                                                lineHeight: 1,
                                                color: colors.green,
                                                fontWeight: "fontWeightBold",
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
                                                setMobile(user?.mobile_number)
                                                setSaveMobile(false)
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
                                                    Enabling notifications will add&nbsp;<strong>10%</strong> to the queue fee. We will notify you via your
                                                    chosen notification preference when your war machine is within top 10 in queue. The notification fee{" "}
                                                    <strong>will not</strong> be refunded if your war marchine exits the queue.
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
                                                        defaultValue={mobile}
                                                        value={mobile}
                                                        onChange={(e) => {
                                                            setMobile(e.target.value)
                                                            if (e.target.value === user?.mobile_number) {
                                                                setSaveMobile(false)
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                                {user?.mobile_number != mobile && (
                                                    <Stack direction="row" spacing=".5rem" alignItems="center">
                                                        <Typography>Save number to profile?</Typography>
                                                        <Checkbox
                                                            checked={saveMobile}
                                                            onClick={() => setSaveMobile((prev) => !prev)}
                                                            sx={{ m: 0, p: 0, color: (theme) => theme.factionTheme.primary }}
                                                        />
                                                    </Stack>
                                                )}
                                            </>
                                        )}

                                        {!settingsMatch && (
                                            <Stack direction="row" spacing=".5rem" alignItems="center">
                                                <Typography>Save notification settings as default?</Typography>
                                                <Checkbox
                                                    checked={saveSettings}
                                                    onClick={() => setSaveSettings((prev) => !prev)}
                                                    sx={{ m: 0, p: 0, color: (theme) => theme.factionTheme.primary }}
                                                />
                                            </Stack>
                                        )}
                                    </Stack>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing="2rem" alignItems="center" sx={{ mt: "auto" }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    disabled={isDeploying}
                                    onClick={onDeploy}
                                    sx={{
                                        flex: 1,
                                        minWidth: 0,
                                        px: ".8rem",
                                        py: ".6rem",
                                        backgroundColor: colors.green,
                                        border: `${colors.green} 1px solid`,
                                        borderRadius: 0.3,
                                        ":hover": { backgroundColor: `${colors.green}90` },
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            lineHeight: 1,
                                            fontWeight: "fontWeightBold",
                                            color: isDeploying ? colors.green : "#FFFFFF",
                                        }}
                                    >
                                        {isDeploying ? "DEPLOYING..." : "DEPLOY"}
                                    </Typography>
                                </Button>
                            </Stack>

                            {deployFailed && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mt: ".3rem",
                                        color: "red",
                                    }}
                                >
                                    {deployFailed}
                                </Typography>
                            )}
                        </Stack>
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".2rem", right: ".2rem" }}>
                        <SvgClose size="1.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}

export const TelegramShortcodeModal = ({ open, onClose, code }: { open: boolean; onClose: () => void; code: string }) => {
    const { state, subscribe } = useGameServerWebsocket()
    const [copySuccess, toggleCopySuccess] = useToggle()
    const [userTelegramShortcodeRegistered, setUserTelegramShortcodeRegistered] = useState<boolean | undefined>(undefined)

    // copy shortcode
    useEffect(() => {
        if (copySuccess) {
            const timeout = setTimeout(() => {
                toggleCopySuccess(false)
            }, 900)

            return () => clearTimeout(timeout)
        }
    }, [copySuccess, toggleCopySuccess])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<boolean | undefined>(
            GameServerKeys.UserTelegramShortcodeRegistered,
            (payload: boolean | undefined) => {
                setUserTelegramShortcodeRegistered(!!payload)
            },
            null,
        )
    }, [state, subscribe])

    if (!TELEGRAM_BOT_URL) return <></>
    return (
        <Modal open={open}>
            <>
                {userTelegramShortcodeRegistered ? (
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "63rem",
                        }}
                    >
                        <ClipThing
                            clipSize="10px"
                            border={{
                                isFancy: true,
                                borderColor: colors.neonBlue,
                                borderThickness: ".15rem",
                            }}
                            backgroundColor={colors.darkNavyBlue}
                        >
                            <Stack
                                direction="row"
                                spacing="1.6rem"
                                sx={{
                                    position: "relative",
                                    pl: "1.76rem",
                                    pr: "2.56rem",
                                    py: "2.4rem",
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        flexShrink: 0,
                                        px: ".64rem",
                                        py: "1.2rem",
                                        borderRadius: 0.6,
                                        boxShadow: "inset 0 0 12px 6px #00000055",
                                    }}
                                >
                                    <Stack
                                        spacing=".48rem"
                                        direction="row"
                                        alignItems="center"
                                        sx={{
                                            position: "absolute",
                                            bottom: "1.2rem",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                        }}
                                    ></Stack>
                                </Box>

                                <Stack spacing=".8rem" sx={{ flex: 1 }}>
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontFamily: fonts.nostromoBold,
                                                marginBottom: "1rem",
                                                fontSize: "2rem",
                                            }}
                                        >
                                            Shortcode Registered Successfully
                                        </Typography>
                                    </Box>

                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setUserTelegramShortcodeRegistered(false)
                                            onClose()
                                        }}
                                        sx={{
                                            justifySelf: "flex-end",
                                            mt: "auto",
                                            ml: 3,
                                            pt: ".7rem",
                                            pb: ".4rem",
                                            width: "9rem",
                                            color: colors.neonBlue,
                                            backgroundColor: colors.darkNavy,
                                            borderRadius: 0.7,
                                            fontFamily: fonts.nostromoBold,
                                            border: `${colors.neonBlue} 1px solid`,
                                            ":hover": {
                                                opacity: 0.8,
                                                border: `${colors.neonBlue} 1px solid`,
                                            },
                                        }}
                                    >
                                        Close
                                    </Button>
                                </Stack>
                            </Stack>
                        </ClipThing>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "73rem",
                        }}
                    >
                        <ClipThing
                            clipSize="10px"
                            border={{
                                isFancy: true,
                                borderColor: colors.neonBlue,
                                borderThickness: ".15rem",
                            }}
                            backgroundColor={colors.darkNavyBlue}
                        >
                            <Stack
                                direction="row"
                                spacing="1.6rem"
                                sx={{
                                    position: "relative",
                                    pl: "1.76rem",
                                    pr: "2.56rem",
                                    py: "2.4rem",
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        flexShrink: 0,
                                        px: ".64rem",
                                        py: "1.2rem",
                                        borderRadius: 0.6,
                                        boxShadow: "inset 0 0 12px 6px #00000055",
                                    }}
                                >
                                    <Stack
                                        spacing=".48rem"
                                        direction="row"
                                        alignItems="center"
                                        sx={{
                                            position: "absolute",
                                            bottom: "1.2rem",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                        }}
                                    ></Stack>
                                </Box>

                                <Stack spacing=".8rem" sx={{ flex: 1 }}>
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontFamily: fonts.nostromoBold,
                                                marginBottom: "1rem",
                                                fontSize: "2rem",
                                            }}
                                        >
                                            Telegram Notifications
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontFamily: fonts.nostromoBold,
                                                marginBottom: "1rem",
                                            }}
                                        >
                                            Steps to enable Telegram notification:
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex" }}>
                                        <Typography
                                            sx={{
                                                fontFamily: fonts.nostromoBold,
                                                marginRight: ".3rem",
                                            }}
                                        >
                                            1) Open The Supremacy Telegram bot:{" "}
                                        </Typography>
                                        <a href={TELEGRAM_BOT_URL} rel="noreferrer" target="_blank">
                                            <Typography
                                                sx={{
                                                    fontFamily: fonts.nostromoBold,
                                                    WebkitBoxOrient: "vertical",
                                                    textDecoration: "underline",
                                                    ":hover": {
                                                        color: colors.blue,
                                                    },
                                                }}
                                            >
                                                {TELEGRAM_BOT_URL}
                                            </Typography>
                                        </a>
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontFamily: fonts.nostromoBold }}>Or Scan QR code:</Typography>
                                    </Box>

                                    <Box style={{ textAlign: "center", marginBottom: "1rem" }}>
                                        <QRCode size={228} value={TELEGRAM_BOT_URL || ""} />
                                    </Box>

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontFamily: fonts.nostromoBold,
                                            }}
                                        >
                                            2) Click Start (if first time using the bot)
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography
                                            sx={{
                                                fontFamily: fonts.nostromoBold,
                                            }}
                                        >
                                            3) type /register
                                        </Typography>
                                    </Box>

                                    <Box
                                        onClick={() => {
                                            navigator.clipboard.writeText(code).then(
                                                () => toggleCopySuccess(true),
                                                () => toggleCopySuccess(false),
                                            )
                                        }}
                                        sx={{
                                            display: "flex",
                                            ":hover": {
                                                cursor: "pointer",
                                                opacity: 0.6,
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontFamily: fonts.nostromoBold,
                                                display: "-webkit-box",
                                            }}
                                        >
                                            4) Enter Shortcode:{" "}
                                            <Typography marginLeft={".5rem"} marginRight={".5rem"} marginTop={"-.5rem"} fontSize={"2rem"}>
                                                {code}
                                            </Typography>
                                        </Typography>

                                        <SvgContentCopyIcon size="1.3rem" />
                                        {copySuccess && (
                                            <Typography
                                                sx={{
                                                    fontFamily: fonts.nostromoBold,
                                                    marginTop: ".5rem",
                                                    marginLeft: "1rem",
                                                }}
                                            >
                                                Copied!
                                            </Typography>
                                        )}
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setUserTelegramShortcodeRegistered(false)
                                            onClose()
                                        }}
                                        sx={{
                                            justifySelf: "flex-end",
                                            mt: "auto",
                                            ml: 3,
                                            pt: ".7rem",
                                            pb: ".4rem",
                                            width: "9rem",
                                            color: colors.neonBlue,
                                            backgroundColor: colors.darkNavy,
                                            borderRadius: 0.7,
                                            fontFamily: fonts.nostromoBold,
                                            border: `${colors.neonBlue} 1px solid`,
                                            ":hover": {
                                                opacity: 0.8,
                                                border: `${colors.neonBlue} 1px solid`,
                                            },
                                        }}
                                    >
                                        Close
                                    </Button>
                                </Stack>
                            </Stack>
                        </ClipThing>
                    </Box>
                )}
            </>
        </Modal>
    )
}
