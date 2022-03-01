import { Box, Button, Modal, Stack, Switch, Typography } from "@mui/material"
import { ClipThing, TooltipHelper } from ".."
import { useToggle } from "../../../../hooks"
import { SvgInfoCircular, SvgSupToken } from "../../assets"
import { useAuth, useWebsocket } from "../../containers"
import { supFormatter } from "../../helpers"
import HubKey from "../../keys"
import { colors } from "../../theme"
import { Asset } from "../../types/assets"

const AmountItem = ({ title, value, tooltip }: { title: string; value: string | number; tooltip: string }) => {
    return (
        <Stack direction="row" alignItems="center">
            <Typography sx={{ mr: 0.5, fontFamily: "Share Tech" }}>{title}</Typography>
            <SvgSupToken size="14px" fill={colors.yellow} />
            <Typography sx={{ fontFamily: "Share Tech", ml: 0.2, color: colors.yellow }}>{value}</Typography>
            <TooltipHelper text={tooltip}>
                <SvgInfoCircular size="12px" sx={{ ml: "auto", opacity: 0.6, ":hover": { opacity: 1 } }} />
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
                    maxWidth: 400,
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
                        spacing={1.5}
                        sx={{
                            pl: 2.2,
                            pr: 3.2,
                            pt: 2,
                            pb: 2.5,
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
                                overflow: "hidden",
                                backgroundImage: `url(${image})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                            }}
                        />

                        <Stack spacing={1}>
                            <Box>
                                {user && (
                                    <Typography
                                        variant="caption"
                                        sx={{ color: user.faction.theme.primary, fontFamily: "Nostromo Regular Heavy" }}
                                    >
                                        {user.faction.label}
                                    </Typography>
                                )}

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
                                    title={"CONTRACT REWARD: "}
                                    value={contractReward ? supFormatter(contractReward, 6) : "N/A"}
                                    tooltip="Your reward if your war machine wins the battle."
                                />

                                <AmountItem
                                    title={"FEE: "}
                                    value={queueCost ? `-${supFormatter(queueCost, 6)}` : "N/A"}
                                    tooltip=""
                                />
                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={0.6}>
                                <TooltipHelper
                                    text={`Insured war machines will repair in rapid mode. Insurance costs 10% of the contract reward${
                                        contractReward ? ` (${contractReward}) SUPS` : ""
                                    }.`}
                                >
                                    <Box>
                                        <Typography
                                            sx={{
                                                pt: 0.1,
                                                fontFamily: "Share Tech",
                                                lineHeight: 1,
                                            }}
                                        >
                                            INSURANCE:
                                        </Typography>
                                    </Box>
                                </TooltipHelper>
                                <Switch
                                    size="small"
                                    checked={needInsured}
                                    onChange={() => toggleNeedInsured()}
                                    sx={{ transform: "scale(.84)" }}
                                />
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
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
