import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { SvgLobbies, SvgMap, SvgSupToken, SvgUserDiamond2 } from "../../../assets"
import { FactionIDs } from "../../../constants"
import { useArena, useAuth, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { supFormatter } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { FactionWithPalette } from "../../../types"
import { BattleLobbiesMech, BattleLobby, BattleLobbySupporter } from "../../../types/battle_queue"
import { AllGameMapsCombined } from "../../Common/AllGameMapsCombined"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
import { TimeLeft } from "../../Common/TimeLeft"
import { TypographyTruncated } from "../../Common/TypographyTruncated"
import { MyFactionMechs } from "./MyFactionMechs/MyFactionMechs"
import { OtherFactionMechs } from "./OtherFactionMechs/OtherFactionMechs"
import { PrizePool } from "./PrizePool"

export interface FactionLobbySlots {
    details: BattleLobby
    faction: FactionWithPalette
    mechSlots: BattleLobbiesMech[] // null represents empty slot
    selectedSupporterSlots: BattleLobbySupporter[] // null represents empty slot
    optedInSupporterSlots: BattleLobbySupporter[]
}

export const LobbyItem = React.memo(function LobbyItem({ battleLobby, joinBattleLobby }: { battleLobby: BattleLobby; joinBattleLobby: () => void }) {
    const theme = useTheme()
    const { factionID } = useAuth()
    const { arenaList } = useArena()
    const { getFaction, factionsAll } = useSupremacy()

    const arenaName = useMemo(() => arenaList.find((a) => a.id === battleLobby.assigned_to_arena_id)?.name, [arenaList, battleLobby.assigned_to_arena_id])

    const ownerFaction = useMemo(() => getFaction(battleLobby.host_by.faction_id), [getFaction, battleLobby.host_by.faction_id])

    const entryFeeDisplay = useMemo(() => {
        const hasFee = battleLobby.entry_fee !== "0"

        if (!hasFee) {
            return null
        }

        return (
            <Typography>
                <SvgSupToken inline size="1.7rem" fill={colors.gold} />
                {supFormatter(battleLobby.entry_fee, 2)} ENTRY FEE
            </Typography>
        )
    }, [battleLobby.entry_fee])

    const lobbyStatus = useMemo(() => {
        let textColor = colors.lightGrey
        let text = "WAITING FOR PLAYERS..."

        if (battleLobby.assigned_to_battle_id) {
            textColor = colors.red
            text = "BATTLE IN PROGRESS..."
        } else if (battleLobby.ready_at) {
            textColor = colors.green
            text = "READY"
        }

        return (
            <Typography variant="body2" fontFamily={fonts.nostromoBold} color={textColor}>
                {text}
            </Typography>
        )
    }, [battleLobby.assigned_to_battle_id, battleLobby.ready_at])

    const [myFactionLobbySlots, otherFactionLobbySlots] = useMemo(() => {
        let myFactionLobbySlots: FactionLobbySlots = {
            details: battleLobby,
            faction: getFaction(factionID),
            mechSlots: [],
            selectedSupporterSlots: [],
            optedInSupporterSlots: [],
        }

        const otherFactionLobbySlots: FactionLobbySlots[] = []

        Object.values(factionsAll)
            .sort((a, b) => a.label.localeCompare(b.label))
            .forEach((f) => {
                const bls: FactionLobbySlots = {
                    details: battleLobby,
                    faction: f,
                    mechSlots: [],
                    selectedSupporterSlots: [],
                    optedInSupporterSlots: [],
                }

                battleLobby.battle_lobbies_mechs.forEach((blm) => {
                    // Skip, if not in the same faction
                    if (blm.faction_id !== f.id) return

                    // Parse data
                    bls.mechSlots.push(blm)
                })

                // since supporters are already split up by faction, use a switch to add the right one to this object
                switch (f.id) {
                    case FactionIDs.ZHI:
                        bls.selectedSupporterSlots.push(...(battleLobby.selected_zai_supporters || []))
                        break
                    case FactionIDs.BC:
                        bls.selectedSupporterSlots.push(...(battleLobby.selected_bc_supporters || []))
                        break
                    case FactionIDs.RM:
                        bls.selectedSupporterSlots.push(...(battleLobby.selected_rm_supporters || []))
                        break
                }

                if (f.id === factionID) {
                    myFactionLobbySlots = bls
                } else {
                    otherFactionLobbySlots.push(bls)
                }
            })

        return [myFactionLobbySlots, otherFactionLobbySlots]
    }, [battleLobby, factionID, factionsAll, getFaction])

    return (
        <>
            <NiceBoxThing
                border={{ color: "#FFFFFF20", thickness: "very-lean" }}
                background={{ colors: ["#FFFFFF"], opacity: 0.06 }}
                sx={{ width: "100%", height: "100%", overflow: "hidden" }}
            >
                {/* Lobby details */}
                <Stack direction="row" alignItems="center" spacing="2rem" sx={{ p: "1.2rem 1.8rem", backgroundColor: `${theme.factionTheme.s400}16` }}>
                    {/* Lobby name */}
                    <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                        <SvgLobbies inline size="2.4rem" /> {battleLobby.name || `Lobby #${battleLobby.number}`}
                    </Typography>

                    {/* Entry fees */}
                    {entryFeeDisplay}

                    <Box flex={1} />

                    {/* Time */}
                    {battleLobby.is_private || (!battleLobby.fill_at && !battleLobby.expires_at) ? (
                        lobbyStatus
                    ) : (
                        <Typography variant="body2" fontFamily={fonts.nostromoBold} color={colors.neonBlue}>
                            <TimeLeft
                                dateTo={(battleLobby.generated_by_system ? battleLobby.fill_at : battleLobby.expires_at) || new Date()}
                                prefixText={battleLobby.generated_by_system ? "READY IN " : "EXPIRES IN "}
                                timeUpText="Filling with AI Mechs..."
                            />
                        </Typography>
                    )}
                </Stack>

                <Stack direction="row" spacing="3rem" sx={{ position: "relative", flex: 1, p: "1.6rem 2rem", pr: "2.5rem" }}>
                    <Stack spacing="1.8rem" sx={{ width: "27rem" }}>
                        {/* Host name */}
                        <Stack direction="row" alignItems="center" spacing=".6rem">
                            {ownerFaction.logo_url && (
                                <Box
                                    sx={{
                                        width: "2.8rem",
                                        height: "2.8rem",
                                        background: `url(${ownerFaction.logo_url})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "contain",
                                    }}
                                />
                            )}
                            <TypographyTruncated variant="h6" sx={{ color: ownerFaction.palette.primary, fontWeight: "bold" }}>
                                {!ownerFaction.logo_url && (
                                    <>
                                        <SvgUserDiamond2 size="2.2rem" inline fill={ownerFaction.palette.primary} />{" "}
                                    </>
                                )}
                                {battleLobby.generated_by_system ? "The Overseer" : `${battleLobby.host_by.username}#${battleLobby.host_by.gid}`}
                            </TypographyTruncated>
                        </Stack>

                        {/* Map logo */}
                        <Box>
                            <Typography variant="body2" gutterBottom fontFamily={fonts.nostromoBold}>
                                <SvgMap inline /> MAP
                            </Typography>

                            {battleLobby.game_map ? (
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: "2.5rem",
                                        background: `url(${
                                            battleLobby.game_map?.logo_url ||
                                            "https://afiles.ninja-cdn.com/supremacy-stream-site/assets/img/maps/logos/iron_dust_5.png"
                                        })`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "left center",
                                        backgroundSize: "contain",
                                    }}
                                />
                            ) : (
                                <Typography color={colors.grey}>
                                    <i>To be determined...</i>
                                </Typography>
                            )}
                        </Box>

                        {/* Reward pool and distribution */}
                        <PrizePool battleLobby={battleLobby} />
                    </Stack>

                    {/* Divider line */}
                    <Box sx={{ borderRight: "#FFFFFF16 1px solid" }} />

                    {/* Mechs */}
                    <MyFactionMechs
                        battleLobby={battleLobby}
                        myFactionLobbySlots={myFactionLobbySlots}
                        isLocked={!!battleLobby.ready_at}
                        onSlotClick={joinBattleLobby}
                    />

                    {/* Other faction mechs */}
                    <OtherFactionMechs battleLobby={battleLobby} otherFactionLobbySlots={otherFactionLobbySlots} />

                    {/* Background map image */}
                    <Box
                        sx={{
                            position: "absolute",
                            m: "0 !important",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `url(${battleLobby.game_map?.background_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            opacity: 0.3,
                            zIndex: -2,
                        }}
                    >
                        {!battleLobby.game_map && <AllGameMapsCombined sx={{ height: "100%", width: "100%", opacity: 0.6 }} />}
                    </Box>

                    {/* Background gradient */}
                    <Box
                        sx={{
                            position: "absolute",
                            m: "0 !important",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "linear-gradient(65deg, #000000EF 0%, #000000AB 30%, #00000000)",
                            zIndex: -1,
                        }}
                    />
                </Stack>

                {/* Supports */}
                <Stack direction="row" alignItems="center" spacing="2rem" sx={{ height: "4.5rem", p: "0 1.5rem" }}>
                    {battleLobby.will_not_start_until && (
                        <Stack direction="row" alignItems="center" spacing=".6rem">
                            <Typography
                                variant="body2"
                                fontFamily={fonts.nostromoBold}
                                sx={{ color: battleLobby.will_not_start_until ? colors.orange : "#FFFFFF" }}
                            >
                                Scheduled time: {battleLobby.will_not_start_until.toLocaleString()}
                            </Typography>
                        </Stack>
                    )}

                    <Box flex={1} />

                    {/* Arena name */}
                    {arenaName && (
                        <Stack direction="row" alignItems="center" spacing=".6rem">
                            <Typography variant="body2" fontFamily={fonts.nostromoBold}>
                                Battle arena: {arenaName}
                            </Typography>
                        </Stack>
                    )}
                </Stack>
            </NiceBoxThing>
        </>
    )
})
