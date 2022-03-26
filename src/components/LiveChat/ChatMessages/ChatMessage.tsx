import { Box, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { SvgDeath, SvgInfoCircular } from "../../../assets"
import { NullUUID, PASSPORT_SERVER_HOST_IMAGES } from "../../../constants"
import { dateFormatter, truncate } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { ChatData, UserStat } from "../../../types/passport"
import { TooltipHelper } from "../../Common/TooltipHelper"

const getMultiplierColor = (multiplierInt: number): string => {
    return multiplierInt >= 149
        ? colors.neonBlue
        : multiplierInt >= 99
        ? colors.yellow
        : multiplierInt >= 49
        ? colors.health
        : colors.orange
}

const getAbilityKillColor = (killCount: number): string => {
    if (!killCount) return colors.orange

    return killCount >= 99
        ? colors.neonBlue
        : killCount >= 49
        ? colors.yellow
        : killCount >= 9
        ? colors.health
        : colors.orange
}

export const ChatMessage = ({
    chat,
    isSent,
    isFailed,
    multiplierValue,
    isCitizen,
    filterZeros,
    fontSize,
    userStat,
}: {
    chat: ChatData
    isSent?: boolean
    isFailed?: boolean
    multiplierValue?: string
    isCitizen: boolean
    filterZeros?: boolean
    fontSize: number
    userStat: UserStat
}) => {
    const { from_username, message_color, faction_colour, faction_logo_blob_id, avatar_id, message, sent_at, self } =
        chat
    const multiplierInt = useMemo(() => (multiplierValue ? parseInt(multiplierValue) : 0), [multiplierValue])
    const multiplierColor = useMemo(() => getMultiplierColor(multiplierInt), [multiplierInt])
    const abilityKillColor = useMemo(() => {
        if (!userStat) return 0
        getAbilityKillColor(userStat.kill_count)
    }, [userStat])

    if (!self && filterZeros && multiplierInt <= 0) return null

    return (
        <Box sx={{ opacity: isSent ? 1 : 0.45 }}>
            <Stack direction="row" spacing=".4rem">
                {isFailed && <SvgInfoCircular size="1.2rem" fill={colors.red} sx={{ mt: ".32rem" }} />}

                {avatar_id && (
                    <Box
                        sx={{
                            mt: "-0.1rem !important",
                            width: fontSize ? `${1.8 * fontSize}rem` : "1.8rem",
                            height: fontSize ? `${1.8 * fontSize}rem` : "1.8rem",
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
                            mt: "-0.1rem !important",
                            width: fontSize ? `${1.8 * fontSize}rem` : "1.8rem",
                            height: fontSize ? `${1.8 * fontSize}rem` : "1.8rem",
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
                {userStat && (
                    <TooltipHelper placement="top-end" text={"Ability kills."}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing=".2rem"
                            sx={{
                                px: ".4rem",
                                pt: ".1rem",
                                height: fontSize ? `${1.6 * fontSize}rem` : "1.6rem",
                                flexShrink: 0,
                                borderRadius: 0.6,
                                border: `${abilityKillColor ? abilityKillColor : colors.grey} 1px solid`,
                                ":hover": {
                                    border: `${faction_colour} 1px solid`,
                                    "*": {
                                        color: faction_colour,
                                        fill: faction_colour,
                                    },
                                },
                            }}
                        >
                            <SvgDeath
                                size={fontSize ? `${1 * fontSize}rem` : "1rem"}
                                sx={{ pb: 0 }}
                                fill={abilityKillColor ? abilityKillColor : colors.grey}
                            />
                            <Typography
                                sx={{
                                    mt: ".3rem",
                                    lineHeight: 1,
                                    cursor: "default",
                                    textAlign: "center",
                                    fontFamily: "Nostromo Regular Black",
                                    fontSize: fontSize ? `${1 * fontSize}rem` : "1rem",
                                    color: abilityKillColor ? abilityKillColor : colors.grey,
                                }}
                            >
                                {userStat.kill_count}
                            </Typography>
                        </Stack>
                    </TooltipHelper>
                )}
                <Box
                    sx={{
                        wordBreak: "break-word",
                        "*": {
                            userSelect: "text !important",
                        },
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                display: "inline",
                                color: message_color,
                                fontWeight: 700,
                                fontSize: fontSize ? `${1.33 * fontSize}rem` : "1.33rem",
                            }}
                        >
                            {truncate(from_username, 24)}
                        </Typography>
                        <Typography
                            sx={{
                                display: "inline",
                                ml: ".4rem",
                                color: multiplierColor,
                                textAlign: "center",
                                fontFamily: "Nostromo Regular Bold",
                                fontSize: fontSize ? `${0.86 * fontSize}rem` : "0.86rem",
                                verticalAlign: "top",
                                opacity: multiplierValue ? 1 : 0.7,
                            }}
                        >
                            {multiplierValue ? multiplierValue : "0"}x
                        </Typography>
                        {isCitizen && (
                            <TooltipHelper placement="top-end" text={"Citizen"}>
                                <Typography
                                    sx={{
                                        display: "inline",
                                        cursor: "default",
                                        ml: ".4rem",
                                        textAlign: "center",
                                        fontFamily: "Nostromo Regular Bold",
                                        fontSize: fontSize ? `${0.86 * fontSize}rem` : "0.86rem",
                                        verticalAlign: "top",
                                    }}
                                >
                                    🦾
                                </Typography>
                            </TooltipHelper>
                        )}

                        <Typography
                            variant="caption"
                            sx={{
                                display: "inline",
                                ml: ".4rem",
                                color: "grey",
                                opacity: 0.5,
                                fontSize: fontSize ? `${1 * fontSize}rem` : "1rem",
                            }}
                        >
                            {dateFormatter(sent_at)}
                        </Typography>
                    </Box>
                </Box>
            </Stack>

            <Box sx={{ ml: fontSize ? `${2.3 * fontSize}rem` : "2.3rem" }}>
                <Typography sx={{ fontSize: fontSize ? `${1.35 * fontSize}rem` : "1.35rem" }}>{message} </Typography>
            </Box>
        </Box>
    )
}
