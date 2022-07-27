import { Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { Link } from "react-router-dom"
import { FancyButton } from "../../../../.."
import { useSnackbar } from "../../../../../../containers"
import { supFormatterNoFixed, timeSinceInWords } from "../../../../../../helpers"
import { useTimer } from "../../../../../../hooks"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { colors, fonts } from "../../../../../../theme/theme"
import { RepairOffer } from "../../../../../../types/jobs"
import { AmountItem } from "../DeployModal"

export const ExistingRepairJobCard = ({ repairJob }: { repairJob: RepairOffer }) => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string>()

    const onCancelRepair = useCallback(async () => {
        try {
            setIsSubmitting(true)
            const resp = await send(GameServerKeys.RegisterMechRepair, {
                offer_id: repairJob.id,
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
    }, [send, repairJob.id, newSnackbarMessage])

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

            <Typography variant="h6">
                You have a repair job listed on the <Link to="/jobs">jobs page</Link>.
            </Typography>

            <Stack>
                <AmountItem title="BLOCKS TO REPAIR:" value={repairJob.blocks_total} disableIcon />
                <AmountItem title="REWARD:" value={supFormatterNoFixed(repairJob.offered_sups_amount)} />
                <Countdown endTime={repairJob.expires_at} />
            </Stack>

            <FancyButton
                loading={isSubmitting}
                clipThingsProps={{
                    clipSize: "5px",
                    backgroundColor: colors.red,
                    border: { isFancy: true, borderColor: colors.red },
                    sx: { position: "relative", width: "100%" },
                }}
                sx={{ px: "1.6rem", py: ".8rem", color: "#FFFFFF" }}
                onClick={() => onCancelRepair()}
            >
                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                    CANCEL
                </Typography>
            </FancyButton>

            <Typography variant="body2">
                <strong>NOTE:</strong> Your remaining offered reward will be refunded but the original GST will be held.
            </Typography>

            {submitError && (
                <Typography variant="body2" sx={{ color: "red" }}>
                    {submitError}
                </Typography>
            )}
        </Stack>
    )
}

const Countdown = ({ endTime }: { endTime: Date }) => {
    const { totalSecRemain } = useTimer(endTime)

    return <AmountItem title="EXPIRES IN:" value={timeSinceInWords(new Date(), new Date(new Date().getTime() + totalSecRemain * 1000))} disableIcon />
}
