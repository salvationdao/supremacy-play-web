import { Stack, Switch, Typography } from "@mui/material"
import { Dispatch, useCallback, useState } from "react"
import { PlayerPrefs } from "../../.."
import { WebSocketProperties } from "../../../../containers"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"

interface BattleQueueSMSProps extends Partial<WebSocketProperties> {
    playerPrefs: PlayerPrefs
    setPlayerPrefs: Dispatch<React.SetStateAction<PlayerPrefs | undefined>>
}

export const BattleQueueSMS = ({ playerPrefs, setPlayerPrefs, send }: BattleQueueSMSProps) => {
    const [error, setError] = useState<string>()

    const toggleNotificationsBattleQueueSMS = useCallback(async () => {
        if (!send) return

        try {
            await send(GameServerKeys.TogglePlayerBattleQueueSMS, {
                battle_queue_sms: !playerPrefs?.notifications_battle_queue_sms,
            })

            setPlayerPrefs((prev) => {
                if (!prev) return prev
                return { ...prev, notifications_battle_queue_sms: !prev.notifications_battle_queue_sms }
            })

            setError(undefined)
        } catch (e) {
            if (typeof e === "string") return setError(e)
            setError("Unable to update SMS preference, please try again.")
        }
    }, [send, playerPrefs, setPlayerPrefs])

    return (
        <Stack sx={{ px: "1.2rem", py: ".6rem", backgroundColor: "#FFFFFF05", borderRadius: 1 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                    Enable Battle Queue SMS Notifications:
                </Typography>
                <Switch
                    size="small"
                    checked={!!playerPrefs?.notifications_battle_queue_sms}
                    onChange={toggleNotificationsBattleQueueSMS}
                    sx={{
                        transform: "scale(.7)",
                        ".Mui-checked": { color: colors.neonBlue },
                        ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.neonBlue}50` },
                    }}
                />
            </Stack>
            {error && (
                <Typography variant="body2" sx={{ color: colors.red }}>
                    {error}
                </Typography>
            )}
        </Stack>
    )
}
