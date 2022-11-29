import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { colors } from "../../../theme/theme"
import { BattleLobby } from "../../../types/battle_queue"
import { TypographyTruncated } from "../../Common/TypographyTruncated"
import { FactionLobbySlots } from "../../Lobbies/LobbyItem/LobbyItem"

export interface BattleIntroProps {
    currentBattle: BattleLobby
}

export const BattleIntro = ({ currentBattle }: BattleIntroProps) => {
    const { factionsAll } = useSupremacy()

    const factions = useMemo(() => {
        if (!currentBattle) return
        const lobbies: FactionLobbySlots[] = []

        Object.values(factionsAll)
            .sort((a, b) => a.label.localeCompare(b.label))
            .forEach((f) => {
                const bls: FactionLobbySlots = {
                    faction: f,
                    mechSlots: [],
                    supporterSlots: [],
                }

                currentBattle.battle_lobbies_mechs.forEach((blm) => {
                    // Skip, if not in the same faction
                    if (blm.faction_id !== f.id) return

                    // Parse data
                    bls.mechSlots.push(blm)
                })

                lobbies.push(bls)
            })

        return lobbies
    }, [currentBattle, factionsAll])

    return (
        <Stack
            sx={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `url(${currentBattle?.game_map?.background_url})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            {factions?.map((f, index) => (
                <FactionRow key={index} lobby={f} />
            ))}
        </Stack>
    )
}

interface FactionRowProps {
    lobby: FactionLobbySlots
}

const FactionRow = ({ lobby }: FactionRowProps) => {
    const theme = useTheme()

    return (
        <Stack
            direction="row"
            sx={{
                p: "2rem 4rem",
                justifyContent: "space-around",
            }}
        >
            <Box
                component="img"
                src={lobby.faction.logo_url}
                sx={{
                    width: 80,
                    height: 80,
                    objectFit: "contain",
                }}
            />
            {lobby.mechSlots.map((ms, index) => (
                <Stack key={index}>
                    <Stack direction="row" spacing=".5rem">
                        <Box
                            component="img"
                            src={ms.avatar_url}
                            sx={{
                                width: 100,
                                objectFit: "cover",
                                border: `1px solid ${colors.black2}`,
                            }}
                        />
                        <Stack spacing=".5rem">
                            {ms.weapon_slots &&
                                ms.weapon_slots.map((w, index) => (
                                    <Box
                                        key={index}
                                        component="img"
                                        src={w.weapon?.avatar_url}
                                        sx={{
                                            flex: 1,
                                            flexBasis: "4rem",
                                            backgroundColor: theme.factionTheme.background,
                                            objectFit: "contain",
                                        }}
                                    />
                                ))}
                        </Stack>
                    </Stack>
                    <TypographyTruncated>{ms.name || ms.label}</TypographyTruncated>
                </Stack>
            ))}
        </Stack>
    )
}
