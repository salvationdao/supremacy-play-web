import { BattleLobby } from "../../../types/battle_queue"
import { useTheme } from "../../../containers/theme"
import { Box, Stack, Typography } from "@mui/material"
import { fonts } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"
import React from "react"
import { camelToTitle, supFormatter } from "../../../helpers"
import { BattleLobbyMechSlots } from "./BattleLobbyMechSlots"

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
