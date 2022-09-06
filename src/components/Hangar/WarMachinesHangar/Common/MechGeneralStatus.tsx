import { Stack, Typography } from "@mui/material"
import { useCallback, useRef, useState } from "react"
import { SvgRepair } from "../../../../assets"
import { useGlobalNotifications } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import {
    useGameServerCommandsFaction,
    useGameServerCommandsUser,
    useGameServerSubscriptionFaction,
    useGameServerSubscriptionSecured,
    useGameServerSubscriptionSecuredUser,
} from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MechDetails, MechStatus, MechStatusEnum, RepairSlot } from "../../../../types"
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
    showButtons,
}: {
    mechID: string
    hideBox?: boolean
    smallVersion?: boolean
    mechDetails?: MechDetails
    onStatusLoaded?: (mechStatus: MechStatus) => void
    onRepairOfferLoaded?: (repairOffer: RepairOffer) => void
    setPrimaryColor?: React.Dispatch<React.SetStateAction<string>>
    showButtons?: boolean
}) => {
    const theme = useTheme()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { send: sendUser } = useGameServerCommandsUser("/user_commander")
    const [mechStatus, setMechStatus] = useState<MechStatus>()
    const textValue = useRef("LOADING...")
    const [color, setColour] = useState(theme.factionTheme.primary)
    const [repairMechModalOpen, setRepairMechModalOpen] = useState<boolean>(false)
    const [repairOffer, setRepairOffer] = useState<RepairOffer>()
    const [defaultOpenSelfRepair, setDefaultOpenSelfRepair] = useState(false)
    const [isInRepairBay, setIsInRepairBay] = useState(false)

    // Subscribe on the mech's repair job listed
    useGameServerSubscriptionSecured<RepairOffer>(
        {
            URI: `/mech/${mechID}/active_repair_offer`,
            key: GameServerKeys.GetMechRepairJob,
            ready: mechStatus?.status === MechStatusEnum.Damaged,
        },
        (payload) => {
            if (!payload || payload.closed_at) {
                setRepairOffer(undefined)
                return
            }
            setRepairOffer(payload)
            onRepairOfferLoaded && onRepairOfferLoaded(payload)
        },
    )

    // Subscribe on the repair bay
    useGameServerSubscriptionSecuredUser<RepairSlot[]>(
        {
            URI: "/repair_bay",
            key: GameServerKeys.GetRepairBaySlots,
        },
        (payload) => {
            if (!payload || payload.length <= 0) {
                setIsInRepairBay(false)
                return
            }
            setIsInRepairBay(!!payload.find((repairSlot) => repairSlot.mech_id === mechID))
        },
    )

    // Subscribe on the mech's status
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
                    if (payload.battle_eta_seconds != null) {
                        text = `> ${payload.battle_eta_seconds < 60 ? "1 MINUTE" : `${Math.ceil(payload.battle_eta_seconds / 60)} MINUTES`}`
                    }
                    color = colors.yellow
                    break
                case MechStatusEnum.Queue:
                    text = "IN QUEUE"
                    if (payload.battle_eta_seconds != null) {
                        text = `${payload.battle_eta_seconds < 60 ? "< 1 MINUTE" : `~${Math.ceil(payload.battle_eta_seconds / 60)} MINUTES`}`
                    }
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

    // Adds mech to repair bay
    const insertRepairBay = useCallback(async () => {
        try {
            await sendUser<boolean>(GameServerKeys.InsertRepairBay, {
                mech_ids: [mechID],
            })
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to insert into repair bay."
            newSnackbarMessage(message, "error")
            console.error(err)
        }
    }, [mechID, newSnackbarMessage, sendUser])

    return (
        <>
            <Stack direction="row" alignItems="center" spacing=".5rem" sx={{ flexShrink: 0 }}>
                <Stack
                    spacing=".8rem"
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
                        {textValue.current}
                    </Typography>

                    {showButtons && (
                        <Stack direction="row" alignItems="center" spacing=".5rem" sx={{ pb: ".4rem" }}>
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
                                        backgroundColor: repairOffer ? "unset" : colors.blue2,
                                        border: repairOffer ? `${colors.blue2} 1px solid` : "unset",
                                        borderRadius: 0.5,
                                        ":hover": { transform: "scale(1.05)" },
                                    }}
                                >
                                    <SvgRepair size="1.1rem" fill={repairOffer ? colors.blue2 : "#FFFFFF"} />
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            color: repairOffer ? colors.blue2 : "#FFFFFF",
                                            whiteSpace: "nowrap",
                                            lineHeight: 1,
                                            fontWeight: "fontWeightBold",
                                        }}
                                    >
                                        {repairOffer ? "JOB POSTED" : "POST JOB"}
                                    </Typography>
                                </Stack>
                            )}

                            {mechDetails && mechStatus?.status === MechStatusEnum.Damaged && (
                                <Stack
                                    direction="row"
                                    spacing=".3rem"
                                    alignItems="center"
                                    sx={{
                                        p: ".1rem .6rem",
                                        pt: ".2rem",
                                        opacity: isInRepairBay ? 0.6 : 1,
                                        backgroundColor: isInRepairBay ? "unset" : colors.bronze,
                                        border: isInRepairBay ? `${colors.bronze} 1px solid` : "unset",
                                        borderRadius: 0.5,
                                        ":hover": { transform: "scale(1.05)" },
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        insertRepairBay()
                                    }}
                                >
                                    <SvgRepair size="1.1rem" fill={isInRepairBay ? colors.bronze : "#FFFFFF"} />
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            color: isInRepairBay ? colors.bronze : "#FFFFFF",
                                            whiteSpace: "nowrap",
                                            lineHeight: 1,
                                            fontWeight: "fontWeightBold",
                                        }}
                                    >
                                        REPAIR BAY
                                    </Typography>
                                </Stack>
                            )}
                        </Stack>
                    )}
                </Stack>
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
