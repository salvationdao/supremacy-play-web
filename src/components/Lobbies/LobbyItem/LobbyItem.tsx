import { Box, IconButton, Stack, Typography } from "@mui/material"
import React, { useMemo, useState } from "react"
import { SvgContentCopyIcon, SvgGlobal, SvgLock, SvgSupToken, SvgUserDiamond } from "../../../assets"
import { FactionIDs } from "../../../constants"
import { useArena, useAuth, useSupremacy } from "../../../containers"
import { supFormatter } from "../../../helpers"
import { TruncateTextLines } from "../../../theme/styles"
import { colors, fonts } from "../../../theme/theme"
import { Faction } from "../../../types"
import { BattleLobbiesMech, BattleLobby, BattleLobbySupporter } from "../../../types/battle_queue"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { TimeLeft } from "../../Common/TimeLeft"
import { MyFactionMechs } from "./MyFactionMechs/MyFactionMechs"
import { OtherFactionMechs } from "./OtherFactionMechs/OtherFactionMechs"
import { PrizePool } from "./PrizePool"
import { Supporters } from "./Supporters"

export const NUMBER_MECHS_REQUIRED = 3

export interface FactionLobbySlots {
    faction: Faction
    mechSlots: BattleLobbiesMech[] // null represents empty slot
    supporterSlots: BattleLobbySupporter[] // null represents empty slot
}

