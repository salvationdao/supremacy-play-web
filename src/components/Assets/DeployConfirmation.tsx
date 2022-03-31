import { Box, Button, Checkbox, IconButton, Link, Modal, Stack, Switch, TextField, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing, TooltipHelper } from ".."
import { SvgClose, SvgExternalLink, SvgInfoCircular, SvgSupToken } from "../../assets"
import { PASSPORT_WEB } from "../../constants"
import {
    useGameServerWebsocket,
    usePassportServerAuth,
    usePassportServerWebsocket,
    useSnackbar,
} from "../../containers"
import { getRarityDeets, supFormatter } from "../../helpers"
import { useToggle } from "../../hooks"
import { GameServerKeys, PassportServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { Asset } from "../../types/assets"

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
    queueLength,
    queueCost,
    contractReward,
    onClose,
}: {
    open: boolean
    asset: Asset
    queueLength: number
    queueCost: string
    contractReward: string
    onClose: () => void
}) => {
    const { newSnackbarMessage } = useSnackbar()
    const { state, send } = useGameServerWebsocket()
    const { send: psSend } = usePassportServerWebsocket()
    const { user } = usePassportServerAuth()
    const { hash, name, label, image_url, tier } = asset.data.mech
    const [needInsured, toggleNeedInsured] = useToggle()
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
    const notificationsOn =
        currentSettings.push_notifications ||
        currentSettings.sms_notifications ||
        currentSettings.telegram_notifications
    const settingsMatch =
        currentSettings.push_notifications === dbSettings?.push_notifications &&
        currentSettings.sms_notifications === dbSettings.sms_notifications &&
        currentSettings.telegram_notifications === dbSettings.telegram_notifications

    useEffect(() => {
        if (!user || !send) return
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
                newSnackbarMessage(
                    typeof err === "string" ? err : "Issue getting settings, try again or contact support.",
                    "error",
                )
            }
        })()
    }, [user, send])

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
            //save mobile number if checked
            if (saveMobile && mobile != user?.mobile_number) {
                const saveMobileNum = await psSend<MobileNumberSave>(PassportServerKeys.UserUpdate, {
                    id: user.id,
                    mobile_number: mobile,
                })
                saveMobileNum
                    ? newSnackbarMessage("Updated mobile number", "success")
                    : newSnackbarMessage("Issue updating mobile number.", "warning")
            }

            //if saveSettings is true, send an updated settings
            if (saveSettings) {
                const updatedSettings = { key: "notification_settings", value: currentSettings }
                ;(async () => {
                    try {
                        const resp = await send<NotificationsSettings>(GameServerKeys.UpdateSettings, updatedSettings)
                        setDbSettings(resp)
                        setCurrentSettings(resp)
                    } catch (err) {
                        newSnackbarMessage(
                            typeof err === "string" ? err : "Issue getting settings, try again or contact support.",
                            "error",
                        )
                    }
                })()
            }

            const resp = await send(GameServerKeys.JoinQueue, {
                asset_hash: hash,
                need_insured: needInsured,
                enable_push_notifications: currentSettings.push_notifications,
                mobile_number: mobile,
            })
            if (resp) {
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
    }, [state, hash, needInsured, currentSettings, saveMobile, mobile, saveSettings])

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "70rem",
                    boxShadow: 6,
                }}
            >
                <ClipThing
                    clipSize="0"
                    border={{
                        isFancy: true,
                        borderColor: (user && user.faction.theme.primary) || colors.neonBlue,
                        borderThickness: ".3rem",
                    }}
                    innerSx={{ position: "relative" }}
                >
                    <Stack
                        direction="row"
                        spacing="1.6rem"
                        sx={{
                            position: "relative",
                            pl: "1.76rem",
                            pr: "2.56rem",
                            py: "2.4rem",
                            display: "flex",
                            backgroundColor: (user && user.faction.theme.background) || colors.darkNavyBlue,
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
                                maxHeight: "130px",
                                alignSelf: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    my: "auto",
                                    width: "11rem",
                                    height: "15rem",
                                    backgroundImage: `url(${image_url})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "top center",
                                    backgroundSize: "contain",
                                }}
                            />

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
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        lineHeight: 1,
                                        color: rarityDeets.color,
                                        fontFamily: "Nostromo Regular Heavy",
                                        textAlign: "center",
                                    }}
                                >
                                    {rarityDeets.label}
                                </Typography>
                            </Stack>
                        </Box>

                        <Stack spacing=".8rem" sx={{ flex: 1 }}>
                            <Box>
                                <Typography
                                    sx={{
                                        fontFamily: "Nostromo Regular Bold",
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        overflowWrap: "anywhere",
                                        textOverflow: "ellipsis",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {name || label}

                                    {user && (
                                        <span>
                                            <Link
                                                href={`${PASSPORT_WEB}profile/${user.username}/asset/${hash}`}
                                                target="_blank"
                                                sx={{ ml: ".48rem" }}
                                            >
                                                <SvgExternalLink
                                                    size="1rem"
                                                    sx={{ opacity: 0.2, ":hover": { opacity: 0.6 } }}
                                                />
                                            </Link>
                                        </span>
                                    )}
                                </Typography>
                            </Box>

                            <Box>
                                <Stack spacing=".08rem">
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

                                <Stack direction="row" alignItems="center">
                                    <Typography
                                        sx={{
                                            pt: ".08rem",
                                            lineHeight: 1,
                                            color: colors.green,
                                            fontWeight: "fontWeightBold",
                                        }}
                                    >
                                        Add insurance:
                                    </Typography>
                                    <Switch
                                        size="small"
                                        checked={needInsured}
                                        onChange={() => toggleNeedInsured()}
                                        sx={{
                                            transform: "scale(.6)",
                                            ".Mui-checked": { color: colors.green },
                                            ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.green}50` },
                                        }}
                                    />
                                    <TooltipHelper
                                        placement="right-start"
                                        text={
                                            <>
                                                Insurance costs&nbsp;
                                                <span style={{ textDecoration: "line-through" }}>10%</span> of the
                                                contract reward but allows your damaged war machine to be repair much
                                                faster so it can be ready for the next battle much sooner.
                                            </>
                                        }
                                    >
                                        <Box sx={{ ml: "auto" }}>
                                            <SvgInfoCircular
                                                size="1.2rem"
                                                sx={{ opacity: 0.4, ":hover": { opacity: 1 } }}
                                            />
                                        </Box>
                                    </TooltipHelper>
                                </Stack>
                            </Box>

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
                                        py: ".48rem",
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
                                    variant="caption"
                                    sx={{
                                        mt: ".3rem",
                                        color: "red",
                                    }}
                                >
                                    {deployFailed}
                                </Typography>
                            )}
                        </Stack>
                        <Stack>
                            <Typography>Notifications</Typography>
                            <Stack direction="row" alignItems="center" sx={{ mt: "-0.55rem" }}>
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
                                        ".Mui-checked": { color: colors.green },
                                        ".Mui-checked+.MuiSwitch-track": {
                                            backgroundColor: `${colors.green}50`,
                                        },
                                    }}
                                />
                                <Box ml="auto" />

                                <TooltipHelper
                                    placement="right-start"
                                    text={
                                        <>
                                            Enabling notifications will add&nbsp;<strong>10%</strong> to the queue cost.
                                            We will notify you via your chosen notification preference when your war
                                            machine is within the top 10 in queue. The notification fee{" "}
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
                            {currentSettings.sms_notifications && (
                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Typography sx={{ alignSelf: "flex-end" }}>Phone Number: </Typography>
                                        <TextField
                                            sx={{ flexGrow: "2", paddingLeft: "1rem" }}
                                            inputProps={{ style: { padding: "2px" } }}
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
                                    <Box sx={{ display: "flex", alignSelf: "flex-end" }}>
                                        {user?.mobile_number != mobile && (
                                            <>
                                                <Typography sx={{ alignSelf: "center" }}>
                                                    Save number to profile?
                                                </Typography>
                                                <Checkbox
                                                    checked={saveMobile}
                                                    onClick={() => {
                                                        setSaveMobile((prev) => !prev)
                                                    }}
                                                    sx={{ margin: "0", color: user?.faction.theme.primary }}
                                                    inputProps={{ "aria-label": "save to profile checkbox" }}
                                                />
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            )}
                            {!settingsMatch && (
                                <Box sx={{ display: "flex", alignSelf: "flex-end" }}>
                                    <Typography sx={{ alignSelf: "center" }}>
                                        Save notification settings as default?
                                    </Typography>
                                    <Checkbox
                                        checked={saveSettings}
                                        onClick={() => {
                                            setSaveSettings((prev) => !prev)
                                        }}
                                        sx={{ margin: "0", color: user?.faction.theme.primary }}
                                        inputProps={{ "aria-label": "save default settings" }}
                                    />
                                </Box>
                            )}
                        </Stack>

                        <IconButton
                            size="small"
                            onClick={onClose}
                            sx={{ position: "absolute", top: ".2rem", right: ".2rem" }}
                        >
                            <SvgClose size="1.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                        </IconButton>
                    </Stack>

                    <IconButton
                        size="small"
                        onClick={onClose}
                        sx={{ position: "absolute", top: ".2rem", right: ".2rem" }}
                    >
                        <SvgClose size="1.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
