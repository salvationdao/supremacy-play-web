import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import FlipMove from "react-flip-move"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsUser, useGameServerSubscriptionSecuredUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { MechBasic, RepairSlot } from "../../../../types"
import { ClipThing } from "../../../Common/Deprecated/ClipThing"
import { FancyButton } from "../../../Common/Deprecated/FancyButton"
import { EmptyRepairBayItem, RepairBayItem } from "../../../FleetMechs/RepairBay/RepairBayItem"

const REPAIR_BAY_SLOTS_MAX = 5

export const RepairBay = ({
    selectedMechs,
    setSelectedMechs,
}: {
    selectedMechs: MechBasic[]
    setSelectedMechs: React.Dispatch<React.SetStateAction<MechBasic[]>>
}) => {
    const theme = useTheme()
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
            const sortedPayload = payload.sort((a, b) => (a.slot_number > b.slot_number ? 1 : -1))
            setRepairSlots(sortedPayload)
        },
    )

    const insertRepairBay = useCallback(async () => {
        try {
            if (selectedMechs.length <= 0) return

            setIsLoading(true)
            await send<boolean>(GameServerKeys.InsertRepairBay, {
                mech_ids: selectedMechs.map((mech) => mech.id),
            })
            setSelectedMechs([])
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to insert into repair bay."
            setError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [selectedMechs, send, setSelectedMechs])

    const removeRepairBay = useCallback(
        async (mechIDs: string[]) => {
            try {
                await send<boolean>(GameServerKeys.RemoveRepairBay, {
                    mech_ids: mechIDs,
                })
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to remove from repair bay."
                setError(message)
                console.error(err)
            }
        },
        [send],
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
                setError(message)
                console.error(err)
            }
        },
        [send],
    )

    const activeRepairSlot = useMemo(() => (repairSlots ? repairSlots[0] : undefined), [repairSlots])
    const queuedRepairSlots = useMemo(() => repairSlots?.slice(1), [repairSlots])
    const emptySlotsToRender = useMemo(() => REPAIR_BAY_SLOTS_MAX - (repairSlots?.length || 0), [repairSlots])

    const primaryColor = colors.bronze
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
                        sx={{ m: "-.3rem", p: "1.3rem" }}
                    >
                        <Typography sx={{ textAlign: "center", fontFamily: fonts.nostromoBlack }}>ACTIVE REPAIR BAY</Typography>
                    </ClipThing>

                    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "20rem", p: "2rem 1.3rem" }}>
                        {activeRepairSlot ? (
                            <RepairBayItem
                                isBigVersion
                                repairSlot={activeRepairSlot}
                                belowSlot={queuedRepairSlots ? queuedRepairSlots[0] : undefined}
                                removeRepairBay={removeRepairBay}
                                swapRepairBay={swapRepairBay}
                            />
                        ) : (
                            <Typography variant="body2" sx={{ color: colors.grey, textAlign: "center", fontFamily: fonts.nostromoBold }}>
                                Repair bay is not being used.
                            </Typography>
                        )}
                    </Stack>
                </Stack>

                {/* Queue */}
                <Stack sx={{ flex: 1 }}>
                    <ClipThing
                        clipSize="10px"
                        corners={{ topLeft: true, topRight: true }}
                        border={{
                            borderColor: primaryColor,
                            borderThickness: ".3rem",
                        }}
                        backgroundColor={primaryColor}
                        sx={{ m: "-.3rem", p: "1.3rem" }}
                    >
                        <Typography sx={{ textAlign: "center", fontFamily: fonts.nostromoBlack }}>REPAIR BAY QUEUE</Typography>
                    </ClipThing>

                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
                            ml: "1.3rem",
                            mr: ".5rem",
                            pr: ".8rem",
                            my: "1.6rem",
                            direction: "ltr",
                            scrollbarWidth: "none",
                        }}
                    >
                        <Box sx={{ direction: "ltr", height: 0 }}>
                            <Stack>
                                <FlipMove>
                                    {queuedRepairSlots &&
                                        queuedRepairSlots.map((repairSlot, index) => {
                                            const aboveSlot = queuedRepairSlots[index - 1] || activeRepairSlot
                                            const belowSlot = queuedRepairSlots[index + 1]

                                            return (
                                                <div key={repairSlot.id} style={{ width: "100%", marginBottom: "1rem" }}>
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
                                            <div key={index} style={{ width: "100%", marginBottom: "1rem" }}>
                                                <EmptyRepairBayItem />
                                            </div>
                                        ))}
                                </FlipMove>
                            </Stack>
                        </Box>
                    </Box>

                    {/* Bottom buttons */}
                    <Stack spacing=".8rem" sx={{ p: "1rem", pt: 0 }}>
                        {error && <Typography sx={{ color: colors.red }}>{error}</Typography>}

                        <FancyButton
                            disabled={selectedMechs.length <= 0}
                            loading={isLoading}
                            clipThingsProps={{
                                clipSize: "6px",
                                clipSlantSize: "0px",
                                corners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
                                backgroundColor: colors.bronze,
                                border: { isFancy: true, borderColor: colors.bronze, borderThickness: "1.5px" },
                                sx: { position: "relative", minWidth: "10rem" },
                            }}
                            sx={{ px: "1.3rem", py: "1.2rem", color: "#FFFFFF" }}
                            onClick={insertRepairBay}
                        >
                            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                INSERT SELECTED MECHS
                            </Typography>
                        </FancyButton>
                    </Stack>
                </Stack>
            </Stack>
        </ClipThing>
    )
}
