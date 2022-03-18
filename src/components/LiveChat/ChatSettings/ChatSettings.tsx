import { IconButton, Popover, Stack, Typography } from "@mui/material"
import { useRef } from "react"
import { ChatFilter, SplitView } from "../.."
import { SvgSettings } from "../../../assets"
import { shadeColor } from "../../../helpers"
import { useToggle } from "../../../hooks"

export const ChatSettings = ({ primaryColor, faction_id }: { primaryColor: string; faction_id: string | null }) => {
    const backgroundColor = shadeColor(primaryColor, -95)

    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()

    return (
        <>
            <IconButton
                ref={popoverRef}
                onClick={toggleIsPopoverOpen}
                edge="end"
                size="small"
                sx={{ mr: 0.08, opacity: 0.5, ":hover": { opacity: 1 }, transition: "all .1s" }}
            >
                <SvgSettings size="1.4rem" fill="#FFFFFF" sx={{ pb: 0 }} />
            </IconButton>

            <Popover
                open={isPopoverOpen}
                anchorEl={popoverRef.current}
                onClose={() => toggleIsPopoverOpen(false)}
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
                    zIndex: 10000,
                    ".MuiPaper-root": {
                        mt: "-2.5rem",
                        background: "none",
                        backgroundColor,
                        border: "#FFFFFF50 1px solid",
                    },
                }}
            >
                <SettingsContent faction_id={faction_id} />
            </Popover>
        </>
    )
}

const SettingsContent = ({ faction_id }: { faction_id: string | null }) => {
    return (
        <Stack
            spacing=".7rem"
            sx={{ position: "relative", width: "30rem", maxWidth: "30rem", px: "1.6rem", py: "1.2rem", pb: "1.6rem" }}
        >
            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                CHAT SETTINGS
            </Typography>
            <SplitView />
            <ChatFilter faction_id={faction_id} />
        </Stack>
    )
}
