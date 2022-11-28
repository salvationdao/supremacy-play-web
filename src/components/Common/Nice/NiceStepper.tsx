import { Stack, Step, Stepper, Typography } from "@mui/material"
import { useTheme } from "../../../containers/theme"

export interface Step {
    label: string
}

export const NiceStepper = ({
    steps,
    activeStep,
    completedSteps,
    handleStep,
}: {
    steps: Step[]
    activeStep: number // Starts from 1, 2, 3 etc. not 0.
    handleStep: (step: number) => void
    completedSteps?: { [k: number]: boolean }
}) => {
    const theme = useTheme()

    return (
        <Stepper activeStep={activeStep}>
            {steps.map((step, index) => (
                <Step key={`nice-stepper-${index}`} completed={completedSteps ? completedSteps[index] : false}>
                    <Stack onClick={() => handleStep(index)} direction="row" alignItems="center" spacing=".8rem">
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                backgroundColor: theme.factionTheme.primary,
                                borderRadius: "50%",
                                width: "2.5rem",
                                height: "2.5rem",
                                opacity: index === activeStep ? 1 : 0.3,
                            }}
                        >
                            <Typography fontWeight="bold">{index + 1}</Typography>
                        </Stack>

                        <Typography>{step.label}</Typography>
                    </Stack>
                </Step>
            ))}
        </Stepper>
    )
}
