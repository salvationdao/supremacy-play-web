import { Popover, Stack, Typography } from "@mui/material"
import { MutableRefObject, useEffect, useMemo } from "react"
import { ClipThing, SplitView, SystemMessageFilter } from "../../.."
import { shadeColor } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { fonts } from "../../../../theme/theme"
import { ChatFontSize } from "./ChatFontSize"

interface SettingsPopoverProps {
    open: boolean
    popoverRef: MutableRefObject<null>
    onClose: () => void
    primaryColor: string
}

export const SettingsPopover = ({ open, popoverRef, onClose, primaryColor }: SettingsPopoverProps) => {
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
                vertical: "bottom",
                horizontal: "left",
            }}
            sx={{
                ".MuiPaper-root": {
                    mt: "-3rem",
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
                <Stack spacing=".7rem" sx={{ position: "relative", width: "30rem", maxWidth: "30rem", px: "1.6rem", py: "1.2rem", pb: "1.6rem" }}>
                    <Typography gutterBottom sx={{ fontFamily: fonts.nostromoBlack }}>
                        CHAT SETTINGS
                    </Typography>
                    <ChatFontSize />
                    <SplitView />
                    <SystemMessageFilter />
                </Stack>
            </ClipThing>
        </Popover>
    )
}
