import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { SvgClose } from "../../../assets"
import { useAuth, useGlobalNotifications } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { Faction } from "../../../types"
import { BattleLobbiesMech } from "../../../types/battle_queue"
import { MechThumbnail } from "../../Hangar/WarMachinesHangar/Common/MechThumbnail"

export interface BattleLobbyFaction {
    faction: Faction
    mechSlots: BattleLobbiesMech[]
}

interface MyFactionLobbySlotsProps {
    factionSlots: BattleLobbyFaction
    isLocked: boolean
}

export const MyFactionLobbySlots = ({ factionSlots, isLocked }: MyFactionLobbySlotsProps) => {
    const theme = useTheme()

    return (
        <>
            {factionSlots.mechSlots.map((ms, index) => {
                return (
                    <Stack
                        key={index}
                        sx={{
                            flex: 1,
                            alignItems: "start",
                            padding: "1rem",
                            backgroundColor: `${colors.offWhite}10`,
                        }}
                    >
                        <Box
                            component="img"
                            src={ms.avatar_url}
                            sx={{
                                maxHeight: "60px",
                            }}
                        />

                        {/* <ClipThing
                            border={{
                                borderColor: factionSlots.faction.primary_color,
                            }}
                            corners={{
                                bottomRight: true,
                            }}
                        >
                        </ClipThing> */}
                        <Typography
                            variant="h6"
                            sx={{
                                color: theme.factionTheme.primary,
                                fontWeight: "fontWeightBold",
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1, // change to max number of lines
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {ms.name || ms.label}
                        </Typography>
                        <Typography
                            sx={{
                                color: theme.factionTheme.primary,
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1, // change to max number of lines
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            <i>{`@${ms.owner.username}#${ms.owner.gid}`}</i>
                        </Typography>
                    </Stack>
                )
            })}
        </>
    )
}

const MechSlotContent = ({ battleLobbiesMech, faction, isLocked }: { battleLobbiesMech: BattleLobbiesMech; faction: Faction; isLocked: boolean }) => {
    const { userID } = useAuth()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { factionTheme } = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(false)
    const canLeave = useMemo(() => !isLocked && userID === battleLobbiesMech.owner.id, [battleLobbiesMech.owner.id, isLocked, userID])

    const leaveLobby = useCallback(
        async (mechID: string) => {
            if (!canLeave) return
            try {
                setIsLoading(true)

                const resp = await send<{ success: boolean; code: string }>(GameServerKeys.LeaveBattleLobby, {
                    mech_ids: [mechID],
                })

                if (resp && resp.success) {
                    newSnackbarMessage("Successfully deployed war machines.", "success")
                }
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to leave battle lobby.", "error")
                return
            } finally {
                setIsLoading(false)
            }
        },
        [canLeave, newSnackbarMessage, send],
    )

    if (battleLobbiesMech.mech_id == "") return null
    // display queued mech
    return (
        <>
            <Stack>
                <MechThumbnail avatarUrl={battleLobbiesMech.avatar_url} tier={battleLobbiesMech.tier} factionID={battleLobbiesMech.owner.faction_id} tiny />
            </Stack>
            <Stack direction={"column"} flex={1}>
                <Typography
                    variant="h6"
                    sx={{
                        flex: 1,
                        color: faction.primary_color,
                        ml: ".45rem",
                        fontWeight: "fontWeightBold",
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1, // change to max number of lines
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {battleLobbiesMech.name || battleLobbiesMech.label}
                </Typography>
                <Typography
                    sx={{
                        flex: 1,
                        color: faction.primary_color,
                        ml: ".45rem",
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1, // change to max number of lines
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    <i>{`@${battleLobbiesMech.owner.username}#${battleLobbiesMech.owner.gid}`}</i>
                </Typography>
            </Stack>

            {canLeave && (
                <IconButton
                    disableRipple
                    disabled={!canLeave || isLoading}
                    onClick={async (e) => {
                        e.preventDefault()
                        e.stopPropagation()

                        await leaveLobby(battleLobbiesMech.mech_id)
                    }}
                >
                    <SvgClose fill={factionTheme.primary} />
                </IconButton>
            )}
        </>
    )
}
