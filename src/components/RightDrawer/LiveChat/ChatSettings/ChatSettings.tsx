import { IconButton } from "@mui/material"
import { useRef } from "react"
import { SvgSettings } from "../../../../assets"
import { useToggle } from "../../../../hooks"
import { SettingsPopover } from "./SettingsPopover"

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
