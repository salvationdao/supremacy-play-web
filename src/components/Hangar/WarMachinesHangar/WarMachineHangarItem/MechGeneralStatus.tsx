import { Box, Typography } from "@mui/material"
import { useCallback } from "react"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { fonts, colors } from "../../../../theme/theme"
import { MechStatus } from "../../../../types"

export const MechGeneralStatus = ({
    mechID,
    mechStatus,
    setMechStatus,
}: {
    mechID: string
    mechStatus?: MechStatus
    setMechStatus: React.Dispatch<React.SetStateAction<MechStatus | undefined>>
}) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    useGameServerSubscriptionFaction<MechStatus>(
        {
            URI: `/queue/${mechID}`,
            key: GameServerKeys.SubMechQueuePosition,
        },
        (payload) => {
            if (!payload) return
            setMechStatus(payload)
        },
    )

    // Manually tell the server to update the mech status
    const triggerStatusUpdate = useCallback(async () => {
        try {
            if (mechStatus?.status !== "QUEUE") return
            await send(GameServerKeys.TriggerMechStatusUpdate, {
                mech_id: mechID,
            })
        } catch (e) {
            console.error(e)
        }
    }, [mechID, mechStatus?.status, send])

    // When the battle queue is updated, tell the server to send the mech status to us again
    useGameServerSubscriptionFaction<boolean>(
        {
            URI: "/xxxxxxxxx",
            key: GameServerKeys.MechQueueUpdated,
        },
        (payload) => {
            if (!payload) return
            triggerStatusUpdate()
        },
    )

    let text = "LOADING..."
    let color = theme.factionTheme.primary

    if (mechStatus?.status === "IDLE") {
        text = "IDLE"
        color = colors.green
    } else if (mechStatus?.status === "QUEUE") {
        const queuePosition = mechStatus?.queue_position
        text = `IN QUEUE${queuePosition ? `: ${queuePosition}` : ""}`
        color = colors.yellow
    } else if (mechStatus?.status === "BATTLE") {
        text = "IN BATTLE"
        color = colors.red
    } else if (mechStatus?.status === "MARKET") {
        text = "IN MARKETPLACE"
        color = colors.orange
    } else if (mechStatus?.status === "SOLD") {
        text = "SOLD"
        color = colors.lightGrey
    }

    return (
        <Box sx={{ px: "1.6rem", pt: ".9rem", pb: ".6rem", backgroundColor: `${color}10`, border: `${color} 1.5px dashed` }}>
            <Typography variant="body2" sx={{ color, textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                {text}
            </Typography>
        </Box>
    )
}
