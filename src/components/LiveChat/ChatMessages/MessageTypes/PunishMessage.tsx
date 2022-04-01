import { Stack, Typography } from "@mui/material"
import { FactionsAll } from "../../../../containers"
import { PunishMessageData } from "../../../../types/chat"

export const PunishMessage = ({ sentAt, fontSize, factionsAll }: { data?: PunishMessageData; sentAt: Date; fontSize: number; factionsAll: FactionsAll }) => {
    const data = {
        issued_by_player_username: "jayli3n",
        reported_player_username: "darren_hung",
        is_passed: true,
        total_player_number: 16,
        agreed_player_number: 12,
        disagreed_player_number: 4,
    }
    const { issued_by_player_username, reported_player_username, is_passed, total_player_number, agreed_player_number, disagreed_player_number } = data

    if (!data) return null

    return (
        <Stack>
            <Typography sx={{ fontSize: fontSize ? `${1.35 * fontSize}rem` : "1.35rem" }}>
                <span className={`reported_player_username-${reported_player_username}`}>{reported_player_username}</span> has been
            </Typography>
        </Stack>
    )
}
