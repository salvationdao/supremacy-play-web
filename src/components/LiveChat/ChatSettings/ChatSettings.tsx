import { ClickAwayListener, IconButton, Stack, Tooltip, Typography } from "@mui/material"
import { ChatFilter, SplitView } from "../.."
import { SvgSettings } from "../../../assets"
import { shadeColor } from "../../../helpers"
import { useToggle } from "../../../hooks"

export const ChatSettings = ({ primaryColor, faction_id }: { primaryColor: string; faction_id: string | null }) => {
    const [isOpen, toggleIsOpen] = useToggle()
    const backgroundColor = shadeColor(primaryColor, -95)

    return (
        <ClickAwayListener onClickAway={() => toggleIsOpen(false)}>
            <div>
                <Tooltip
                    arrow
                    open={isOpen}
                    placement="top"
                    title={<SettingsContent faction_id={faction_id} />}
                    componentsProps={{
                        popper: { style: { zIndex: 99999, filter: "drop-shadow(0 3px 3px #00000070)" } },
                        arrow: { sx: { color: backgroundColor } },
                        tooltip: {
                            sx: {
                                mr: "1rem",
                                width: "30rem",
                                maxWidth: "30rem",
                                background: backgroundColor,
                                border: "#FFFFFF80 1px solid",
                            },
                        },
                    }}
                >
                    <IconButton
                        onClick={toggleIsOpen}
                        edge="end"
                        size="small"
                        sx={{ mr: 0.08, opacity: 0.5, ":hover": { opacity: 1 }, transition: "all .1s" }}
                    >
                        <SvgSettings size="1.4rem" fill="#FFFFFF" sx={{ pb: 0 }} />
                    </IconButton>
                </Tooltip>
            </div>
        </ClickAwayListener>
    )
}

const SettingsContent = ({ faction_id }: { faction_id: string | null }) => {
    return (
        <Stack spacing=".7rem" sx={{ position: "relative", px: ".2rem", py: ".8rem" }}>
            <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                CHAT SETTINGS
            </Typography>
            <SplitView />
            <ChatFilter faction_id={faction_id} />
        </Stack>
    )
}
