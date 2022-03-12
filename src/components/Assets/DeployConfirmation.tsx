import { Box, Button, IconButton, Link, Modal, Stack, Switch, Typography } from "@mui/material"
import { useEffect } from "react"
import { ClipThing, TooltipHelper } from ".."
import { SvgClose, SvgExternalLink, SvgInfoCircular, SvgSupToken } from "../../assets"
import { PASSPORT_WEB } from "../../constants"
import { useGameServerWebsocket, usePassportServerAuth } from "../../containers"
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
}: {
    title: string
    color: string
    value: string | number
    tooltip: string
}) => {
    return (
        <Stack direction="row" alignItems="center">
            <Typography sx={{ mr: 0.5 }}>{title}</Typography>
            <SvgSupToken size="14px" fill={color} />
            <Typography sx={{ mr: 4, color: color }}>{value}</Typography>
            <TooltipHelper placement="right-start" text={tooltip}>
                <Box sx={{ ml: "auto" }}>
                    <SvgInfoCircular size="12px" sx={{ opacity: 0.4, ":hover": { opacity: 1 } }} />
                </Box>
            </TooltipHelper>
        </Stack>
    )
}

export const DeployConfirmation = ({
    open,
    asset,
    queueCost,
    contractReward,
    onClose,
}: {
    open: boolean
    asset: Asset
    queueCost: string
    contractReward: string
    onClose: () => void
}) => {
    const { state, send } = useGameServerWebsocket()
    const { user } = usePassportServerAuth()
    const { hash, name, label, image_url, tier } = asset.data.mech
    const [needInsured, toggleNeedInsured] = useToggle()
    const [isDeploying, toggleIsDeploying] = useToggle()
    const [deployFailed, toggleDeployFailed] = useToggle()

    const rarityDeets = getRarityDeets(tier)

    useEffect(() => {
        if (!open) toggleDeployFailed(false)
    }, [open])

    const onDeploy = async () => {
        if (state !== WebSocket.OPEN) return
        try {
            toggleIsDeploying(true)
            const resp = await send(GameServerKeys.JoinQueue, { asset_hash: hash, need_insured: needInsured })
            if (resp) {
                onClose()
            }
        } catch (e) {
            toggleDeployFailed(true)
            console.log(e)
            return
        } finally {
            toggleIsDeploying(false)
        }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: 420,
                }}
            >
                <ClipThing
                    clipSize="10px"
                    border={{
                        isFancy: true,
                        borderColor: (user && user.faction.theme.primary) || colors.neonBlue,
                        borderThickness: "3px",
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            position: "relative",
                            pl: 2.2,
                            pr: 3.2,
                            py: 3,
                            backgroundColor: (user && user.faction.theme.background) || colors.darkNavyBlue,
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                flexShrink: 0,
                                px: 0.8,
                                py: 1.5,
                                borderRadius: 0.6,
                                boxShadow: "inset 0 0 12px 6px #00000055",
                            }}
                        >
                            <Box
                                sx={{
                                    my: "auto",
                                    width: 110,
                                    height: 132,
                                    backgroundImage: `url(${image_url})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "top center",
                                    backgroundSize: "contain",
                                }}
                            />

                            <Stack
                                spacing={0.6}
                                direction="row"
                                alignItems="center"
                                sx={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)" }}
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

                        <Stack spacing={1}>
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
                                                sx={{ ml: 0.6 }}
                                            >
                                                <SvgExternalLink
                                                    size="10px"
                                                    sx={{ opacity: 0.2, ":hover": { opacity: 0.6 } }}
                                                />
                                            </Link>
                                        </span>
                                    )}
                                </Typography>
                            </Box>

                            <Stack spacing={0.1}>
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
                                    value={supFormatter(queueCost, 2)}
                                    tooltip="The cost to place your war machine into the battle queue."
                                />
                            </Stack>

                            <Stack direction="row" alignItems="center">
                                <Typography
                                    sx={{
                                        pt: 0.1,
                                        lineHeight: 1,
                                        color: colors.green,
                                    }}
                                >
                                    Add insurance:
                                </Typography>
                                <Switch
                                    size="small"
                                    checked={needInsured}
                                    onChange={() => toggleNeedInsured()}
                                    sx={{
                                        transform: "scale(.7)",
                                        ".Mui-checked": { color: colors.green },
                                        ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.green}50` },
                                    }}
                                />
                                <TooltipHelper
                                    placement="right-start"
                                    text={
                                        <>
                                            Insurance costs&nbsp;
                                            <span style={{ textDecoration: "line-through" }}>10%</span> of the contract
                                            reward but allows your damaged war machine to be repair much faster so it
                                            can be ready for the next battle much sooner.
                                        </>
                                    }
                                >
                                    <Box sx={{ ml: "auto" }}>
                                        <SvgInfoCircular size="12px" sx={{ opacity: 0.4, ":hover": { opacity: 1 } }} />
                                    </Box>
                                </TooltipHelper>
                            </Stack>

                            <Button
                                variant="contained"
                                size="small"
                                disabled={isDeploying}
                                onClick={onDeploy}
                                sx={{
                                    mt: "auto",
                                    minWidth: 0,
                                    px: 1,
                                    py: 0.6,
                                    boxShadow: 0,
                                    backgroundColor: colors.green,
                                    border: `${colors.green} 1px solid`,
                                    borderRadius: 0.3,
                                    ":hover": { backgroundColor: `${colors.green}90` },
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: ".75rem",
                                        lineHeight: 1,
                                        color: isDeploying ? colors.green : "#FFFFFF",
                                    }}
                                >
                                    {isDeploying ? "DEPLOYING..." : "DEPLOY"}
                                </Typography>
                            </Button>

                            {deployFailed && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        lineHeight: 1,
                                        color: "red",
                                    }}
                                >
                                    Failed to deploy.
                                </Typography>
                            )}
                        </Stack>

                        <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: 2, right: 2 }}>
                            <SvgClose size="16px" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                        </IconButton>
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
