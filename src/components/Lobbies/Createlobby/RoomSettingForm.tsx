import { Box, Stack, Typography } from "@mui/material"
import { Controller, useFormContext } from "react-hook-form"
import { NiceTextField } from "../../Common/Nice/NiceTextField"
import React, { useCallback } from "react"
import { useTheme } from "../../../containers/theme"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { fonts } from "../../../theme/theme"
import { Accessibility, Scheduling } from "./CreateLobby"
import { GameMapSelector } from "./GameMapSelector"
import { FactionBasedDatePicker } from "../../Common/FactionBasedDatePicker"
import { FactionBasedTimePicker } from "../../Common/FactionBasedTimePicker"

interface RoomSettingFormProps {
    nextPage: () => void
}

export const RoomSettingForm = ({ nextPage }: RoomSettingFormProps) => {
    const { factionTheme } = useTheme()
    const { control, formState, watch, setValue, trigger } = useFormContext()
    const { errors } = formState

    const accessibility = watch("accessibility")
    const maxDeployNumber = watch("max_deploy_number")
    const schedulingType = watch("scheduling_type")
    const wontStartUntilDate = watch("wont_start_until_date")
    const wontStartUntilTime = watch("wont_start_until_time")

    const nextForm = useCallback(async () => {
        const valid = await trigger(["name"])
        if (!valid) return

        nextPage()
    }, [trigger, nextPage])

    return (
        <Stack direction="column" flex={1} sx={{ px: "25rem", py: "4rem" }}>
            <Stack direction="column" flex={1} spacing="5rem">
                <Stack spacing="2rem">
                    <Section
                        orderLabel="A"
                        title="ACCESS"
                        description={
                            accessibility === Accessibility.Private ? "A private lobby is available for anyone with access to the generated code." : undefined
                        }
                    />

                    <Stack direction="row" spacing="2rem">
                        {Object.values(Accessibility).map((a) => (
                            <NiceButton
                                key={a}
                                buttonColor={`${factionTheme.primary}${a === accessibility ? "" : "AA"}`}
                                sx={{
                                    opacity: a === accessibility ? 1 : 0.5,
                                    px: "3rem",
                                    py: "1rem",
                                }}
                                onClick={() => setValue("accessibility", a as Accessibility)}
                            >
                                <Typography variant="h6" fontFamily={fonts.nostromoBold}>
                                    {a}
                                </Typography>
                            </NiceButton>
                        ))}
                    </Stack>
                </Stack>

                <Stack
                    spacing="2rem"
                    sx={{
                        width: "50rem",
                    }}
                >
                    <Section orderLabel="B" title="Name" />
                    <Stack direction="column">
                        <Controller
                            name="name"
                            control={control}
                            rules={{
                                required: "Lobby name is required",
                                minLength: {
                                    value: 1,
                                    message: "Lobby name cannot be empty.",
                                },
                                maxLength: {
                                    value: 20,
                                    message: "No more than 20 characters.",
                                },
                            }}
                            render={({ field }) => (
                                <NiceTextField
                                    value={field.value}
                                    onChange={(e) => {
                                        if (e.length > 20) return
                                        field.onChange(e.toUpperCase())
                                    }}
                                    placeholder="Lobby Name..."
                                    primaryColor={factionTheme.primary}
                                    errorMessage={errors[field.name]?.message as string}
                                    sx={{
                                        height: "4.5rem",
                                        ".MuiOutlinedInput-root": {
                                            py: 0,
                                            height: "4.5rem",
                                        },
                                    }}
                                />
                            )}
                        />
                        <Stack alignItems="flex-end">
                            <Typography variant="body2" fontFamily={fonts.shareTechMono} fontWeight="bold" color={`${factionTheme.primary}AA`}>
                                Max 20 characters
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>

                <Stack spacing="2rem">
                    <Section orderLabel="C" title="Game Map" description="Select a map for the battle to take place in." />
                    <GameMapSelector />
                </Stack>

                <Stack spacing="2rem">
                    <Section orderLabel="D" title="War Machine Deploy" description="Select the max number of war machines per player." />
                    <Stack direction="row" alignItems="center" spacing="4rem">
                        {[1, 2, 3].map((i) => (
                            <NiceButton
                                key={i}
                                buttonColor={`${factionTheme.primary}${i === maxDeployNumber ? "" : "AA"}`}
                                sx={{
                                    opacity: i === maxDeployNumber ? 1 : 0.5,
                                    width: "7rem",
                                    height: "7rem",
                                }}
                                onClick={() => setValue("max_deploy_number", i)}
                            >
                                <Typography variant="h5" fontFamily={fonts.nostromoBlack}>
                                    {i}
                                </Typography>
                            </NiceButton>
                        ))}
                    </Stack>
                </Stack>

                <Stack spacing="2rem">
                    <Section orderLabel="E" title="Scheduling" description="Choose when the battle starts." />
                    <Stack direction="column" spacing="1rem">
                        <Stack direction="row" alignItems="center" spacing="2rem">
                            {Object.values(Scheduling).map((s) => (
                                <NiceButton
                                    key={s}
                                    buttonColor={`${factionTheme.primary}${s === schedulingType ? "" : "AA"}`}
                                    sx={{
                                        opacity: s === schedulingType ? 1 : 0.5,
                                        px: "3rem",
                                        py: "1rem",
                                    }}
                                    onClick={() => setValue("scheduling_type", s as Scheduling)}
                                >
                                    <Typography variant="h6" fontFamily={fonts.nostromoBold}>
                                        {s}
                                    </Typography>
                                </NiceButton>
                            ))}
                        </Stack>
                        {schedulingType === Scheduling.SetTime && (
                            <Stack direction="row" spacing={1}>
                                <Box width="25rem">
                                    <FactionBasedDatePicker value={wontStartUntilDate} onChange={(v) => setValue("wont_start_until_date", v)} />
                                </Box>
                                <Box width="25rem">
                                    <FactionBasedTimePicker value={wontStartUntilTime} onChange={(v) => setValue("wont_start_until_time", v)} />
                                </Box>
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <NiceButton
                    buttonColor={factionTheme.primary}
                    disabled={true}
                    sx={{
                        px: "4rem",
                        py: "1.5rem",
                    }}
                >
                    BACK
                </NiceButton>
                <NiceButton
                    buttonColor={factionTheme.primary}
                    onClick={() => nextForm()}
                    sx={{
                        px: "4rem",
                        py: "1.5rem",
                    }}
                >
                    next
                </NiceButton>
            </Stack>
        </Stack>
    )
}

interface SectionProps {
    orderLabel: string
    title: string
    description?: string
}
export const Section = ({ orderLabel, title, description }: SectionProps) => {
    const { factionTheme } = useTheme()
    return (
        <Stack direction="row" spacing="1rem" alignItems="center">
            <Typography variant="h6" fontFamily={fonts.nostromoBlack}>
                {orderLabel}.
            </Typography>
            <Typography variant="body1" fontFamily={fonts.nostromoBold} color={`${factionTheme.primary}`}>
                {title}:
            </Typography>
            {description && (
                <Typography variant="body2" color={`${factionTheme.primary}CC`}>
                    {description}
                </Typography>
            )}
        </Stack>
    )
}
