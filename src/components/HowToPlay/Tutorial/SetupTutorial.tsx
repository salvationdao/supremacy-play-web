import { Box, Button, Typography } from "@mui/material"
import { MaskStylesObj } from "@reactour/mask"
import { PopoverStylesObj } from "@reactour/popover"
import { StepType, useTour } from "@reactour/tour"
import { Styles, StylesObj } from "@reactour/tour/dist/styles"
import { useEffect, useMemo } from "react"
import { RightDrawerPanels, useBar, usePassportServerAuth, useRightDrawer, useSupremacy } from "../../../containers"
import { colors, fonts } from "../../../theme/theme"

export const SetupTutorial = () => {
    const { user } = usePassportServerAuth()
    const { haveSups } = useSupremacy()

    const { setIsOpen, setSteps, setCurrentStep } = useTour()
    const { toggleActiveBar } = useBar()
    const { activePanel, togglePanel } = useRightDrawer()

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
                    "This is the amount of $SUPS you have in your on-world wallet. Choose wisely how you spend them as you turn the tides of battles in your Syndicate's favor. You will be able to see information on your current session and most recent transactions here.",
                action: () => {
                    toggleActiveBar("wallet", true)
                },
                resizeObservables: ["#tutorial-enlist", "#tutorial-enlisted", "#tutorial-wallet", "#tutorial-passport"],
            },
            {
                selector: "#tutorial-multi",
                content:
                    "The is where you can see what multipliers are applied to your account. Having multipliers will earn you $SUPS from the Spoils of War pool.",
                action: () => {
                    toggleActiveBar("wallet", true)
                },
                resizeObservables: ["#tutorial-enlist", "#tutorial-enlisted", "#tutorial-wallet", "#tutorial-passport"],
            },
            {
                selector: "#tutorial-purchase",
                content: "You can purchase $SUPS directly from Supremacy here. The $SUPs will be available to you in your on-world wallet.",
                action: () => {
                    toggleActiveBar("wallet", true)
                },
                resizeObservables: ["#tutorial-enlist", "#tutorial-enlisted", "#tutorial-wallet", "#tutorial-passport"],
            },
            {
                selector: "#tutorial-passport",
                content:
                    "Access key profile functionalities here, these will open up your profile information on your Passport along with your War Machine inventory and the game store.",
                action: () => {
                    toggleActiveBar("profile", true)
                },
                resizeObservables: ["#tutorial-enlist", "#tutorial-enlisted", "#tutorial-wallet", "#tutorial-passport"],
            },
            {
                selector: "#tutorial-overlays",
                content: "You can gain more information about Spoils of War, minimap along with current and past battle histories by toggling these overlays.",
                position: "top",
            },
            {
                selector: "#tutorial-stream-options",
                content:
                    "You can select your streaming server, change the resolution, and other options here. Supremacy recommends always connecting to the closest server, if you ever experience delays.",
                position: "top",
            },
        ]
    }, [user?.faction_id])

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
                content: "Global Chat includes everyone from all Syndicates.",
                action: () => {
                    if (activePanel !== RightDrawerPanels.LiveChat) {
                        togglePanel(RightDrawerPanels.LiveChat, true)
                    }
                },
            },
            {
                selector: ".tutorial-faction-chat",
                content:
                    "Your sydicate chat only includes others that are apart of the same syndicate as you are. This is the best place to strategize know your team and co-ordinate the next attack.",
                action: () => {
                    if (activePanel !== RightDrawerPanels.LiveChat) {
                        togglePanel(RightDrawerPanels.LiveChat, true)
                    }
                },
            },
            {
                selector: "#tutorial-asset",
                content:
                    "You'll find your mechs here, these can be purchased from Supremacy Store or on the Black Market (OpenSeas). You will be able to deploy your mechs to battle here as well as see each mech's battle history.",
                action: () => {
                    if (activePanel !== RightDrawerPanels.Assets) {
                        togglePanel(RightDrawerPanels.Assets, true)
                    }
                },
            },
        ]
    }, [activePanel])

    //only show if user has sups
    const withSupsSteps: StepType[] = useMemo(() => {
        return [
            {
                selector: "#tutorial-vote",
                content:
                    "Game abilities will show up here throughout. Work with your Syndicate and contribute to these game to give an advantage to your Syndicate mechs on the battlefield.",
            },
            {
                selector: "#tutorial-mech-stats",
                content: "These are the health and shield bars for each mech on the battlefield. You can also vote for individual mech abilities here.",
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
                            Start contributing to your Syndicate&apos;s battle effort to ensure its&apos; supremacy and reap the Spoils of War!
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
    }, [])

    useEffect(() => {
        let tutorialSteps = [...baseSteps]

        //if the user is not enlisted, finish tutorial
        if (user?.faction_id) {
            tutorialSteps = [...tutorialSteps, ...enlistedSteps]
        }

        if (haveSups) {
            tutorialSteps = [...tutorialSteps, ...withSupsSteps]
        }

        tutorialSteps = [...tutorialSteps, ...endSteps]

        setSteps(tutorialSteps)
    }, [baseSteps, enlistedSteps, withSupsSteps, endSteps, user, user?.faction_id, haveSups])

    return null
}

export const tourStyles: (PopoverStylesObj & StylesObj & MaskStylesObj & Partial<Styles>) | undefined = {
    maskWrapper: (base) => ({
        ...base,
        zIndex: 999999998,
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
        zIndex: 999999999,
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
