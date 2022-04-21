import { Box, Button, Typography } from "@mui/material"
import { MaskStylesObj } from "@reactour/mask"
import { PopoverStylesObj } from "@reactour/popover"
import { StepType, useTour } from "@reactour/tour"
import { Styles, StylesObj } from "@reactour/tour/dist/styles"
import { BtnFnProps } from "@reactour/tour/dist/types"
import { useCallback, useEffect, useMemo } from "react"
import { useBar, useDrawer, usePassportServerAuth, useStream, useWallet } from "../../containers"
import { colors } from "../../theme/theme"

export const Tutorial = () => {
    const { setIsOpen, setSteps, setCurrentStep } = useTour()
    const { toggleActiveBar } = useBar()
    const { isLiveChatOpen, isAssetOpen } = useDrawer()
    const { streamResolutions } = useStream()
    const { user } = usePassportServerAuth()
    const { onWorldSupsRaw } = useWallet()

    //only show if no user
    const preAuthSteps: StepType[] = useMemo(() => {
        return [
            {
                selector: "#tutorial-connect",
                content: "Connect to your wallet here, you'll get the most out of this tutorial and Supremacy while logged in.",
                mutationObservables: ["#tutorial-connect"],
            },
        ]
    }, [])

    //basic steps when user is logged in
    const baseSteps: StepType[] = useMemo<StepType[]>(() => {
        return [
            {
                selector: "#tutorial-welcome",
                content: "Welcome to the Battle Arena! You can find more information about the game mechanics here under 'Game Guide'.",
                resizeObservables: [
                    "#tutorial-enlist",
                    "#tutorial-enlisted",
                    "#tutorial-wallet",
                    "#tutorial-wallet-icon",
                    "#tutorial-passport",
                    "#tutorial-sups",
                    "tutorial-purchase",
                ],
            },
            {
                selector: user?.faction_id ? "#tutorial-enlisted" : "#tutorial-enlist",
                content:
                    "Here you can enlist in a Syndicate, if you haven't already. Take care with who you choose to align yourself with- this will be the Syndicate you stay with for a while. After enlistment, you can see your personal game stats, including mech kills, ability kills and rank.",
                action: () => {
                    toggleActiveBar("enlist", true)
                },
                resizeObservables: ["#tutorial-enlist", "#tutorial-enlisted", "#tutorial-wallet", "#tutorial-passport"],
            },
            {
                selector: "#tutorial-sups",
                content:
                    "This is the amount of $SUPS you have in your on-world wallet. Choose wisely how you spend them and you can turn the tides of battle in your Syndicate's favor. You will be able to see information on your current session and most recent transactions here.",
                action: () => {
                    toggleActiveBar("wallet", true)
                },
                resizeObservables: ["#tutorial-enlist", "#tutorial-enlisted", "#tutorial-wallet", "#tutorial-passport"],
            },
            {
                selector: "#tutorial-purchase",
                content: "You are able to purchase more $SUPS directly from Supremacy here. These $SUPs will be available to you in your on-world wallet.",
                action: () => {
                    toggleActiveBar("wallet", true)
                },
                resizeObservables: ["#tutorial-enlist", "#tutorial-enlisted", "#tutorial-wallet", "#tutorial-passport"],
            },
            {
                selector: "#tutorial-passport",
                content:
                    "Access key profile functionality here, these will open up your profile information on your Passport along with your War Machine inventory and the game store.",
                action: () => {
                    toggleActiveBar("profile", true)
                },
                resizeObservables: ["#tutorial-enlist", "#tutorial-enlisted", "#tutorial-wallet", "#tutorial-passport"],
            },
            {
                selector: "#tutorial-overlays",
                content:
                    "You can gain more information about Spoils of War, Mini-Map along with current and past battle histories by toggling these overlays. Note that these functionalities can only be used when you have SUPs in your on-world wallet.",
                position: "top",
            },
            {
                selector: "#tutorial-server",
                content:
                    "Select your server here. Supremacy recommends always connecting to the closest server, if you ever experience delays, ensure you have the nearest server selected or try choosing another server.",
                position: "top",
            },
        ]
    }, [user, user?.faction_id])

    const resolutionSteps: StepType[] = useMemo<StepType[]>(() => {
        return [
            {
                selector: "#tutorial-resolution",
                content: "Select your stream resolution here. If you are experience delays or poor internet connection, try dropping the resolution.",
                position: "top",
            },
        ]
    }, [])

    //only show if user is enlisted
    const enlistedSteps: StepType[] = useMemo<StepType[]>(() => {
        return [
            {
                selector: "#tutorial-chat",
                content: "You can interact with other online players here.",
            },
            {
                selector: ".tutorial-global-chat",
                content: "Global Chat includes everyone from all factions.",
            },
            {
                selector: ".tutorial-faction-chat",
                content:
                    "Your sydicate chat only includes others that are apart of the same syndicate as you are. This is the best place to strategize your next move and coordinate attacks with your teammates.",
            },
            {
                selector: "#tutorial-asset",
                content:
                    "You'll find your mechs here, these can be purchased from Supremacy Store or on the Black Market (OpenSeas). You will be able to deploy your mechs to battle here as well as see each mech's battle history.",
            },
        ]
    }, [isLiveChatOpen, isAssetOpen])

    //only show if user has sups
    const withSupsSteps: StepType[] = useMemo<StepType[]>(() => {
        return [
            {
                selector: "#tutorial-vote",
                content:
                    "Battle abilities will show up here throughout each battle. As a Syndicate Member, your job will be to contribute $SUPS to save for an ability before the other Syndicates to give an advantage to your mechs on the battlefield.",
            },
            {
                selector: "#tutorial-mech-stats",
                content: "These are the health and shield bars for each mech on the battlefield. You can also vote for individual mech abilities here.",
            },
        ]
    }, [])

    const endStepContent = useMemo(() => {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography>
                    That concludes the tutorial. Start contributing to your Syndicate&apos;s battle effort to ensure its&apos; supremacy and reap the Spoils of
                    War!
                </Typography>
                <Button
                    variant="outlined"
                    sx={{ width: "50%", color: colors.neonBlue, mt: "1rem" }}
                    onClick={() => {
                        setCurrentStep(0)
                        setIsOpen(false)
                    }}
                >
                    Play
                </Button>
            </Box>
        )
    }, [])

    //end of tutorial
    const endSteps: StepType[] = useMemo<StepType[]>(() => {
        return [
            {
                selector: ".tutorial-end",
                content: endStepContent,
                position: "center",
            },
        ]
    }, [endStepContent])

    const changeTutorialSteps = useCallback(() => {
        if (!user) {
            setSteps([...preAuthSteps])
            return
        }

        let tutorialSteps: StepType[] = [...baseSteps]
        //if resolution, add it here
        if (streamResolutions && streamResolutions.length >= 0) {
            setSteps([...tutorialSteps, ...resolutionSteps])
        }
        //if the user is not enlisted, finish tutorial
        if (!user.faction_id) {
            setSteps([...tutorialSteps, ...endSteps])
            return
        }
        tutorialSteps = [...tutorialSteps, ...enlistedSteps]
        //if the user does not have sups, finish tutorial
        if (!parseInt(onWorldSupsRaw)) {
            setSteps([...tutorialSteps, ...endSteps])
            return
        }
        setSteps([...tutorialSteps, ...withSupsSteps, ...endSteps])
    }, [preAuthSteps, baseSteps, enlistedSteps, resolutionSteps, withSupsSteps, endSteps, user, user?.faction_id, onWorldSupsRaw])

    useEffect(() => {
        changeTutorialSteps()
    }, [changeTutorialSteps])

    return (
        <Button
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                color: colors.neonBlue,
                minWidth: 0,
            }}
            onClick={() => {
                setIsOpen(true)
            }}
        >
            <Typography sx={{ lineHeight: 1, color: colors.offWhite, textTransform: "uppercase" }}>Tutorial</Typography>
        </Button>
    )
}

