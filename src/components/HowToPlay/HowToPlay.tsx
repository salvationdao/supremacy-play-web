import { Button, Popover, Stack, Typography, useMediaQuery } from "@mui/material"
import { useTour } from "@reactour/tour"
import { MutableRefObject, useRef } from "react"
import { SvgQuestionMark } from "../../assets"
import { usePassportServerAuth } from "../../containers"
import { shadeColor } from "../../helpers"
import { useToggle } from "../../hooks"
import { colors } from "../../theme/theme"
import { UserData } from "../../types/passport"
import GameGuide from "./GameGuide/GameGuide"
import { Tutorial } from "./Tutorial/Tutorial"

export const HowToPlay = () => {
    const below1440 = useMediaQuery("(max-width:1440px)")
    const { user } = usePassportServerAuth()
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "1.2rem",
                    color: colors.neonBlue,
                    minWidth: 0,
                }}
            >
                <SvgQuestionMark size="1.5rem" fill={colors.neonBlue} />
                {below1440 ? null : (
                    <Typography sx={{ ml: ".6rem", lineHeight: 1, color: colors.neonBlue, textTransform: "uppercase" }}>How To Play</Typography>
                )}
            </Button>

            {isPopoverOpen && (
                <OptionsPopover
                    user={user}
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

            <Tutorial />
            {isGameGuideOpen && <GameGuide onClose={() => toggleIsGameGuideOpen(false)} />}
        </>
    )
}

const OptionsPopover = ({
    user,
    open,
    onClose,
    popoverRef,
    openGameGuide,
    openTutorial,
}: {
    user?: UserData
    open: boolean
    onClose: () => void
    popoverRef: MutableRefObject<null>
    openGameGuide: () => void
    openTutorial: () => void
}) => {
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
                zIndex: 10000,
                ".MuiPaper-root": {
                    background: "none",
                    backgroundColor: user && user.faction ? shadeColor(user.faction.theme.primary, -95) : colors.darkNavy,
                    border: "#FFFFFF50 1px solid",
                },
            }}
        >
            <Stack spacing=".32rem" sx={{ position: "relative", minWidth: "13rem", p: ".8rem" }}>
                <OptionButton text="TUTORIAL" onClick={openTutorial} />
                <OptionButton text="GAME GUIDE" onClick={openGameGuide} />
            </Stack>
        </Popover>
    )
}

const OptionButton = ({ text, onClick }: { text: string; onClick: () => void }) => {
    return (
        <Button
            tabIndex={0}
            sx={{
                color: "#FFFFFF",
                minWidth: 0,
                cursor: "pointer",
                ":hover": {
                    backgroundColor: "#FFFFFF20",
                },
            }}
            onClick={onClick}
        >
            <Typography sx={{ lineHeight: 1 }}>{text}</Typography>
        </Button>
    )
}
