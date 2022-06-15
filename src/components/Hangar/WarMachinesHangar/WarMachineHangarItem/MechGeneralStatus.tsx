import { Box, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { fonts, colors } from "../../../../theme/theme"
import { MechStatus } from "../../../../types"

export const MechGeneralStatus = ({
    mechID,
    setMechStatus,
}: {
    mechID: string
    mechStatus?: MechStatus
    setMechStatus: React.Dispatch<React.SetStateAction<MechStatus | undefined>>
}) => {
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
            setMechStatus(payload)
            if (payload.status === "IDLE") {
                setText("IDLE")
                setColour(colors.green)
            } else if (payload.status === "QUEUE") {
                const queuePosition = payload.queue_position
                setText(`IN QUEUE${queuePosition ? `: ${queuePosition}` : ""}`)
                setColour(colors.yellow)
            } else if (payload.status === "BATTLE") {
                setText("IN BATTLE")
                setColour(colors.red)
            } else if (payload.status === "MARKET") {
                setText("IN MARKETPLACE")
                setColour(colors.orange)
            } else if (payload.status === "SOLD") {
                setText("SOLD")
                setColour(colors.lightGrey)
            }
        },
    )

    // Manually tell the server to update the mech status
    const triggerStatusUpdate = useCallback(
        async (currentStatus: string) => {
            try {
                // TODO: status is not correct need to be fixed
                console.log({ currentStatus })
                // if (currentStatus !== "QUEUE") return
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