export const tourStyles: (PopoverStylesObj & StylesObj & MaskStylesObj & Partial<Styles>) | undefined = {
    popover: (base) => ({
        ...base,
        backgroundColor: `${colors.navy}D9`,
        borderRadius: "5px",
        color: colors.offWhite,
        fontSize: "1.5rem",
        fontFamily: "Share Tech,Roboto,Helvetica,Arial,sans-serif",
        padding: "3.5rem",
    }),
    dot: (base) => ({
        ...base,
        backgroundColor: `${colors.lightGrey}`,
        borderColor: colors.darkNavy,
    }),
}

//custom next button, on last step, clicking the next arrow btn will close the tour- does not work for arrow (that has to use esc key)
export const tutorialNextBtn = ({ Button, currentStep, stepsLength, setIsOpen, setCurrentStep }: BtnFnProps) => {
    const { steps } = useTour()
    const { isLiveChatOpen, isAssetOpen, toggleIsAssetOpen, toggleIsLiveChatOpen } = useDrawer()

    const nextBtnStepper = useCallback(() => {
        const nextStep = steps[currentStep + 1]
        if (nextStep && nextStep.selector === "#tutorial-asset") {
            if (!isAssetOpen) {
                toggleIsAssetOpen()
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
            if (!isLiveChatOpen) {
                toggleIsLiveChatOpen()
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
    }, [isLiveChatOpen, isAssetOpen, toggleIsAssetOpen, toggleIsLiveChatOpen, steps, currentStep, stepsLength, setIsOpen, setCurrentStep])

    return (
        <Button
            kind="next"
            onClick={() => {
                nextBtnStepper()
            }}
        />
    )
}

//custom next button, on last step, clicking the next arrow btn will close the tour- does not work for arrow (that has to use esc key)
export const tutorialPrevButton = ({ Button, currentStep, setCurrentStep }: BtnFnProps) => {
    const { steps } = useTour()
    const { isLiveChatOpen, isAssetOpen, toggleIsAssetOpen, toggleIsLiveChatOpen } = useDrawer()

    const prevBtnStepper = useCallback(() => {
        const prevStep = steps[currentStep - 1]
        if (prevStep && prevStep.selector === "#tutorial-asset") {
            if (!isAssetOpen) {
                toggleIsAssetOpen()
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
            if (!isLiveChatOpen) {
                toggleIsLiveChatOpen()
                setTimeout(() => {
                    setCurrentStep(currentStep - 1)
                }, 250)
                return
            }
        }

        setCurrentStep(currentStep - 1)
    }, [isLiveChatOpen, isAssetOpen, toggleIsAssetOpen, toggleIsLiveChatOpen, steps, currentStep, setCurrentStep])

    return (
        <Button
            kind="prev"
            onClick={() => {
                prevBtnStepper()
            }}
        />
    )
}

export default Tutorial
