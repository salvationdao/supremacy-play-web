import { Box, IconButton, Modal, Stack, SxProps, Typography } from "@mui/material"
import { ReactNode, useCallback, useState } from "react"
import { SvgClose, SvgCubes, SvgSupToken } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { supFormatterNoFixed, timeSinceInWords } from "../../../helpers"
import { useTimer } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { RepairAgent, RepairJobStatus } from "../../../types/jobs"
import { ClipThing } from "../../Common/ClipThing"
import { FancyButton } from "../../Common/FancyButton"
import { RepairBlocks } from "../../Hangar/WarMachinesHangar/Common/MechRepairBlocks"
import { StackTower } from "./StackTower/StackTower"

export const DoRepairModal = ({ repairStatus, open, onClose }: { repairStatus: RepairJobStatus; open: boolean; onClose: () => void }) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [isRegistering, setIsRegistering] = useState(false)
    const [error, setError] = useState<string>()
    const [repairAgent, setRepairAgent] = useState<RepairAgent>()

    const remainDamagedBlocks = repairStatus ? repairStatus.blocks_required_repair - repairStatus.blocks_repaired : 0
    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    const registerAgentRepair = useCallback(async () => {
        try {
            setError(undefined)
            setIsRegistering(true)
            const resp = await send<RepairAgent>(GameServerKeys.RegisterRepairAgent, {
                repair_offer_id: repairStatus.id,
            })

            if (!resp) return
            setRepairAgent(resp)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to register repair job."
            setError(message)
            console.error(err)
        } finally {
            setIsRegistering(false)
        }
    }, [repairStatus.id, send])

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
                                        span: { color: colors.orange, fontFamily: "inherit" },
                                    }}
                                >
                                    <span>{remainDamagedBlocks}</span> BLOCKS REMAINING
                                </Typography>
                                <RepairBlocks
                                    size={12}
                                    defaultBlocks={repairStatus.blocks_required_repair}
                                    remainDamagedBlocks={remainDamagedBlocks}
                                    hideNumber
                                />
                            </Stack>
                        </Stack>

                        {/* Info cards */}
                        <Stack direction="row" spacing="1.7rem" justifyContent="center">
                            <InfoCard primaryColor={primaryColor} label="ACTIVE AGENTS">
                                <Typography
                                    variant="h4"
                                    sx={{ fontWeight: "fontWeightBold", color: repairStatus.working_agent_count <= 3 ? colors.green : colors.orange }}
                                >
                                    {repairStatus.working_agent_count.toString()}
                                </Typography>
                            </InfoCard>

                            <InfoCard primaryColor={primaryColor} label="REWARD PER BLOCK" sx={{ flex: 1.6 }}>
                                <Stack direction="row" alignItems="center">
                                    <SvgSupToken size="3rem" fill={colors.yellow} />
                                    <Typography variant="h4" sx={{ fontWeight: "fontWeightBold" }}>
                                        {supFormatterNoFixed(repairStatus.sups_worth_per_block || "0", 2)}
                                    </Typography>
                                </Stack>
                            </InfoCard>

                            <InfoCard primaryColor={primaryColor} label="TIME LEFT">
                                <Countdown endTime={repairStatus.expires_at} />
                            </InfoCard>
                        </Stack>

                        {/* Game */}
                        <Box sx={{ flex: 1 }}>
                            <StackTower repairAgent={repairAgent} />
                        </Box>

                        {/* Button */}
                        {repairAgent ? (
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
                                onClick={onClose}
                            >
                                <Typography sx={{ color: colors.red, fontFamily: fonts.nostromoBlack }}>ABANDON JOB</Typography>
                            </FancyButton>
                        ) : (
                            <FancyButton
                                loading={isRegistering}
                                clipThingsProps={{
                                    clipSize: "7px",
                                    clipSlantSize: "0px",
                                    corners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
                                    backgroundColor: primaryColor,
                                    opacity: 1,
                                    border: { borderColor: primaryColor, borderThickness: "2px" },
                                    sx: { position: "relative" },
                                }}
                                sx={{ px: "1.6rem", py: "1rem", color: secondaryColor }}
                                onClick={registerAgentRepair}
                            >
                                <Typography sx={{ color: secondaryColor, fontFamily: fonts.nostromoBlack }}>START REPAIRS</Typography>
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
