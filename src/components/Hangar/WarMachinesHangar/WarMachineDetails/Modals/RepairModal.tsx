import { InputAdornment, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { FancyButton } from "../../../.."
import { SvgSupToken } from "../../../../../assets"
import { useSnackbar } from "../../../../../containers"
import { useGameServerCommandsFaction } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts } from "../../../../../theme/theme"
import { MechDetails } from "../../../../../types"
import { MechModal } from "../../Common/MechModal"

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
    const [agentReward, setAgentReward] = useState<number>(10)

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

    return (
        <MechModal open={repairMechModalOpen} mechDetails={selectedMechDetails} onClose={onClose}>
            <Stack spacing="1.5rem">
                <Stack sx={{ p: "1.2rem 1.6rem 1.6rem 1.6rem", backgroundColor: "#FFFFFF20" }}>
                    <Typography sx={{ mb: ".5rem", fontFamily: fonts.nostromoBlack, color: colors.blue2 }}>AGENT REPAIR</Typography>

                    <Typography>Citizens work together and complete challenges to repair your mech, in return they receive a reward.</Typography>

                    <Stack spacing=".3rem" sx={{ mt: "1rem" }}>
                        <Typography variant="caption" sx={{ color: colors.blue2, fontFamily: fonts.nostromoBlack }}>
                            REWARD TO OFFER:
                        </Typography>
                        <TextField
                            variant="outlined"
                            hiddenLabel
                            placeholder="ANY"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SvgSupToken fill={colors.yellow} size="1.9rem" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                backgroundColor: "#00000090",
                                ".MuiOutlinedInput-root": { borderRadius: 0.5, border: `${colors.blue2}99 2px dashed` },
                                ".MuiOutlinedInput-input": {
                                    px: "1.5rem",
                                    py: ".3rem",
                                    fontSize: "1.7rem",
                                    height: "unset",
                                    "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
                                        "-webkit-appearance": "none",
                                    },
                                },
                                ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                            }}
                            type="number"
                            value={agentReward}
                            onChange={(e) => {
                                const value = parseInt(e.target.value)
                                setAgentReward(value)
                            }}
                        />
                    </Stack>

                    <FancyButton
                        disabled={!agentReward || agentReward <= 0}
                        loading={isLoading}
                        clipThingsProps={{
                            clipSize: "5px",
                            backgroundColor: colors.blue2,
                            border: { isFancy: true, borderColor: colors.blue2 },
                            sx: { position: "relative", width: "100%", mt: "1rem" },
                        }}
                        sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                        onClick={() => onAgentRepair()}
                    >
                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                            SUBMIT
                        </Typography>
                    </FancyButton>
                </Stack>

                <Stack sx={{ p: "1.2rem 1.6rem 1.6rem 1.6rem", backgroundColor: "#FFFFFF20" }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: ".5rem" }}>
                        <Typography sx={{ fontFamily: fonts.nostromoBlack, color: colors.green }}>INSTANT REPAIR</Typography>

                        <Stack direction="row" alignItems="center">
                            <SvgSupToken size="1.6rem" fill={colors.yellow} />
                            <Typography sx={{ fontWeight: "fontWeightBold" }}>2500</Typography>
                        </Stack>
                    </Stack>

                    <Typography>Instantly repair your mech and be ready for the next battle immediately.</Typography>

                    <FancyButton
                        loading={isLoading}
                        clipThingsProps={{
                            clipSize: "5px",
                            backgroundColor: colors.green,
                            border: { isFancy: true, borderColor: colors.green },
                            sx: { position: "relative", width: "100%", mt: "1rem" },
                        }}
                        sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                        onClick={() => onInstantRepair()}
                    >
                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                            SUBMIT
                        </Typography>
                    </FancyButton>
                </Stack>

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
