import { Box, Button, Stack, Typography } from "@mui/material"
import { useTheme } from "../../../containers/theme"
import { colors } from "../../../theme/theme"
import { SystemMessageDisplayable } from "./Messages"

export interface MessageItemProps {
    message: SystemMessageDisplayable
    selected: boolean
    onSelect: () => void
}

export const MessageItem = ({ message, selected, onSelect }: MessageItemProps) => {
    const theme = useTheme()

    const selectedOrNotRead = !message.read_at || selected

    return (
        <Box>
            <Button
                sx={{
                    width: "100%",
                    borderRadius: 0,
                    justifyContent: "start",
                    border: selected ? `${theme.factionTheme.primary}70 1.5px solid` : "none",
                }}
                onClick={() => onSelect()}
            >
                <Stack direction="row" alignItems="center" spacing="1rem" sx={{ flex: 1 }}>
                    <message.icon size="1.8rem" fill={selectedOrNotRead ? "white" : colors.grey} />

                    <Typography
                        variant="h6"
                        sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            width: "100%",
                            maxWidth: "100px",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1, // change to max number of lines
                            WebkitBoxOrient: "vertical",
                            textAlign: "left",
                            color: selectedOrNotRead ? "white" : colors.grey,
                        }}
                    >
                        {message.title}
                    </Typography>
                    <Typography
                        sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1, // change to max number of lines
                            WebkitBoxOrient: "vertical",
                            textAlign: "left",
                            textTransform: "none",
                            color: selectedOrNotRead ? "white" : colors.grey,
                        }}
                    >
                        {message.message}
                    </Typography>

                    <Box flex={1} />
                    <Typography
                        variant="body2"
                        sx={{
                            color: colors.grey,
                        }}
                    >
                        {message.sent_at.getHours()}:{`${message.sent_at.getMinutes() < 10 ? "0" : ""}${message.sent_at.getMinutes()}`}
                    </Typography>
                </Stack>
            </Button>
        </Box>
    )
}
