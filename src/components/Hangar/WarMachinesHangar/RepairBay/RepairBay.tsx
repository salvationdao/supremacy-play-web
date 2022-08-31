import { Box, Stack } from "@mui/material"
import { useCallback, useState } from "react"
import { useGlobalNotifications } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsUser, useGameServerSubscriptionSecuredUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { ClipThing } from "../../../Common/ClipThing"

interface RepairSlot {
    id: string
    player_id: string
    mech_id: string
    repair_case_id: string
    status: string
    next_repair_time: Date
    slot_number: number
}

export const RepairBay = () => {
    const theme = useTheme()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [repairSlots, setRepairSlots] = useState<RepairSlot[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>()

    useGameServerSubscriptionSecuredUser<RepairSlot[]>(
        {
            URI: "/repair_bay",
            key: GameServerKeys.GetRepairBaySlots,
        },
        (payload) => {
            if (!payload) return
            setRepairSlots(payload)
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
            opacity={0.7}
            backgroundColor={backgroundColor}
            sx={{ height: "100%", width: "38rem", ml: "1rem" }}
        >
            <Stack sx={{ height: "100%" }}>
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
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
                            background: primaryColor,
                            borderRadius: 3,
                        },
                    }}
                >
                    <Stack sx={{ position: "relative", height: 0, mt: "-.3rem", mx: "-.3rem" }}></Stack>
                </Box>
            </Stack>
        </ClipThing>
    )
}
