import { Box, IconButton, Modal, Stack, SxProps, Typography } from "@mui/material"
import { ReactNode, useCallback, useMemo, useState } from "react"
import { SvgClose, SvgCubes, SvgSupToken } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { supFormatterNoFixed, timeSinceInWords } from "../../../helpers"
import { useTimer } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { heightEffect } from "../../../theme/keyframes"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { RepairAgent, RepairJobStatus, RepairStatus } from "../../../types/jobs"
import { ClipThing } from "../../Common/ClipThing"
import { FancyButton } from "../../Common/FancyButton"
import { RepairBlocks } from "../../Hangar/WarMachinesHangar/Common/MechRepairBlocks"
import { GamePattern } from "./StackTower/src/game"
import { StackTower } from "./StackTower/StackTower"

export const DoRepairModal = ({
    repairStatus,
    repairJobStatus,
    open,
    onClose,
}: {
    repairStatus?: RepairStatus
    repairJobStatus?: RepairJobStatus
    open: boolean
    onClose: () => void
}) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [isRegistering, setIsRegistering] = useState(false)
    const [error, setError] = useState<string>()
    const [repairAgent, setRepairAgent] = useState<RepairAgent>()

    // Submission
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string>()
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const remainDamagedBlocks = repairJobStatus
        ? repairJobStatus.blocks_required_repair - repairJobStatus.blocks_repaired
        : repairStatus
        ? repairStatus.blocks_required_repair - repairStatus.blocks_repaired
        : 0
    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    const abandonJob = useCallback(() => {
        setRepairAgent(undefined)
        setError(undefined)
        setIsRegistering(false)
        setSubmitSuccess(false)
    }, [])

    const registerAgentRepair = useCallback(async () => {
        if (!repairStatus?.id && !repairJobStatus?.id) return

        setError(undefined)
        setIsRegistering(true)
        setSubmitSuccess(false)

        try {
            const resp = await send<RepairAgent>(GameServerKeys.RegisterRepairAgent, {
                repair_offer_id: repairJobStatus?.id,
                repair_case_id: repairStatus?.id,
            })

            if (!resp) return
            setRepairAgent(resp)
            setSubmitSuccess(true)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to register repair job."
            setError(message)
            console.error(err)
        } finally {
            setIsRegistering(false)
        }
    }, [repairJobStatus?.id, repairStatus?.id, send])

    const completeAgentRepair = useCallback(
        async (repairAgentID: string, gamePatterns: GamePattern[]) => {
            try {
                setSubmitError(undefined)
                setIsSubmitting(true)
                const resp = await send(GameServerKeys.CompleteRepairAgent, {
                    repair_agent_id: repairAgentID,
                    game_patterns: gamePatterns,
                })

                if (!resp) return
                setRepairAgent(undefined)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to submit results."
                setSubmitError(message)
                console.error(err)
            } finally {
                setTimeout(() => {
                    setIsSubmitting(false)
                }, 2200)
            }
        },
        [send],
    )

    const popupContent = useMemo(() => {
        if (remainDamagedBlocks > 0) {
            return (
                <Stack spacing="2rem" alignItems="center">
                    <Typography variant="h4" sx={{ textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                        THIS ITEM IS FULLY REPAIRED!
                    </Typography>

                    <FancyButton
                        loading={isRegistering}
                        clipThingsProps={{
                            clipSize: "7px",
                            clipSlantSize: "0px",
                            corners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
                            backgroundColor: colors.lightGrey,
                            opacity: 1,
                            border: { borderColor: colors.lightGrey, borderThickness: "2px" },
                            sx: { position: "relative" },
                        }}
                        sx={{ px: "1.6rem", py: ".6rem", minWidth: "14rem", color: "#FFFFFF" }}
                        onClick={onClose}
                    >
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>EXIT</Typography>
                    </FancyButton>
                </Stack>
            )
        }

        if (!repairAgent) {
            return (
                <Stack spacing="2rem" alignItems="center">
                    {submitSuccess && (
                        <>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography gutterBottom variant="h4" sx={{ fontFamily: fonts.nostromoHeavy }}>
                                    CONGRATULATIONS!
                                </Typography>
                                <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                                    {repairJobStatus?.sups_worth_per_block ? "YOU'VE JUST EARNED" : "YOU'VE JUST REPAIRED A BLOCK"}
                                </Typography>
                            </Box>

                            {repairJobStatus?.sups_worth_per_block && (
                                <ClipThing
                                    clipSize="10px"
                                    border={{
                                        borderColor: primaryColor,
                                        borderThickness: ".4rem",
                                    }}
                                    backgroundColor={backgroundColor}
                                >
                                    <Stack direction="row" alignItems="center" sx={{ p: ".4rem 1rem" }}>
                                        <SvgSupToken size="4.2rem" fill={colors.yellow} />
                                        <Typography variant="h3" sx={{ fontWeight: "fontWeightBold" }}>
                                            {supFormatterNoFixed(repairJobStatus.sups_worth_per_block || "0", 2)}
                                        </Typography>
                                    </Stack>
                                </ClipThing>
                            )}
                        </>
                    )}

                    <FancyButton
                        loading={isRegistering}
                        clipThingsProps={{
                            clipSize: "7px",
                            clipSlantSize: "0px",
                            corners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
                            backgroundColor: colors.green,
                            opacity: 1,
                            border: { borderColor: colors.green, borderThickness: "2px" },
                            sx: { position: "relative" },
                        }}
                        sx={{ px: "1.6rem", py: "1rem", color: "#FFFFFF" }}
                        onClick={registerAgentRepair}
                    >
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{submitSuccess ? "REPAIR NEXT BLOCK" : "START REPAIRS"}</Typography>
                    </FancyButton>
                </Stack>
            )
        }

        if (submitError) {
            return (
                <Typography variant="h5" sx={{ fontWeight: "fontWeightBold", color: colors.red }}>
                    {submitError}
                </Typography>
            )
        }

        if (isSubmitting) {
            return (
                <Stack spacing="1.8rem" alignItems="center">
                    <Stack justifyContent="flex-end" sx={{ width: "3rem", height: "3rem", backgroundColor: colors.red, boxShadow: 3 }}>
                        <Box sx={{ width: "100%", backgroundColor: colors.green, animation: `${heightEffect()} 4s ease-out infinite` }} />
                    </Stack>

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: "fontWeightBold",
                        }}
                    >
                        SUBMITTING RESULTS...
                    </Typography>
                </Stack>
            )
        }

        return null
    }, [
        backgroundColor,
        isRegistering,
        isSubmitting,
        onClose,
        primaryColor,
        registerAgentRepair,
        remainDamagedBlocks,
        repairAgent,
        repairJobStatus?.sups_worth_per_block,
        submitError,
        submitSuccess,
    ])

    return (
        <Modal open={open} onClose={repairAgent ? undefined : onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80vw",
                    height: "90vh",
                    maxWidth: "80rem",
                    maxHeight: "120rem",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: primaryColor,
                        borderThickness: ".3rem",
                    }}
                    corners={{
                        topLeft: true,
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                    }}
                    sx={{ position: "relative", height: "100%", width: "100%" }}
                    backgroundColor={backgroundColor}
                >
                    <Stack spacing="2rem" sx={{ p: "3.6rem 3.8rem", height: "100%" }}>
                        {/* Top blocks */}
                        <Stack spacing="2.6rem" direction="row" alignItems="center" sx={{ pl: ".5rem" }}>
                            <SvgCubes size="5rem" />
                            <Stack spacing=".6rem">
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontFamily: fonts.nostromoBlack,
                                        span: { fontFamily: fonts.nostromoHeavy, color: colors.orange },
                                    }}
                                >
                                    <span>{remainDamagedBlocks}</span> BLOCKS REMAINING
                                </Typography>
                                <RepairBlocks
                                    size={12}
                                    defaultBlocks={repairJobStatus?.blocks_required_repair || repairStatus?.blocks_required_repair}
                                    remainDamagedBlocks={remainDamagedBlocks}
                                    hideNumber
                                />
                            </Stack>
                        </Stack>

                        {/* Info cards */}
                        {repairJobStatus && (
                            <Stack direction="row" spacing="1.7rem" justifyContent="center">
                                <InfoCard primaryColor={primaryColor} label="ACTIVE AGENTS">
                                    <Typography
                                        variant="h4"
                                        sx={{ fontWeight: "fontWeightBold", color: repairJobStatus.working_agent_count <= 3 ? colors.green : colors.orange }}
                                    >
                                        {repairJobStatus.working_agent_count.toString()}
                                    </Typography>
                                </InfoCard>

                                <InfoCard primaryColor={primaryColor} label="REWARD PER BLOCK" sx={{ flex: 1.6 }}>
                                    <Stack direction="row" alignItems="center">
                                        <SvgSupToken size="3rem" fill={colors.yellow} />
                                        <Typography variant="h4" sx={{ fontWeight: "fontWeightBold" }}>
                                            {supFormatterNoFixed(repairJobStatus.sups_worth_per_block || "0", 2)}
                                        </Typography>
                                    </Stack>
                                </InfoCard>

                                <InfoCard primaryColor={primaryColor} label="TIME LEFT">
                                    <Countdown endTime={repairJobStatus.expires_at} />
                                </InfoCard>
                            </Stack>
                        )}

                        {/* Game */}
                        <Box sx={{ flex: 1, position: "relative" }}>
                            <Box
                                sx={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "50%",
                                    width: "90%",
                                    transform: "translate(-50%, -50%)",
                                    zIndex: 99,
                                }}
                            >
                                {popupContent}
                            </Box>

                            <StackTower
                                disableGame={!repairAgent || !!submitError || isSubmitting}
                                repairAgent={repairAgent}
                                completeAgentRepair={completeAgentRepair}
                            />
                        </Box>

                        {/* Button */}
                        {repairAgent && (
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "7px",
                                    clipSlantSize: "0px",
                                    corners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
                                    backgroundColor: colors.red,
                                    opacity: 1,
                                    border: { borderColor: colors.red, borderThickness: "2px" },
                                    sx: { position: "relative" },
                                }}
                                sx={{ px: "1.6rem", py: "1rem", color: "#FFFFFF" }}
                                onClick={abandonJob}
                            >
                                <Typography sx={{ color: "#FFFFFF", fontFamily: fonts.nostromoBlack }}>ABANDON JOB</Typography>
                            </FancyButton>
                        )}

                        {/* Error message */}
                        {error && <Typography sx={{ color: colors.red }}>{error}</Typography>}
                    </Stack>

                    {!repairAgent && (
                        <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                            <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                        </IconButton>
                    )}
                </ClipThing>
            </Box>
        </Modal>
    )
}

const InfoCard = ({ primaryColor, children, label, sx }: { primaryColor: string; children: ReactNode; label: string; sx?: SxProps }) => {
    return (
        <Stack
            alignItems="center"
            justifyContent="space-between"
            spacing=".8rem"
            sx={{
                flex: 1,
                p: "1.4rem 3rem",
                pt: "1.8rem",
                textAlign: "center",
                border: `${primaryColor}70 2px solid`,
                backgroundColor: `${primaryColor}30`,
                boxShadow: 2,
                borderRadius: 1.3,
                ...sx,
            }}
        >
            {children}
            <Typography variant="caption" sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBlack }}>
                {label}
            </Typography>
        </Stack>
    )
}

const Countdown = ({ endTime }: { endTime: Date }) => {
    const { totalSecRemain } = useTimer(endTime)

    return (
        <Typography variant="h4" sx={{ fontWeight: "fontWeightBold", color: totalSecRemain < 300 ? colors.orange : "#FFFFFF" }}>
            {timeSinceInWords(new Date(), new Date(new Date().getTime() + totalSecRemain * 1000), true)}
        </Typography>
    )
}
