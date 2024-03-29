import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { useAuth, useGlobalNotifications, useSupremacy } from "../../containers"
import { useTheme } from "../../containers/theme"
import { useGameServerCommands } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { User } from "../../types"
import { NiceTable } from "../Common/Nice/NiceTable"
import { PlayerNameGid } from "../Common/PlayerNameGid"
import { TypographyTruncated } from "../Common/TypographyTruncated"

interface RankItem {
    player: User
    mechs_owned: number
}

export const PlayerMechsOwned = () => {
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

                const resp = await send<RankItem[]>(GameServerKeys.GetPlayerMechsOwned)

                if (!resp) return
                setLoadError(undefined)
                setRankItems(resp)
            } catch (e) {
                const message = typeof e === "string" ? e : "Failed to player mechs owned."
                setLoadError(message)
                newSnackbarMessage(message, "error")
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [newSnackbarMessage, send])

    return (
        <NiceTable
            tableHeadings={["TOP 100", "PLAYER", "FACTION", "MECHS OWNED"]}
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
                            border: item.player.id === userID ? `${rank <= 3 ? color : primaryColor} 1px solid` : "unset",
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

                        <PlayerNameGid key={2} player={item.player} variant="h6" />,

                        <TypographyTruncated variant="h6" key={3} sx={{ fontWeight: "bold", color: faction.palette.primary }}>
                            {faction.label}
                        </TypographyTruncated>,

                        <Stack key={4} direction="row" spacing=".4rem" alignItems="center" justifyContent="center">
                            <TypographyTruncated variant="h6" sx={{ fontWeight: "bold" }}>
                                {item.mechs_owned}
                            </TypographyTruncated>
                        </Stack>,
                    ],
                }
            }}
        />
    )
}
