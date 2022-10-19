import HCaptcha from "@hcaptcha/react-hcaptcha"
import { Box, IconButton, Modal, Stack, SxProps, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { SvgClose, SvgCubes, SvgSupToken } from "../../../assets"
import { CAPTCHA_KEY } from "../../../constants"
import { useSupremacy, useUI } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { supFormatterNoFixed, timeSinceInWords } from "../../../helpers"
import { useTimer } from "../../../hooks"
import { useGameServerCommandsUser, useGameServerSubscriptionSecured } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { RepairAgent, RepairJob, RepairStatus } from "../../../types/jobs"
import { ClipThing } from "../../Common/ClipThing"
import { FancyButton } from "../../Common/FancyButton"
import { RepairBlocks } from "../../Hangar/WarMachinesHangar/Common/MechRepairBlocks"
import { isWebGLAvailable } from "./StackTower/src/utils"
import { StackTower } from "./StackTower/StackTower"

interface DoRepairModalProps {
    repairStatus?: RepairStatus
    repairJob?: RepairJob
    onClose: () => void
}

const propsAreEqual = (prevProps: DoRepairModalProps, nextProps: DoRepairModalProps) => {
    return (
        prevProps.repairJob?.id === nextProps.repairJob?.id &&
        prevProps.repairJob?.closed_at === nextProps.repairJob?.closed_at &&
        prevProps.repairJob?.blocks_repaired === nextProps.repairJob?.blocks_repaired &&
        prevProps.repairJob?.working_agent_count === nextProps.repairJob?.working_agent_count &&
        prevProps.repairStatus?.id === nextProps.repairStatus?.id &&
        prevProps.repairStatus?.blocks_repaired === nextProps.repairStatus?.blocks_repaired
    )
}

/**
 * Make sure this component is quite generic and doesnt know about what the
 * mini-game is because in the future we want to support different mini-games.
 */
export const DoRepairModal = React.memo(function DoRepairModal({ repairStatus, repairJob: _repairJob, onClose }: DoRepairModalProps) {
    const theme = useTheme()
    const { setStopMapRender, setIsStreamBigDisplay } = useUI()
    const { getFaction } = useSupremacy()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [repairJob, setRepairJob] = useState<RepairJob | undefined>(_repairJob)

    useGameServerSubscriptionSecured<RepairJob>(
        {
            URI: `/repair_offer/${_repairJob?.id}`,
            key: GameServerKeys.SubRepairJobStatus,
            ready: !!repairJob?.id,
        },
        (payload) => {
            if (!payload) return
            setRepairJob(payload)
        },
    )

    // When doing repair, pause minimap rendering, and show stream on top left corner
    useEffect(() => {
        setIsStreamBigDisplay(false)
        setStopMapRender(true)
        return () => setStopMapRender(false)
    }, [setIsStreamBigDisplay, setStopMapRender])

    // Captcha
    const [captchaToken, setCaptchaToken] = useState<string>()

    // Registering to play (to be a repair agent)
    const [repairAgentID, setRepairAgentID] = useState("") // Need this for the mini-game key prop
    const [repairAgent, setRepairAgent] = useState<RepairAgent>()
    const [isRegistering, setIsRegistering] = useState(false)
    const [error, setError] = useState<string>()

    // Submission
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const faction = useMemo(() => getFaction(_repairJob?.job_owner.faction_id || ""), [_repairJob?.job_owner.faction_id, getFaction])
    const remainDamagedBlocks = repairJob
        ? repairJob.blocks_required_repair - repairJob.blocks_repaired
        : repairStatus
        ? repairStatus.blocks_required_repair - repairStatus.blocks_repaired
        : -1
    const primaryColor = _repairJob?.job_owner.faction_id ? faction.primary_color : theme.factionTheme.primary
    const backgroundColor = _repairJob?.job_owner.faction_id ? faction.background_color : theme.factionTheme.background
    const isFinished = !!(repairJob?.closed_at || (repairJob?.expires_at && repairJob?.expires_at < new Date()) || remainDamagedBlocks <= 0)

    useEffect(() => {
        if (!isWebGLAvailable()) {
            setError("WebGL is not supported in this browser.")
            console.error("WebGL is not supported in this browser.")
        }
    }, [])

    const abandonJob = useCallback(() => {
        // Tell back end
        if (repairAgent?.id) {
            send(GameServerKeys.AbandonRepairAgent, {
                repair_agent_id: repairAgent.id,
            })
        }

        onClose()
    }, [onClose, repairAgent?.id, send])

    const onSubmitted = useCallback(() => {
        setRepairAgent(undefined)
        setSubmitSuccess(true)
    }, [])

    // Register for to be a repair agent
    const registerAgentRepair = useCallback(async () => {
        if (!repairStatus?.id && !repairJob?.id) return

        setError(undefined)
        setIsRegistering(true)
        setSubmitSuccess(false)

        try {
            const resp = await send<RepairAgent>(GameServerKeys.RegisterRepairAgent, {
                repair_offer_id: repairJob?.id,
                repair_case_id: repairStatus?.id,
                captcha_token: captchaToken,
            })

            if (!resp) return
            setRepairAgent(resp)
            setRepairAgentID(resp.id)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to register repair job."
            setError(message)
            setCaptchaToken(undefined)
            console.error(err)
        } finally {
            setIsRegistering(false)
        }
    }, [repairJob?.id, repairStatus?.id, send, captchaToken])

    // Things that display on top of the game to show info
    const overlayContent = useMemo(() => {
        const earnings = submitSuccess ? (
            <>
                <Box sx={{ textAlign: "center" }}>
                    <Typography gutterBottom variant="h4" sx={{ fontFamily: fonts.nostromoHeavy }}>
                        CONGRATULATIONS!
                    </Typography>
                    <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                        {repairJob?.sups_worth_per_block ? "YOU'VE JUST EARNED" : "YOU'VE JUST REPAIRED A BLOCK"}
                    </Typography>
                </Box>

                {repairJob?.sups_worth_per_block && (
                    <Box sx={{ pb: ".5rem" }}>
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
                                    {supFormatterNoFixed(repairJob.sups_worth_per_block || "0", 2)}
                                </Typography>
                            </Stack>
                        </ClipThing>
                    </Box>
                )}
            </>
        ) : null

        if ((repairJob || repairStatus) && remainDamagedBlocks <= 0) {
            return (
                <Stack spacing="2rem" alignItems="center">
                    {earnings}

                    <Typography variant="h5" sx={{ textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                        MECH IS FULLY REPAIRED!
                        <br />
                        YOU MAY CLOSE THE MODAL NOW.
                    </Typography>

                    <FancyButton
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

        if (repairJob && isFinished) {
            return (
                <Stack spacing="2rem" alignItems="center">
                    <Typography variant="h4" sx={{ textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                        JOB {repairJob?.finished_reason}
                    </Typography>
                    <Typography variant="h5" sx={{ textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                        THIS JOB IS NO LONGER AVAILABLE
                    </Typography>
                </Stack>
            )
        }

        if (!repairAgent) {
            return (
                <Stack spacing="2.3rem" alignItems="center">
                    {earnings}

                    {!captchaToken && (
                        <form>
                            <HCaptcha
                                size="compact"
                                theme="dark"
                                sitekey={CAPTCHA_KEY}
                                onVerify={setCaptchaToken}
                                onExpire={() => setCaptchaToken(undefined)}
                            />
                        </form>
                    )}

                    <FancyButton
                        disabled={!captchaToken}
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

        return null
    }, [
        submitSuccess,
        repairJob,
        primaryColor,
        backgroundColor,
        repairStatus,
        remainDamagedBlocks,
        isFinished,
        repairAgent,
        onClose,
        registerAgentRepair,
        captchaToken,
        isRegistering,
    ])

    return (
        <Modal open={true} onClose={repairAgent ? undefined : onClose} sx={{ zIndex: siteZIndex.Modal }}>
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
                                    defaultBlocks={repairJob?.blocks_required_repair || repairStatus?.blocks_required_repair}
                                    remainDamagedBlocks={remainDamagedBlocks}
                                    hideNumber
                                />
                            </Stack>
                        </Stack>

                        {/* 3 x info cards */}
                        {repairJob && (
                            <Stack direction="row" spacing="1.6rem" justifyContent="center">
                                <InfoCard primaryColor={primaryColor} label="ACTIVE WORKERS">
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: "fontWeightBold",
                                            color: repairJob.working_agent_count <= remainDamagedBlocks ? colors.green : colors.orange,
                                        }}
                                    >
                                        {repairJob.working_agent_count.toString()}
                                    </Typography>
                                </InfoCard>

                                <InfoCard primaryColor={primaryColor} label="REWARD PER BLOCK">
                                    <Stack direction="row" alignItems="center">
                                        <SvgSupToken size="3rem" fill={colors.yellow} />
                                        <Typography variant="h4" sx={{ fontWeight: "fontWeightBold" }}>
                                            {supFormatterNoFixed(repairJob.sups_worth_per_block || "0", 2)}
                                        </Typography>
                                    </Stack>
                                </InfoCard>

                                <InfoCard primaryColor={primaryColor} label="REMAINING REWARDS">
                                    <Stack direction="row" alignItems="center">
                                        <SvgSupToken size="3rem" fill={colors.yellow} />
                                        <Typography variant="h4" sx={{ fontWeight: "fontWeightBold" }}>
                                            {supFormatterNoFixed(
                                                new BigNumber(repairJob.sups_worth_per_block || "0").multipliedBy(remainDamagedBlocks).toString(),
                                                1,
                                            )}
                                        </Typography>
                                    </Stack>
                                </InfoCard>

                                <InfoCard primaryColor={primaryColor} label="TIME REMAINING">
                                    <Countdown endTime={repairJob.expires_at} />
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
                                {overlayContent}
                            </Box>

                            {/* Support other mini-games in the future */}
                            <StackTower
                                key={repairAgentID}
                                primaryColor={primaryColor}
                                disableGame={!repairAgent || isFinished}
                                repairAgent={repairAgent}
                                onSubmitted={onSubmitted}
                            />
                        </Box>

                        {/* Abandon button */}
                        {repairAgent && (
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "7px",
                                    clipSlantSize: "0px",
                                    corners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
                                    backgroundColor: backgroundColor,
                                    opacity: 1,
                                    border: { borderColor: colors.red, borderThickness: "2px" },
                                    sx: { position: "relative" },
                                }}
                                sx={{ px: "1.6rem", py: "1rem", color: colors.red }}
                                onClick={abandonJob}
                            >
                                <Typography sx={{ color: colors.red, fontFamily: fonts.nostromoBlack }}>ABANDON REPAIR</Typography>
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
}, propsAreEqual)

const InfoCard = React.memo(function InfoCard({
    primaryColor,
    children,
    label,
    sx,
}: {
    primaryColor: string
    children: ReactNode
    label: string
    sx?: SxProps
}) {
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
            <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
                {children}
            </Stack>
            <Typography variant="caption" sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBlack }}>
                {label}
            </Typography>
        </Stack>
    )
})

const Countdown = React.memo(function Countdown({ endTime }: { endTime: Date }) {
    const { totalSecRemain } = useTimer(endTime)

    let color = "#FFFFFF"
    if (totalSecRemain < 300) color = colors.orange
    if (totalSecRemain <= 0) color = colors.lightGrey

    return (
        <Typography variant="h4" sx={{ fontWeight: "fontWeightBold", color: color }}>
            {totalSecRemain > 0 ? timeSinceInWords(new Date(), new Date(new Date().getTime() + totalSecRemain * 1000), true) : "EXPIRED"}
        </Typography>
    )
})
