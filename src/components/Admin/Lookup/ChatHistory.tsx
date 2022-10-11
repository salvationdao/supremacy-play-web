import { Box, Stack, Typography } from "@mui/material"
import { dateFormatter } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { Faction, User } from "../../../types"
import { AdminChatView } from "../../../types/admin"

export const ChatHistory = ({ chatHistory, faction, user }: { chatHistory: AdminChatView[]; faction: Faction; user: User }) => {
    return (
        <Box>
            {chatHistory.map((chat) => {
                return (
                    <Stack key={chat.text + chat.created_at.toLocaleDateString()} sx={{ width: "100%", p: "1rem" }}>
                        <Stack justifyContent={"space-between"} direction="row" alignItems="center">
                            <Stack direction="row">
                                <Box
                                    sx={{
                                        alignSelf: "flex-start",
                                        flexShrink: 0,
                                        width: "2rem",
                                        height: "2rem",
                                        background: `url(${faction.logo_url})`,
                                        backgroundColor: faction.background_color,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "contain",
                                    }}
                                />
                                <Typography sx={{ ml: "0.3rem", fontWeight: "700" }}>{`${user.username} #${user.gid}`}</Typography>
                            </Stack>
                            <Typography sx={{ color: colors.lightGrey }}>{dateFormatter(chat.created_at)}</Typography>
                        </Stack>
                        <Typography sx={{ ml: 2 }}>{chat.text}</Typography>
                    </Stack>
                )
            })}
        </Box>
    )
}
