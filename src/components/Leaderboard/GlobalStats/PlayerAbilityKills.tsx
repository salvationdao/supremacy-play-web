import { Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { ClipThing } from "../.."
import { useSnackbar, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommands } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { User } from "../../../types"
import { CoolTable } from "../../Common/CoolTable"
import { Player } from "../../Common/Player"

interface RankItem {
    player: User
    ability_kill_count: number
}

export const PlayerAbilityKills = () => {
    const theme = useTheme()
    const { getFaction } = useSupremacy()
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommands("/public/commander")
    const [rankItems, setRankItems] = useState<RankItem[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    useEffect(() => {
        ;(async () => {
            try {
                setIsLoading(true)

                const resp = await send<RankItem[]>(GameServerKeys.GetPlayerAbilityKills)

                if (!resp) return
                setLoadError(undefined)
                setRankItems(resp)
            } catch (e) {
                const message = typeof e === "string" ? e : "Failed to player battles spectated."
                setLoadError(message)
                newSnackbarMessage(message, "error")
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [newSnackbarMessage, send])

    return (
        <ClipThing
            clipSize="8px"
            border={{
                isFancy: true,
                borderColor: primaryColor,
                borderThickness: ".2rem",
            }}
            backgroundColor={backgroundColor}
        >
            <CoolTable
                title="MOST ABILITY KILLS"
                tableHeadings={["TOP 10", "PLAYER", "FACTION", "ABILITY KILLS"]}
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

                    return [
                        <Typography
                            key={1}
                            variant="h6"
                            sx={{ textAlign: "center", fontWeight: "fontWeightBold", color, fontFamily: rank <= 3 ? fonts.nostromoBlack : "inherit" }}
                        >
                            {index + 1}
                        </Typography>,

                        <Player key={2} player={item.player} styledImageTextProps={{ variant: "h6", imageSize: 2.4 }} />,

                        <Typography variant="h6" key={3} sx={{ fontWeight: "fontWeightBold", color: faction.primary_color, textTransform: "uppercase" }}>
                            {faction.label}
                        </Typography>,

                        <Stack key={4} direction="row" spacing=".4rem" alignItems="center" justifyContent="center">
                            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                {item.ability_kill_count}
                            </Typography>
                        </Stack>,
                    ]
                }}
            />
        </ClipThing>
    )
}
