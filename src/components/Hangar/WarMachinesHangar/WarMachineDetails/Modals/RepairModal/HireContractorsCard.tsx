import { InputAdornment, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SvgSupToken } from "../../../../../../assets"
import { useGlobalNotifications } from "../../../../../../containers"
import { numberCommaFormatter, parseString } from "../../../../../../helpers"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { colors, fonts } from "../../../../../../theme/theme"
import { MechBasic } from "../../../../../../types"
import { NiceBoxThing } from "../../../../../Common/Nice/NiceBoxThing"
import { NiceButton } from "../../../../../Common/Nice/NiceButton"
import { NiceSelect } from "../../../../../Common/Nice/NiceSelect"
import { AmountItem } from "../DeployModal"

const listingDurations: {
    label: string
    value: string
}[] = [
    { label: "15 minutes", value: "15" },
    { label: "30 minutes", value: "30" },
    { label: "1 hour", value: "60" },
    { label: "2 hours", value: "120" },
    { label: "3 hours", value: "180" },
]

export const HireContractorsCard = (props: { mechs: MechBasic[]; remainDamagedBlocks: number; onClose?: () => void; onSubmitted?: () => void }) => {
    if (props.remainDamagedBlocks <= 0) return null
    return <HireContractorsCardInner {...props} />
}

const HireContractorsCardInner = ({
    mechs,
    remainDamagedBlocks,
    onClose,
    onSubmitted,
}: {
    mechs: MechBasic[]
    remainDamagedBlocks: number
    onClose?: () => void
    onSubmitted?: () => void
}) => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string>()

    const INITIAL_REWARD_PER_BLOCK = useMemo(() => parseString(localStorage.getItem("repairHireRewards"), 2), [])
    const [agentReward, setAgentReward] = useState<number>(Math.round(100 * INITIAL_REWARD_PER_BLOCK * remainDamagedBlocks) / 100)
    const [agentRewardPerBlock, setAgentRewardPerBlock] = useState<number>(INITIAL_REWARD_PER_BLOCK)
    const [durationMinutes, setDurationMinutes] = useState<number>(parseInt(listingDurations[1].value))

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
                onSubmitted && onSubmitted()
                onClose && onClose()
            }
        } catch (e) {
            setSubmitError(typeof e === "string" ? e : "Failed to listed mech for repair.")
            console.error(e)
        } finally {
            setIsSubmitting(false)
        }
    }, [send, mechs, durationMinutes, agentRewardPerBlock, newSnackbarMessage, onSubmitted, onClose])

    return (
        <NiceBoxThing border={{ color: `${colors.blue2}34`, thickness: "very-lean" }} background={{ colors: ["#FFFFFF"], opacity: 0.06 }}>
            <Stack spacing="1rem" sx={{ p: "2rem", pt: "1.6rem" }}>
                <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack, color: colors.blue2 }}>
                    HIRE CONTRACTORS
                </Typography>

                <Typography variant="h6">Send your repairs to the jobs page! Citizens work together and complete challenges to repair your mech.</Typography>

                {/* Duration */}
                <Stack spacing=".5rem">
                    <Typography variant="body2" sx={{ color: colors.blue2, fontFamily: fonts.nostromoBlack }}>
                        DEADLINE:
                    </Typography>

                    <NiceSelect
                        primaryColor={colors.blue2}
                        secondaryColor={"#FFFFFF"}
                        options={listingDurations}
                        selected={`${durationMinutes}`}
                        onSelected={(value) => setDurationMinutes(parseInt(value))}
                        // sx={{ minWidth: "26rem" }}
                    />
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
                    as
                    <Typography sx={{ color: colors.lightGrey }}>
                        <i>
                            <strong>NOTE:</strong> Total charge is {agentReward || 0} SUPS + 10% processing fee.
                        </i>
                    </Typography>
                </Stack>

                <NiceButton
                    corners
                    disabled={!agentReward || agentReward <= 0 || remainDamagedBlocks <= 0}
                    loading={isSubmitting}
                    buttonColor={colors.blue2}
                    onClick={() => onAgentRepair()}
                >
                    SUBMIT
                </NiceButton>

                {submitError && (
                    <Typography variant="body2" sx={{ color: colors.red }}>
                        {submitError}
                    </Typography>
                )}
            </Stack>
        </NiceBoxThing>
    )
}
