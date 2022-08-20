import { InputAdornment, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { FancyButton } from "../../../../.."
import { SvgSupToken } from "../../../../../../assets"
import { useGlobalNotifications } from "../../../../../../containers"
import { numberCommaFormatter, parseString } from "../../../../../../helpers"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { colors, fonts } from "../../../../../../theme/theme"
import { MechBasic } from "../../../../../../types"
import { AmountItem } from "../DeployModal"

const INITIAL_REWARD_PER_BLOCK = parseString(localStorage.getItem("repairHireRewards"), 2)

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

export const HireContractorsCard = (props: { mechs: MechBasic[]; remainDamagedBlocks: number; onClose?: () => void }) => {
    if (props.remainDamagedBlocks <= 0) return null
    return <HireContractorsCardInner {...props} />
}

const HireContractorsCardInner = ({ mechs, remainDamagedBlocks, onClose }: { mechs: MechBasic[]; remainDamagedBlocks: number; onClose?: () => void }) => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string>()

    const [agentReward, setAgentReward] = useState<number>(Math.round(100 * INITIAL_REWARD_PER_BLOCK * remainDamagedBlocks) / 100)
    const [agentRewardPerBlock, setAgentRewardPerBlock] = useState<number>(INITIAL_REWARD_PER_BLOCK)
    const [durationMinutes, setDurationMinutes] = useState<number>(listingDurations[1].value)

    useEffect(() => {
        localStorage.setItem("repairHireRewards", agentRewardPerBlock.toString())
    }, [agentRewardPerBlock])

    const onAgentRepair = useCallback(async () => {
        try {
            setIsSubmitting(true)
            const resp = await send(GameServerKeys.RegisterMechRepair, {
                mech_ids: mechs.map((vm) => vm.id),
                last_for_minutes: durationMinutes,
                offered_sups_per_block: agentRewardPerBlock.toString(),
            })
            if (resp) {
                newSnackbarMessage(`Successfully submitted listed mech${mechs.length > 1 ? "s" : ""} for repair.`, "success")
                setSubmitError(undefined)
                onClose && onClose()
            }
        } catch (e) {
            setSubmitError(typeof e === "string" ? e : "Failed to listed mech for repair.")
            console.error(e)
        } finally {
            setIsSubmitting(false)
        }
    }, [send, mechs, durationMinutes, agentRewardPerBlock, newSnackbarMessage, onClose])

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

            {/* Reward to offer (per block) */}
            <Stack spacing=".5rem">
                <Typography variant="body2" sx={{ color: colors.blue2, fontFamily: fonts.nostromoBlack }}>
                    REWARD TO OFFER (PER BLOCK):
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
                        endAdornment: (
                            <InputAdornment position="end">
                                <Typography variant="body2">PER BLOCK</Typography>
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
                                WebkitAppearance: "none",
                            },
                        },
                        ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                    }}
                    type="number"
                    value={agentRewardPerBlock}
                    onChange={(e) => {
                        const value = parseFloat(e.target.value)
                        setAgentRewardPerBlock(value)
                        setAgentReward(value * remainDamagedBlocks)
                    }}
                />
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
                                WebkitAppearance: "none",
                            },
                        },
                        ".MuiOutlinedInput-notchedOutline": { border: "unset" },
                    }}
                    type="number"
                    value={agentReward}
                    onChange={(e) => {
                        const value = parseFloat(e.target.value)
                        setAgentReward(value)
                        setAgentRewardPerBlock(Math.round((value / remainDamagedBlocks) * 100) / 100)
                    }}
                />
            </Stack>

            <Stack sx={{ pt: ".8rem" }}>
                <AmountItem
                    title="TOTAL CHARGE:"
                    color={colors.yellow}
                    value={numberCommaFormatter(Math.round(agentReward * 1.1 * 100) / 100)}
                    tooltip={`Offered reward + 10% processing fee`}
                />

                <Typography sx={{ color: colors.lightGrey }}>
                    <i>
                        <strong>NOTE:</strong> Total charge is {agentReward || 0} SUPS + 10% processing fee.
                    </i>
                </Typography>
            </Stack>

            <FancyButton
                disabled={!agentReward || agentReward <= 0 || remainDamagedBlocks <= 0}
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
