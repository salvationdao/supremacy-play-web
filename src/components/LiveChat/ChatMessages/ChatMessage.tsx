import { Box, Stack, Typography } from "@mui/material"
import { SvgInfoCircular } from "../../../assets"
import { NullUUID, PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { dateFormatter, truncate } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { ChatData } from "../../../types/passport"
import { TooltipHelper } from "../../Common/TooltipHelper"

export const ChatMessage = ({
    chat,
    isSent,
    isFailed,
    multiplierValue,
    isCitizen,
}: {
    chat: ChatData
    isSent?: boolean
    isFailed?: boolean
    multiplierValue?: string
    isCitizen: boolean
}) => {
    const { from_username, message_color, faction_colour, faction_logo_blob_id, avatar_id, message, sent_at } = chat
    const multiplierInt = multiplierValue ? parseInt(multiplierValue) : 0

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
                <Stack direction="row" spacing={0.5}>
                    <Typography variant="body2" style={{ color: message_color, fontWeight: 700 }}>
                        {truncate(from_username, 24)}
                    </Typography>
                    <Typography
                        style={{
                            color:
                                multiplierInt >= 50
                                    ? colors.neonBlue
                                    : multiplierInt >= 15
                                    ? colors.yellow
                                    : colors.orange,
                            textAlign: "center",
                            fontFamily: "Nostromo Regular Bold",
                            fontSize: ".8rem",
                            verticalAlign: "top",
                            opacity: multiplierValue ? 1 : 0.7,
                        }}
                    >
                        {multiplierValue ? multiplierValue : "0"}x
                    </Typography>
                    {isCitizen && (
                        <TooltipHelper placement="top-end" text={"Citizen"}>
                            <Typography
                                style={{
                                    cursor: "default",
                                    textAlign: "center",
                                    fontFamily: "Nostromo Regular Bold",
                                    fontSize: ".8rem",
                                    verticalAlign: "top",
                                }}
                            >
                                🦾
                            </Typography>
                        </TooltipHelper>
                    )}
                    <Typography
                        variant="caption"
                        style={{
                            display: "inline-block",
                            color: "grey",
                            opacity: 0.5,
                        }}
                    >
                        {dateFormatter(sent_at)}
                    </Typography>
                </Stack>

                <Typography variant="body2">{message} </Typography>
            </Typography>
        </Stack>
    )
}
