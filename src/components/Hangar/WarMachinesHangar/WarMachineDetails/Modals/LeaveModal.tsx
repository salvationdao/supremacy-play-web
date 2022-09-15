import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { FancyButton } from "../../../.."
import { useGlobalNotifications } from "../../../../../containers"
import { useGameServerCommandsFaction } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts } from "../../../../../theme/theme"
import { MechModal } from "../../Common/MechModal"
import { MechDetails } from "../../../../../types"

export const LeaveModal = ({
    selectedMechDetails: leaveMechDetails,
    leaveMechModalOpen,
    setLeaveMechModalOpen,
}: {
    selectedMechDetails: MechDetails
    leaveMechModalOpen: boolean
    setLeaveMechModalOpen: (close: boolean) => void
}) => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(false)
    const [leaveQueueError, setLeaveQueueError] = useState<string>()

    const onClose = useCallback(() => {
        setLeaveMechModalOpen(false)
        setLeaveQueueError(undefined)
    }, [setLeaveQueueError, setLeaveMechModalOpen])

    const onLeaveQueue = useCallback(
        async (mechID: string) => {
            try {
                setIsLoading(true)
                const resp = await send(GameServerKeys.LeaveQueue, { mech_ids: [mechID] })
                if (resp) {
                    newSnackbarMessage("Successfully removed war machine from queue.", "success")
                    onClose()
                }
            } catch (e) {
                setLeaveQueueError(typeof e === "string" ? e : "Failed to leave queue.")
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        },
        [newSnackbarMessage, send, onClose],
    )

    if (!leaveMechDetails) return null

    const { id, name, label } = leaveMechDetails

    return (
        <MechModal open={leaveMechModalOpen} mechDetails={leaveMechDetails} onClose={onClose}>
            <Stack spacing="1.5rem">
                <Typography sx={{ strong: { color: colors.neonBlue } }}>
                    Are you sure you&apos;d like to remove <strong>{name || label}</strong> from the battle queue? You will be refunded the initial queuing fee.
                </Typography>

                <Box sx={{ mt: "auto" }}>
                    <FancyButton
                        loading={isLoading}
                        clipThingsProps={{
                            clipSize: "5px",
                            backgroundColor: colors.yellow,
                            border: { isFancy: true, borderColor: colors.yellow },
                            sx: { position: "relative", width: "100%" },
                        }}
                        sx={{ px: "1.6rem", py: ".6rem", color: "#111111" }}
                        onClick={() => onLeaveQueue(id)}
                    >
                        <Typography variant="caption" sx={{ color: "#111111", fontFamily: fonts.nostromoBlack }}>
                            LEAVE QUEUE
                        </Typography>
                    </FancyButton>
                </Box>

                {leaveQueueError && (
                    <Typography
                        variant="body2"
                        sx={{
                            mt: ".3rem",
                            color: "red",
                        }}
                    >
                        {leaveQueueError}
                    </Typography>
                )}
            </Stack>
        </MechModal>
    )
}
