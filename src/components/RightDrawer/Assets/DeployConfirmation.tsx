import { Box, Button, IconButton, Link, Modal, Stack, Theme, Typography, useTheme } from "@mui/material"
import BigNumber from "bignumber.js"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing, QueueFeedResponse, TooltipHelper } from "../.."
import { SvgClose, SvgExternalLink, SvgInfoCircular, SvgSupToken } from "../../../assets"
import { PASSPORT_WEB } from "../../../constants"
import { useGameServerWebsocket, usePassportServerAuth, useSnackbar } from "../../../containers"
import { getRarityDeets, supFormatter } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
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

export const DeployConfirmation = ({ open, asset, queueFeed, onClose }: { open: boolean; asset: Asset; queueFeed: QueueFeedResponse; onClose: () => void }) => {
    const theme = useTheme<Theme>()
    const queueLength = queueFeed?.queue_length || 0
    const queueCost = queueFeed?.queue_cost || ""
    const contractReward = queueFeed?.contract_reward || ""

    const { newSnackbarMessage } = useSnackbar()
    const { state, send } = useGameServerWebsocket()
    const { user } = usePassportServerAuth()
    const { hash, name, label, image_url, avatar_url, tier } = asset.data.mech
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
            })

            if (resp && resp.success) {
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
    }, [state, hash])

    return (
        <Modal open={open} onClose={onClose} sx={{ zIndex: 999999 }}>
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
