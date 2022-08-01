import { IconButton, Popover, Stack, Typography } from "@mui/material"
import { MutableRefObject, useEffect, useMemo, useRef } from "react"
import { ClipThing, SplitView, SystemMessageFilter } from "../../.."
import { SvgSettings } from "../../../../assets"
import { shadeColor } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { fonts, siteZIndex } from "../../../../theme/theme"
import { ChatFontSize } from "./ChatFontSize"

export const ChatSettings = ({ primaryColor }: { primaryColor: string }) => {
    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()

    return (
        <>
            <IconButton
                ref={popoverRef}
                onClick={() => toggleIsPopoverOpen()}
                edge="end"
                size="small"
                sx={{ mr: 0.08, opacity: 0.5, ":hover": { opacity: 1 }, transition: "all .1s" }}
            >
                <SvgSettings size="1.4rem" fill="#FFFFFF" sx={{ pb: 0 }} />
            </IconButton>

            {isPopoverOpen && (
                <SettingsPopover open={isPopoverOpen} popoverRef={popoverRef} onClose={() => toggleIsPopoverOpen(false)} primaryColor={primaryColor} />
            )}
        </>
    )
}

const SettingsPopover = ({
    open,
    popoverRef,
    onClose,
    primaryColor,
}: {
    open: boolean
    popoverRef: MutableRefObject<null>
    onClose: () => void
    primaryColor: string
}) => {
    const [localOpen, toggleLocalOpen] = useToggle(open)

    useEffect(() => {
        if (!localOpen) {
            const timeout = setTimeout(() => {
                onClose()
            }, 300)

            return () => clearTimeout(timeout)
        }
    }, [localOpen, onClose])

    const backgroundColor = useMemo(() => shadeColor(primaryColor, -95), [primaryColor])

    return (
        <Popover
            open={localOpen}
            anchorEl={popoverRef.current}
            onClose={() => toggleLocalOpen(false)}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            sx={{
                mt: ".8rem",
                zIndex: siteZIndex.Popover,
                ".MuiPaper-root": {
                    mt: "-2.5rem",
                    background: "none",
                    boxShadow: 0,
                },
            }}
        >
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".2rem",
                }}
                backgroundColor={backgroundColor}
                sx={{ height: "100%" }}
            >
                <SettingsContent />
            </ClipThing>
        </Popover>
    )
}

const SettingsContent = () => {
    return (
        <Stack spacing=".7rem" sx={{ position: "relative", width: "30rem", maxWidth: "30rem", px: "1.6rem", py: "1.2rem", pb: "1.6rem" }}>
            <Typography gutterBottom sx={{ fontFamily: fonts.nostromoBlack }}>
                CHAT SETTINGS
            </Typography>
            <ChatFontSize />
            <SplitView />
            <SystemMessageFilter />
        </Stack>
    )
}
