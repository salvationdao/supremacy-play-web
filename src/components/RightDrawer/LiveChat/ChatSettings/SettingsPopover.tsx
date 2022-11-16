import { Stack, Typography } from "@mui/material"
import { MutableRefObject } from "react"
import { SplitView, SystemMessageFilter } from "../../.."
import { fonts } from "../../../../theme/theme"
import { NicePopover } from "../../../Common/Nice/NicePopover"
import { ChatFontSize } from "./ChatFontSize"

interface SettingsPopoverProps {
    open: boolean
    popoverRef: MutableRefObject<null>
    onClose: () => void
    primaryColor: string
}

export const SettingsPopover = ({ open, popoverRef, onClose }: SettingsPopoverProps) => {
    return (
        <NicePopover
            open={open}
            anchorEl={popoverRef.current}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
        >
            <Stack
                spacing=".7rem"
                sx={{
                    position: "relative",
                    width: "30rem",
                    maxWidth: "30rem",
                    px: "1.6rem",
                    py: "1.2rem",
                    pb: "1.6rem",
                }}
            >
                <Typography gutterBottom sx={{ fontFamily: fonts.nostromoBlack }}>
                    CHAT SETTINGS
                </Typography>
                <ChatFontSize />
                <SplitView />
                <SystemMessageFilter />
            </Stack>
        </NicePopover>
    )
}
