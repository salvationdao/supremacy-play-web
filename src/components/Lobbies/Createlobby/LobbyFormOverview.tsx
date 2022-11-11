import { Stack, Typography } from "@mui/material"
import { useFormContext } from "react-hook-form"
import { LobbyForm } from "./CreateLobby"
import { fonts } from "../../../theme/theme"
import { useTheme } from "../../../containers/theme"

export const LobbyFormOverview = () => {
    const { factionTheme } = useTheme()
    const { watch } = useFormContext<LobbyForm>()

    const { name } = watch()

    return (
        <Stack
            sx={{
                width: "60rem",
                p: "4rem",
                backgroundColor: `${factionTheme.primary}10`,
            }}
        >
            <Typography fontFamily={fonts.nostromoHeavy}>Lobby Overview</Typography>
            <Typography fontFamily={fonts.nostromoMedium}>{name ? name : "Lobby Name"}</Typography>
        </Stack>
    )
}
