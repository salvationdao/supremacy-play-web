import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { FancyButton, TooltipHelper } from "../../.."
import { SvgInfoCircular, SvgSupToken } from "../../../../assets"
import { useAuth, useSnackbar } from "../../../../containers"
import { useHangarWarMachine } from "../../../../containers/hangar/hangarWarMachines"
import { supFormatter } from "../../../../helpers"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MechModal } from "../Common/MechModal"

export interface QueueFeed {
    queue_length: number
    queue_cost: string
    contract_reward: string
}

export const DeployModal = () => {
    const { deployMechDetails, setDeployMechDetails } = useHangarWarMachine()
    const { newSnackbarMessage } = useSnackbar()
    const { userID } = useAuth()
    const { send: sendFactionCommander } = useGameServerCommandsFaction("/faction_commander")
    const [deployQueueError, setDeployQueueError] = useState<string>()

    // Queuing cost, queue length win reward etc.
    const queueFeed = useGameServerSubscriptionFaction<QueueFeed>({
        URI: "/queue",
        key: GameServerKeys.SubQueueFeed,
    })

    const onDeployQueue = useCallback(
        async ({ hash }: { hash: string }) => {
            if (!userID) return

            try {
                // Deploy the mech into queue, with the notification settings
                const resp = await sendFactionCommander<{ success: boolean; code: string }>(GameServerKeys.JoinQueue, {
                    asset_hash: hash,
                })

                if (resp && resp.success) {
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
        [newSnackbarMessage, sendFactionCommander, setDeployMechDetails, userID],
    )

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

                    <AmountItem
                        title={"Fee: "}
                        color={"#FF4136"}
                        value={supFormatter(queueFeed?.queue_cost || "0", 2)}
                        tooltip="The cost to place your war machine into the battle queue."
                    />
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
                        sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                        onClick={() => onDeployQueue({ hash })}
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
