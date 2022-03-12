import { Box, Stack, Typography } from "@mui/material"
import { SvgInfoCircular } from "../../../assets"
import { NullUUID, PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { truncate } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { ChatData } from "../../../types/passport"

export const ChatMessage = ({
    chat,
    isSent,
    isFailed,
    multiplierValue,
}: {
    chat: ChatData
    isSent?: boolean
    isFailed?: boolean
    multiplierValue?: string
}) => {
    const { from_username, message_color, faction_colour, faction_logo_blob_id, avatar_id, message, sent_at } = chat

    return (
        <Stack direction="row" spacing={0.5} sx={{ opacity: isSent ? 1 : 0.45 }}>
            {isFailed && <SvgInfoCircular size="12px" fill={colors.red} sx={{ mt: 0.4 }} />}

            {avatar_id && (
                <Box
                    sx={{
                        mt: "-0.8px !important",
                        width: 18,
                        height: 18,
                        flexShrink: 0,
                        backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${avatar_id})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        backgroundColor: faction_colour,
                        borderRadius: 0.8,
                        border: `${faction_colour} 1px solid`,
                    }}
                />
            )}
            {faction_logo_blob_id && faction_logo_blob_id != NullUUID && (
                <Box
                    sx={{
                        mt: "-0.8px !important",
                        width: 18,
                        height: 18,
                        flexShrink: 0,
                        backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${faction_logo_blob_id})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        backgroundColor: faction_colour,
                        borderRadius: 0.8,
                        border: `${faction_colour} 1px solid`,
                    }}
                />
            )}
            <Typography
                variant="body2"
                sx={{
                    fontSize: "0.8rem",
                    wordBreak: "break-word",
                    userSelect: "text",
                }}
            >
                <Stack direction="row" spacing={0.35}>
                    <span style={{ color: message_color, fontWeight: 700 }}>{truncate(from_username, 27)}</span>
                    <span
                        style={{
                            color: colors.orange,
                            textAlign: "center",
                            fontFamily: "Nostromo Regular Bold",
                            fontSize: "0.5rem",
                            verticalAlign: "top",
                            opacity: multiplierValue ? 1 : 0.8,
                            borderRadius: 0.6,
                        }}
                    >
                        {multiplierValue ? multiplierValue : "0"}x
                    </span>
                    <span
                        style={{
                            display: "inline-block",
                            color: "grey",
                            fontSize: "0.7rem",
                            opacity: 0.5,
                        }}
                    >
                        {dateFormatter(sent_at)}
                    </span>
                </Stack>

                <p>{message} </p>
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
