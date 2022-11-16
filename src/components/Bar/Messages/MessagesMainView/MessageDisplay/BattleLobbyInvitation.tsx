import { BattleLobby } from "../../../../../types/battle_queue"
import { Stack, Typography } from "@mui/material"
import { NiceButton } from "../../../../Common/Nice/NiceButton"

interface BattleLobbyInvitationProps {
    message: string
    data: BattleLobby
}

export const BattleLobbyInvitation = ({ message, data }: BattleLobbyInvitationProps) => {
    console.log(data)
    return (
        <Stack spacing="3rem" sx={{ px: "1rem", pt: "1rem", pb: "3rem" }}>
            <Typography variant="h6">{message}</Typography>
            <NiceButton>GO TO LOBBY</NiceButton>
        </Stack>
    )
}
