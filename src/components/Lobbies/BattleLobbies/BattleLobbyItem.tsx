import { Avatar, Box, Stack, SxProps, Typography } from "@mui/material"
import React, { ReactNode, useMemo, useState } from "react"
import { SvgGlobal, SvgLock, SvgQuestionMark2, SvgSupToken } from "../../../assets"
import { FactionIDs } from "../../../constants"
import { useArena, useAuth, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { supFormatter } from "../../../helpers"
import { TruncateTextLines } from "../../../theme/styles"
import { colors, fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { Avatar as SupremacyAvatar } from "../../Avatar"
import { OptInButton } from "../../BattleArena/UpcomingBattle/UpcomingBattle"
import { ClipThing } from "../../Common/Deprecated/ClipThing"
import { TimeLeft } from "../../Storefront/PlayerAbilitiesStore/PlayerAbilitiesStore"
import { BattleLobbyFaction, MyFactionLobbySlots } from "../BattleLobbyMech/BattleLobbyMechSlots"
import { BattleLobbyJoinModal } from "./BattleLobbyJoinModal"
import { BattleLobbyPricePool } from "./BattleLobbyPricePool"
import { BattleLobbyMechList } from "./SmallLobbyCard"

interface BattleLobbyItemProps {
    battleLobby: BattleLobby
    omitClip?: boolean
    disabled?: boolean
    accessCode?: string
}

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
        prevProps.battleLobby.fill_at === nextProps.battleLobby.fill_at &&
        prevProps.battleLobby.expires_at === nextProps.battleLobby.expires_at &&
        prevProps.battleLobby.battle_lobbies_mechs === nextProps.battleLobby.battle_lobbies_mechs
    )
}

