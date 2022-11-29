import { Fade, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { CreateLobbyFormFields } from "./CreateLobbyFormModal"

export const Overview = ({ formMethods }: { formMethods: UseFormReturn<CreateLobbyFormFields, unknown> }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const {
        name,
        accessibility,
        access_code,
        game_map,
        max_deploy_number,
        scheduling_type,
        entry_fee,
        first_faction_cut,
        second_faction_cut,
        extra_reward,
        selected_mechs,
        wont_start_until_date,
        wont_start_until_time,
    } = formMethods.watch()

    return (
        <Fade in>
            <Stack spacing="2rem">
                <Typography variant="h4">Overview</Typography>
            </Stack>
        </Fade>
    )
}
