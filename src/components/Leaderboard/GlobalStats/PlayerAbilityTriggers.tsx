import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { useAuth, useGlobalNotifications, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommands } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { LeaderboardRound, User } from "../../../types"
import { NiceTable } from "../../Common/Nice/NiceTable"
import { PlayerNameGid } from "../../Common/PlayerNameGid"
import { TypographyTruncated } from "../../Common/TypographyTruncated"

interface RankItem {
    player: User
    total_ability_triggered: number
}

export const PlayerAbilityTriggers = ({ selectedRound }: { selectedRound?: LeaderboardRound }) => {
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

                const resp = await send<RankItem[]>(GameServerKeys.GetPlayerAbilityTriggers, { round_id: selectedRound?.id })

                if (!resp) return
                setLoadError(undefined)
                setRankItems(resp)
            } catch (e) {
                const message = typeof e === "string" ? e : "Failed to player ability triggers."
                setLoadError(message)
                newSnackbarMessage(message, "error")
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [newSnackbarMessage, selectedRound?.id, send])

    return (
        <NiceTable
            tableHeadings={["TOP 100", "PLAYER", "FACTION", "ABILITIES TRIGGERED"]}
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
                        <TypographyTruncated
                            key={1}
                            variant="h6"
                            sx={{ textAlign: "center", fontWeight: "bold", color, fontFamily: rank <= 3 ? fonts.nostromoBlack : "inherit" }}
                        >
                            {index + 1}
                        </TypographyTruncated>,

                        <PlayerNameGid key={2} player={item.player} styledImageTextProps={{ variant: "h6", imageSize: 2.4 }} />,

                        <TypographyTruncated variant="h6" key={3} sx={{ fontWeight: "bold", color: faction.palette.primary, textTransform: "uppercase" }}>
                            {faction.label}
                        </TypographyTruncated>,

                        <Stack key={4} direction="row" spacing=".4rem" alignItems="center" justifyContent="center">
                            <TypographyTruncated variant="h6" sx={{ fontWeight: "bold" }}>
                                {item.total_ability_triggered}
                            </TypographyTruncated>
                        </Stack>,
                    ],
                }
            }}
        />
    )
}
