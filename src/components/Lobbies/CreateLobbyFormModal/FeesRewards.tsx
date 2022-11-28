import { Fade, Stack, Typography } from "@mui/material"
import { Controller, UseFormReturn } from "react-hook-form"
import { SvgSupToken } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { colors } from "../../../theme/theme"
import { NiceTextField } from "../../Common/Nice/NiceTextField"
import { CreateLobbyFormFields } from "./CreateLobbyFormModal"
import { FormField } from "./FormField"

export const FeesRewards = ({ formMethods }: { formMethods: UseFormReturn<CreateLobbyFormFields, unknown> }) => {
    const theme = useTheme()

    return (
        <Fade in>
            <Stack spacing="2rem">
                <Typography variant="h4">Fees & Rewards</Typography>

                {/* Entry fee */}
                <FormField label="Entry fee">
                    <Controller
                        name="entry_fee"
                        control={formMethods.control}
                        rules={{
                            required: { value: true, message: "Entry fee is required." },
                            min: { value: 0, message: "Entry fee is too low." },
                        }}
                        render={({ field }) => {
                            const errorMessage = formMethods.formState.errors.entry_fee?.message
                            return (
                                <NiceTextField
                                    primaryColor={theme.factionTheme.primary}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Enter entry fee..."
                                    type="number"
                                    error={!!errorMessage}
                                    helperText={errorMessage}
                                    InputProps={{
                                        startAdornment: <SvgSupToken fill={colors.gold} size="1.5rem" />,
                                    }}
                                />
                            )
                        }}
                    />
                </FormField>

                {/* First win cut */}
                <FormField label="Champion winning payout %">
                    <Controller
                        name="first_faction_cut"
                        control={formMethods.control}
                        rules={{
                            required: { value: true, message: "Champion winning payout is required." },
                            min: { value: 0, message: "Champion winning payout is too low." },
                            max: { value: 100, message: "Champion winning payout is too high." },
                        }}
                        render={({ field }) => {
                            const errorMessage = formMethods.formState.errors.first_faction_cut?.message
                            return (
                                <NiceTextField
                                    primaryColor={theme.factionTheme.primary}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Enter champion winning payout..."
                                    type="number"
                                    error={!!errorMessage}
                                    helperText={errorMessage}
                                    InputProps={{
                                        startAdornment: <Typography>%</Typography>,
                                    }}
                                />
                            )
                        }}
                    />
                </FormField>

                {/* Second win cut */}
                <FormField label="Runner up winning payout %">
                    <Controller
                        name="second_faction_cut"
                        control={formMethods.control}
                        rules={{
                            required: { value: true, message: "Runner up winning payout is required." },
                            min: { value: 0, message: "Runner up winning payout is too low." },
                            max: { value: 100, message: "Runner up winning payout is too high." },
                        }}
                        render={({ field }) => {
                            const errorMessage = formMethods.formState.errors.second_faction_cut?.message
                            return (
                                <NiceTextField
                                    primaryColor={theme.factionTheme.primary}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Enter runner up winning payout..."
                                    type="number"
                                    error={!!errorMessage}
                                    helperText={errorMessage}
                                    InputProps={{
                                        startAdornment: <Typography>%</Typography>,
                                    }}
                                />
                            )
                        }}
                    />
                </FormField>

                {/* Extra reward */}
                <FormField label="Extra payout for all players">
                    <Controller
                        name="extra_reward"
                        control={formMethods.control}
                        rules={{
                            min: { value: 0, message: "Extra payout is too low." },
                        }}
                        render={({ field }) => {
                            const errorMessage = formMethods.formState.errors.extra_reward?.message
                            return (
                                <NiceTextField
                                    primaryColor={theme.factionTheme.primary}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Enter extra payout payout..."
                                    type="number"
                                    error={!!errorMessage}
                                    helperText={errorMessage}
                                    InputProps={{
                                        startAdornment: <SvgSupToken fill={colors.gold} size="1.5rem" />,
                                    }}
                                />
                            )
                        }}
                    />
                </FormField>
            </Stack>
        </Fade>
    )
}
