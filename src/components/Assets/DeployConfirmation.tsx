import { Box, Button, IconButton, Link, Modal, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing, TooltipHelper } from ".."
import { SvgClose, SvgExternalLink, SvgInfoCircular, SvgSupToken } from "../../assets"
import { PASSPORT_WEB } from "../../constants"
import { useGameServerWebsocket, usePassportServerAuth, useSnackbar } from "../../containers"
import { getRarityDeets, supFormatter } from "../../helpers"
import { useToggle } from "../../hooks"
import { GameServerKeys } from "../../keys"
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
    const { user } = usePassportServerAuth()
    const { hash, name, label, image_url, avatar_url, tier } = asset.data.mech
    const [needInsured] = useToggle()
    const [isDeploying, toggleIsDeploying] = useToggle()
    const [deployFailed, setDeployFailed] = useState("")
    const [actualQueueCost, setActualQueueCost] = useState(supFormatter(queueCost, 2))

    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])

    useEffect(() => {
        const qc = new BigNumber(queueCost).shiftedBy(-18)
        setActualQueueCost(qc.toFixed(3))
    }, [queueCost])

    useEffect(() => {
        if (!open) setDeployFailed("")
    }, [open])

    const onDeploy = useCallback(async () => {
        if (state !== WebSocket.OPEN || !user) return

        try {
            const resp = await send<{ success: boolean; code: string }>(GameServerKeys.JoinQueue, {
                asset_hash: hash,
                need_insured: needInsured,
            })

            if (resp && resp.success) {
                // if (resp.code !== "" && setTelegramShortcode) {
                //     setTelegramShortcode(resp.code)
                // }
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
    }, [state, hash, needInsured])

    return (
        <Modal open={open} onClose={onClose}>
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
                        borderColor: (user && user.faction.theme.primary) || colors.neonBlue,
                        borderThickness: ".3rem",
                    }}
                    innerSx={{ position: "relative" }}
                >
                    <Stack
                        spacing="1.6rem"
                        sx={{
                            position: "relative",
                            px: "2.5rem",
                            py: "2.4rem",
                            backgroundColor: (user && user.faction.theme.background) || colors.darkNavyBlue,
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

                            <Stack
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    position: "absolute",
                                    top: "1.8rem",
                                    left: "1.6rem",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "5rem",
                                        height: "5rem",
                                        border: "#FFFFFF60 1px solid",
                                        backgroundImage: `url(${avatar_url})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "top center",
                                        backgroundSize: "contain",
                                    }}
                                />

                                <Typography
                                    variant="caption"
                                    sx={{
                                        mt: ".5rem",
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

                        <Stack spacing=".8rem">
                            <Box>
                                <Typography sx={{ display: "inline", fontFamily: "Nostromo Regular Bold" }}>{name || label}</Typography>
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
                                {/* <Stack direction="row" alignItems="center">
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
                                                Insurance costs&nbsp;
                                                <span style={{ textDecoration: "line-through" }}>10%</span> of the contract reward but allows your damaged war
                                                machine to be repair much faster so it can be ready for the next battle much sooner.
                                            </>
                                        }
                                    >
                                        <Box sx={{ ml: "auto" }}>
                                            <SvgInfoCircular size="1.2rem" sx={{ opacity: 0.4, ":hover": { opacity: 1 } }} />
                                        </Box>
                                    </TooltipHelper>
                                </Stack> */}

                                {/* <Stack direction="row" alignItems="center">
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
                                </Stack> */}
                                {/* 
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
                                                            sx={{ m: 0, p: 0, color: user?.faction.theme.primary }}
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
                                                    sx={{ m: 0, p: 0, color: user?.faction.theme.primary }}
                                                />
                                            </Stack>
                                        )}
                                    </Stack>
                                </Box> */}
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
