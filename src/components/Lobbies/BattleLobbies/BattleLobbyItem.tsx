import { BattleLobbiesMech, BattleLobby } from "../../../types/battle_queue"
import { useTheme } from "../../../containers/theme"
import { FancyButton } from "../../Common/FancyButton"
import { Box, Stack, Typography } from "@mui/material"
import { fonts } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"
import { MechCard } from "../../UpcomingBattle/MechCard"
import { useMemo } from "react"
import { useSupremacy } from "../../../containers"
import { Faction } from "../../../types"

export const BattleLobbyItem = ({ battleLobby }: { battleLobby: BattleLobby }) => {
    const theme = useTheme()

    const { game_map, number } = battleLobby
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
                        sx={{ p: ".35rem", position: "relative", minHeight: "12rem", background: `url(${game_map.background_url})` }}
                    >
                        {/* Lobby Info */}
                        <Stack direction="column" height="100%">
                            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>Lobby #{number}</Typography>
                            {/* Map detail, NOTE: undefined map detail mean  */}
                        </Stack>

                        {/* Mech slots */}
                        <BattleLobbyMechSlots battleLobbyMechs={battle_lobbies_mechs} />
                    </Stack>
                </ClipThing>
            </Box>
        </Stack>
    )
}

interface MechSlot {
    mechID: string
    faction: Faction
    mechName: string
    avatarURL: string
}

const BattleLobbyMechSlots = ({ battleLobbyMechs }: { battleLobbyMechs: BattleLobbiesMech[] }) => {
    const { factionsAll } = useSupremacy()
    // fill up slot
    const mechSlots = useMemo(() => {
        const factions = Object.values(factionsAll).sort((a, b) => a.label.localeCompare(b.label))
        const mechAmountForEachFaction = 3
        const mechSlots: MechSlot[] = []

        // insert mech slot
        factions.forEach((f) => {
            let amount = 0
            battleLobbyMechs.forEach((blm) => {
                if (blm.owner.faction_id !== f.id) return

                mechSlots.push({
                    mechID: blm.mech_id,
                    faction: f,
                    mechName: blm.name || blm.label,
                    avatarURL: blm.avatar_url,
                })

                amount += 1
            })

            // insert default slots
            while (amount < mechAmountForEachFaction) {
                mechSlots.push({
                    mechID: "",
                    faction: f,
                    mechName: "",
                    avatarURL: "",
                })
                amount += 1
            }
        })

        return mechSlots
    }, [battleLobbyMechs, factionsAll])

    return (
        <Stack direction="row" width={"100%"}>
            {mechSlots.map((ms, i) => (
                <MechCard key={i} mechID={ms.mechID} faction={ms.faction} mechName={ms.mechName} avatarURL={ms.avatarURL} />
            ))}
        </Stack>
    )
}
