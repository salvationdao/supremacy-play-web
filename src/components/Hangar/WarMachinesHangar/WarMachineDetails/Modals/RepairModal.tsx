import { Box, IconButton, InputAdornment, Modal, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { ClipThing, FancyButton } from "../../../.."
import { SvgClose, SvgSupToken } from "../../../../../assets"
import { useSnackbar } from "../../../../../containers"
import { useTheme } from "../../../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../../theme/theme"
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
    const theme = useTheme()
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
        <Modal open={repairMechModalOpen} onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "50rem",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    corners={{
                        topLeft: true,
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                    }}
                    sx={{ position: "relative" }}
                    backgroundColor={theme.factionTheme.background}
                >
                    <Stack
                        spacing="1.6rem"
                        sx={{
                            position: "relative",
                            px: "2.5rem",
                            py: "2.4rem",
                            maxHeight: "calc(100vh - 5rem)",
                            overflow: "hidden",
                        }}
                    >
                        <Stack spacing="1.6rem">
                            <Stack sx={{ p: "2rem", pt: "1.6rem", backgroundColor: "#FFFFFF20" }}>
                                <Typography variant="h6" sx={{ mb: ".8rem", fontFamily: fonts.nostromoBlack, color: colors.blue2 }}>
                                    3RD PARTY REPAIR
                                </Typography>

                                <Typography variant="h6">Citizens work together and complete challenges to repair your mech.</Typography>

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
                                    loading={isLoading}
                                    clipThingsProps={{
                                        clipSize: "5px",
                                        backgroundColor: colors.blue2,
                                        border: { isFancy: true, borderColor: colors.blue2 },
                                        sx: { position: "relative", width: "100%", mt: "1rem" },
                                    }}
                                    sx={{ px: "1.6rem", py: ".8rem", color: "#FFFFFF" }}
                                    onClick={() => onAgentRepair()}
                                >
                                    <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                                        HIRE CONTRACTORS
                                    </Typography>
                                </FancyButton>
                            </Stack>

                            <Stack sx={{ p: "2rem", pt: "1.6rem", backgroundColor: "#FFFFFF20" }}>
                                <Typography variant="h6" sx={{ mb: ".8rem", fontFamily: fonts.nostromoBlack, color: colors.green }}>
                                    SELF REPAIR
                                </Typography>

                                <Typography variant="h6">Instantly repair your mech and be ready for the next battle immediately.</Typography>

                                <FancyButton
                                    loading={isLoading}
                                    clipThingsProps={{
                                        clipSize: "5px",
                                        backgroundColor: colors.green,
                                        border: { isFancy: true, borderColor: colors.green },
                                        sx: { position: "relative", width: "100%", mt: "1rem" },
                                    }}
                                    sx={{ px: "1.6rem", py: ".8rem", color: "#FFFFFF" }}
                                    onClick={() => onInstantRepair()}
                                >
                                    <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                                        INSTANT REPAIR
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
                    </Stack>

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
