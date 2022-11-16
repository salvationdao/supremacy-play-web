import { Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useTimer } from "use-timer"
import { FancyButton } from "../../.."
import { useGlobalNotifications } from "../../../../containers"
import { supFormatter, timeSinceInWords } from "../../../../helpers"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { RepairOffer } from "../../../../types/jobs"
import { AmountItem } from "../../../Hangar/WarMachinesHangar/WarMachineDetails/Modals/AmountItem"

export const ExistingRepairJobCard = ({ repairOffer, remainDamagedBlocks }: { repairOffer: RepairOffer; remainDamagedBlocks: number }) => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string>()

    const onCancelRepair = useCallback(async () => {
        try {
            setIsSubmitting(true)
            const resp = await send(GameServerKeys.CancelMechRepair, {
                repair_offer_id: repairOffer.id,
            })
            if (resp) {
                newSnackbarMessage("Successfully cancelled repair job.", "success")
                setSubmitError(undefined)
            }
        } catch (e) {
            setSubmitError(typeof e === "string" ? e : "Failed to cancelled repair job.")
            console.error(e)
        } finally {
            setIsSubmitting(false)
        }
    }, [send, repairOffer.id, newSnackbarMessage])

    return (
        <Stack
            spacing="1rem"
            sx={{
                p: "2rem",
                pt: "1.6rem",
                backgroundColor: "#FFFFFF20",
                border: `${colors.blue2}30 1px solid`,
            }}
        >
            <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack, color: colors.blue2 }}>
                Repair job posted!
            </Typography>

            <Stack>
                <AmountItem title="BLOCKS TO REPAIR:" value={repairOffer.blocks_total} disableIcon />
                <AmountItem title="REWARD:" value={supFormatter(repairOffer.offered_sups_amount)} />
                <Countdown initialTime={(repairOffer.expires_at.getTime() - new Date().getTime()) / 1000} />
            </Stack>

            <FancyButton
                loading={isSubmitting}
                disabled={remainDamagedBlocks <= 0}
                clipThingsProps={{
                    clipSize: "5px",
                    backgroundColor: "#222222",
                    border: { borderColor: colors.red },
                    sx: { position: "relative", width: "100%" },
                }}
                sx={{ px: "1.6rem", py: ".8rem", color: colors.red }}
                onClick={() => onCancelRepair()}
            >
                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: colors.red }}>
                    CANCEL
                </Typography>
            </FancyButton>

            <Typography sx={{ color: colors.lightGrey }}>
                <i>
                    <strong>NOTE:</strong> Your remaining offered reward will be refunded but the original processing fee will be held.
                </i>
            </Typography>

            {submitError && (
                <Typography variant="body2" sx={{ color: colors.red }}>
                    {submitError}
                </Typography>
            )}
        </Stack>
    )
}

const Countdown = ({ initialTime }: { initialTime: number }) => {
    const { time } = useTimer({
        autostart: true,
        initialTime: initialTime,
        endTime: 0,
        timerType: "DECREMENTAL",
    })

    return <AmountItem title="EXPIRES IN:" value={timeSinceInWords(new Date(), new Date(new Date().getTime() + time * 1000))} disableIcon />
}
