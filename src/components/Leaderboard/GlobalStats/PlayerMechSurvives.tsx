import { Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useAuth, useGlobalNotifications, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommands } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { LeaderboardRound, User } from "../../../types"
import { CoolTable } from "../../Common/Nice/NiceTable"
import { PlayerNameGid } from "../../Common/PlayerNameGid"

interface RankItem {
    player: User
    mech_survive_count: number
}

export const PlayerMechSurvives = ({ selectedRound }: { selectedRound?: LeaderboardRound }) => {
    const theme = useTheme()
    const { userID } = useAuth()
    const { getFaction } = useSupremacy()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommands("/public/commander")
    const [rankItems, setRankItems] = useState<RankItem[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const primaryColor = theme.factionTheme.primary

    useEffect(() => {
        ;(async () => {
            try {
                setIsLoading(true)

                const resp = await send<RankItem[]>(GameServerKeys.GetPlayerMechSurvives, { round_id: selectedRound?.id })

                if (!resp) return
                setLoadError(undefined)
                setRankItems(resp)
            } catch (e) {
                const message = typeof e === "string" ? e : "Failed to player mech survives."
                setLoadError(message)
                newSnackbarMessage(message, "error")
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [newSnackbarMessage, selectedRound?.id, send])

    return (
        <CoolTable
            title="MOST MECH SURVIVES"
            tableHeadings={["TOP 100", "PLAYER", "FACTION", "MECH SURVIVES"]}
            alignments={["center", "left", "left", "center"]}
            widths={["19rem", "auto", "auto", "23rem"]}
            items={rankItems}
            isLoading={isLoading}
            loadError={loadError}
            renderItem={(item, index) => {
                const rank = index + 1
                const faction = getFaction(item.player.faction_id)

                let color = "#FFFFFF"
                if (rank === 1) color = colors.yellow
                if (rank === 2) color = colors.silver
                if (rank === 3) color = colors.bronze

                return {
                    rowProps: {
                        sx: {
                            backgroundColor: item.player.id === userID ? `${rank <= 3 ? color : primaryColor}20` : "unset",
                            border: item.player.id === userID ? `${rank <= 3 ? color : primaryColor} 3px solid` : "unset",
                        },
                    },
                    cells: [
                        <Typography
                            key={1}
                            variant="h6"
                            sx={{ textAlign: "center", fontWeight: "bold", color, fontFamily: rank <= 3 ? fonts.nostromoBlack : "inherit" }}
                        >
                            {index + 1}
                        </Typography>,

                        <PlayerNameGid key={2} player={item.player} styledImageTextProps={{ variant: "h6", imageSize: 2.4 }} />,

                        <Typography variant="h6" key={3} sx={{ fontWeight: "bold", color: faction.palette.primary, textTransform: "uppercase" }}>
                            {faction.label}
                        </Typography>,

                        <Stack key={4} direction="row" spacing=".4rem" alignItems="center" justifyContent="center">
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {item.mech_survive_count}
                            </Typography>
                        </Stack>,
                    ],
                }
            }}
        />
    )
}
