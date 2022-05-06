import { Box, Button, Typography } from "@mui/material"
import { MaskStylesObj } from "@reactour/mask"
import { PopoverStylesObj } from "@reactour/popover"
import { StepType, useTour } from "@reactour/tour"
import { Styles, StylesObj } from "@reactour/tour/dist/styles"
import { useEffect, useMemo } from "react"
import { RightDrawerPanels, useBar, usePassportServerAuth, useRightDrawer, useSupremacy } from "../../../containers"
import { colors, fonts, siteZIndex } from "../../../theme/theme"

export const SetupTutorial = () => {
    const { user } = usePassportServerAuth()
    const { haveSups } = useSupremacy()

    const { setIsOpen, setSteps, setCurrentStep } = useTour()
    const { toggleActiveBar } = useBar()
    const { activePanel, togglePanel } = useRightDrawer()

    // Only show if no user
    const preAuthSteps: StepType[] = useMemo(() => {
        return [
            {
                selector: "#tutorial-connect",
                content: "Connect to your wallet here, you'll get the most out of this tutorial and Supremacy while logged in.",
                mutationObservables: ["#tutorial-connect"],
            },
        ]
    }, [])

    // Basic steps when user is logged in
    const baseSteps: StepType[] = useMemo(() => {
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
                    "#tutorial-purchase",
                ],
            },
            {
                selector: user?.faction_id ? "#tutorial-enlisted" : "#tutorial-enlist",
                content: user?.faction_id
                    ? "You can see your personal game stats here."
                    : "Here you can enlist into a Syndicate. Take care with who you choose to align yourself with- this will be the Syndicate you stay with for a while.",
                action: () => {
                    toggleActiveBar("enlist", true)
                },
                resizeObservables: ["#tutorial-enlist", "#tutorial-enlisted", "#tutorial-wallet", "#tutorial-passport"],
            },
            {
                selector: "#tutorial-sups",
                content:
                    "This is the amount of $SUPS you have in your on-world wallet. Choose wisely how you spend them as you can turn the tides of war in your syndicate's favor. You will be able to see information on your current session and most recent transactions here.",
                action: () => {
                    toggleActiveBar("wallet", true)
                },
                resizeObservables: ["#tutorial-enlist", "#tutorial-enlisted", "#tutorial-wallet", "#tutorial-passport"],
            },
            {
                selector: "#tutorial-multi",
                content:
                    "This is where you can see what multipliers are applied to your account. Having multipliers will earn you $SUPS from the Spoils of War pool.",
                action: () => {
                    toggleActiveBar("wallet", true)
                },
                resizeObservables: ["#tutorial-enlist", "#tutorial-enlisted", "#tutorial-wallet", "#tutorial-passport"],
            },
            {
                selector: "#tutorial-purchase",
                content: "You can purchase $SUPS directly from Supremacy here. The $SUPS will be available to you in your on-world wallet.",
                action: () => {
                    toggleActiveBar("wallet", true)
                },
                resizeObservables: ["#tutorial-enlist", "#tutorial-enlisted", "#tutorial-wallet", "#tutorial-passport"],
            },
            {
                selector: "#tutorial-passport",
                content:
                    "Access key profile functionalities here. Access the Passport system, edit your profile, or submit a ticket to receive help on different issues.",
                action: () => {
                    toggleActiveBar("profile", true)
                },
                resizeObservables: ["#tutorial-enlist", "#tutorial-enlisted", "#tutorial-wallet", "#tutorial-passport"],
            },
            {
                selector: "#tutorial-overlays",
                content:
                    "Toggle the overlays to bring up the mini-map, gain more information on the current Spoils of War or look at past and present battle logs.",
                position: "top",
            },
            {
                selector: "#tutorial-stream-options",
                content:
                    "Here you can select your server and resolution, and also alter the volume. Supremacy recommends connecting to the closest server if you are experiencing stream delays.",
                position: "top",
            },
        ]
    }, [toggleActiveBar, user?.faction_id])

    //only show if user is enlisted
    const enlistedSteps: StepType[] = useMemo(() => {
        return [
            {
                selector: "#tutorial-chat",
                content: "This is where you can interact with other online players.",
                action: () => {
                    if (activePanel !== RightDrawerPanels.LiveChat) {
                        togglePanel(RightDrawerPanels.LiveChat, true)
                    }
                },
            },
            {
                selector: ".tutorial-global-chat",
                content: "Global Chat includes everyone from all syndicates.",
                action: () => {
                    if (activePanel !== RightDrawerPanels.LiveChat) {
                        togglePanel(RightDrawerPanels.LiveChat, true)
                    }
                },
            },
            {
                selector: ".tutorial-faction-chat",
                content:
                    "Syndicate chat only includes others that are part of the same syndicate as yourself. This is the best place to get to know your fellow syndicate members, strategize and plan the best avenue of assault.",
                action: () => {
                    if (activePanel !== RightDrawerPanels.LiveChat) {
                        togglePanel(RightDrawerPanels.LiveChat, true)
                    }
                },
            },
        ]
    }, [activePanel, togglePanel])

    //only show if user has sups
    const withSupsSteps: StepType[] = useMemo(() => {
        return [
            {
                selector: "#tutorial-vote",
                content:
                    "Game abilities will show up here throughout the round. Work with your syndicate to contribute and win these abilities to aid your syndicate's mechs and lead them to victory.",
            },
            {
                selector: "#tutorial-mech-stats",
                content:
                    "These are the health and shield bars for each mech on the battlefield. Clicking on the mechs will highlight their position in the mini-map, and also bring up individual game abilities.",
            },
        ]
    }, [])

    //end of tutorial
    const endSteps: StepType[] = useMemo(() => {
        return [
            {
                selector: ".tutorial-end",
                content: (
                    <Box>
                        <Typography>
                            Start contributing to your syndicate&apos;s battle effort to ensure it&apos;s supremacy and reap the Spoils of War!
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setCurrentStep(0)
                                setIsOpen(false)
                                localStorage.setItem("visited", "true")
                            }}
                            sx={{
                                mt: "1rem",
                                pt: ".7rem",
                                pb: ".4rem",
                                backgroundColor: colors.neonBlue,
                                color: colors.darkNavy,
                                borderRadius: 0.7,
                                ":hover": {
                                    backgroundColor: colors.neonBlue,
                                },
                            }}
                        >
                            <Typography variant="body2" sx={{ color: `${colors.navy}D9`, fontFamily: fonts.nostromoBold }}>
                                Play Now
                            </Typography>
                        </Button>
                    </Box>
                ),
                position: "center",
            },
        ]
    }, [setCurrentStep, setIsOpen])

    useEffect(() => {
        if (!user) {
            setSteps([...preAuthSteps])
            return
        }

        let tutorialSteps = [...baseSteps]

        //if the user is not enlisted, finish tutorial
        if (user.faction_id) {
            tutorialSteps = [...tutorialSteps, ...enlistedSteps]
        }

        if (haveSups) {
            tutorialSteps = [...tutorialSteps, ...withSupsSteps]
        }

        tutorialSteps = [...tutorialSteps, ...endSteps]

        setSteps(tutorialSteps)
    }, [preAuthSteps, baseSteps, enlistedSteps, withSupsSteps, endSteps, user, haveSups, setSteps])

    return null
}

export const tourStyles: (PopoverStylesObj & StylesObj & MaskStylesObj & Partial<Styles>) | undefined = {
    maskWrapper: (base) => ({
        ...base,
        zIndex: siteZIndex.Modal - 1,
        opacity: 0.9,
    }),
    popover: (base) => ({
        ...base,
        color: "#FFFFFF",
        backgroundColor: `${colors.navy}D9`,
        borderRadius: "5px",
        fontSize: "1.5rem",
        fontFamily: fonts.shareTech,
        lineHeight: 1.5,
        padding: "2.8rem 3rem",
        zIndex: siteZIndex.Modal,
        "& button:hover, & svg:hover": {
            fill: "#FFFFFF",
            color: "#FFFFFF",
        },
    }),
    dot: (base) => ({
        ...base,
        backgroundColor: `${colors.lightGrey}`,
        borderColor: colors.darkNavy,
    }),
}
