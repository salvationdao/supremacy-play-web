import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react"
import { SvgRepair } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction, useGameServerSubscriptionSecured } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MechDetails, MechStatus, MechStatusEnum } from "../../../../types"
import { RepairOffer } from "../../../../types/jobs"
import { RepairModal } from "../WarMachineDetails/Modals/RepairModal/RepairModal"

export const MechGeneralStatus = ({
    mechID,
    hideBox,
    smallVersion,
    mechDetails,
    onStatusLoaded,
    onRepairOfferLoaded,
    setPrimaryColor,
}: {
    mechID: string
    hideBox?: boolean
    smallVersion?: boolean
    mechDetails?: MechDetails
    onStatusLoaded?: (mechStatus: MechStatus) => void
    onRepairOfferLoaded?: (repairOffer: RepairOffer) => void
    setPrimaryColor?: React.Dispatch<React.SetStateAction<string>>
}) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechStatus, setMechStatus] = useState<MechStatus>()
    const textValue = useRef("LOADING...")
    const [color, setColour] = useState(theme.factionTheme.primary)
    const [repairMechModalOpen, setRepairMechModalOpen] = useState<boolean>(false)
    const [repairOffer, setRepairOffer] = useState<RepairOffer>()
    const [defaultOpenSelfRepair, setDefaultOpenSelfRepair] = useState(false)

    useGameServerSubscriptionSecured<RepairOffer>(
        {
            URI: `/mech/${mechID}/active_repair_offer`,
            key: GameServerKeys.GetMechRepairJob,
            ready: mechStatus?.status === MechStatusEnum.Damaged,
        },
        (payload) => {
            if (!payload) return
            setRepairOffer(payload)
            onRepairOfferLoaded && onRepairOfferLoaded(payload)
        },
    )

    useGameServerSubscriptionFaction<MechStatus>(
        {
            URI: `/queue/${mechID}`,
            key: GameServerKeys.SubMechQueuePosition,
        },
        (payload) => {
            if (!payload) return

            setMechStatus(payload)
            onStatusLoaded && onStatusLoaded(payload)
            let text = ""
            let color = ""
            switch (payload.status) {
                case MechStatusEnum.Idle:
                    text = "IDLE"
                    color = colors.green
                    break
                case MechStatusEnum.PendingQueue:
                    text = "PENDING DEPLOY"
                    color = colors.yellow
                    break
                case MechStatusEnum.Queue:
                    text = "IN QUEUE"
                    color = colors.yellow
                    break
                case MechStatusEnum.Battle:
                    text = "BATTLING"
                    color = colors.orange
                    break
                case MechStatusEnum.Market:
                    text = "LISTED"
                    color = colors.red
                    break
                case MechStatusEnum.Sold:
                    text = "SOLD"
                    color = colors.lightGrey
                    break
                case MechStatusEnum.Damaged:
                    text = "DAMAGED"
                    color = colors.bronze
                    break
                default:
                    text = payload.status
                    color = colors.lightGrey
            }

            textValue.current = text
            setColour(color)
            setPrimaryColor && setPrimaryColor(color)
        },
    )

    // Manually tell the server to update the mech status
    const triggerStatusUpdate = useCallback(
        async (currentStatus: string) => {
            try {
                if (!currentStatus.includes("QUEUE") && !currentStatus.includes("BATTLING")) return
                await send(GameServerKeys.TriggerMechStatusUpdate, {
                    mech_id: mechID,
                })
            } catch (e) {
                console.error(e)
            }
        },
        [mechID, send],
    )

    // When the battle queue is updated, tell the server to send the mech status to us again
    useGameServerSubscriptionFaction<boolean>(
        {
            URI: "/queue-update",
            key: GameServerKeys.MechQueueUpdated,
        },
        (payload) => {
            if (!payload) return
            triggerStatusUpdate(textValue.current)
        },
    )

    return (
        <>
            <Stack direction="row" alignItems="center" spacing=".5rem" sx={{ flexShrink: 0 }}>
                <Box
                    sx={
                        hideBox
                            ? { position: "relative" }
                            : {
                                  position: "relative",
                                  p: smallVersion ? ".4rem 1rem" : ".6rem 1.6rem",
                                  backgroundColor: `${color}25`,
                                  border: `${color} ${smallVersion ? 1.5 : 2}px dashed`,
                              }
                    }
                >
                    <Typography
                        variant={smallVersion ? "caption" : "body1"}
                        sx={{ lineHeight: 1, color, textAlign: hideBox ? "start" : "center", fontFamily: fonts.nostromoBlack }}
                    >
                        {mechStatus?.status === MechStatusEnum.Queue && mechStatus.battle_eta_seconds != null ? (
                            <BattleETA battleETASeconds={mechStatus.battle_eta_seconds} />
                        ) : (
                            textValue.current
                        )}
                    </Typography>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing=".5rem"
                        sx={{ position: "absolute", left: "100%", top: "50%", transform: "translateY(-50%)", px: ".4rem", pb: ".3rem" }}
                    >
                        {mechDetails && mechStatus?.status === MechStatusEnum.Damaged && (
                            <Stack
                                direction="row"
                                spacing=".3rem"
                                alignItems="center"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setDefaultOpenSelfRepair(true)
                                    setRepairMechModalOpen(true)
                                }}
                                sx={{
                                    p: ".1rem .6rem",
                                    pt: ".2rem",
                                    borderRadius: 0.5,
                                    backgroundColor: colors.orange,
                                    ":hover": { transform: "scale(1.05)" },
                                }}
                            >
                                <SvgRepair size="1.1rem" />
                                <Typography variant="subtitle1" sx={{ whiteSpace: "nowrap", lineHeight: 1, fontWeight: "fontWeightBold" }}>
                                    REPAIR
                                </Typography>
                            </Stack>
                        )}

                        {mechDetails && mechStatus?.status === MechStatusEnum.Damaged && (
                            <Stack
                                direction="row"
                                spacing=".3rem"
                                alignItems="center"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setDefaultOpenSelfRepair(false)
                                    setRepairMechModalOpen(true)
                                }}
                                sx={{
                                    p: ".1rem .6rem",
                                    pt: ".2rem",
                                    opacity: repairOffer ? 0.6 : 1,
                                    backgroundColor: repairOffer ? colors.grey : colors.blue2,
                                    borderRadius: 0.5,
                                    ":hover": { transform: "scale(1.05)" },
                                }}
                            >
                                <SvgRepair size="1.1rem" />
                                <Typography variant="subtitle1" sx={{ whiteSpace: "nowrap", lineHeight: 1, fontWeight: "fontWeightBold" }}>
                                    {repairOffer ? "JOB POSTED" : "POST JOB"}
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                </Box>
            </Stack>

            {repairMechModalOpen && mechDetails && (
                <RepairModal
                    defaultOpenSelfRepair={defaultOpenSelfRepair}
                    selectedMechDetails={mechDetails}
                    repairMechModalOpen={repairMechModalOpen}
                    setRepairMechModalOpen={setRepairMechModalOpen}
                />
            )}
        </>
    )
}

interface BattleETAProps {
    battleETASeconds: number
}

const BattleETA = ({ battleETASeconds }: BattleETAProps) => {
    const countdownRef = useRef<HTMLDivElement>()
    const secondsLeftRef = useRef(battleETASeconds)

    useEffect(() => {
        const t = setInterval(() => {
            if (!countdownRef.current) return
            secondsLeftRef.current -= 10
            countdownRef.current.innerText = secondsLeftRef.current < 60 ? "< 1 MINUTE" : `~ ${Math.round(secondsLeftRef.current / 60)} MINUTES`
        }, 1000 * 10) // Every 10 seconds

        return () => clearInterval(t)
    }, [battleETASeconds])

    return <Box ref={countdownRef}>{battleETASeconds < 60 ? "< 1 MINUTE" : `~ ${Math.round(battleETASeconds / 60)} MINUTES`}</Box>
}
