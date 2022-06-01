import { Button, Popover, Stack, Typography, useMediaQuery } from "@mui/material"
import { useTour } from "@reactour/tour"
import { MutableRefObject, useRef } from "react"
import { ClipThing, FancyButton } from ".."
import { SvgQuestionMark } from "../../assets"
import { useTheme } from "../../containers/theme"
import { useToggle } from "../../hooks"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import GameGuide from "./GameGuide/GameGuide"
import { SetupTutorial } from "./Tutorial/SetupTutorial"

export const HowToPlay = () => {
    const below1440 = useMediaQuery("(max-width:1440px)")
    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()

    const { setIsOpen } = useTour()
    const [isGameGuideOpen, toggleIsGameGuideOpen] = useToggle()

    return (
        <>
            <Button
                id="tutorial-welcome"
                onClick={() => toggleIsPopoverOpen()}
                ref={popoverRef}
                sx={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "1.2rem",
                    color: colors.neonBlue,
                    minWidth: 0,
                    borderRadius: 0.4,
                }}
            >
                <SvgQuestionMark size="1.5rem" fill={colors.neonBlue} />
                {below1440 ? null : (
                    <Typography sx={{ ml: ".6rem", lineHeight: 1, color: colors.neonBlue, textTransform: "uppercase" }}>How To Play</Typography>
                )}
            </Button>

            {isPopoverOpen && (
                <OptionsPopover
                    open={isPopoverOpen}
                    onClose={() => toggleIsPopoverOpen(false)}
                    popoverRef={popoverRef}
                    openGameGuide={() => {
                        toggleIsGameGuideOpen(true)
                        toggleIsPopoverOpen(false)
                    }}
                    openTutorial={() => {
                        setIsOpen(true)
                        toggleIsPopoverOpen(false)
                    }}
                />
            )}

            <SetupTutorial />
            {isGameGuideOpen && <GameGuide onClose={() => toggleIsGameGuideOpen(false)} />}
        </>
    )
}

const OptionsPopover = ({
    open,
    onClose,
    popoverRef,
    openGameGuide,
    openTutorial,
}: {
    open: boolean
    onClose: () => void
    popoverRef: MutableRefObject<null>
    openGameGuide: () => void
    openTutorial: () => void
}) => {
    const theme = useTheme()

    return (
        <Popover
            open={open}
            anchorEl={popoverRef.current}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            sx={{
                mt: ".8rem",
                zIndex: siteZIndex.Modal,
                ".MuiPaper-root": {
                    background: "none",
                    boxShadow: 0,
                },
            }}
        >
            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: true,
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                backgroundColor={theme.factionTheme.background}
                sx={{ height: "100%" }}
            >
                <Stack spacing=".32rem" sx={{ position: "relative", minWidth: "13rem", p: ".8rem" }}>
                    <OptionButton text="TUTORIAL" onClick={openTutorial} />
                    <OptionButton text="GAME GUIDE" onClick={openGameGuide} />
                </Stack>
            </ClipThing>
        </Popover>
    )
}

const OptionButton = ({ text, onClick }: { text: string; onClick: () => void }) => {
    return (
        <FancyButton
            tabIndex={0}
            excludeCaret
            clipThingsProps={{
                clipSize: "9px",
                opacity: 1,
                sx: { position: "relative" },
            }}
            sx={{ px: "1.6rem", py: ".4rem", color: "#FFFFFF" }}
            onClick={onClick}
        >
            <Typography
                variant="caption"
                sx={{
                    color: "#FFFFFF",
                    fontFamily: fonts.nostromoBlack,
                }}
            >
                {text}
            </Typography>
        </FancyButton>
    )
}
