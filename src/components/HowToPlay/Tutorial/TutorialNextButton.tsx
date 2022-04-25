import { useTour } from "@reactour/tour"
import { BtnFnProps } from "@reactour/tour/dist/types"
import { useCallback } from "react"
import { useRightDrawer, RightDrawerPanels } from "../../../containers"

//custom next button, on last step, clicking the next arrow btn will close the tour- does not work for arrow (that has to use esc key)
export const TutorialNextButton = ({ Button, currentStep, stepsLength, setIsOpen, setCurrentStep }: BtnFnProps) => {
    const { steps } = useTour()
    const { activePanel, togglePanel } = useRightDrawer()

    const nextBtnStepper = useCallback(() => {
        const nextStep = steps[currentStep + 1]
        if (nextStep && nextStep.selector === "#tutorial-asset") {
            if (activePanel !== RightDrawerPanels.Assets) {
                togglePanel(RightDrawerPanels.Assets, true)
                setTimeout(() => {
                    setCurrentStep(currentStep + 1)
                }, 250)
                return
            }
        }

        if (
            nextStep &&
            (nextStep.selector === "#tutorial-chat" || nextStep.selector === "#tutorial-global-chat" || nextStep.selector === "#tutorial-faction-chat")
        ) {
            if (activePanel !== RightDrawerPanels.LiveChat) {
                togglePanel(RightDrawerPanels.LiveChat, true)
                setTimeout(() => {
                    setCurrentStep(currentStep + 1)
                }, 250)
                return
            }
        }

        if (currentStep + 1 === stepsLength) {
            setIsOpen(false)
            setCurrentStep(0)
            return
        }
        setCurrentStep(currentStep + 1)
    }, [activePanel, togglePanel, steps, currentStep, stepsLength, setIsOpen, setCurrentStep])

    return (
        <Button
            kind="next"
            onClick={() => {
                nextBtnStepper()
            }}
        />
    )
}
