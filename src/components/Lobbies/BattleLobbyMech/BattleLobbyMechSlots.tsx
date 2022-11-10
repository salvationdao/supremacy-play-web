import { Box, Button, IconButton, Stack, Typography } from "@mui/material"
import React, { useCallback, useMemo, useState } from "react"
import { SvgLogout, SvgPlus, SvgUnhide } from "../../../assets"
import { useAuth, useGlobalNotifications, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets } from "../../../helpers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Faction } from "../../../types"
import { BattleLobbiesMech, BattleLobbySupporter } from "../../../types/battle_queue"
import { ConfirmModal } from "../../Common/Deprecated/ConfirmModal"
import { WeaponSlot } from "../Common/weaponSlot"
import { MechBarStats } from "../../Hangar/WarMachinesHangar/Common/MechBarStats"
import { TruncateTextLines } from "../../../theme/styles"
import { useHistory } from "react-router-dom"

export interface BattleLobbyFaction {
    faction: Faction
    mechSlots: BattleLobbiesMech[] // null represents empty slot
    supporterSlots: BattleLobbySupporter[] // null represents empty slot
}

interface MyFactionLobbySlotsProps {
    factionLobby: BattleLobbyFaction
    isLocked: boolean
    onSlotClick: () => void
}

export const MyFactionLobbySlots = ({ factionLobby, isLocked, onSlotClick }: MyFactionLobbySlotsProps) => {
    const theme = useTheme()
    const { userID } = useAuth()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { getFaction } = useSupremacy()
    const history = useHistory()

    // Leaving lobby
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [leftMechID, setLeftMechID] = useState("")

    const mechSlots = useMemo(() => {
        const list: (BattleLobbiesMech | null)[] = [...factionLobby.mechSlots]

        while (list.length < 3) {
            list.push(null)
        }

        return list
    }, [factionLobby.mechSlots])

    const leaveLobby = useCallback(
        async (mechID: string) => {
            try {
                await send(GameServerKeys.LeaveBattleLobby, {
                    mech_ids: [mechID],
                })
                setLeftMechID("")
                newSnackbarMessage("Successfully removed mech from lobby.", "success")
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to leave battle lobby.", "error")
            }
        },
        [newSnackbarMessage, send],
    )

    return (
        <>
            {mechSlots.map((ms, index) => {
                if (!ms) {
                    return (
                        <Button
                            key={index}
                            onClick={() => onSlotClick()}
                            disabled={isLocked}
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                padding: "1rem",
                                height: "30rem",
                                borderRadius: 0,
                                backgroundColor: `${colors.offWhite}20`,
                            }}
                        >
                            <SvgPlus
                                size="40px"
                                fill={`${colors.offWhite}30`}
                                sx={{
                                    padding: "2.5rem",
                                    backgroundColor: `${colors.offWhite}10`,
                                    borderRadius: "50%",
                                }}
                            />
                            <Typography
                                display="block"
                                sx={{
                                    mt: "1rem",
                                    color: `${colors.offWhite}30`,
                                }}
                            >
                                DEPLOY MECH
                            </Typography>
                        </Button>
                    )
                }

                const rarity = getRarityDeets(ms.tier)

                return (
                    <Stack
                        key={index}
                        sx={{
                            flex: 1,
                            padding: "1rem",
                            alignItems: "start",
                            textAlign: "initial",
                            height: "30rem",
                            borderRadius: 0,
                            backgroundColor: `${colors.offWhite}20`,
                            border: ms?.queued_by?.id === userID ? `${colors.gold}BB 2px solid` : undefined,
                        }}
                        spacing={0.8}
                    >
                        <Stack direction="row" spacing="1rem" sx={{ width: "100%" }}>
                            <Box
                                sx={{
                                    position: "relative",
                                    height: "9rem",
                                    width: "9rem",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={ms.avatar_url}
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        left: "50%",
                                        bottom: 0,
                                        width: "100%",
                                        transform: "translate(-50%, 0)",
                                        backgroundColor: `${factionLobby.faction.background_color}dd`,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "1.2rem",
                                            fontFamily: fonts.nostromoMedium,
                                            textTransform: "uppercase",
                                            textAlign: "center",
                                            color: rarity.color,
                                        }}
                                    >
                                        {rarity.label}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        position: "absolute",
                                        left: "1%",
                                        top: "1%",
                                        backgroundColor: `${factionLobby.faction.background_color}30`,
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        history.push(`/mech/${ms.mech_id}`)
                                    }}
                                >
                                    <SvgUnhide size="1.5rem" fill={`${colors.offWhite}DD`} />
                                </Box>
                            </Box>
                            <Stack flex={1} sx={{ position: "relative" }}>
                                <Stack direction="row" spacing=".5rem" mb=".5rem">
                                    {ms.weapon_slots.map((ws) => (
                                        <WeaponSlot key={ws.slot_number} weaponSlot={ws} tooltipPlacement={"top-end"} size="3rem" />
                                    ))}
                                </Stack>
                                {!isLocked && ms.queued_by?.id === userID && (
                                    <Box sx={{ position: "absolute", right: 0, top: 0, transform: "translate(40%, -20%)" }}>
                                        <IconButton size="small" onClick={() => setLeftMechID(ms?.mech_id || "")}>
                                            <SvgLogout size="1.5rem" />
                                        </IconButton>
                                    </Box>
                                )}

                                <Typography
                                    variant="h6"
                                    sx={{
                                        ...TruncateTextLines(1),
                                        textTransform: "uppercase",
                                        fontWeight: "bold",
                                        color: `#ffffff`,
                                        letterSpacing: 1.1,
                                    }}
                                >
                                    {ms.name || ms.label}
                                </Typography>
                                {ms.queued_by && (
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            ...TruncateTextLines(1),
                                            color: `${getFaction(ms.faction_id).primary_color}`,
                                            fontStyle: "italic",
                                        }}
                                    >
                                        {`@${ms.queued_by.username}#${ms.queued_by.gid}`}
                                    </Typography>
                                )}
                            </Stack>
                        </Stack>

                        <MechBarStats
                            mech={ms}
                            color={theme.factionTheme.primary}
                            fontSize="1.3rem"
                            width="100%"
                            spacing=".45rem"
                            barHeight=".8rem"
                            compact
                            outerSx={{ flex: 1, width: "100%" }}
                        />
                        {!isLocked && ms.queued_by?.id === userID && leftMechID === ms.mech_id && (
                            <ConfirmModal title="Confirm Removal" onConfirm={() => leaveLobby(ms.mech_id)} onClose={() => setLeftMechID("")}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        "& span": {
                                            fontWeight: "bold",
                                        },
                                    }}
                                >
                                    Withdraw <span>{ms.name || ms.label}</span> from this lobby?
                                </Typography>
                            </ConfirmModal>
                        )}
                    </Stack>
                )
            })}
        </>
    )
}
