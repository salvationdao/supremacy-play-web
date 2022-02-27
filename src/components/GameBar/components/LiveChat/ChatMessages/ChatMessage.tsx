import { Box, Stack, Typography } from "@mui/material"
import { SvgInfoCircular } from "../../../assets"
import { NilUUID } from "../../../constants"
import { colors } from "../../../theme"
import { ChatData } from "../../../types"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../../../constants"

export const ChatMessage = ({ chat, isSent, isFailed }: { chat: ChatData; isSent?: boolean; isFailed?: boolean }) => {
    const { fromUsername, messageColor, factionColour, factionLogoBlobID, avatarID, message, sentAt } = chat

    return (
        <Stack direction="row" spacing={0.5} sx={{ opacity: isSent ? 1 : 0.45 }}>
            {isFailed && <SvgInfoCircular size="12px" fill={colors.red} sx={{ mt: 0.4 }} />}

            {avatarID && (
                <Box
                    sx={{
                        mt: "-0.8px !important",
                        width: 18,
                        height: 18,
                        flexShrink: 0,
                        backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${avatarID})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        backgroundColor: factionColour,
                        borderRadius: 0.8,
                        border: `${factionColour} 1px solid`,
                    }}
                />
            )}
            {factionLogoBlobID && factionLogoBlobID != NilUUID && (
                <Box
                    sx={{
                        mt: "-0.8px !important",
                        width: 18,
                        height: 18,
                        flexShrink: 0,
                        backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionLogoBlobID})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        backgroundColor: factionColour,
                        borderRadius: 0.8,
                        border: `${factionColour} 1px solid`,
                    }}
                />
            )}
            <Typography
                variant="body2"
                sx={{
                    color: colors.text,
                    fontFamily: "Share Tech",
                    fontSize: "0.8rem",
                    wordBreak: "break-word",
                    userSelect: "text",
                }}
            >
                <span style={{ color: messageColor, fontWeight: 700 }}>{fromUsername}</span>: {message}{" "}
                <span
                    style={{
                        display: "inline-block",
                        color: "grey",
                        opacity: 0.5,
                        marginLeft: "3px",
                        fontSize: ".7rem",
                    }}
                >
                    {dateFormatter(sentAt)}
                </span>
            </Typography>
        </Stack>
    )
}

const dateFormatter = (date: Date): string => {
    let hours = date.getHours()
    const minutes = date.getMinutes()

    // Check whether AM or PM
    const newformat = hours >= 12 ? "PM" : "AM"

    // Find current hour in AM-PM Format
    hours = hours % 12

    // To display "0" as "12"
    hours = hours ? hours : 12
    const minutes2 = minutes < 10 ? "0" + minutes : minutes

    return `${hours}:${minutes2} ${newformat}`
}
