import { BattleLobbiesMech, BattleLobby } from "../../../types/battle_queue"
import { useTheme } from "../../../containers/theme"
import { Avatar, Box, Stack, Typography } from "@mui/material"
import { colors, fonts } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"
import React, { useMemo } from "react"
import { useSupremacy } from "../../../containers"
import { Faction } from "../../../types"
import { camelToTitle, supFormatter } from "../../../helpers"
import { MechThumbnail } from "../../Hangar/WarMachinesHangar/Common/MechThumbnail"

interface BattleLobbyItemProps {
    battleLobby: BattleLobby
}

const propsAreEqual = (prevProps: BattleLobbyItemProps, nextProps: BattleLobbyItemProps) => {
    return (
        prevProps.battleLobby.id === nextProps.battleLobby.id &&
        prevProps.battleLobby.battle_lobbies_mechs.length === nextProps.battleLobby.battle_lobbies_mechs.length
    )
}

export const BattleLobbyItem = React.memo(function BattleLobbyItem({ battleLobby }: BattleLobbyItemProps) {
    const theme = useTheme()
    const { game_map, number, entry_fee, first_faction_cut, second_faction_cut, third_faction_cut } = battleLobby
    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    const { battle_lobbies_mechs } = battleLobby

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
                            <BattleLobbyMechSlots battleLobbyMechs={battle_lobbies_mechs} />
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

const BattleLobbyMechSlots = ({ battleLobbyMechs }: { battleLobbyMechs: BattleLobbiesMech[] }) => {
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
                            minHeight: "12rem",
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
                                    <MechSlotContent battleLobbiesMech={ms} faction={faction} />
                                </Box>
                            ))}
                        </Box>
                    </Stack>
                )
            })}
        </Stack>
    )
}

const MechSlotContent = ({ battleLobbiesMech, faction }: { battleLobbiesMech: BattleLobbiesMech; faction: Faction }) => {
    if (battleLobbiesMech.mech_id == "") return null
    // display queued mech
    return (
        <>
            <Stack>
                <MechThumbnail avatarUrl={battleLobbiesMech.avatar_url} tier={battleLobbiesMech.tier} factionID={battleLobbiesMech.owner.faction_id} tiny />
            </Stack>
            <Typography
                sx={{
                    flex: 1,
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
                {battleLobbiesMech.name || battleLobbiesMech.label}
            </Typography>
        </>
    )
}
