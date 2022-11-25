import { Stack, Typography } from "@mui/material"
import React, { MutableRefObject, useCallback, useMemo, useRef, useState } from "react"
import { useGlobalNotifications } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsFaction, useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MechStatusEnum, NewMechStruct } from "../../../types"
import { NiceButton } from "../Nice/NiceButton"
import { NiceModal } from "../Nice/NiceModal"
import { NicePopover } from "../Nice/NicePopover"
import { RepairBlocks } from "./MechRepairBlocks"
import { HireContractorsCard } from "./RepairModal/HireContractorsCard"

export const MechBulkActions = React.memo(function MechBulkActions({
    selectedMechs,
    setSelectedMechs,
}: {
    selectedMechs: NewMechStruct[]
    setSelectedMechs: React.Dispatch<React.SetStateAction<NewMechStruct[]>>
}) {
    const theme = useTheme()
    const [isBulkPopoverOpen, setIsBulkPopoverOpen] = useState(false)
    const bulkPopoverRef = useRef(null)

    return (
        <>
            <NiceButton
                ref={bulkPopoverRef}
                buttonColor={theme.factionTheme.primary}
                sx={{ p: ".2rem 1rem", pt: ".4rem" }}
                disabled={selectedMechs.length <= 0}
                onClick={() => setIsBulkPopoverOpen(true)}
            >
                <Typography variant="subtitle1" fontFamily={fonts.nostromoBold}>
                    Actions ({selectedMechs.length})
                </Typography>
            </NiceButton>

            <BulkActionPopover
                open={isBulkPopoverOpen}
                onClose={() => setIsBulkPopoverOpen(false)}
                popoverRef={bulkPopoverRef}
                selectedMechs={selectedMechs}
                setSelectedMechs={setSelectedMechs}
            />
        </>
    )
})

const BulkActionPopover = ({
    open,
    onClose,
    popoverRef,
    selectedMechs,
    setSelectedMechs,
}: {
    open: boolean
    onClose: () => void
    popoverRef: MutableRefObject<null>
    selectedMechs: NewMechStruct[]
    setSelectedMechs: React.Dispatch<React.SetStateAction<NewMechStruct[]>>
}) => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")
    const { send: sendFaction } = useGameServerCommandsFaction("/faction_commander")
    const [bulkRepairModalOpen, setBulkRepairModalOpen] = useState(false)

    const stakeSelectedMechs = useCallback(
        async (mechs: NewMechStruct[]) => {
            try {
                if (mechs.length <= 0) return

                await sendFaction<boolean>(GameServerKeys.StakeMechs, {
                    mech_ids: mechs.map((mech) => mech.id),
                })
                setSelectedMechs([])
                newSnackbarMessage("Successfully added mechs to faction mech pool.", "success")
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to add mechs to faction mech pool."
                newSnackbarMessage(message, "error")
                console.error(err)
            }
        },
        [newSnackbarMessage, sendFaction, setSelectedMechs],
    )

    const unstakeSelectedMechs = useCallback(
        async (mechs: NewMechStruct[]) => {
            try {
                if (mechs.length <= 0) return

                await sendFaction<boolean>(GameServerKeys.UnstakeMechs, {
                    mech_ids: mechs.map((mech) => mech.id),
                })
                setSelectedMechs([])
                newSnackbarMessage("Successfully removed mechs from faction mech pool.", "success")
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to remove mechs from faction mech pool."
                newSnackbarMessage(message, "error")
                console.error(err)
            }
        },
        [newSnackbarMessage, sendFaction, setSelectedMechs],
    )

    const insertMechsToRepairBay = useCallback(
        async (mechs: NewMechStruct[]) => {
            try {
                if (mechs.length <= 0) return

                await send<boolean>(GameServerKeys.InsertRepairBay, {
                    mech_ids: mechs.map((mech) => mech.id),
                })
                setSelectedMechs([])
                newSnackbarMessage("Successfully added mechs to repair bay.", "success")
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to insert mech to repair bay."
                newSnackbarMessage(message, "error")
                console.error(err)
            }
        },
        [newSnackbarMessage, send, setSelectedMechs],
    )

    return (
        <>
            <NicePopover open={open} anchorEl={popoverRef.current} onClose={onClose}>
                <Stack>
                    <NiceButton
                        disabled={selectedMechs.length <= 0}
                        sx={{ justifyContent: "flex-start" }}
                        onClick={() => {
                            stakeSelectedMechs(selectedMechs)
                            onClose()
                        }}
                    >
                        STAKE SELECTED
                    </NiceButton>
                    <NiceButton
                        disabled={selectedMechs.length <= 0}
                        sx={{ justifyContent: "flex-start" }}
                        onClick={() => {
                            unstakeSelectedMechs(selectedMechs)
                            onClose()
                        }}
                    >
                        UNSTAKE SELECTED
                    </NiceButton>

                    <NiceButton
                        disabled={selectedMechs.length <= 0}
                        sx={{ justifyContent: "flex-start" }}
                        onClick={() => {
                            insertMechsToRepairBay(selectedMechs)
                            onClose()
                        }}
                    >
                        SEND TO REPAIR BAY
                    </NiceButton>

                    <NiceButton
                        disabled={selectedMechs.length <= 0}
                        sx={{ justifyContent: "flex-start" }}
                        onClick={() => {
                            setBulkRepairModalOpen(true)
                            onClose()
                        }}
                    >
                        CREATE REPAIR JOBS
                    </NiceButton>
                </Stack>
            </NicePopover>

            <BulkRepairModal
                open={bulkRepairModalOpen}
                onClose={() => setBulkRepairModalOpen(false)}
                selectedMechs={selectedMechs}
                setSelectedMechs={setSelectedMechs}
            />
        </>
    )
}

const BulkRepairModal = ({
    open,
    onClose,
    selectedMechs,
    setSelectedMechs,
}: {
    open: boolean
    onClose: () => void
    selectedMechs: NewMechStruct[]
    setSelectedMechs: React.Dispatch<React.SetStateAction<NewMechStruct[]>>
}) => {
    const validMechs = useMemo(() => selectedMechs.filter((mech) => mech.status === MechStatusEnum.Damaged && !mech.has_repair_offer), [selectedMechs])

    const remainDamagedBlocks = useMemo(
        () =>
            validMechs.reduce((acc, mech) => {
                return (acc += mech.damaged_blocks)
            }, 0),
        [validMechs],
    )

    return (
        <NiceModal open={open} onClose={onClose} sx={{ p: "1.8rem 2.5rem", maxHeight: "calc(100vh - 5rem)", width: "50rem" }}>
            <Stack spacing="1.5rem">
                <Stack>
                    <Typography variant="h5" sx={{ fontFamily: fonts.nostromoHeavy }}>
                        BULK REPAIR
                    </Typography>

                    <Typography sx={{ mb: ".2rem", color: colors.red, fontFamily: fonts.nostromoBlack }}>{remainDamagedBlocks} x DAMAGED BLOCKS</Typography>

                    <RepairBlocks defaultBlocks={remainDamagedBlocks} remainDamagedBlocks={remainDamagedBlocks} />
                </Stack>

                {remainDamagedBlocks > 0 ? (
                    <HireContractorsCard
                        mechs={validMechs}
                        remainDamagedBlocks={remainDamagedBlocks}
                        onClose={onClose}
                        onSubmitted={() => setSelectedMechs([])}
                    />
                ) : (
                    <Typography variant="body2" fontFamily={fonts.nostromoBold} color={colors.grey}>
                        The mechs you have selected are not damaged...
                    </Typography>
                )}
            </Stack>
        </NiceModal>
    )
}
