import { Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useTimer } from "use-timer"
import { useGlobalNotifications } from "../../../../containers"
import { supFormatter, timeSinceInWords } from "../../../../helpers"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { RepairOffer } from "../../../../types/jobs"
import { AmountItem } from "../../../Hangar/WarMachinesHangar/WarMachineDetails/Modals/AmountItem"
import { NiceBoxThing } from "../../Nice/NiceBoxThing"
import { NiceButton } from "../../Nice/NiceButton"

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
        <NiceBoxThing border={{ color: `${colors.blue2}50`, thickness: "very-lean" }} background={{ colors: ["#FFFFFF"], opacity: 0.06 }}>
            <Stack spacing="1rem" sx={{ p: "2rem", pt: "1.6rem" }}>
                <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack, color: colors.blue2 }}>
                    Repair job posted!
                </Typography>

                <Stack>
                    <AmountItem title="BLOCKS TO REPAIR:" value={repairOffer.blocks_total} disableIcon />
                    <AmountItem title="REWARD:" value={supFormatter(repairOffer.offered_sups_amount)} />
                    <Countdown initialTime={(repairOffer.expires_at.getTime() - new Date().getTime()) / 1000} />
                </Stack>

                <NiceButton corners loading={isSubmitting} disabled={remainDamagedBlocks <= 0} buttonColor={colors.red} onClick={() => onCancelRepair()}>
                    CANCEL
                </NiceButton>

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
        </NiceBoxThing>
    )
}

const Countdown = ({ initialTime }: { initialTime: number }) => {
    const { time } = useTimer({
        autostart: true,
        initialTime: Math.round(initialTime),
        endTime: 0,
        timerType: "DECREMENTAL",
    })

    return <AmountItem title="EXPIRES IN:" value={timeSinceInWords(new Date(), new Date(new Date().getTime() + time * 1000))} disableIcon />
}
