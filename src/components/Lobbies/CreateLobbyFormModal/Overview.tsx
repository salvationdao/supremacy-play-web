import { Fade, Stack } from "@mui/material"
import { UseFormReturn } from "react-hook-form"
import { CreateLobbyFormFields } from "./CreateLobbyFormModal"

export const Overview = ({ formMethods }: { formMethods: UseFormReturn<CreateLobbyFormFields, unknown> }) => {
    return (
        <Fade in>
            <Stack></Stack>
        </Fade>
    )
}
