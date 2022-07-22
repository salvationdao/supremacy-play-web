import { Box, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { fonts, colors } from "../../../../theme/theme"
import { MechStatus, MechStatusEnum } from "../../../../types"

export const MechGeneralStatus = ({ mechID, hideBox }: { mechID: string; hideBox?: boolean }) => {
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
                case MechStatusEnum.Damaged:
                    setText("DAMAGED")
                    setColour(colors.red)
                    break
                case MechStatusEnum.StandardRepairing:
                    setText("REPAIRING")
                    setColour(colors.red)
                    break
                case MechStatusEnum.FastRepairing:
                    setText("REPAIRING (FAST)")
                    setColour(colors.red)
                    break
            }
        },
    )

    // Manually tell the server to update the mech status
    const triggerStatusUpdate = useCallback(
        async (currentStatus: string) => {
            try {
                if (currentStatus.includes("QUEUE")) return
                console.log("send status update")
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
            URI: `/mech/${mechID}/repair-update`,
            key: GameServerKeys.MechQueueUpdated,
        },
        (payload) => {
            if (!payload) return

            // force update status
            triggerStatusUpdate("")
        },
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
        <Box sx={hideBox ? {} : { p: ".2rem 1rem", backgroundColor: `${color}20`, border: `${color} 1.5px dashed` }}>
            <Typography variant="body2" sx={{ color, textAlign: hideBox ? "start" : "center", fontFamily: fonts.nostromoBlack }}>
                {text}
            </Typography>
        </Box>
    )
}