export const BattleLobbyItem = React.memo(function BattleLobbyItem({ battleLobby, omitClip, disabled, accessCode }: BattleLobbyItemProps) {
    const theme = useTheme()
    const { factionID, userID } = useAuth()
    const { arenaList } = useArena()
    const { factionsAll, getFaction } = useSupremacy()
    const {
        host_by,
        is_private,
        generated_by_system,
        game_map,
        name,
        number,
        entry_fee,
        assigned_to_arena_id,
        battle_lobbies_mechs,
        ready_at,
        selected_zai_supporters,
        selected_rm_supporters,
        selected_bc_supporters,
        fill_at,
        expires_at,
    } = battleLobby
    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background
    const assignedToArenaName = useMemo(() => arenaList.find((a) => a.id === assigned_to_arena_id)?.name, [arenaList, assigned_to_arena_id])

    const displayedAccessCode = useMemo(() => battleLobby.access_code || accessCode, [accessCode, battleLobby.access_code])

    const [showJoinModal, setShowJoinModal] = useState(false)

    const [myFactionLobbySlots, otherFactionLobbySlots] = useMemo(() => {
        let myFactionLobbySlots: BattleLobbyFaction = {
            faction: getFaction(factionID),
            mechSlots: [],
            supporterSlots: [],
        }
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
    }, [getFaction, factionID, factionsAll, battle_lobbies_mechs, selected_zai_supporters, selected_bc_supporters, selected_rm_supporters])

    const entryFeeDisplay = useMemo(() => {
        const hasFee = entry_fee !== "0"
        const text = hasFee ? supFormatter(entry_fee, 2) : "NONE"

        return (
            <Stack direction="row" spacing={0.8}>
                <Typography
                    variant="body2"
                    fontFamily={fonts.nostromoHeavy}
                    sx={{
                        color: hasFee ? colors.gold : colors.green,
                        textAlign: "bottom",
                    }}
                >
                    Entry Fee:
                </Typography>
                <Stack direction="row" alignItems="center" spacing=".4rem">
                    {hasFee && <SvgSupToken size="1.5rem" fill={colors.gold} />}
                    <Typography variant="body2" fontFamily={fonts.nostromoHeavy} sx={{ opacity: hasFee ? 1 : 0.6 }}>
                        {text}
                    </Typography>
                </Stack>
            </Stack>
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
                            spacing="1rem"
                            sx={{
                                p: "2rem",
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing="1rem"
                                sx={{
                                    position: "relative",
                                    minHeight: "10rem",
                                }}
                            >
                                {/* Lobby Info */}
                                <Stack direction="column" flexBasis="25rem" height="100%" mr="1rem" spacing={0.5}>
                                    <Stack direction="row" alignItems="center" spacing={0.6}>
                                        {is_private ? <SvgLock size="1.8rem" fill={colors.gold} /> : <SvgGlobal size="1.8rem" fill={colors.green} />}
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                lineHeight: 1,
                                                fontFamily: fonts.nostromoBlack,
                                                ...TruncateTextLines(1),
                                            }}
                                        >
                                            {name ? name : `Lobby ${number}`}
                                        </Typography>
                                    </Stack>

                                    {entryFeeDisplay}

                                    {displayedAccessCode && userID === battleLobby.host_by_id && (
                                        <LobbyInfoField title="ACCESS CODE:" value={displayedAccessCode} />
                                    )}

                                    {assignedToArenaName && <LobbyInfoField title="Arena:" value={assignedToArenaName} />}

                                    {fill_at && (
                                        <LobbyInfoField
                                            title="Ready In"
                                            value={<TimeLeft dateTo={fill_at} timeUpMessage="Filling AI Mechs" />}
                                            valueSxProp={{
                                                fontFamily: fonts.nostromoMedium,
                                                fontStyle: "italic",
                                                fontSize: "1.2rem",
                                            }}
                                        />
                                    )}

                                    {expires_at && (
                                        <LobbyInfoField
                                            title="Expires In"
                                            value={<TimeLeft dateTo={expires_at} timeUpMessage="Closing Lobby" />}
                                            valueSxProp={{
                                                fontFamily: fonts.nostromoMedium,
                                                fontStyle: "italic",
                                                fontSize: "1.2rem",
                                            }}
                                        />
                                    )}

                                    <LobbyInfoField
                                        title="Max deploy"
                                        value={battleLobby.max_deploy_per_player}
                                        valueSxProp={{
                                            fontFamily: fonts.nostromoMedium,
                                            fontStyle: "italic",
                                            fontSize: "1.2rem",
                                        }}
                                    />

                                    <Stack direction="column">
                                        <Typography
                                            variant="body2"
                                            fontFamily={fonts.nostromoHeavy}
                                            sx={{
                                                color: colors.grey,
                                            }}
                                        >
                                            Hosted by
                                        </Typography>
                                        <Stack direction="row" alignItems="center">
                                            {!generated_by_system && (
                                                <Avatar
                                                    src={getFaction(host_by.faction_id).logo_url}
                                                    alt={`${getFaction(host_by.faction_id).label}'s Avatar`}
                                                    sx={{
                                                        height: "2.6rem",
                                                        width: "2.6rem",
                                                    }}
                                                    variant="square"
                                                />
                                            )}
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    ...TruncateTextLines(1),
                                                    lineHeight: "unset",
                                                    fontStyle: "italic",
                                                    color: generated_by_system ? colors.offWhite : getFaction(host_by.faction_id).primary_color,
                                                }}
                                            >
                                                {generated_by_system ? "SYSTEM" : `${host_by.username} #${host_by.gid}`}
                                            </Typography>
                                        </Stack>
                                    </Stack>

                                    {/* Prize pool */}
                                    <BattleLobbyPricePool battleLobby={battleLobby} />

                                    {/* Other faction mech slots */}
                                    <Stack spacing=".5rem">
                                        {otherFactionLobbySlots.map((fls) => (
                                            <BattleLobbyMechList key={fls.faction.id} factionID={fls.faction.id} battleLobbiesMechs={fls.mechSlots} />
                                        ))}
                                    </Stack>
                                </Stack>

                                {/* Map */}
                                <Stack spacing="1rem" height="100%" width="30rem">
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        sx={{
                                            p: ".5rem",
                                            backgroundColor: `${theme.factionTheme.primary}30`,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontFamily: fonts.nostromoBlack,
                                                color: "white",
                                                ml: ".45rem",
                                                ...TruncateTextLines(1),
                                            }}
                                        >
                                            Map
                                        </Typography>
                                    </Stack>
                                    {/*Background image*/}
                                    <Stack flex={1}>
                                        {game_map ? (
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    width: "30rem",
                                                    height: "30rem",
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundPosition: "center",
                                                    backgroundSize: "cover",
                                                    backgroundImage: `url(${game_map.background_url})`,
                                                    borderRadius: 0.8,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        position: "absolute",
                                                        bottom: "10%",
                                                        left: "2rem",
                                                        right: "2rem",
                                                        top: 0,
                                                        backgroundImage: `url(${game_map.logo_url})`,
                                                        backgroundRepeat: "no-repeat",
                                                        backgroundPosition: "bottom center",
                                                        backgroundSize: "contain",
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            <Stack
                                                spacing="1rem"
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    width: "30rem",
                                                    height: "30rem",
                                                    borderRadius: 0.8,
                                                    backgroundColor: `${colors.offWhite}10`,
                                                }}
                                            >
                                                <SvgQuestionMark2 size="7rem" fill={`${colors.grey}aa`} />
                                                <Typography variant="h5" fontFamily={fonts.nostromoBlack} sx={{ color: `${colors.grey}aa` }}>
                                                    RANDOM
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Stack>

                                {/* My faction mech slots */}
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
                                            alignItems="center"
                                            sx={{
                                                p: ".5rem",
                                                backgroundColor: `${myFactionLobbySlots.faction.palette.primary}30`,
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
                                                    ...TruncateTextLines(1),
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
                            </Stack>
                            {displayedAccessCode && (
                                <Stack
                                    direction="column"
                                    spacing={1}
                                    sx={{
                                        justifyContent: "center",
                                        marginBottom: "1rem",
                                    }}
                                >
                                    <Typography variant="body2" fontFamily={fonts.nostromoHeavy}>
                                        Battle Supporters
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "20% 20% 20% 20% 20%",
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
                                                        accessCode={displayedAccessCode}
                                                    />
                                                ))}
                                    </Box>
                                </Stack>
                            )}
                        </Stack>
                    </ClipThing>
                </Box>
            </Stack>
            {showJoinModal && (
                <BattleLobbyJoinModal
                    battleLobby={battleLobby}
                    onJoin={() => setShowJoinModal(false)}
                    onClose={() => setShowJoinModal(false)}
                    accessCode={displayedAccessCode}
                />
            )}
        </>
    )
}, propsAreEqual)

interface LobbyInfoFieldProps {
    title: string
    value: ReactNode

    titleSxProp?: SxProps
    valueSxProp?: SxProps
}

const LobbyInfoField = ({ title, value, titleSxProp, valueSxProp }: LobbyInfoFieldProps) => {
    return (
        <Stack direction="column">
            <Typography
                variant="body2"
                sx={{
                    fontFamily: fonts.nostromoHeavy,
                    color: colors.grey,
                    ...titleSxProp,
                }}
            >
                {title}
            </Typography>
            <Typography
                sx={{
                    fontFamily: fonts.nostromoBold,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    ...valueSxProp,
                }}
            >
                {value}
            </Typography>
        </Stack>
    )
}
