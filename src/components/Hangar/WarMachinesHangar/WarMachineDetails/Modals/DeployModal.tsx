import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { FancyButton, TooltipHelper } from "../../../.."
import { SvgInfoCircular, SvgSupToken } from "../../../../../assets"
import { useGlobalNotifications } from "../../../../../containers"
import { supFormatter } from "../../../../../helpers"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts } from "../../../../../theme/theme"
import { MechDetails } from "../../../../../types"
import { MechModal } from "../../Common/MechModal"
import { useBattleLobby } from "../../../../../containers/battleLobby"

export interface QueueFeed {
    queue_position: number
    queue_cost: string
}

interface DeployModalProps {
    selectedMechDetails: MechDetails
    deployMechModalOpen: boolean
    setDeployMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const DeployModal = ({ selectedMechDetails: deployMechDetails, deployMechModalOpen, setDeployMechModalOpen }: DeployModalProps) => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { playerQueueStatus } = useBattleLobby()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const [isLoading, setIsLoading] = useState(false)
    const [deployQueueError, setDeployQueueError] = useState<string>()

    // Queuing cost, queue length win reward etc.
    const queueFeed = useGameServerSubscriptionFaction<QueueFeed>({
        URI: "/queue",
        key: GameServerKeys.SubQueueFeed,
    })

    const onClose = useCallback(() => {
        setDeployQueueError(undefined)
        setDeployMechModalOpen(false)
    }, [setDeployQueueError, setDeployMechModalOpen])

    const onDeployQueue = useCallback(
        async ({ mechIDs }: { mechIDs: string[] }) => {
            try {
                setIsLoading(true)
                const resp = await send<{ success: boolean; code: string }>(GameServerKeys.JoinQueue, {
                    mech_ids: mechIDs,
                })

                if (resp && resp.success) {
                    newSnackbarMessage("Successfully deployed war machine.", "success")
                    onClose()
                }
            } catch (err) {
                setDeployQueueError(typeof err === "string" ? err : "Failed to deploy war machine.")
                console.error(err)
                return
            } finally {
                setIsLoading(false)
            }
        },
        [newSnackbarMessage, send, onClose],
    )
    const queueCost = queueFeed?.queue_cost || "0"

    if (!deployMechDetails) return null

    const { id } = deployMechDetails

    return (
        <MechModal open={deployMechModalOpen} mechDetails={deployMechDetails} onClose={onClose}>
            <Stack spacing="1.5rem">
                <Stack spacing=".2rem">
                    <AmountItem
                        key={`${queueFeed?.queue_position}-queue_time`}
                        title={"Position: "}
                        value={queueFeed?.queue_position || "UNKNOWN"}
                        tooltip="The current queue position of your faction."
                        disableIcon
                    />

                    <AmountItem
                        title={"Fee: "}
                        color={colors.yellow}
                        value={supFormatter(queueCost, 2)}
                        tooltip="The cost to place your war machine into the battle queue."
                    />

                    {playerQueueStatus && (
                        <AmountItem
                            title="LIMIT: "
                            color={playerQueueStatus.total_queued / playerQueueStatus.queue_limit === 1 ? colors.red : "white"}
                            value={`${playerQueueStatus.total_queued} / ${playerQueueStatus.queue_limit}`}
                            tooltip="The total amount of mechs you have queued."
                            disableIcon
                        />
                    )}
                </Stack>

                <Box sx={{ mt: "auto" }}>
                    <FancyButton
                        loading={isLoading}
                        clipThingsProps={{
                            clipSize: "5px",
                            backgroundColor: colors.green,
                            border: { borderColor: colors.green },
                            sx: { position: "relative", width: "100%" },
                        }}
                        sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                        onClick={() => onDeployQueue({ mechIDs: [id] })}
                    >
                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                            DEPLOY
                        </Typography>
                    </FancyButton>
                </Box>

                {deployQueueError && (
                    <Typography
                        variant="body2"
                        sx={{
                            mt: ".3rem",
                            color: colors.red,
                        }}
                    >
                        {deployQueueError}
                    </Typography>
                )}
            </Stack>
        </MechModal>
    )
}

export const AmountItem = ({
    title,
    color,
    value,
    tooltip,
    disableIcon,
}: {
    title: string
    color?: string
    value: string | number
    tooltip?: string
    disableIcon?: boolean
}) => {
    return (
        <Stack direction="row" alignItems="center">
            <Typography variant="body2" sx={{ mr: ".4rem", fontFamily: fonts.nostromoHeavy }}>
                {title}
            </Typography>

            {!disableIcon && <SvgSupToken size="1.8rem" fill={colors.yellow} sx={{ mr: ".1rem", pb: ".4rem" }} />}

            <Typography variant="body1" sx={{ mr: "3.2rem", color: color || colors.offWhite, fontWeight: "fontWeightBold" }}>
                {value || "---"}
            </Typography>

            {tooltip && (
                <TooltipHelper placement="right-start" text={tooltip}>
                    <Box sx={{ ml: "auto" }}>
                        <SvgInfoCircular size="1.2rem" sx={{ opacity: 0.4, ":hover": { opacity: 1 } }} />
                    </Box>
                </TooltipHelper>
            )}
        </Stack>
    )
}
