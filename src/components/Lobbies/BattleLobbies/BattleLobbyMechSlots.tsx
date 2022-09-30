import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { SvgClose, SvgQuestionMark2 } from "../../../assets"
import { useAuth, useGlobalNotifications } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Faction } from "../../../types"
import { BattleLobbiesMech } from "../../../types/battle_queue"
import { MechThumbnail } from "../../Hangar/WarMachinesHangar/Common/MechThumbnail"

export interface BattleLobbyFaction {
    faction: Faction
    mechSlots: BattleLobbiesMech[]
}

interface MyFactionLobbySlotsProps {
    factionLobby: BattleLobbyFaction
    isLocked: boolean
}

export const MyFactionLobbySlots = ({ factionLobby, isLocked }: MyFactionLobbySlotsProps) => {
    const theme = useTheme()

    return (
        <>
            {factionLobby.mechSlots.map((ms, index) => {
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

interface OtherFactionLobbySlotsProps {
    factionLobbies: BattleLobbyFaction[]
    isLocked: boolean
}

export const OtherFactionLobbySlots = ({ factionLobbies, isLocked }: OtherFactionLobbySlotsProps) => {
    return (
        <>
            {factionLobbies.map((fl) => (
                <Box key={fl.faction.id}>
                    <Stack
                        direction="row"
                        sx={{
                            alignItems: "center",
                            mb: ".3rem",
                        }}
                    >
                        <Typography
                            sx={{
                                display: "-webkit-box",
                                fontSize: "1.2rem",
                                fontFamily: fonts.nostromoBlack,
                                color: fl.faction.primary_color,
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1, // change to max number of lines
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {fl.faction.label}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing=".5rem">
                        {fl.mechSlots.map((ms, index) => (
                            <Stack
                                key={index}
                                sx={{
                                    height: "30px",
                                    width: "30px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `1px solid ${fl.faction.primary_color}`,
                                    backgroundColor: fl.faction.background_color,
                                }}
                            >
                                <SvgQuestionMark2 fill={`${colors.offWhite}20`} />
                            </Stack>
                        ))}
                    </Stack>
                </Box>
            ))}
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
