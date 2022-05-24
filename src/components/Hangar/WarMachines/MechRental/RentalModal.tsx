import { Stack, Typography } from "@mui/material"
import { useCallback } from "react"
import { FancyButton } from "../../.."
import { useHangarWarMachine } from "../../../../containers/hangar/hangarWarMachines"
import { colors, fonts } from "../../../../theme/theme"
import { MechModal } from "../Common/MechModal"

export const RentalModal = () => {
    const { onLeaveQueue, leaveQueueError, leaveMechDetails, setLeaveMechDetails, setLeaveQueueError } = useHangarWarMachine()

    const onClose = useCallback(() => {
        setLeaveMechDetails(undefined)
        setLeaveQueueError("")
    }, [setLeaveQueueError, setLeaveMechDetails])

    if (!leaveMechDetails) return null

    const { hash, name, label } = leaveMechDetails

    return (
        <MechModal mechDetails={leaveMechDetails} onClose={onClose}>
            <Stack spacing="1.5rem">
                <Typography sx={{ fontSize: "1.6rem", strong: { color: colors.neonBlue } }}>
                    Are you sure you&apos;d like to remove <strong>{name || label}</strong> from the battle queue? Your will be refunded the initial queuing
                    fee.
                </Typography>

                <Stack direction="row" spacing="2rem" alignItems="center" sx={{ mt: "auto" }}>
                    <FancyButton
                        excludeCaret
                        clipThingsProps={{
                            clipSize: "5px",
                            backgroundColor: colors.red,
                            border: { isFancy: true, borderColor: colors.red },
                            sx: { position: "relative", width: "100%" },
                        }}
                        sx={{ px: "1.6rem", py: ".5rem", color: "#FFFFFF" }}
                        onClick={() => onLeaveQueue(hash)}
                    >
                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                            LEAVE QUEUE
                        </Typography>
                    </FancyButton>
                </Stack>

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
