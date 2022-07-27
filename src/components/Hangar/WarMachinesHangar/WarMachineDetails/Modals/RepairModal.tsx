import { Box, IconButton, InputAdornment, MenuItem, Modal, Select, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { ClipThing, FancyButton } from "../../../.."
import { SvgClose, SvgSupToken } from "../../../../../assets"
import { useSnackbar } from "../../../../../containers"
import { useTheme } from "../../../../../containers/theme"
import { useGameServerCommandsFaction, useGameServerSubscription } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts, siteZIndex } from "../../../../../theme/theme"
import { MechDetails } from "../../../../../types"
import { RepairStatus } from "../../../../../types/jobs"
import { MechRepairBlocks } from "../../Common/MechRepairBlocks"
import { AmountItem } from "./DeployModal"

const listingDurations: {
    label: string
    value: number
}[] = [
    { label: "15 minutes", value: 15 },
    { label: "30 minutes", value: 30 },
    { label: "1 hour", value: 60 },
    { label: "2 hours", value: 120 },
    { label: "3 hours", value: 180 },
]

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
    const [durationMinutes, setDurationMinutes] = useState<number>(listingDurations[1].value)

    const repairStatus = useGameServerSubscription<RepairStatus>({
        URI: `/public/mech/${selectedMechDetails.id}/repair_case`,
        key: GameServerKeys.SubMechRepairStatus,
    })

    const remainDamagedBlocks = repairStatus ? repairStatus.blocks_required_repair - repairStatus.blocks_repaired : 0

    const onClose = useCallback(() => {
        setRepairError(undefined)
        setRepairMechModalOpen(false)
    }, [setRepairError, setRepairMechModalOpen])

    const onAgentRepair = useCallback(async () => {
        try {
            setIsLoading(true)
            const resp = await send(GameServerKeys.RegisterMechRepair, {
                mech_id: selectedMechDetails.id,
                last_for_minutes: durationMinutes,
                offered_sups: agentReward.toString(),
            })
            if (resp) {
                newSnackbarMessage("Successfully submitted listed mech for repair.", "success")
                setRepairError(undefined)
                onClose()
            }
        } catch (e) {
            setRepairError(typeof e === "string" ? e : "Failed to listed mech for repair.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [send, selectedMechDetails.id, durationMinutes, agentReward, newSnackbarMessage, onClose])

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
                        <Stack>
                            <Typography variant="h5" sx={{ color: theme.factionTheme.primary, fontFamily: fonts.nostromoHeavy }}>
                                DAMAGED MECH
                            </Typography>

                            <Typography sx={{ mb: ".2rem", color: colors.red, fontFamily: fonts.nostromoBlack }}>
                                {remainDamagedBlocks} x DAMAGED BLOCKS
                            </Typography>

                            <MechRepairBlocks mechID={selectedMechDetails?.id} defaultBlocks={selectedMechDetails?.model.repair_blocks} hideNumber />
                        </Stack>

                        {/* Hire contractors */}
                        <Stack spacing="1rem" sx={{ p: "2rem", pt: "1.6rem", backgroundColor: "#FFFFFF20", border: "#FFFFFF30 1px solid" }}>
                            <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack, color: colors.blue2 }}>
                                HIRE CONTRACTORS
                            </Typography>

                            <Typography variant="h6">
                                Send your repairs to the jobs page! Citizens work together and complete challenges to repair your mech.
                            </Typography>

                            {/* Duration */}
                            <Stack spacing=".5rem">
                                <Typography variant="body2" sx={{ color: colors.blue2, fontFamily: fonts.nostromoBlack }}>
                                    DURATION:
                                </Typography>
                                <Select
                                    sx={{
                                        width: "100%",
                                        borderRadius: 0.5,
                                        border: `${colors.blue2}99 2px dashed`,
                                        backgroundColor: "#00000090",
                                        "&:hover": {
                                            backgroundColor: colors.darkNavy,
                                        },
                                        ".MuiTypography-root": {
                                            px: "2.4rem",
                                            py: ".6rem",
                                        },
                                        "& .MuiSelect-outlined": { p: 0 },
                                        ".MuiOutlinedInput-notchedOutline": {
                                            border: "none !important",
                                        },
                                    }}
                                    displayEmpty
                                    value={durationMinutes}
                                    MenuProps={{
                                        variant: "menu",
                                        sx: {
                                            "&& .Mui-selected": {
                                                ".MuiTypography-root": {
                                                    color: "#FFFFFF",
                                                },
                                                backgroundColor: colors.blue2,
                                            },
                                        },
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: colors.darkNavy,
                                                borderRadius: 0.5,
                                            },
                                        },
                                    }}
                                >
                                    {listingDurations.map((x, i) => {
                                        return (
                                            <MenuItem
                                                key={x.value + i}
                                                value={x.value}
                                                onClick={() => {
                                                    setDurationMinutes(x.value)
                                                }}
                                                sx={{ "&:hover": { backgroundColor: "#FFFFFF20" } }}
                                            >
                                                <Typography textTransform="uppercase">{x.label}</Typography>
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </Stack>

                            {/* Reward to offer */}
                            <Stack spacing=".5rem">
                                <Typography variant="body2" sx={{ color: colors.blue2, fontFamily: fonts.nostromoBlack }}>
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
                                            py: ".6rem",
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
                                        const value = parseFloat(e.target.value)
                                        setAgentReward(value)
                                    }}
                                />
                            </Stack>

                            <Stack sx={{ pt: ".8rem" }}>
                                <AmountItem
                                    title="REWARD PER BLOCK:"
                                    value={Math.round((agentReward / remainDamagedBlocks) * 100) / 100}
                                    tooltip={`Offered reward / ${remainDamagedBlocks} blocks`}
                                />
                                <AmountItem title="TOTAL CHARGE:" value={Math.round(agentReward * 1.1 * 100) / 100} tooltip={`Offered reward + 10% GST`} />
                            </Stack>

                            <FancyButton
                                disabled={!agentReward || agentReward <= 0}
                                loading={isLoading}
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: colors.blue2,
                                    border: { isFancy: true, borderColor: colors.blue2 },
                                    sx: { position: "relative", width: "100%" },
                                }}
                                sx={{ px: "1.6rem", py: ".8rem", color: "#FFFFFF" }}
                                onClick={() => onAgentRepair()}
                            >
                                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                    SUBMIT
                                </Typography>
                            </FancyButton>
                        </Stack>

                        {/* Self repair */}
                        <Stack spacing="1rem" sx={{ p: "2rem", pt: "1.6rem", backgroundColor: "#FFFFFF20", border: "#FFFFFF30 1px solid" }}>
                            <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack, color: colors.green }}>
                                SELF REPAIR
                            </Typography>

                            <Typography variant="h6">Get your hands dirty and do the repair work yourself.</Typography>

                            <FancyButton
                                loading={isLoading}
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: colors.green,
                                    border: { isFancy: true, borderColor: colors.green },
                                    sx: { position: "relative", width: "100%" },
                                }}
                                sx={{ px: "1.6rem", py: ".8rem", color: "#FFFFFF" }}
                                // onClick={() => onInstantRepair()}
                            >
                                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                    REPAIR
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

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}
