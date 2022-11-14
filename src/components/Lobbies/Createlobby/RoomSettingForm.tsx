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

export const RoomSettingForm = () => {
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
    }, [trigger])

    return (
        <Stack direction="column" flex={1} sx={{ px: "15rem", py: "4rem" }}>
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
                                border={{
                                    color: `${factionTheme.primary}${a === accessibility ? "" : "AA"}`,
                                    style: "dashed",
                                }}
                                sx={{
                                    opacity: a === accessibility ? 1 : 0.5,
                                }}
                                onClick={() => setValue("accessibility", a as Accessibility)}
                            >
                                <Typography fontFamily={fonts.nostromoBold}>{a}</Typography>
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
                    <Stack spacing={1}>
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
                                        field.onChange(e)
                                    }}
                                    placeholder="Lobby Name..."
                                    primaryColor={factionTheme.primary}
                                    errorMessage={errors[field.name]?.message as string}
                                />
                            )}
                        />
                        <Stack alignItems="flex-end">
                            <Typography variant="subtitle1">max 20 characters</Typography>
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
                                border={{
                                    color: `${factionTheme.primary}${i === maxDeployNumber ? "" : "AA"}`,
                                    style: "dashed",
                                }}
                                sx={{
                                    opacity: i === maxDeployNumber ? 1 : 0.5,
                                }}
                                onClick={() => setValue("max_deploy_number", i)}
                            >
                                <Typography fontFamily={fonts.nostromoBlack}>{i}</Typography>
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
                                    border={{
                                        color: `${factionTheme.primary}${s === schedulingType ? "" : "AA"}`,
                                        style: "dashed",
                                    }}
                                    sx={{
                                        opacity: s === schedulingType ? 1 : 0.5,
                                    }}
                                    onClick={() => setValue("scheduling_type", s as Scheduling)}
                                >
                                    <Typography fontFamily={fonts.nostromoBold}>{s}</Typography>
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
                <NiceButton disabled={true}>BACK</NiceButton>
                <NiceButton onClick={() => nextForm()}>next</NiceButton>
            </Stack>
        </Stack>
    )
}

interface SectionProps {
    orderLabel: string
    title: string
    description?: string
}
const Section = ({ orderLabel, title, description }: SectionProps) => {
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
