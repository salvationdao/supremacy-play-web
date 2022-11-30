import { Box, Stack, Typography } from "@mui/material"
import { MutableRefObject, useCallback, useMemo, useRef, useState } from "react"
import { SvgMoreOptions, SvgRepair } from "../../../assets"
import { useGlobalNotifications } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { getMechStatusDeets, mechHasPowerCoreAndWeapon } from "../../../helpers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { MechStatusEnum, NewMechStruct } from "../../../types"
import { NiceButton } from "../Nice/NiceButton"
import { NicePopover } from "../Nice/NicePopover"
import { NiceTooltip } from "../Nice/NiceTooltip"
import { RepairModal } from "./RepairModal/RepairModal"

export const MechIdleStatus = ({ mech, hideMoreOptionButtons }: { mech: NewMechStruct; hideMoreOptionButtons?: boolean }) => {
    const theme = useTheme()
    const repairPopoverRef = useRef(null)
    const stakePopoverRef = useRef(null)
    const [isRepairPopoverOpen, setIsRepairPopoverOpen] = useState(false)
    const [isStakePopoverOpen, setIsStakePopoverOpen] = useState(false)

    const statusDeets = useMemo(() => getMechStatusDeets(mech.status), [mech.status])

    const stakeColor = useMemo(() => (mech.is_staked ? theme.factionTheme.primary : colors.notStaked), [mech.is_staked, theme.factionTheme.primary])

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
                        whiteSpace: "nowrap",
                    }}
                >
                    {statusDeets.label}
                </Typography>

                {mech.status === MechStatusEnum.Damaged && !hideMoreOptionButtons && (
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
                    backgroundColor: `${stakeColor}30`,
                    boxShadow: 0.4,
                }}
            >
                <Typography
                    sx={{
                        p: ".1rem 1.6rem",
                        fontWeight: "bold",
                        color: stakeColor,
                        whiteSpace: "nowrap",
                    }}
                >
                    {mech.is_staked ? "STAKED" : "NOT STAKED"}
                </Typography>

                {!hideMoreOptionButtons && (
                    <>
                        <NiceTooltip enterDelay={0} text="Mech must have a Power Core and a weapon equipped" placement="right">
                            <Box ref={stakePopoverRef}>
                                <NiceButton sx={{ p: 0 }} onClick={() => setIsStakePopoverOpen(true)}>
                                    <SvgMoreOptions size="1.6rem" fill={stakeColor} />
                                </NiceButton>
                            </Box>
                        </NiceTooltip>
                        <StakeActions open={isStakePopoverOpen} onClose={() => setIsStakePopoverOpen(false)} popoverRef={stakePopoverRef} mech={mech} />
                    </>
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
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const [repairMechModalOpen, setRepairMechModalOpen] = useState<boolean>(false)
    const [defaultOpenSelfRepair, setDefaultOpenSelfRepair] = useState(false)

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
                        disabled={!!mech.has_repair_offer}
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
                        disabled={!!mech.player_mech_repair_slot_id}
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

    const isStakeable = useMemo(() => mechHasPowerCoreAndWeapon(mech), [mech])

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
                            disabled={!isStakeable}
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
