import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { FancyButton, TooltipHelper } from "../../../.."
import { SvgInfoCircular, SvgSupToken } from "../../../../../assets"
import { useSnackbar } from "../../../../../containers"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts } from "../../../../../theme/theme"
import { MechModal } from "../../Common/MechModal"
import { MechDetails } from "../../../../../types"

export const RepairModal = ({
    selectedMechDetails,
    repairMechModalOpen,
    setRepairMechModalOpen,
}: {
    selectedMechDetails: MechDetails
    repairMechModalOpen: boolean
    setRepairMechModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(false)
    const [repairError, setRepairError] = useState<string>()

    const onClose = useCallback(() => {
        setRepairError(undefined)
        setRepairMechModalOpen(false)
    }, [setRepairError, setRepairMechModalOpen])

    const onAgentRepair = useCallback(async () => {
        try {
            setIsLoading(true)
            const resp = await send(GameServerKeys.AgentRepairWarMachine, { mech_id: selectedMechDetails.id })
            if (resp) {
                newSnackbarMessage("Successfully submitted agent repair request.", "success")
                setRepairError(undefined)
                onClose()
            }
        } catch (e) {
            setRepairError(typeof e === "string" ? e : "Failed to submit agent repair request.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [send, selectedMechDetails.id, newSnackbarMessage, onClose])

    const onInstantRepair = useCallback(async () => {
        try {
            setIsLoading(true)
            const resp = await send(GameServerKeys.InstantRepairWarMachine, { mech_id: selectedMechDetails.id })
            if (resp) {
                newSnackbarMessage("Successfully submitted instant repair request.", "success")
                setRepairError(undefined)
                onClose()
            }
        } catch (e) {
            setRepairError(typeof e === "string" ? e : "Failed to submit instant repair request.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [send, selectedMechDetails.id, newSnackbarMessage, onClose])

    if (!selectedMechDetails) return null

    const { hash } = selectedMechDetails

    return (
        <MechModal open={repairMechModalOpen} mechDetails={selectedMechDetails} onClose={onClose}>
            <Stack spacing="1.5rem">
                <Box sx={{ mt: "auto" }}>
                    <FancyButton
                        loading={isLoading}
                        clipThingsProps={{
                            clipSize: "5px",
                            backgroundColor: colors.green,
                            border: { isFancy: true, borderColor: colors.green },
                            sx: { position: "relative", width: "100%" },
                        }}
                        sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                        // onClick={() => onDeployQueue({ hash })}
                    >
                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                            AGENT REPAIR
                        </Typography>
                    </FancyButton>
                </Box>

                {repairError && (
                    <Typography
                        variant="body2"
                        sx={{
                            mt: ".3rem",
                            color: "red",
                        }}
                    >
                        {repairError}
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
