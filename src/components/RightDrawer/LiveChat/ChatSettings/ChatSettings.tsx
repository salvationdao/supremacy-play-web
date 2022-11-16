import { IconButton, Stack, Typography } from "@mui/material"
import { MutableRefObject, useEffect, useRef } from "react"
import { SplitView, SystemMessageFilter } from "../../.."
import { SvgSettings } from "../../../../assets"
import { useToggle } from "../../../../hooks"
import { fonts } from "../../../../theme/theme"
import { NicePopover } from "../../../Common/Nice/NicePopover"
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

const SettingsPopover = ({ open, popoverRef, onClose }: { open: boolean; popoverRef: MutableRefObject<null>; onClose: () => void; primaryColor: string }) => {
    const [localOpen, toggleLocalOpen] = useToggle(open)

    useEffect(() => {
        if (!localOpen) {
            const timeout = setTimeout(() => {
                onClose()
            }, 300)

            return () => clearTimeout(timeout)
        }
    }, [localOpen, onClose])

    return (
        <NicePopover
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
            sx={{ mt: "-1rem" }}
        >
            <SettingsContent />
        </NicePopover>
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
