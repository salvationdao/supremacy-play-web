import { Button, Popover, Stack, Typography, useMediaQuery } from "@mui/material"
import { MutableRefObject, useRef } from "react"
import { ClipThing, FancyButton } from ".."
import { SvgQuestionMark } from "../../assets"
import { useTheme } from "../../containers/theme"
import { useToggle } from "../../hooks"
import { fonts, siteZIndex } from "../../theme/theme"
import GameGuide from "./GameGuide/GameGuide"

export const HowToPlay = () => {
    const theme = useTheme()
    const below1440 = useMediaQuery("(max-width:1440px)")
    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()

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
                    color: theme.factionTheme.primary,
                    minWidth: 0,
                    borderRadius: 0.4,
                }}
            >
                <SvgQuestionMark size="1.5rem" fill={theme.factionTheme.primary} />
                {below1440 ? null : (
                    <Typography sx={{ ml: ".6rem", lineHeight: 1, color: theme.factionTheme.primary, fontWeight: "fontWeightBold" }}>HOW TO PLAY</Typography>
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
                />
            )}

            {isGameGuideOpen && <GameGuide onClose={() => toggleIsGameGuideOpen(false)} />}
        </>
    )
}

const OptionsPopover = ({
    open,
    onClose,
    popoverRef,
    openGameGuide,
}: {
    open: boolean
    onClose: () => void
    popoverRef: MutableRefObject<null>
    openGameGuide: () => void
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
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                backgroundColor={theme.factionTheme.background}
                sx={{ height: "100%" }}
            >
                <Stack spacing=".32rem" sx={{ position: "relative", minWidth: "13rem", p: ".8rem" }}>
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
                    textAlign: "start",
                    fontFamily: fonts.nostromoBlack,
                }}
            >
                {text}
            </Typography>
        </FancyButton>
    )
}
