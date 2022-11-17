import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo, useState } from "react"
import { FactionIDs } from "../../../constants"
import { useAuth, useSupremacy } from "../../../containers"
import { fonts } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { Avatar as SupremacyAvatar } from "../../Avatar"
import { OptInButton } from "../../BattleArena/UpcomingBattle/UpcomingBattle"
import { BattleLobbyFaction } from "../BattleLobbyMech/BattleLobbyMechSlots"
import { BattleLobbyJoinModal } from "./BattleLobbyJoinModal"
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

export const BattleLobbyItem = React.memo(function BattleLobbyItem({ battleLobby, accessCode }: BattleLobbyItemProps) {
    const { factionID } = useAuth()
    const { factionsAll, getFaction } = useSupremacy()
    const { battle_lobbies_mechs, selected_zai_supporters, selected_rm_supporters, selected_bc_supporters } = battleLobby

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

    return (
        <>
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
                        {/* Other faction mech slots */}
                        <Stack spacing=".5rem">
                            {otherFactionLobbySlots.map((fls) => (
                                <BattleLobbyMechList key={fls.faction.id} factionID={fls.faction.id} battleLobbiesMechs={fls.mechSlots} />
                            ))}
                        </Stack>
                    </Stack>
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
