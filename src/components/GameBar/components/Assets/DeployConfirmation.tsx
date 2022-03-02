import { Box, Button, IconButton, Modal, Stack, Switch, Typography } from "@mui/material"
import { ClipThing, TooltipHelper } from ".."
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../../constants"
import { useQueue } from "../../../../containers/queue"
import { acronym } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { SvgClose, SvgInfoCircular, SvgSupToken } from "../../assets"
import { useAuth, useWebsocket } from "../../containers"
import { supFormatter } from "../../helpers"
import HubKey from "../../keys"
import { colors } from "../../theme"
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
            <Typography sx={{ mr: 0.5, fontFamily: "Share Tech" }}>{title}</Typography>
            <SvgSupToken size="14px" fill={color} />
            <Typography sx={{ fontFamily: "Share Tech", ml: 0.2, mr: 4, color: color }}>{value}</Typography>
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
    queueCost?: string
    contractReward?: string
    onClose: () => void
}) => {
    const { state, send } = useWebsocket()
    const { user } = useAuth()
    const { queueLength } = useQueue()
    const { hash, name, image } = asset
    const [needInsured, toggleNeedInsured] = useToggle(false)

    const onDeploy = async () => {
        if (state !== WebSocket.OPEN) return
        try {
            const resp = await send(HubKey.JoinQueue, { assetHash: hash, needInsured })
            if (resp) onClose()
        } catch (e) {
            console.log(e)
            return
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
                                my: "auto",
                                width: 110,
                                height: 150,
                                flexShrink: 0,
                                backgroundImage: `url(${image})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "top center",
                                backgroundSize: "contain",
                            }}
                        >
                            {user && (
                                <Stack
                                    spacing={0.6}
                                    direction="row"
                                    alignItems="center"
                                    sx={{ position: "absolute", bottom: -5, left: 5 }}
                                >
                                    <Box
                                        sx={{
                                            mb: 0.3,
                                            width: 16,
                                            height: 16,
                                            flexShrink: 0,
                                            overflow: "hidden",
                                            backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${user.faction.logoBlobID})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            backgroundSize: "contain",
                                            backgroundColor: user.faction.theme.primary,
                                            borderRadius: 0.8,
                                            border: `${user.faction.theme.primary} 1px solid`,
                                        }}
                                    />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            lineHeight: 1,
                                            color: user.faction.theme.primary,
                                            fontFamily: "Nostromo Regular Heavy",
                                        }}
                                    >
                                        {acronym(user.faction.label)}
                                    </Typography>
                                </Stack>
                            )}
                        </Box>

                        <Stack spacing={1}>
                            <Box>
                                <Typography
                                    sx={{
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        overflowWrap: "anywhere",
                                        textOverflow: "ellipsis",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {name}
                                </Typography>
                            </Box>

                            <Stack spacing={0.1}>
                                <AmountItem
                                    key={`${queueLength}-contract_reward`}
                                    title={"CONTRACT REWARD: "}
                                    color={colors.yellow}
                                    value={
                                        queueLength !== undefined
                                            ? supFormatter(`${(queueLength + 1) * 2}000000000000000000`)
                                            : "N/A"
                                    }
                                    tooltip="Your reward if your syndicate wins the battle."
                                />

                                <AmountItem
                                    title={"FEE: "}
                                    color={"#FF2B2B"}
                                    value={queueCost ? `${supFormatter(queueCost)}` : "N/A"}
                                    tooltip="The cost to place your war machine into the battle queue."
                                />
                            </Stack>

                            <Stack direction="row" alignItems="center">
                                <Typography
                                    sx={{
                                        pt: 0.1,
                                        fontFamily: "Share Tech",
                                        lineHeight: 1,
                                        color: colors.neonBlue,
                                    }}
                                >
                                    ADD INSURANCE:
                                </Typography>
                                <Switch
                                    size="small"
                                    checked={needInsured}
                                    onChange={() => toggleNeedInsured()}
                                    sx={{ transform: "scale(.7)" }}
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
                                        fontFamily: "Share Tech",
                                        lineHeight: 1,
                                        color: "#FFFFFF",
                                    }}
                                >
                                    DEPLOY
                                </Typography>
                            </Button>
                        </Stack>

                        <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: 3, right: 2 }}>
                            <SvgClose size="16px" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                        </IconButton>
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
