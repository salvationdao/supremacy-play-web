import { BattleLobbiesMech, BattleLobby } from "../../../types/battle_queue"
import { useTheme } from "../../../containers/theme"
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material"
import { colors, fonts } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"
import React, { useCallback, useMemo, useState } from "react"
import { useAuth, useGlobalNotifications, useSupremacy } from "../../../containers"
import { Faction } from "../../../types"
import { camelToTitle, supFormatter } from "../../../helpers"
import { MechThumbnail } from "../../Hangar/WarMachinesHangar/Common/MechThumbnail"
import { SvgClose } from "../../../assets"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"

interface BattleLobbyItemProps {
    battleLobby: BattleLobby
}

const propsAreEqual = (prevProps: BattleLobbyItemProps, nextProps: BattleLobbyItemProps) => {
    return (
        prevProps.battleLobby.id === nextProps.battleLobby.id &&
        prevProps.battleLobby.ready_at === nextProps.battleLobby.ready_at &&
        prevProps.battleLobby.ended_at === nextProps.battleLobby.ended_at &&
        prevProps.battleLobby.deleted_at === nextProps.battleLobby.deleted_at &&
        prevProps.battleLobby.battle_lobbies_mechs === nextProps.battleLobby.battle_lobbies_mechs
    )
}

export const BattleLobbyItem = React.memo(function BattleLobbyItem({ battleLobby }: BattleLobbyItemProps) {
    const theme = useTheme()
    const { game_map, number, entry_fee, first_faction_cut, second_faction_cut, third_faction_cut } = battleLobby
    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background
    const { battle_lobbies_mechs, ready_at } = battleLobby

    return (
        <Stack sx={{ color: primaryColor, textAlign: "start", height: "100%" }}>
            <Box>
                <ClipThing
                    clipSize="6px"
                    border={{
                        borderColor: primaryColor,
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={backgroundColor}
                    opacity={0.7}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                            p: ".35rem",
                            position: "relative",
                            minHeight: "12rem",
                        }}
                    >
                        {/*Background image*/}
                        <Box
                            sx={{
                                position: "absolute",
                                zIndex: -1,
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: game_map ? `url(${game_map.background_url})` : undefined,
                                opacity: 0.4,
                            }}
                        />

                        {/* Lobby Info */}
                        <Stack direction="column" height="100%" width="22%">
                            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>Lobby #{number}</Typography>
                            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>MAP: {game_map ? camelToTitle(game_map.name) : "Random"}</Typography>
                            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>JOIN FEE: {entry_fee ? supFormatter(entry_fee) : "0"}</Typography>
                            {entry_fee !== "0" && (
                                <>
                                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>DISTRIBUTION (1 - 2 - 3)</Typography>
                                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>
                                        {`${Math.round(parseFloat(first_faction_cut) * 100)}% - ${Math.round(
                                            parseFloat(second_faction_cut) * 100,
                                        )}% - ${Math.round(parseFloat(third_faction_cut) * 100)}%`}
                                    </Typography>
                                </>
                            )}
                        </Stack>

                        {/* Mech slots */}
                        <Stack direction="row" height="100%" flex={1}>
                            <BattleLobbyMechSlots battleLobbyMechs={battle_lobbies_mechs} isLocked={!!ready_at} />
                        </Stack>
                    </Stack>
                </ClipThing>
            </Box>
        </Stack>
    )
}, propsAreEqual)

interface BattleLobbySlot {
    faction: Faction
    mechSlots: BattleLobbiesMech[]
}

const BattleLobbyMechSlots = ({ battleLobbyMechs, isLocked }: { battleLobbyMechs: BattleLobbiesMech[]; isLocked: boolean }) => {
    const { factionsAll } = useSupremacy()
    // fill up slot
    const battleLobbySlots = useMemo(() => {
        const blss: BattleLobbySlot[] = []
        const mechAmountPerFaction = 3
        Object.values(factionsAll)
            .sort((a, b) => a.label.localeCompare(b.label))
            .forEach((f) => {
                const bls: BattleLobbySlot = {
                    faction: f,
                    mechSlots: [],
                }

                battleLobbyMechs.forEach((blm) => {
                    // skip, if not in the same faction
                    if (blm.owner.faction_id != f.id) return

                    // parse data
                    bls.mechSlots.push(blm)
                })

                // fill up with empty struct
                while (bls.mechSlots.length < mechAmountPerFaction) {
                    bls.mechSlots.push({
                        mech_id: "",
                        battle_lobby_id: "",
                        name: "",
                        label: "",
                        tier: "",
                        avatar_url: "",
                        owner: {
                            id: "",
                            faction_id: "",
                            username: "UNKNOWN",
                            gid: 0,
                            rank: "NEW_RECRUIT",
                            features: [],
                        },
                        is_destroyed: false,
                    })
                }

                blss.push(bls)
            })

        return blss
    }, [factionsAll, battleLobbyMechs])

    return (
        <Stack direction="row" flex={1} justifyContent="space-between">
            {battleLobbySlots.map((bls) => {
                const { faction, mechSlots } = bls
                return (
                    <Stack
                        key={faction.id}
                        direction="column"
                        width="33%"
                        sx={{
                            p: ".35rem",
                            position: "relative",
                            minHeight: "21rem",
                            backgroundColor: colors.darkestNeonBlue + "a0",
                            borderRadius: "4px",
                        }}
                    >
                        <Stack direction="row" sx={{ mb: ".25rem" }}>
                            <Avatar
                                src={faction.logo_url}
                                alt={`${faction.label}'s Avatar`}
                                sx={{
                                    height: "2.6rem",
                                    width: "2.6rem",
                                    borderRadius: 0.8,
                                    border: `${faction.primary_color} 2px solid`,
                                    backgroundColor: faction.primary_color,
                                }}
                                variant="square"
                            />
                            <Typography
                                sx={{
                                    fontFamily: fonts.nostromoBlack,
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
                                {faction.label}
                            </Typography>
                        </Stack>

                        <Box
                            flex={1}
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {mechSlots.map((ms, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        display: "flex",
                                        flex: 1,
                                        flexDirection: "row",
                                        p: ".15rem",
                                        my: ".1rem",
                                        width: "100%",
                                        backgroundColor: colors.offWhite + "20",
                                        borderRadius: "4px",
                                    }}
                                >
                                    <MechSlotContent battleLobbiesMech={ms} faction={faction} isLocked={isLocked} />
                                </Box>
                            ))}
                        </Box>
                    </Stack>
                )
            })}
        </Stack>
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
