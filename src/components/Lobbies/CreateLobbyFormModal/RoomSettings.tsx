import { Stack } from "@mui/material"
import { Controller, UseFormReturn } from "react-hook-form"
import { useTheme } from "../../../containers/theme"
import { NiceButtonGroup } from "../../Common/Nice/NiceButtonGroup"
import { NiceTextField } from "../../Common/Nice/NiceTextField"
import { Accessibility, CreateLobbyFormFields } from "./CreateLobbyFormModal"
import { FormField } from "./FormField"

export const RoomSettings = ({ formMethods }: { formMethods: UseFormReturn<CreateLobbyFormFields, unknown> }) => {
    const theme = useTheme()

    return (
        <Stack spacing="2.54rem">
            <FormField label="Lobby Access">
                <Controller
                    name="accessibility"
                    control={formMethods.control}
                    rules={{
                        required: { value: true, message: "Access field is required." },
                    }}
                    render={({ field }) => {
                        return (
                            <NiceButtonGroup
                                primaryColor={theme.factionTheme.primary}
                                secondaryColor={theme.factionTheme.text}
                                options={[
                                    { label: "Public", value: Accessibility.Public },
                                    { label: "Private", value: Accessibility.Private },
                                ]}
                                selected={field.value}
                                onSelected={(value) => field.onChange(value)}
                            />
                        )
                    }}
                />
            </FormField>

            <FormField label="Lobby Name">
                <Controller
                    name="name"
                    control={formMethods.control}
                    rules={{
                        required: { value: true, message: "Lobby name is required." },
                        maxLength: { value: 20, message: "Lobby name is too long." },
                    }}
                    render={({ field }) => {
                        const errorMessage = formMethods.formState.errors.name?.message
                        return (
                            <NiceTextField
                                primaryColor={theme.factionTheme.primary}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Enter lobby name..."
                                type="text"
                                error={!!errorMessage}
                                helperText={errorMessage}
                            />
                        )
                    }}
                />
            </FormField>
        </Stack>
    )
}
