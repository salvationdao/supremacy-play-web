import { Box, Divider, Stack, Typography } from "@mui/material"
import React, { useCallback, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useTheme } from "../../../containers/theme"
import { colors, fonts } from "../../../theme/theme"
import { NewMechStruct } from "../../../types"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceModal } from "../../Common/Nice/NiceModal"
import { NiceStepper } from "../../Common/Nice/NiceStepper"
import { FeesRewards } from "./FeesRewards"
import { Overview } from "./Overview"
import { RoomSettings } from "./RoomSettings"

const steps = [{ label: "Room Settings" }, { label: "Fees & Rewards" }, { label: "Deploy Mechs" }, { label: "Overview" }]

export enum Accessibility {
    Public = "PUBLIC",
    Private = "PRIVATE",
}

export enum Scheduling {
    SetTime = "SCHEDULED TIME & DATE",
    OnReady = "ON FULL LOBBY",
}

export interface CreateLobbyFormFields {
    // Step 1
    name: string
    accessibility: Accessibility
    access_code: string
    max_deploy_number: number
    game_map_id: string
    scheduling_type: Scheduling
    wont_start_until_date: Date
    wont_start_until_time: Date

    // Step 2
    entry_fee: number
    first_faction_cut: number // Percentage (e.g. 75)
    second_faction_cut: number // Percentage (e.g. 75)
    third_faction_cut: number // Percentage (e.g. 75)
    extra_reward: number

    // Step 3
    selected_mechs: NewMechStruct[]
}

export const CreateLobbyFormModal = React.memo(function CreateLobbyFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const theme = useTheme()

    //  Form
    const formMethods = useForm<CreateLobbyFormFields>({
        defaultValues: {
            // Step 1
            name: "",
            access_code: "",
            accessibility: Accessibility.Public,
            max_deploy_number: 3,
            game_map_id: "",
            scheduling_type: Scheduling.OnReady,
            wont_start_until_date: new Date(),
            wont_start_until_time: new Date(),

            // Step 2
            entry_fee: 0,
            first_faction_cut: 75,
            second_faction_cut: 25,
            third_faction_cut: 0,
            extra_reward: 0,

            // Step 3
            selected_mechs: [],
        },
    })

    // Stepper
    const [activeStep, setActiveStep] = useState(0)

    const handleStep = useCallback((step: number) => {
        setActiveStep(step)
    }, [])

    const handleBack = useCallback(() => {
        setActiveStep((prev) => Math.max(prev - 1, 0))
    }, [])

    const handleNext = useCallback(() => {
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
    }, [])

    const isLastStep = activeStep >= steps.length - 1

    const stepForm = useMemo(() => {
        if (activeStep === 0) {
            return <RoomSettings formMethods={formMethods} />
        }

        if (activeStep === 1) {
            return <FeesRewards formMethods={formMethods} />
        }

        if (activeStep === 2) {
            return null
        }

        if (activeStep === 3) {
            return <Overview formMethods={formMethods} />
        }

        return null
    }, [activeStep, formMethods])

    return (
        <NiceModal open={open} onClose={onClose} sx={{ p: "1.8rem 2.5rem", maxHeight: "calc(100vh - 20rem)", minWidth: "66rem" }}>
            <Stack>
                <Typography variant="h6" fontFamily={fonts.nostromoBlack} mb="2rem">
                    Create Lobby
                </Typography>

                <Stack direction="row" alignItems="stretch" spacing="2rem">
                    {/* Stepper */}
                    <NiceStepper steps={steps} activeStep={activeStep} handleStep={handleStep} orientation="vertical" />

                    <Divider flexItem orientation="vertical" />

                    <Stack spacing="1rem" flex={1}>
                        {/* The form questions */}
                        <Box flex={1}>{stepForm}</Box>

                        {/* Bottom buttons */}
                        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing="1rem">
                            <NiceButton buttonColor={theme.factionTheme.primary} disabled={activeStep === 0} onClick={handleBack}>
                                Back
                            </NiceButton>

                            {isLastStep ? (
                                <NiceButton buttonColor={colors.green} onClick={handleNext}>
                                    Create Lobby
                                </NiceButton>
                            ) : (
                                <NiceButton buttonColor={theme.factionTheme.primary} onClick={handleNext}>
                                    Next
                                </NiceButton>
                            )}
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </NiceModal>
    )
})
