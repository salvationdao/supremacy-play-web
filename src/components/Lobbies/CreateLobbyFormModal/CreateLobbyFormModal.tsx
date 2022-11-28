import { Box, Stack, Typography } from "@mui/material"
import React, { useCallback, useMemo, useState } from "react"
import { useTheme } from "../../../containers/theme"
import { colors, fonts } from "../../../theme/theme"
import { NiceButton } from "../../Common/Nice/NiceButton"
import { NiceModal } from "../../Common/Nice/NiceModal"
import { NiceStepper } from "../../Common/Nice/NiceStepper"
import { FeesRewards } from "./FeesRewards"
import { RoomSettings } from "./RoomSettings"

const steps = [{ label: "Room Settings" }, { label: "Fees & Rewards" }, { label: "Deploy Mechs" }]

export const CreateLobbyFormModal = React.memo(function CreateLobbyFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const theme = useTheme()
    const [activeStep, setActiveStep] = useState(0)
    const [completedSteps, setCompletedSteps] = React.useState<{
        [k: number]: boolean
    }>({})

    const handleStep = useCallback((step: number) => {
        setActiveStep(step)
    }, [])

    const handleBack = useCallback(() => {
        setActiveStep((prev) => Math.max(prev - 1, 0))
    }, [])

    const handleNext = useCallback(() => {
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
    }, [])

    // Complete a step
    const handleComplete = useCallback(
        (step: number) => {
            setCompletedSteps((prev) => ({ ...prev, [step]: true }))
            handleNext()
        },
        [handleNext],
    )

    const isLastStep = activeStep >= steps.length - 1

    const stepForm = useMemo(() => {
        if (activeStep === 1) {
            return <RoomSettings />
        }

        if (activeStep === 2) {
            return <FeesRewards />
        }

        if (activeStep === 3) {
            return null
        }

        return null
    }, [activeStep])

    return (
        <NiceModal open={open} onClose={onClose} sx={{ p: "1.8rem 2.5rem", maxHeight: "calc(100vh - 20rem)", minWidth: "60rem" }}>
            <Stack spacing="1.5rem">
                <Typography variant="h6" fontFamily={fonts.nostromoBlack}>
                    Create Lobby
                </Typography>

                {/* Stepper */}
                <NiceStepper steps={steps} activeStep={activeStep} handleStep={handleStep} completedSteps={completedSteps} />

                <Box sx={{ minHeight: "5rem" }}>{stepForm}</Box>

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
        </NiceModal>
    )
})
