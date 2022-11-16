import { BattleLobby } from "../../../../../types/battle_queue"
import { Box, Stack, Typography } from "@mui/material"
import { NiceButton } from "../../../../Common/Nice/NiceButton"
import { useTheme } from "../../../../../containers/theme"

interface BattleLobbyInvitationProps {
    message: string
    data: BattleLobby
}

export const BattleLobbyInvitation = ({ message, data }: BattleLobbyInvitationProps) => {
    const { factionTheme } = useTheme()

    // todo: link used to redirect to the lobby

    return (
        <Stack spacing="3rem" sx={{ px: "1rem", pt: "1rem", pb: "3rem" }}>
            <Typography variant="h6">{message}</Typography>
            <Box>
                <NiceButton
                    corners
                    buttonColor={factionTheme.primary}
                    sx={{
                        px: "2rem",
                        py: ".4rem",
                        mx: "1.2rem",
                    }}
                    link={{ href: "/lobbies" }}
                >
                    GO TO LOBBY
                </NiceButton>
            </Box>
        </Stack>
    )
}
