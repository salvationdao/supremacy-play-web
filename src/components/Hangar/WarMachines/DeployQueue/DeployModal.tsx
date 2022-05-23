import { Box, Checkbox, Stack, Switch, TextField, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { FancyButton, TooltipHelper } from "../../.."
import { SvgInfoCircular, SvgSupToken } from "../../../../assets"
import { useAuth } from "../../../../containers"
import { useHangarWarMachine } from "../../../../containers/hangar/hangarWarMachines"
import { supFormatter } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { colors, fonts } from "../../../../theme/theme"
import { MechModal } from "../Common/MechModal"

export const DeployModal = () => {
    const {
        queueFeed,
        actualQueueCost,
        onDeployQueue,
        deployQueueError,
        deployMechDetails,
        setDeployMechDetails,
        setDeployQueueError,
        settingsMatch,
        currentSettings,
        setCurrentSettings,
    } = useHangarWarMachine()
    const { user } = useAuth()

    const [mobile, setMobile] = useState(user.mobile_number || "")
    const [saveSettings, toggleSaveSettings] = useToggle(false)
    const [saveMobile, toggleSaveMobile] = useToggle(false)

    const onClose = useCallback(() => {
        setDeployMechDetails(undefined)
        setDeployQueueError("")
    }, [setDeployQueueError, setDeployMechDetails])

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