export const LobbyItem = React.memo(function LobbyItem({ lobby, accessCode }: { lobby: BattleLobby; accessCode?: string }) {
    const { userID, factionID } = useAuth()
    const { arenaList } = useArena()
    const { getFaction, factionsAll } = useSupremacy()

    // Modals
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

    const arenaName = useMemo(() => arenaList.find((a) => a.id === lobby.assigned_to_arena_id)?.name, [arenaList, lobby.assigned_to_arena_id])

    const ownerFaction = useMemo(() => getFaction(lobby.host_by.faction_id), [getFaction, lobby.host_by.faction_id])

    const entryFeeDisplay = useMemo(() => {
        const hasFee = lobby.entry_fee !== "0"

        if (!hasFee) {
            return null
        }

        return (
            <Typography>
                <SvgSupToken inline size="1.7rem" fill={colors.gold} />
                {supFormatter(lobby.entry_fee, 2)} ENTRY FEE
            </Typography>
        )
    }, [lobby.entry_fee])

    const [myFactionLobbySlots, otherFactionLobbySlots] = useMemo(() => {
        let myFactionLobbySlots: FactionLobbySlots = {
            faction: getFaction(factionID),
            mechSlots: [],
            supporterSlots: [],
        }

        const otherFactionLobbySlots: FactionLobbySlots[] = []

        Object.values(factionsAll)
            .sort((a, b) => a.label.localeCompare(b.label))
            .forEach((f) => {
                const bls: FactionLobbySlots = {
                    faction: f,
                    mechSlots: [],
                    supporterSlots: [],
                }

                lobby.battle_lobbies_mechs.forEach((blm) => {
                    // Skip, if not in the same faction
                    if (blm.faction_id !== f.id) return

                    // Parse data
                    bls.mechSlots.push(blm)
                })

                // since supporters are already split up by faction, use a switch to add the right one to this object
                switch (f.id) {
                    case FactionIDs.ZHI:
                        bls.supporterSlots.push(...(lobby.selected_zai_supporters || []))
                        break
                    case FactionIDs.BC:
                        bls.supporterSlots.push(...(lobby.selected_bc_supporters || []))
                        break
                    case FactionIDs.RM:
                        bls.supporterSlots.push(...(lobby.selected_rm_supporters || []))
                        break
                }

                if (f.id === factionID) {
                    myFactionLobbySlots = bls
                } else {
                    otherFactionLobbySlots.push(bls)
                }
            })

        return [myFactionLobbySlots, otherFactionLobbySlots]
    }, [
        getFaction,
        factionID,
        factionsAll,
        lobby.battle_lobbies_mechs,
        lobby.selected_zai_supporters,
        lobby.selected_bc_supporters,
        lobby.selected_rm_supporters,
    ])

    const displayAccessCode = useMemo(() => lobby.access_code || accessCode, [accessCode, lobby.access_code])

    return (
        <NiceBoxThing
            border={{ color: "#FFFFFF20", thickness: "very-lean" }}
            background={{ colors: ["#FFFFFF"], opacity: 0.06 }}
            sx={{ position: "relative", p: "1.2rem 1.8rem" }}
        >
            {/* Lobby details */}
            <Stack spacing="1.8rem">
                <Stack direction="row" alignItems="center" spacing="2rem">
                    {/* Lobby name */}
                    <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                        {lobby.name || `Lobby #${lobby.number}`}
                    </Typography>

                    {/* Access code */}
                    {displayAccessCode && userID === lobby.host_by_id && (
                        <Stack direction="row" alignItems="center">
                            <Typography color={colors.neonBlue}>{displayAccessCode}</Typography>
                            <IconButton
                                size="small"
                                sx={{ opacity: 0.6, ":hover": { opacity: 1 } }}
                                onClick={() => {
                                    navigator.clipboard.writeText(displayAccessCode || "")
                                }}
                            >
                                <SvgContentCopyIcon inline size="1.3rem" />
                            </IconButton>
                        </Stack>
                    )}

                    {/* Entry fees */}
                    {entryFeeDisplay}

                    <Box flex={1} />

                    {/* Lobby private or public */}
                    {lobby.is_private ? (
                        <Typography color={colors.orange}>
                            <SvgLock inline size="1.6rem" fill={colors.orange} /> PRIVATE
                        </Typography>
                    ) : (
                        <Typography color={colors.green}>
                            <SvgGlobal inline size="1.6rem" fill={colors.green} /> PUBLIC
                        </Typography>
                    )}
                </Stack>

                <Stack direction="row" spacing="3rem" sx={{ flex: 1 }}>
                    <Stack spacing="1.8rem">
                        {/* Host name */}
                        <Typography
                            variant="h6"
                            sx={{
                                color: ownerFaction.primary_color,
                                fontWeight: "bold",
                                ...TruncateTextLines(1),
                            }}
                        >
                            <SvgUserDiamond size="2.2rem" inline fill={ownerFaction.primary_color} />{" "}
                            {lobby.generated_by_system ? "The Overseer" : `${lobby.host_by.username}#${lobby.host_by.gid}`}
                        </Typography>

                        {/* Arena name */}
                        {arenaName && (
                            <Box>
                                <Typography variant="body2" gutterBottom fontFamily={fonts.nostromoBold} color={colors.lightGrey}>
                                    BATTLE ARENA
                                </Typography>

                                <Typography>{arenaName}</Typography>
                            </Box>
                        )}

                        {/* Map logo */}
                        <Box>
                            <Typography variant="body2" gutterBottom fontFamily={fonts.nostromoBold} color={colors.lightGrey}>
                                MAP
                            </Typography>

                            <Box
                                sx={{
                                    width: "100%",
                                    height: "3rem",
                                    background: `url(${
                                        lobby.game_map?.logo_url || "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/maps/logos/iron_dust_5.png"
                                    })`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "left center",
                                    backgroundSize: "contain",
                                }}
                            />
                        </Box>

                        {/* Reward pool and distribution */}
                        <PrizePool lobby={lobby} />

                        {/* Time left */}
                        {lobby.fill_at && (
                            <Box>
                                <Typography variant="body2" gutterBottom fontFamily={fonts.nostromoBold} color={colors.lightGrey}>
                                    READY IN
                                </Typography>

                                <Typography>
                                    <TimeLeft dateTo={lobby.fill_at} timeUpMessage="Filling with AI Mechs..." />
                                </Typography>
                            </Box>
                        )}

                        {lobby.expires_at && (
                            <Box>
                                <Typography variant="body2" gutterBottom fontFamily={fonts.nostromoBold} color={colors.lightGrey}>
                                    TIME LEFT
                                </Typography>

                                <Typography>
                                    <TimeLeft dateTo={lobby.expires_at} timeUpMessage="Closing lobby..." />
                                </Typography>
                            </Box>
                        )}
                    </Stack>

                    {/* Mechs */}
                    <MyFactionMechs factionLobbySlots={myFactionLobbySlots} isLocked={!!lobby.ready_at} onSlotClick={() => setIsJoinModalOpen(true)} />

                    {/* Other faction mechs */}
                    <OtherFactionMechs factionLobbySlots={otherFactionLobbySlots} />
                </Stack>

                {/* Supports */}
                <Supporters />
            </Stack>

            {/* Background map image */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `url(${
                        lobby.game_map?.background_url || "https://afiles.ninja-cdn.com//supremacy-stream-site/assets/img/maps/backgrounds/iron_dust.png"
                    })`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    opacity: 0.3,
                    zIndex: -2,
                }}
            />

            {/* Background gradient */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(to right, #000000BB 0%, #00000020 35%, #00000000)",
                    zIndex: -1,
                }}
            />
        </NiceBoxThing>
    )
})
