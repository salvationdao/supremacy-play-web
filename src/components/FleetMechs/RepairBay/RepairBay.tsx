import { Box, Stack, Typography } from "@mui/material"
import React, { useCallback, useMemo, useState } from "react"
import FlipMove from "react-flip-move"
import { useGlobalNotifications } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsUser, useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { RepairSlot } from "../../../types"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { EmptyRepairBayItem, RepairBayItem } from "./RepairBayItem"

const REPAIR_BAY_SLOTS_MAX = 5

export const RepairBay = React.memo(function RepairBay({ open }: { open: boolean }) {
    const theme = useTheme()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [repairSlots, setRepairSlots] = useState<RepairSlot[]>([])

    useGameServerSubscriptionSecuredUser<RepairSlot[]>(
        {
            URI: "/repair_bay",
            key: GameServerKeys.GetRepairBaySlots,
        },
        (payload) => {
            if (!payload || payload.length <= 0) {
                setRepairSlots([])
                return
            }
            const sortedPayload = payload.sort((a, b) => (a.slot_number > b.slot_number ? 1 : -1))
            setRepairSlots(sortedPayload)
        },
    )

    const removeRepairBay = useCallback(
        async (mechIDs: string[]) => {
            try {
                await send<boolean>(GameServerKeys.RemoveRepairBay, {
                    mech_ids: mechIDs,
                })
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to remove from repair bay."
                newSnackbarMessage(message, "error")
                console.error(err)
            }
        },
        [newSnackbarMessage, send],
    )

    const swapRepairBay = useCallback(
        async (mechIDs: [string, string]) => {
            try {
                await send<boolean>(GameServerKeys.SwapRepairBay, {
                    from_mech_id: mechIDs[0],
                    to_mech_id: mechIDs[1],
                })
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to swap repair bay slots."
                newSnackbarMessage(message, "error")
                console.error(err)
            }
        },
        [newSnackbarMessage, send],
    )

    const activeRepairSlot = useMemo(() => (repairSlots ? repairSlots[0] : undefined), [repairSlots])
    const queuedRepairSlots = useMemo(() => repairSlots?.slice(1), [repairSlots])
    const emptySlotsToRender = useMemo(() => REPAIR_BAY_SLOTS_MAX - (repairSlots?.length || 0), [repairSlots])

    const primaryColor = colors.repair
    const backgroundColor = theme.factionTheme.background

    return (
        <NiceBoxThing
            border={{ color: primaryColor, thickness: "very-lean" }}
            background={{ colors: [backgroundColor], opacity: 0.06 }}
            sx={{
                visibility: open ? "visible" : "hidden",
                width: open ? "38rem" : 0,
                opacity: open ? 1 : 0,
                ml: open ? "2.5rem" : 0,
                overflowY: "hidden",
                transition: "all .3s",
                flexShrink: 0,
            }}
        >
            <Stack height="100%">
                {/* Active bay */}
                <Stack>
                    <Typography sx={{ p: "1rem 1.5rem", backgroundColor: primaryColor, fontFamily: fonts.nostromoBlack }}>ACTIVE REPAIR BAY</Typography>

                    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "20rem", p: "1.8rem" }}>
                        {activeRepairSlot ? (
                            <RepairBayItem
                                repairSlot={activeRepairSlot}
                                belowSlot={queuedRepairSlots ? queuedRepairSlots[0] : undefined}
                                removeRepairBay={removeRepairBay}
                                swapRepairBay={swapRepairBay}
                            />
                        ) : (
                            <EmptyRepairBayItem isBigVersion />
                        )}
                    </Stack>
                </Stack>

                {/* Queue */}
                <Stack flex={1} overflow="hidden">
                    <Typography sx={{ p: "1rem 1.5rem", backgroundColor: primaryColor, fontFamily: fonts.nostromoBlack }}>REPAIR BAY QUEUE</Typography>

                    <Box
                        sx={{
                            flex: 1,
                            p: "1.8rem",
                            overflowY: "auto",
                            overflowX: "hidden",
                        }}
                    >
                        <FlipMove>
                            {queuedRepairSlots &&
                                queuedRepairSlots.map((repairSlot, index) => {
                                    const aboveSlot = queuedRepairSlots[index - 1] || activeRepairSlot
                                    const belowSlot = queuedRepairSlots[index + 1]

                                    return (
                                        <div key={repairSlot.id} style={{ width: "100%", marginBottom: "1.5rem" }}>
                                            <RepairBayItem
                                                repairSlot={repairSlot}
                                                belowSlot={belowSlot}
                                                aboveSlot={aboveSlot}
                                                removeRepairBay={removeRepairBay}
                                                swapRepairBay={swapRepairBay}
                                            />
                                        </div>
                                    )
                                })}

                            {emptySlotsToRender > 0 &&
                                new Array(emptySlotsToRender).fill(0).map((_, index) => (
                                    <div key={index} style={{ width: "100%", marginBottom: "1.5rem" }}>
                                        <EmptyRepairBayItem />
                                    </div>
                                ))}
                        </FlipMove>
                    </Box>
                </Stack>
            </Stack>
        </NiceBoxThing>
    )
})
