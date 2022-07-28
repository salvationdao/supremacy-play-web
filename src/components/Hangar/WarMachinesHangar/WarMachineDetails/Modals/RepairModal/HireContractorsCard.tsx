import { InputAdornment, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { FancyButton } from "../../../../.."
import { SvgSupToken } from "../../../../../../assets"
import { useSnackbar } from "../../../../../../containers"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { colors, fonts } from "../../../../../../theme/theme"
import { MechDetails } from "../../../../../../types"
import { AmountItem } from "../DeployModal"

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

export const HireContractorsCard = ({ mechDetails, remainDamagedBlocks }: { mechDetails: MechDetails; remainDamagedBlocks: number }) => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string>()

    const [agentReward, setAgentReward] = useState<number>(10)
    const [durationMinutes, setDurationMinutes] = useState<number>(listingDurations[1].value)

    const onAgentRepair = useCallback(async () => {
        try {
            setIsSubmitting(true)
            const resp = await send(GameServerKeys.RegisterMechRepair, {
                mech_id: mechDetails.id,
                last_for_minutes: durationMinutes,
                offered_sups: agentReward.toString(),
            })
            if (resp) {
                newSnackbarMessage("Successfully submitted listed mech for repair.", "success")
                setSubmitError(undefined)
            }
        } catch (e) {
            setSubmitError(typeof e === "string" ? e : "Failed to listed mech for repair.")
            console.error(e)
        } finally {
            setIsSubmitting(false)
        }
    }, [send, mechDetails.id, durationMinutes, agentReward, newSnackbarMessage])

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
                HIRE CONTRACTORS
            </Typography>

            <Typography variant="h6">Send your repairs to the jobs page! Citizens work together and complete challenges to repair your mech.</Typography>

            {/* Duration */}
            <Stack spacing=".5rem">
                <Typography variant="body2" sx={{ color: colors.blue2, fontFamily: fonts.nostromoBlack }}>
                    DEADLINE:
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
                loading={isSubmitting}
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

            {submitError && (
                <Typography variant="body2" sx={{ color: colors.red }}>
                    {submitError}
                </Typography>
            )}
        </Stack>
    )
}
