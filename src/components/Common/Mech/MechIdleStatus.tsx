import { Box, Stack, Typography } from "@mui/material"
import { MutableRefObject, useCallback, useMemo, useRef, useState } from "react"
import { SvgMoreOptions, SvgRepair } from "../../../assets"
import { useGlobalNotifications } from "../../../containers"
import { getMechStatusDeets } from "../../../helpers"
import {
    useGameServerCommandsFaction,
    useGameServerCommandsUser,
    useGameServerSubscriptionSecured,
    useGameServerSubscriptionSecuredUser,
} from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { MechStatusEnum, NewMechStruct, RepairSlot } from "../../../types"
import { RepairOffer } from "../../../types/jobs"
import { NiceButton } from "../Nice/NiceButton"
import { NicePopover } from "../Nice/NicePopover"
import { RepairModal } from "./RepairModal/RepairModal"

export const MechIdleStatus = ({ mech }: { mech: NewMechStruct }) => {
    const repairPopoverRef = useRef(null)
    const stakePopoverRef = useRef(null)
    const [isRepairPopoverOpen, setIsRepairPopoverOpen] = useState(false)
    const [isStakePopoverOpen, setIsStakePopoverOpen] = useState(false)

    const statusDeets = useMemo(() => getMechStatusDeets(mech.status), [mech.status])

    return (
        <Stack direction="row" alignItems="center" spacing=".8rem">
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

                {mech.status === MechStatusEnum.Damaged && (
                    <>
                        <Box ref={repairPopoverRef}>
                            <NiceButton sx={{ p: 0 }} onClick={() => setIsRepairPopoverOpen(true)}>
                                <SvgMoreOptions size="1.6rem" fill={statusDeets.color} />
                            </NiceButton>
                        </Box>

                        <RepairActions open={isRepairPopoverOpen} onClose={() => setIsRepairPopoverOpen(false)} popoverRef={repairPopoverRef} mech={mech} />
                    </>
                )}
            </Stack>

            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    pt: ".1rem",
                    width: "fit-content",
                    backgroundColor: `${colors.staked}30`,
                    boxShadow: 0.4,
                }}
            >
                <Typography
                    sx={{
                        p: ".1rem 1.6rem",
                        fontWeight: "bold",
                        color: mech.is_staked ? colors.staked : colors.green,
                    }}
                >
                    {mech.is_staked ? "STAKED" : "NOT STAKED"}
                </Typography>

                <Box ref={stakePopoverRef}>
                    <NiceButton sx={{ p: 0 }} onClick={() => setIsStakePopoverOpen(true)}>
                        <SvgMoreOptions size="1.6rem" fill={mech.is_staked ? colors.staked : colors.green} />
                    </NiceButton>
                </Box>

                {isStakePopoverOpen && (
                    <StakeActions open={isStakePopoverOpen} onClose={() => setIsStakePopoverOpen(false)} popoverRef={stakePopoverRef} mech={mech} />
                )}
            </Stack>
        </Stack>
    )
}

const RepairActions = ({
    open,
    popoverRef,
    onClose,
    mech,
}: {
    open: boolean
    popoverRef: MutableRefObject<null>
    onClose: () => void
    mech: NewMechStruct
}) => {
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

const StakeActions = ({ open, popoverRef, onClose, mech }: { open: boolean; popoverRef: MutableRefObject<null>; onClose: () => void; mech: NewMechStruct }) => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const stakeSelectedMechs = useCallback(
        async (mechs: NewMechStruct[]) => {
            try {
                if (mechs.length <= 0) return

                await send<boolean>(GameServerKeys.StakeMechs, {
                    mech_ids: mechs.map((mech) => mech.id),
                })
                newSnackbarMessage("Successfully added mechs to faction mech pool.", "success")
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to add mechs to faction mech pool."
                newSnackbarMessage(message, "error")
                console.error(err)
            }
        },
        [newSnackbarMessage, send],
    )

    const unstakeSelectedMechs = useCallback(
        async (mechs: NewMechStruct[]) => {
            try {
                if (mechs.length <= 0) return

                await send<boolean>(GameServerKeys.UnstakeMechs, {
                    mech_ids: mechs.map((mech) => mech.id),
                })
                newSnackbarMessage("Successfully removed mechs from faction mech pool.", "success")
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to remove mechs from faction mech pool."
                newSnackbarMessage(message, "error")
                console.error(err)
            }
        },
        [newSnackbarMessage, send],
    )

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
                    {mech.is_staked ? (
                        <NiceButton
                            sx={{ justifyContent: "flex-start" }}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                unstakeSelectedMechs([mech])
                                onClose()
                            }}
                        >
                            UNSTAKE
                        </NiceButton>
                    ) : (
                        <NiceButton
                            sx={{ justifyContent: "flex-start" }}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                stakeSelectedMechs([mech])
                                onClose()
                            }}
                        >
                            STAKE
                        </NiceButton>
                    )}
                </Stack>
            </NicePopover>
        </>
    )
}
