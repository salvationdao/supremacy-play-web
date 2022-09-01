import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { useGlobalNotifications } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsUser, useGameServerSubscriptionSecuredUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { RepairSlot } from "../../../../types"
import { ClipThing } from "../../../Common/ClipThing"
import { EmptyRepairBayItem, RepairBayItem } from "./RepairBayItem"

const REPAIR_BAY_SLOTS_MAX = 5

export const RepairBay = () => {
    const theme = useTheme()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [repairSlots, setRepairSlots] = useState<RepairSlot[]>()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>()

    useGameServerSubscriptionSecuredUser<RepairSlot[]>(
        {
            URI: "/repair_bay",
            key: GameServerKeys.GetRepairBaySlots,
        },
        (payload) => {
            if (!payload || payload.length <= 0) {
                setRepairSlots(undefined)
                return
            }
            setRepairSlots(payload.sort((a, b) => (a.slot_number > b.slot_number ? 1 : -1)))
        },
    )

    const insertRepairBay = useCallback(async () => {
        try {
            setIsLoading(true)
            await send<boolean>(GameServerKeys.InsertRepairBay, {
                mech_ids: [],
            })
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to insert into repair bay."
            newSnackbarMessage(message, "error")
            setError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [newSnackbarMessage, send])

    const removeRepairBay = useCallback(async () => {
        try {
            setIsLoading(true)
            await send<boolean>(GameServerKeys.RemoveRepairBay, {
                mech_ids: [],
            })
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to remove from repair bay."
            newSnackbarMessage(message, "error")
            setError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [newSnackbarMessage, send])

    const swapRepairBay = useCallback(async () => {
        try {
            setIsLoading(true)
            await send<boolean>(GameServerKeys.SwapRepairBay, {
                from_mech_id: "",
                to_mech_id: "",
            })
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to swap repair bay slots."
            newSnackbarMessage(message, "error")
            setError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [newSnackbarMessage, send])

    const activeRepairSlot = useMemo(() => (repairSlots ? repairSlots[0] : undefined), [repairSlots])
    const queuedRepairSlots = useMemo(() => repairSlots?.slice(1), [repairSlots])
    const emptySlotsToRender = useMemo(() => REPAIR_BAY_SLOTS_MAX - (repairSlots?.length || 0), [repairSlots])

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: primaryColor,
                borderThickness: ".3rem",
            }}
            opacity={0.8}
            backgroundColor={backgroundColor}
            sx={{ height: "100%", width: "38rem", ml: "1rem" }}
        >
            <Stack sx={{ height: "100%" }}>
                {/* Active bay */}
                <Stack>
                    <ClipThing
                        clipSize="10px"
                        corners={{ topLeft: true, topRight: true }}
                        border={{
                            borderColor: primaryColor,
                            borderThickness: ".3rem",
                        }}
                        backgroundColor={primaryColor}
                        sx={{ m: "-.3rem", p: "1rem" }}
                    >
                        <Typography sx={{ textAlign: "center", fontFamily: fonts.nostromoBlack }}>ACTIVE REPAIR BAY</Typography>
                    </ClipThing>

                    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "20rem", p: "2rem" }}>
                        {activeRepairSlot ? (
                            <RepairBayItem isBigVersion repairSlot={activeRepairSlot} />
                        ) : (
                            <Typography variant="body2" sx={{ color: colors.grey, textAlign: "center", fontFamily: fonts.nostromoBold }}>
                                No mech is using this bay.
                            </Typography>
                        )}
                    </Stack>
                </Stack>

                {/* Queue */}
                <Box sx={{ flex: 1 }}>
                    <ClipThing
                        clipSize="10px"
                        corners={{ topLeft: true, topRight: true }}
                        border={{
                            borderColor: primaryColor,
                            borderThickness: ".3rem",
                        }}
                        backgroundColor={primaryColor}
                        sx={{ m: "-.3rem", p: "1rem" }}
                    >
                        <Typography sx={{ textAlign: "center", fontFamily: fonts.nostromoBlack }}>REPAIR BAY QUEUE</Typography>
                    </ClipThing>

                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
                            ml: "1.9rem",
                            mr: ".5rem",
                            pr: "1.4rem",
                            my: "1rem",
                            direction: "ltr",
                            scrollbarWidth: "none",
                            "::-webkit-scrollbar": {
                                width: ".4rem",
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: (theme) => theme.factionTheme.primary,
                                borderRadius: 3,
                            },
                        }}
                    >
                        <Box sx={{ direction: "ltr", height: 0 }}>
                            <Stack>
                                {queuedRepairSlots &&
                                    queuedRepairSlots.map((repairSlot) => {
                                        return <RepairBayItem key={repairSlot.id} repairSlot={repairSlot} />
                                    })}

                                {emptySlotsToRender > 0 && new Array(emptySlotsToRender).fill(0).map((_, index) => <EmptyRepairBayItem key={index} />)}
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Stack>
        </ClipThing>
    )
}
