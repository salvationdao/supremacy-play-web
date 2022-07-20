import { Box, Collapse, Fade, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { SystemMessageDisplayable } from "../../../containers/systemMessaging"
import { colors } from "../../../theme/theme"
import { FancyButton } from "../../Common/FancyButton"

export interface MessageItemProps {
    message: SystemMessageDisplayable
    onDismiss: () => void
}

export const MessageItem = ({ message, onDismiss }: MessageItemProps) => {
    const [isCollapsed, setIsCollapsed] = useState(true)

    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing=".5rem">
                {message.icon({})}
                <Typography
                    variant="h6"
                    sx={{
                        flexShrink: 1,
                        overflowX: "hidden",
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    }}
                >
                    {message.message}
                </Typography>
                <Box
                    sx={{
                        flex: 1,
                        width: "fit-content",
                    }}
                >
                    <FancyButton
                        clipThingsProps={{
                            backgroundColor: colors.darkGrey,
                        }}
                        size="small"
                        onClick={() => setIsCollapsed((prev) => !prev)}
                    >
                        {isCollapsed ? "View" : "Hide"}
                    </FancyButton>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        width: "fit-content",
                    }}
                >
                    <FancyButton
                        clipThingsProps={{
                            backgroundColor: colors.lightRed,
                        }}
                        size="small"
                        onClick={() => onDismiss()}
                    >
                        Dismiss
                    </FancyButton>
                </Box>
            </Stack>
            <Collapse in={!isCollapsed}>
                <Fade in={true}>
                    <Stack>
                        <Typography variant="h6">{message.message}</Typography>
                    </Stack>
                </Fade>
            </Collapse>
        </Box>
    )
}
