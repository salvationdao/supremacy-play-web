import { Box, Stack, Typography } from "@mui/material"
import { MutableRefObject, useCallback, useMemo, useRef, useState } from "react"
import { SvgMoreOptions, SvgRepair } from "../../../assets"
import { useGlobalNotifications } from "../../../containers"
import { getMechStatusDeets } from "../../../helpers"
import {
    useGameServerCommandsUser,
    useGameServerSubscriptionFaction,
    useGameServerSubscriptionSecured,
    useGameServerSubscriptionSecuredUser,
} from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { LobbyMech, MechStatus, MechStatusEnum, RepairSlot } from "../../../types"
import { RepairOffer } from "../../../types/jobs"
import { RepairModal } from "./RepairModal/RepairModal"
import { NiceButton } from "../Nice/NiceButton"
import { NicePopover } from "../Nice/NicePopover"

export const MechIdleStatus = ({ mech }: { mech: LobbyMech }) => {
    const [mechStatus, setMechStatus] = useState<MechStatusEnum>(mech.status)

    const popoverRef = useRef(null)
    const [isActionsPopoverOpen, setIsActionsPopoverOpen] = useState(false)

    // Subscribe on the mech's status
    useGameServerSubscriptionFaction<MechStatus>(
        {
            URI: `/queue/${mech.id}`,
            key: GameServerKeys.SubMechQueuePosition,
        },
        (payload) => {
            if (!payload) return
            setMechStatus(payload.status)
        },
    )

    const statusDeets = useMemo(() => getMechStatusDeets(mechStatus), [mechStatus])

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    pt: ".1rem",
                    width: "fit-content",
                    backgroundColor: `${statusDeets.color}30`,
                    boxShadow: 0.4,
                }}
            >
                <Typography
                    sx={{
                        p: ".1rem 1.6rem",
                        fontWeight: "bold",
                        color: statusDeets.color,
                    }}
                >
                    {statusDeets.label}
                </Typography>

                {mechStatus === MechStatusEnum.Damaged && (
                    <>
                        <Box ref={popoverRef}>
                            <NiceButton sx={{ p: 0 }} onClick={() => setIsActionsPopoverOpen(true)}>
                                <SvgMoreOptions size="1.6rem" fill={statusDeets.color} />
                            </NiceButton>
                        </Box>

                        <RepairActions open={isActionsPopoverOpen} onClose={() => setIsActionsPopoverOpen(false)} popoverRef={popoverRef} mech={mech} />
                    </>
                )}
            </Stack>
        </>
    )
}

const RepairActions = ({ open, popoverRef, onClose, mech }: { open: boolean; popoverRef: MutableRefObject<null>; onClose: () => void; mech: LobbyMech }) => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")

    const [repairMechModalOpen, setRepairMechModalOpen] = useState<boolean>(false)
    const [hasRepairOffer, setHasRepairOffer] = useState(false)
    const [defaultOpenSelfRepair, setDefaultOpenSelfRepair] = useState(false)
    const [isInRepairBay, setIsInRepairBay] = useState(false)

    // Subscribe on the mech's repair job listed
    useGameServerSubscriptionSecured<RepairOffer>(
        {
            URI: `/mech/${mech.id}/active_repair_offer`,
            key: GameServerKeys.GetMechRepairJob,
        },
        (payload) => {
            if (!payload || payload.closed_at) {
                setHasRepairOffer(false)
                return
            }
            setHasRepairOffer(true)
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
            setIsInRepairBay(!!payload.find((repairSlot) => repairSlot.mech_id === mech.id))
        },
    )

    // Adds mech to repair bay
    const insertMechToRepairBay = useCallback(async () => {
        try {
            await send<boolean>(GameServerKeys.InsertRepairBay, {
                mech_ids: [mech.id],
            })
            newSnackbarMessage("Successfully added mech to repair bay.", "success")
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to insert mech to repair bay."
            newSnackbarMessage(message, "error")
            console.error(err)
        }
    }, [mech.id, newSnackbarMessage, send])

    return (
        <>
            <NicePopover
                open={open}
                anchorEl={popoverRef.current}
                onClose={onClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <Stack>
                    <NiceButton
                        sx={{ justifyContent: "flex-start" }}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setDefaultOpenSelfRepair(true)
                            setRepairMechModalOpen(true)
                            onClose()
                        }}
                    >
                        <SvgRepair inline size="1.3rem" /> SELF REPAIR
                    </NiceButton>

                    <NiceButton
                        disabled={hasRepairOffer}
                        sx={{ justifyContent: "flex-start" }}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setDefaultOpenSelfRepair(false)
                            setRepairMechModalOpen(true)
                            onClose()
                        }}
                    >
                        <SvgRepair inline size="1.3rem" /> POST REPAIR JOB
                    </NiceButton>

                    <NiceButton
                        disabled={isInRepairBay}
                        sx={{ justifyContent: "flex-start" }}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            insertMechToRepairBay()
                            onClose()
                        }}
                    >
                        <SvgRepair inline size="1.3rem" /> SEND TO REPAIR BAY
                    </NiceButton>
                </Stack>
            </NicePopover>

            {repairMechModalOpen && (
                <RepairModal
                    defaultOpenSelfRepair={defaultOpenSelfRepair}
                    mech={mech}
                    repairMechModalOpen={repairMechModalOpen}
                    setRepairMechModalOpen={setRepairMechModalOpen}
                />
            )}
        </>
    )
}
