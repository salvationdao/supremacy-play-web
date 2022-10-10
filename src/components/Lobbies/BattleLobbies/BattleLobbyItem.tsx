import { Avatar, Box, Stack, Typography } from "@mui/material"
import React, { useMemo, useState } from "react"
import { Avatar as SupremacyAvatar } from "../../Avatar"
import { SvgBostonKillIcon, SvgDeath, SvgLock, SvgRedMoutainKillIcon, SvgSupToken, SvgZaibatsuKillIcon } from "../../../assets"
import { useArena, useAuth, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { camelToTitle, supFormatter } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { ClipThing } from "../../Common/ClipThing"
import { BattleLobbyJoinModal } from "./BattleLobbyJoinModal"
import { BattleLobbyFaction, MyFactionLobbySlots, OtherFactionLobbySlots } from "../BattleLobbyMech/BattleLobbyMechSlots"
import { CropMaxLengthText } from "../../../theme/styles"
import { FactionIDs } from "../../../constants"
import { OptInButton } from "../../UpcomingBattle/UpcomingBattle"

interface BattleLobbyItemProps {
    battleLobby: BattleLobby
    omitClip?: boolean
    disabled?: boolean
    accessCode?: string
}

const FACTION_LOBBY_SIZE = 3

const propsAreEqual = (prevProps: BattleLobbyItemProps, nextProps: BattleLobbyItemProps) => {
    return (
        prevProps.accessCode === prevProps.accessCode &&
        prevProps.disabled === nextProps.disabled &&
        prevProps.battleLobby.id === nextProps.battleLobby.id &&
        prevProps.battleLobby.ready_at === nextProps.battleLobby.ready_at &&
        prevProps.battleLobby.ended_at === nextProps.battleLobby.ended_at &&
        prevProps.battleLobby.deleted_at === nextProps.battleLobby.deleted_at &&
        prevProps.battleLobby.assigned_to_battle_id === nextProps.battleLobby.assigned_to_battle_id &&
        prevProps.battleLobby.assigned_to_arena_id === nextProps.battleLobby.assigned_to_arena_id &&
        prevProps.battleLobby.battle_lobbies_mechs === nextProps.battleLobby.battle_lobbies_mechs
    )
}

export const BattleLobbyItem = React.memo(function BattleLobbyItem({ battleLobby, omitClip, disabled, accessCode }: BattleLobbyItemProps) {
    const theme = useTheme()
    const { factionID } = useAuth()
    const { arenaList } = useArena()
    const { factionsAll } = useSupremacy()
    const {
        host_by,
        is_private,
        generated_by_system,
        game_map,
        name,
        number,
        entry_fee,
        first_faction_cut,
        second_faction_cut,
        third_faction_cut,
        assigned_to_arena_id,
        battle_lobbies_mechs,
        ready_at,
        selected_zai_supporters,
        selected_rm_supporters,
        selected_bc_supporters,
    } = battleLobby
    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background
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
                    supporterSlots: [],
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

                // since supporters are already split up by faction, use a switch to add the right one to this object
                switch (f.id) {
                    case FactionIDs.ZHI:
                        bls.supporterSlots.push(...(selected_zai_supporters || []))
                        break
                    case FactionIDs.BC:
                        bls.supporterSlots.push(...(selected_bc_supporters || []))
                        break
                    case FactionIDs.RM:
                        bls.supporterSlots.push(...(selected_rm_supporters || []))
                        break
                }

                if (f.id === factionID) {
                    myFactionLobbySlots = bls
                } else {
                    otherFactionLobbySlots.push(bls)
                }
            })

        return [myFactionLobbySlots, otherFactionLobbySlots]
    }, [factionsAll, battle_lobbies_mechs, factionID, selected_zai_supporters, selected_rm_supporters, selected_bc_supporters])

    const entryFeeDisplay = useMemo(() => {
        if (entry_fee && entry_fee !== "0")
            return (
                <Stack direction="row" spacing=".2rem" alignItems="center">
                    <Typography
                        sx={{
                            color: colors.grey,
                        }}
                    >
                        Entry Fee:
                    </Typography>
                    <SvgSupToken size="1.6rem" fill={colors.gold} />
                    <Typography
                        sx={{
                            color: "white",
                        }}
                    >
                        {supFormatter(entry_fee)}
                    </Typography>
                </Stack>
            )
        return (
            <Typography
                sx={{
                    color: colors.green,
                }}
            >
                No entry fee
            </Typography>
        )
    }, [entry_fee])

    return (
        <>
            <Stack sx={{ color: primaryColor, textAlign: "start", height: "100%", opacity: disabled ? 0.4 : 1 }}>
                <Box>
                    <ClipThing
                        clipSize="6px"
                        border={
                            omitClip
                                ? undefined
                                : {
                                      borderColor: primaryColor,
                                      borderThickness: ".3rem",
                                  }
                        }
                        backgroundColor={backgroundColor}
                        opacity={0.7}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{
                                position: "relative",
                                minHeight: "200px",
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
                                    background: game_map
                                        ? `linear-gradient(to right, ${backgroundColor}dd 0%, transparent 100%), url(${game_map.background_url})`
                                        : undefined,
                                    opacity: 0.4,
                                }}
                            />

                            {/* Lobby Info */}
                            <Stack direction="column" flexBasis="250px" height="100%" mr="1rem">
                                <Box mb=".6rem">
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            lineHeight: 1,
                                            fontFamily: fonts.nostromoBlack,
                                        }}
                                    >
                                        {name ? name : `Lobby ${number}`}
                                    </Typography>
                                    <Stack direction="row" spacing=".5rem" alignItems="center">
                                        {is_private && <SvgLock size="1.2rem" fill={colors.gold} />}
                                        <Typography
                                            sx={{
                                                color: is_private ? colors.gold : colors.neonBlue,
                                            }}
                                        >
                                            {is_private ? "Private" : "Public"} Lobby
                                        </Typography>
                                        <Box
                                            component="span"
                                            sx={{
                                                fontFamily: fonts.shareTech,
                                            }}
                                        >
                                            &#8212;
                                        </Box>
                                        {entryFeeDisplay}
                                    </Stack>
                                </Box>
                                {assignedToArenaName && (
                                    <Stack direction="column" sx={{ mb: ".35rem" }}>
                                        <Typography
                                            component="span"
                                            sx={{
                                                color: colors.grey,
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Arena:{" "}
                                        </Typography>
                                        <Typography
                                            component="span"
                                            sx={{
                                                ...CropMaxLengthText,
                                                fontFamily: fonts.nostromoBold,
                                            }}
                                        >
                                            {assignedToArenaName}
                                        </Typography>
                                    </Stack>
                                )}
                                <Stack direction="column" sx={{ mb: ".35rem" }}>
                                    <Typography
                                        sx={{
                                            color: colors.grey,
                                            textTransform: "uppercase",
                                            textAlign: "bottom",
                                        }}
                                    >
                                        Map:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            ...CropMaxLengthText,
                                            fontFamily: fonts.nostromoBold,
                                        }}
                                    >
                                        {game_map ? camelToTitle(game_map.name) : "Random"}
                                    </Typography>
                                </Stack>
                                <Stack direction="column" sx={{ mb: ".35rem" }}>
                                    <Typography
                                        sx={{
                                            color: colors.grey,
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Hosted by
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            ...CropMaxLengthText,
                                            // color: factionsAll[host_by.faction_id]?.primary_color,
                                        }}
                                    >
                                        {generated_by_system ? "SYSTEM" : `${host_by.username} #${host_by.gid}`}
                                    </Typography>
                                </Stack>
                                {/* Prize allocation */}
                                {entry_fee !== "0" && (
                                    <>
                                        <Stack direction="column" sx={{ mb: ".35rem" }}>
                                            <Typography
                                                sx={{
                                                    color: colors.grey,
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                Distribution (%)
                                            </Typography>
                                            <Stack direction="row" spacing="1rem">
                                                <Stack direction="row" alignItems="center" spacing=".5rem">
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            height: "2rem",
                                                            width: "2rem",
                                                            borderRadius: "50%",
                                                            backgroundColor: colors.gold,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: `${colors.darkerNavy}99`,
                                                                fontFamily: fonts.nostromoBlack,
                                                            }}
                                                        >
                                                            1
                                                        </Typography>
                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontFamily: fonts.nostromoMedium,
                                                        }}
                                                    >
                                                        {(parseFloat(first_faction_cut) * 100).toFixed(1)}
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" alignItems="center" spacing=".5rem">
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            height: "2rem",
                                                            width: "2rem",
                                                            borderRadius: "50%",
                                                            backgroundColor: colors.silver,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: `${colors.darkerNavy}99`,
                                                                fontFamily: fonts.nostromoBlack,
                                                            }}
                                                        >
                                                            2
                                                        </Typography>
                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontFamily: fonts.nostromoMedium,
                                                        }}
                                                    >
                                                        {(parseFloat(second_faction_cut) * 100).toFixed(1)}
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" alignItems="center" spacing=".5rem">
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            height: "2rem",
                                                            width: "2rem",
                                                            borderRadius: "50%",
                                                            backgroundColor: colors.bronze,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: `${colors.darkerNavy}99`,
                                                                fontFamily: fonts.nostromoBlack,
                                                            }}
                                                        >
                                                            3
                                                        </Typography>
                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontFamily: fonts.nostromoMedium,
                                                        }}
                                                    >
                                                        {(parseFloat(third_faction_cut) * 100).toFixed(1)}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Stack>
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
                                    }}
                                    sx={{
                                        flex: 1,
                                    }}
                                >
                                    <Stack spacing="1rem" height="100%">
                                        <Stack
                                            direction="row"
                                            sx={{
                                                alignItems: "center",
                                                p: ".5rem",
                                                backgroundColor: `${myFactionLobbySlots.faction.primary_color}30`,
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
                                                    color: "white",
                                                    ml: ".45rem",
                                                    ...CropMaxLengthText,
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
                        {accessCode && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    marginBottom: "1rem",
                                }}
                            >
                                <Typography variant={"h5"}>Battle Supporters</Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-evenly",
                                        marginBottom: "1rem",
                                    }}
                                >
                                    {myFactionLobbySlots?.supporterSlots.map((sup, i) => {
                                        return (
                                            <SupremacyAvatar
                                                marginLeft={0}
                                                zIndexAdded={i}
                                                key={`${sup.id}`}
                                                username={sup.username}
                                                factionID={sup.faction_id}
                                                avatarURL={sup.avatar_url}
                                                customAvatarID={sup.custom_avatar_id}
                                            />
                                        )
                                    })}
                                    {/* users faction, display opt in buttons*/}
                                    {myFactionLobbySlots &&
                                        myFactionLobbySlots?.supporterSlots.length < 5 &&
                                        new Array(5 - myFactionLobbySlots?.supporterSlots.length)
                                            .fill(0)
                                            .map((_, i) => (
                                                <OptInButton
                                                    key={`${factionID}-add-${i}`}
                                                    battleLobbyID={battleLobby.id}
                                                    factionID={factionID}
                                                    accessCode={accessCode}
                                                />
                                            ))}
                                </Box>
                            </Box>
                        )}
                    </ClipThing>
                </Box>
            </Stack>
            {showJoinModal && (
                <BattleLobbyJoinModal
                    battleLobby={battleLobby}
                    onJoin={() => setShowJoinModal(false)}
                    onClose={() => setShowJoinModal(false)}
                    accessCode={accessCode}
                />
            )}
        </>
    )
}, propsAreEqual)
