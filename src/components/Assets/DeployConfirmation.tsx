import { Box, Button, IconButton, Link, Modal, Stack, Switch, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing, PlayerPrefs, TooltipHelper } from ".."
import { SvgClose, SvgExternalLink, SvgInfoCircular, SvgSupToken, SvgWarningIcon } from "../../assets"
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
    const { state, subscribe, send } = useGameServerWebsocket()
    const { user } = usePassportServerAuth()
    const { hash, name, label, image_url, tier } = asset.data.mech
    const [enableNotifications, setEnableNotifications] = useState(false)
    const [needInsured, toggleNeedInsured] = useToggle()
    const [isDeploying, toggleIsDeploying] = useToggle()
    const [deployFailed, setDeployFailed] = useState("")
    const [playerPrefs, setPlayerPrefs] = useState<PlayerPrefs>()
    const [actualQueueCost, setActualQueueCost] = useState(supFormatter(queueCost, 2))

    const rarityDeets = useMemo(() => getRarityDeets(tier), [tier])

    useEffect(() => {
        let qc = new BigNumber(queueCost).shiftedBy(-18)
        if (enableNotifications) {
            qc = qc.multipliedBy(1.1)
            setActualQueueCost(qc.toFixed(3))
        } else {
            setActualQueueCost(qc.toFixed(3))
        }
    }, [enableNotifications, queueCost])

    // Subscribe to player preferences
    useEffect(() => {
        if (state !== WebSocket.OPEN || !user || !subscribe) return
        return subscribe<PlayerPrefs>(GameServerKeys.SubPlayerPrefs, (payload) => {
            setPlayerPrefs(payload)
        })
    }, [user, subscribe])

    useEffect(() => {
        if (!open) setDeployFailed("")
    }, [open])

    const onDeploy = useCallback(async () => {
        if (state !== WebSocket.OPEN) return
        try {
            const resp = await send(GameServerKeys.JoinQueue, {
                asset_hash: hash,
                need_insured: needInsured,
                enable_notifications: enableNotifications,
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
    }, [state, hash, needInsured, enableNotifications])

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "46rem",
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
                                        checked={enableNotifications}
                                        onChange={(e) => {
                                            setEnableNotifications(e.currentTarget.checked)
                                        }}
                                        sx={{
                                            transform: "scale(.6)",
                                            ".Mui-checked": { color: colors.green },
                                            ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.green}50` },
                                        }}
                                    />
                                    <Box ml="auto" />
                                    {!playerPrefs?.notifications_battle_queue_sms && (
                                        <TooltipHelper
                                            placement="right-start"
                                            text={
                                                <>
                                                    You currently do not have battle queue SMS notifications enabled.
                                                    You must have it enabled in order for this feature to work. To get
                                                    alerts when your war machine is soon to battle, enable SMS option by
                                                    clicking on your username in the top right, and select
                                                    &quot;Preferences&quot; in the dropdown menu.
                                                </>
                                            }
                                        >
                                            <Box>
                                                <SvgWarningIcon
                                                    size="1.2rem"
                                                    fill={colors.orange}
                                                    sx={{
                                                        paddingBottom: 0,
                                                        opacity: 0.6,
                                                        ":hover": { opacity: 1 },
                                                    }}
                                                />
                                            </Box>
                                        </TooltipHelper>
                                    )}
                                    <TooltipHelper
                                        placement="right-start"
                                        text={
                                            <>
                                                Enabling notifications will add&nbsp;<strong>10%</strong> to the queue
                                                cost. We will notify you via SMS when your war machine is within the top
                                                10 in queue.
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
                                        lineHeight: 1,
                                        color: "red",
                                    }}
                                >
                                    {deployFailed}
                                </Typography>
                            )}
                        </Stack>
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
