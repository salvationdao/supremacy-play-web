import { Stack, Step, Stepper, StepperProps, Typography } from "@mui/material"
import { useTheme } from "../../../containers/theme"

const ICON_SIZE = "2.5rem"

export interface Step {
    label: string
}

export interface NiceStepperProps extends StepperProps {
    steps: Step[]
    activeStep: number // Starts from 1, 2, 3 etc. not 0.
    handleStep: (step: number) => void
    completedSteps?: { [k: number]: boolean }
}

export const NiceStepper = ({ steps, activeStep, completedSteps, handleStep, sx, ...props }: NiceStepperProps) => {
    const theme = useTheme()

    return (
        <Stepper
            activeStep={activeStep}
            sx={{
                ...(props.orientation === "vertical"
                    ? {
                          ".MuiStepConnector-root": {
                              ml: `calc(${ICON_SIZE} / 2)`,
                              my: ".4rem",
                          },
                      }
                    : {}),
                ...sx,
            }}
            {...props}
        >
            {steps.map((step, index) => (
                <Step key={`nice-stepper-${index}`} completed={completedSteps ? completedSteps[index] : false}>
                    <Stack
                        onClick={() => handleStep(index)}
                        direction="row"
                        alignItems="center"
                        spacing=".8rem"
                        sx={{ opacity: index === activeStep ? 1 : 0.3 }}
                    >
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                backgroundColor: theme.factionTheme.primary,
                                borderRadius: "50%",
                                width: ICON_SIZE,
                                height: ICON_SIZE,
                            }}
                        >
                            <Typography fontWeight="bold">{index + 1}</Typography>
                        </Stack>

                        <Typography lineHeight={1.2}>{step.label}</Typography>
                    </Stack>
                </Step>
            ))}
        </Stepper>
    )
}
