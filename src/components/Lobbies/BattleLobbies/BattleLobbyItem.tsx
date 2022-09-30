import { Avatar, Box, Stack, Typography } from "@mui/material"
import React, { useMemo, useState } from "react"
import { useArena, useAuth, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { camelToTitle, supFormatter } from "../../../helpers"
import { fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { ClipThing } from "../../Common/ClipThing"
import { BattleLobbyJoinModal } from "../BattleLobbyJoinModal"
import { BattleLobbyFaction, MyFactionLobbySlots, OtherFactionLobbySlots } from "./BattleLobbyMechSlots"

interface BattleLobbyItemProps {
    battleLobby: BattleLobby
}

const FACTION_LOBBY_SIZE = 3

const propsAreEqual = (prevProps: BattleLobbyItemProps, nextProps: BattleLobbyItemProps) => {
    return (
        prevProps.battleLobby.id === nextProps.battleLobby.id &&
        prevProps.battleLobby.ready_at === nextProps.battleLobby.ready_at &&
        prevProps.battleLobby.ended_at === nextProps.battleLobby.ended_at &&
        prevProps.battleLobby.deleted_at === nextProps.battleLobby.deleted_at &&
        prevProps.battleLobby.assigned_to_battle_id === nextProps.battleLobby.assigned_to_battle_id &&
        prevProps.battleLobby.assigned_to_arena_id === nextProps.battleLobby.assigned_to_arena_id &&
        prevProps.battleLobby.battle_lobbies_mechs === nextProps.battleLobby.battle_lobbies_mechs
    )
}

// {
//     mech_id: "",
//     battle_lobby_id: "",
//     name: "",
//     label: "",
//     tier: "",
//     avatar_url: "",
//     owner: {
//         id: "",
//         faction_id: "",
//         username: "UNKNOWN",
//         gid: 0,
//         rank: "NEW_RECRUIT",
//         features: [],
//     },
//     is_destroyed: false,
// }

export const BattleLobbyItem = React.memo(function BattleLobbyItem({ battleLobby }: BattleLobbyItemProps) {
    const theme = useTheme()
    const { factionID } = useAuth()
    const { arenaList } = useArena()
    const { factionsAll } = useSupremacy()
    const { game_map, name, entry_fee, first_faction_cut, second_faction_cut, third_faction_cut, assigned_to_arena_id } = battleLobby
    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background
    const { battle_lobbies_mechs, ready_at } = battleLobby
    const assignedToArenaName = useMemo(() => arenaList.find((a) => a.id === assigned_to_arena_id)?.name, [arenaList, assigned_to_arena_id])

    const [showJoinModal, setShowJoinModal] = useState(false)

    const [myFactionLobbySlots, otherFactionLobbySlots] = useMemo(() => {
        let myFactionLobbySlots = null as BattleLobbyFaction | null
        const otherFactionLobbySlots: BattleLobbyFaction[] = []
        Object.values(factionsAll)
            .sort((a, b) => a.label.localeCompare(b.label))
            .forEach((f) => {
                const bls: BattleLobbyFaction = {
                    faction: f,
                    mechSlots: [],
                }

                battle_lobbies_mechs.forEach((blm) => {
                    // skip, if not in the same faction
                    if (blm.faction_id != f.id) return

                    // parse data
                    bls.mechSlots.push(blm)
                })

                // fill up with empty struct
                while (bls.mechSlots.length < FACTION_LOBBY_SIZE) {
                    bls.mechSlots.push(null)
                }

                if (f.id === factionID) {
                    myFactionLobbySlots = bls
                } else {
                    otherFactionLobbySlots.push(bls)
                }
            })

        return [myFactionLobbySlots, otherFactionLobbySlots]
    }, [factionsAll, battle_lobbies_mechs, factionID])

    return (
        <>
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
                                position: "relative",
                                height: "200px",
                                p: "2rem",
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
                            <Stack direction="column" flexBasis="250px" height="100%">
                                <Typography sx={{ fontFamily: fonts.nostromoBlack }}>Lobby: {name}</Typography>
                                <Typography sx={{ fontFamily: fonts.nostromoBlack }}>MAP: {game_map ? camelToTitle(game_map.name) : "Random"}</Typography>
                                {assignedToArenaName && <Typography sx={{ fontFamily: fonts.nostromoBlack }}>Arena: {assignedToArenaName}</Typography>}
                                {entry_fee !== "0" && (
                                    <>
                                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>JOIN FEE: {entry_fee ? supFormatter(entry_fee) : "0"}</Typography>
                                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>DISTRIBUTION (1 - 2 - 3)</Typography>
                                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>
                                            {`${Math.round(parseFloat(first_faction_cut) * 100)}% - ${Math.round(
                                                parseFloat(second_faction_cut) * 100,
                                            )}% - ${Math.round(parseFloat(third_faction_cut) * 100)}%`}
                                        </Typography>
                                    </>
                                )}
                                {/* Other faction mech slots */}
                                <Stack spacing=".5rem" marginTop="auto">
                                    <OtherFactionLobbySlots factionLobbies={otherFactionLobbySlots} />
                                </Stack>
                            </Stack>

                            {/* My faction mech slots */}
                            {myFactionLobbySlots && (
                                <ClipThing
                                    corners={{
                                        topRight: true,
                                        bottomLeft: true,
                                    }}
                                    sx={{
                                        flex: 1,
                                        height: "100%",
                                    }}
                                >
                                    <Stack spacing="1rem" height="100%">
                                        <Stack
                                            direction="row"
                                            sx={{
                                                alignItems: "center",
                                                p: ".5rem",
                                                backgroundColor: `${myFactionLobbySlots.faction.primary_color}10`,
                                            }}
                                        >
                                            <Avatar
                                                src={myFactionLobbySlots.faction.logo_url}
                                                alt={`${myFactionLobbySlots.faction.label}'s Avatar`}
                                                sx={{
                                                    height: "2.6rem",
                                                    width: "2.6rem",
                                                }}
                                                variant="square"
                                            />
                                            <Typography
                                                sx={{
                                                    fontFamily: fonts.nostromoBlack,
                                                    color: myFactionLobbySlots.faction.secondary_color,
                                                    ml: ".45rem",
                                                    display: "-webkit-box",
                                                    overflow: "hidden",
                                                    overflowWrap: "anywhere",
                                                    textOverflow: "ellipsis",
                                                    WebkitLineClamp: 1, // change to max number of lines
                                                    WebkitBoxOrient: "vertical",
                                                }}
                                            >
                                                {myFactionLobbySlots.faction.label}
                                            </Typography>
                                        </Stack>

                                        <Box
                                            sx={{
                                                flex: 1,
                                                minHeight: 0,
                                                alignItems: "stretch",
                                                overflowY: "auto",
                                                overflowX: "hidden",
                                                scrollbarColor: `${theme.factionTheme.primary}55 ${"#FFFFFF15"}`,
                                                scrollbarWidth: "thin",
                                                "::-webkit-scrollbar": {
                                                    width: "1rem",
                                                },
                                                "::-webkit-scrollbar-track": {
                                                    background: "#FFFFFF15",
                                                },
                                                "::-webkit-scrollbar-thumb": {
                                                    background: theme.factionTheme.primary,
                                                },
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                spacing="1rem"
                                                sx={{
                                                    minHeight: "100%",
                                                    height: "min-content",
                                                    width: "100%",
                                                }}
                                            >
                                                <MyFactionLobbySlots
                                                    factionLobby={myFactionLobbySlots}
                                                    isLocked={!!ready_at}
                                                    onSlotClick={() => setShowJoinModal(true)}
                                                />
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </ClipThing>
                            )}
                        </Stack>
                    </ClipThing>
                </Box>
            </Stack>
            <BattleLobbyJoinModal
                show={showJoinModal}
                battleLobby={battleLobby}
                onJoin={() => setShowJoinModal(false)}
                onClose={() => setShowJoinModal(false)}
            />
        </>
    )
}, propsAreEqual)
