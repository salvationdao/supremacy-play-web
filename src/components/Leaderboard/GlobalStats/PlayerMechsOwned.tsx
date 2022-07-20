import { Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useSnackbar, useSupremacy } from "../../../containers"
import { useGameServerCommands } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { User } from "../../../types"
import { Player } from "../../Common/Player"
import { RanksTable } from "../Common/RanksTable"

interface RankItem {
    player: User
    mechs_owned: number
}

export const PlayerMechsOwned = () => {
    const { getFaction } = useSupremacy()
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommands("/public/commander")
    const [rankItems, setRankItems] = useState<RankItem[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    useEffect(() => {
        ;(async () => {
            try {
                setIsLoading(true)

                const resp = await send<RankItem[]>(GameServerKeys.GetPlayerMechsOwned)

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
        <RanksTable
            title="MOST MECHS OWNED"
            tableHeadings={["TOP 10", "PLAYER", "FACTION", "MECHS OWNED"]}
            alignments={["center", "left", "left", "center"]}
            widths={["19rem", "auto", "auto", "23rem"]}
            rankItems={rankItems}
            isLoading={isLoading}
            loadError={loadError}
            renderItem={(item, index) => {
                const faction = getFaction(item.player.faction_id)
                return [
                    <Typography variant="h6" key={1} sx={{ fontWeight: "fontWeightBold", textAlign: "center" }}>
                        #{index + 1}
                    </Typography>,

                    <Player key={2} player={item.player} styledImageTextProps={{ variant: "h6", imageSize: 2.4 }} />,

                    <Typography variant="h6" key={3} sx={{ fontWeight: "fontWeightBold", color: faction.primary_color, textTransform: "uppercase" }}>
                        {faction.label}
                    </Typography>,

                    <Typography variant="h6" key={4} sx={{ textAlign: "center" }}>
                        {item.mechs_owned}
                    </Typography>,
                ]
            }}
        />
    )
}
