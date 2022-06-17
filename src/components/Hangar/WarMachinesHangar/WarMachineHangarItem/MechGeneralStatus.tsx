import { Box, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { fonts, colors } from "../../../../theme/theme"
import { MechStatus, MechStatusEnum } from "../../../../types"

export const MechGeneralStatus = ({ mechID, smallSize }: { mechID: string; smallSize?: boolean }) => {
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
            if (!payload || text === "SOLD") return
            switch (payload.status) {
                case MechStatusEnum.Idle:
                    setText("IDLE")
                    setColour(colors.green)
                    break
                case MechStatusEnum.Queue:
                    setText(`IN QUEUE${payload.queue_position ? `: ${payload.queue_position}` : ""}`)
                    setColour(colors.yellow)
                    break
                case MechStatusEnum.Battle:
                    setText("IN BATTLE")
                    setColour(colors.orange)
                    break
                case MechStatusEnum.Market:
                    setText("MARKETPLACE")
                    setColour(colors.red)
                    break
                case MechStatusEnum.Sold:
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
        <Box sx={{ p: smallSize ? ".1rem 1rem" : ".9rem 1.6rem .6rem 1.6rem", backgroundColor: `${color}20`, border: `${color} 1.5px dashed` }}>
            <Typography variant={smallSize ? "caption" : "body2"} sx={{ color, textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                {text}
            </Typography>
        </Box>
    )
}
