import { Stack, Typography } from "@mui/material"
import { Controller, useFormContext } from "react-hook-form"
import { NiceTextField } from "../../Common/Nice/NiceTextField"
import React from "react"
import { useTheme } from "../../../containers/theme"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { fonts } from "../../../theme/theme"

export const RoomSettingForm = () => {
    const { factionTheme } = useTheme()
    const { control, formState } = useFormContext()
    const { errors } = formState

    return (
        <Stack direction="column" flex={1} spacing={2} sx={{ px: "15rem", py: "4rem" }}>
            <Stack spacing="1rem">
                <Typography variant="body1" fontFamily={fonts.nostromoBold}>
                    A. ACCESS:
                </Typography>
                <Stack direction="row" spacing={1}>
                    <NiceButton
                        border={{
                            color: factionTheme.primary,
                        }}
                    >
                        <Typography>Public</Typography>
                    </NiceButton>

                    <NiceButton
                        border={{
                            color: factionTheme.primary,
                        }}
                    >
                        <Typography>Private</Typography>
                    </NiceButton>
                </Stack>
            </Stack>

            <Stack spacing="1rem">
                <Typography variant="body1" fontFamily={fonts.nostromoBold}>
                    B. Name:
                </Typography>
                <Controller
                    name="name"
                    control={control}
                    rules={{
                        required: "Lobby name is required",
                    }}
                    render={({ field }) => (
                        <NiceTextField
                            fullWidth
                            value={field.value}
                            onChange={field.onChange}
                            primaryColor={factionTheme.primary}
                            errorMessage={errors[field.name]?.message as string}
                        />
                    )}
                />
            </Stack>
        </Stack>
    )
}
