import { useTour } from "@reactour/tour"
import { BtnFnProps } from "@reactour/tour/dist/types"
import { useCallback } from "react"
import { useRightDrawer, RightDrawerPanels } from "../../../containers"

//custom next button, on last step, clicking the next arrow btn will close the tour- does not work for arrow (that has to use esc key)
export const TutorialPrevButton = ({ Button, currentStep, setCurrentStep }: BtnFnProps) => {
    const { steps } = useTour()
    const { activePanel, togglePanel } = useRightDrawer()

    const prevBtnStepper = useCallback(() => {
        const prevStep = steps[currentStep - 1]
        if (prevStep && prevStep.selector === "#tutorial-asset") {
            if (activePanel !== RightDrawerPanels.Assets) {
                togglePanel(RightDrawerPanels.Assets, true)
                setTimeout(() => {
                    setCurrentStep(currentStep - 1)
                }, 250)
                return
            }
        }

        if (
            prevStep &&
            (prevStep.selector === "#tutorial-chat" || prevStep.selector === ".tutorial-global-chat" || prevStep.selector === ".tutorial-faction-chat")
        ) {
            if (activePanel !== RightDrawerPanels.LiveChat) {
                togglePanel(RightDrawerPanels.LiveChat, true)
                setTimeout(() => {
                    setCurrentStep(currentStep - 1)
                }, 250)
                return
            }
        }

        setCurrentStep(currentStep - 1)
    }, [activePanel, togglePanel, steps, currentStep, setCurrentStep])

    return (
        <Button
            kind="prev"
            onClick={() => {
                prevBtnStepper()
            }}
        />
    )
}
