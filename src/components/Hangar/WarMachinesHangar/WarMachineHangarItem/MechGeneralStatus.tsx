import { Box, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { fonts, colors } from "../../../../theme/theme"
import { MechStatus } from "../../../../types"

export const MechGeneralStatus = ({ mechID }: { mechID: string }) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [text, setText] = useState("LOADING...")
    const [color, setColour] = useState(theme.factionTheme.primary)

    useGameServerSubscriptionFaction<MechStatus>(
        {
            URI: `/queue/${mechID}`,
            key: GameServerKeys.SubMechQueuePosition,
        },
        (payload) => {
            if (!payload) return
            switch (payload.status) {
                case "IDLE":
                    setText("IDLE")
                    setColour(colors.green)
                    break
                case "QUEUE":
                    setText(`IN QUEUE${payload.queue_position ? `: ${payload.queue_position}` : ""}`)
                    setColour(colors.yellow)
                    break
                case "BATTLE":
                    setText("IN BATTLE")
                    setColour(colors.red)
                    break
                case "MARKET":
                    setText("IN MARKETPLACE")
                    setColour(colors.orange)
                    break
                case "SOLD":
                    setText("SOLD")
                    setColour(colors.lightGrey)
                    break
            }
        },
    )

    // Manually tell the server to update the mech status
    const triggerStatusUpdate = useCallback(
        async (currentStatus: string) => {
            try {
                if (currentStatus.includes("QUEUE")) return
                await send(GameServerKeys.TriggerMechStatusUpdate, {
                    mech_id: mechID,
                })
            } catch (e) {
                console.error(e)
            }
        },
        [mechID, send],
    )

    // When the battle queue is updated, tell the server to send the mech status to us again
    useGameServerSubscriptionFaction<boolean>(
        {
            URI: "/queue-update",
            key: GameServerKeys.MechQueueUpdated,
        },
        (payload) => {
            if (!payload) return

            triggerStatusUpdate(text)
        },
    )

    return (
        <Box sx={{ px: "1.6rem", pt: ".9rem", pb: ".6rem", backgroundColor: `${color}10`, border: `${color} 1.5px dashed` }}>
            <Typography variant="body2" sx={{ color, textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                {text}
            </Typography>
        </Box>
    )
}
