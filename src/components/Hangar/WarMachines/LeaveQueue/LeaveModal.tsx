import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { FancyButton } from "../../.."
import { useSnackbar } from "../../../../containers"
import { useHangarWarMachine } from "../../../../containers/hangar/hangarWarMachines"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MechModal } from "../Common/MechModal"

export const LeaveModal = () => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { leaveMechDetails, setLeaveMechDetails } = useHangarWarMachine()
    const [isLoading, setIsLoading] = useState(false)
    const [leaveQueueError, setLeaveQueueError] = useState<string>()

    const onClose = useCallback(() => {
        setLeaveMechDetails(undefined)
        setLeaveQueueError(undefined)
    }, [setLeaveQueueError, setLeaveMechDetails])

    const onLeaveQueue = useCallback(
        async (hash: string) => {
            try {
                setIsLoading(true)
                const resp = await send(GameServerKeys.LeaveQueue, { asset_hash: hash })
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

    const { hash, name, label } = leaveMechDetails

    return (
        <MechModal mechDetails={leaveMechDetails} onClose={onClose}>
            <Stack spacing="1.5rem">
                <Typography sx={{ strong: { color: colors.neonBlue } }}>
                    Are you sure you&apos;d like to remove <strong>{name || label}</strong> from the battle queue? Your will be refunded the initial queuing
                    fee.
                </Typography>

                <Box sx={{ mt: "auto" }}>
                    <FancyButton
                        loading={isLoading}
                        excludeCaret
                        clipThingsProps={{
                            clipSize: "5px",
                            backgroundColor: colors.red,
                            border: { isFancy: true, borderColor: colors.red },
                            sx: { position: "relative", width: "100%" },
                        }}
                        sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                        onClick={() => onLeaveQueue(hash)}
                    >
                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
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
