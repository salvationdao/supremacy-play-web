import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useMemo, useRef } from "react"
import { UserBanForm } from "../../../.."
import { SvgSkull2, SvgInfoCircular } from "../../../../../assets"
import { NullUUID, PASSPORT_SERVER_HOST_IMAGES } from "../../../../../constants"
import { FactionsAll } from "../../../../../containers"
import { dateFormatter, getUserRankDeets, shadeColor, truncate } from "../../../../../helpers"
import { useToggle } from "../../../../../hooks"
import { colors, fonts } from "../../../../../theme/theme"
import { TextMessageData } from "../../../../../types/chat"
import { User } from "../../../../../types"
import { TooltipHelper } from "../../../../Common/TooltipHelper"
import { UserDetailsPopover } from "./UserDetailsPopover"

const getMultiplierColor = (multiplierInt: number): string => {
    if (multiplierInt >= 2800) return "#3BFFDE"
    if (multiplierInt >= 2000) return "#8BFF33"
    if (multiplierInt >= 1400) return "#EEFF36"
    if (multiplierInt >= 800) return "#FFC830"
    if (multiplierInt >= 400) return "#FF6924"
    if (multiplierInt >= 220) return "#B669FF"
    if (multiplierInt >= 120) return "#FA5EFF"
    if (multiplierInt >= 80) return "#FF547F"
    if (multiplierInt >= 50) return "#FF4242"
    return "#9791FF"
}

export const TextMessage = ({
    data,
    sentAt,
    fontSize,
    isSent,
    isFailed,
    filterZeros,
    filterSystemMessages,
    factionsAll,
    user,
    isEmoji,
}: {
    data: TextMessageData
    sentAt: Date
    fontSize: number
    isSent?: boolean
    isFailed?: boolean
    filterZeros?: boolean
    filterSystemMessages?: boolean
    factionsAll: FactionsAll
    user?: User
    isEmoji: boolean
}) => {
    const { from_user, user_rank, message_color, avatar_id, message, self, total_multiplier, is_citizen, from_user_stat } = data
    const { id, username, gid, faction_id } = from_user

    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()
    const [banModalOpen, toggleBanModalOpen] = useToggle()
    const multiplierColor = useMemo(() => getMultiplierColor(total_multiplier || 0), [total_multiplier])
    const abilityKillColor = useMemo(() => {
        if (!from_user_stat || from_user_stat.ability_kill_count == 0 || !message_color) return colors.grey
        if (from_user_stat.ability_kill_count < 0) return colors.red
        return shadeColor(message_color, 30)
    }, [from_user_stat, message_color])
    const factionColor = useMemo(() => (faction_id ? factionsAll[faction_id]?.theme.primary : message_color), [faction_id, factionsAll])
    const factionSecondaryColor = useMemo(() => (faction_id ? factionsAll[faction_id]?.theme.secondary : "#FFFFFF"), [faction_id, factionsAll])
    const factionLogoBlobID = useMemo(() => (faction_id ? factionsAll[faction_id]?.logo_blob_id : ""), [faction_id, factionsAll])
    const rankDeets = useMemo(() => (user_rank ? getUserRankDeets(user_rank, ".8rem", "1.8rem") : undefined), [user_rank])
    const smallFontSize = useMemo(() => (fontSize ? `${0.9 * fontSize}rem` : "0.9rem"), [fontSize])

    const renderFontSize = useCallback(() => {
        if (isEmoji) return (fontSize || 1.1) * 3
        return (fontSize || 1.1) * 1.35
    }, [isEmoji, fontSize])

    const chatMessage = useMemo(() => {
        const messageFontSize = renderFontSize()
        return <Typography sx={{ fontSize: `${messageFontSize}rem` }}>{message}</Typography>
    }, [message, renderFontSize])

    // For the hide zero multi setting
    if ((!self && filterZeros && (!total_multiplier || total_multiplier <= 0)) || filterSystemMessages) return null

    return (
        <>
            <Box sx={{ opacity: isSent ? 1 : 0.45, wordBreak: "break-word", "*": { userSelect: "text !important" } }}>
                <Stack direction="row" justifyContent="space-between">
                    <Stack ref={popoverRef} direction="row" spacing=".3rem">
                        <Stack direction="row" spacing=".4rem" alignItems="flex-start">
                            {isFailed && <SvgInfoCircular size="1.2rem" fill={colors.red} sx={{ mt: ".2rem" }} />}

                            {avatar_id && (
                                <Box
                                    sx={{
                                        mt: "-0.1rem !important",
                                        width: fontSize ? `${1.7 * fontSize}rem` : "1.7rem",
                                        height: fontSize ? `${1.7 * fontSize}rem` : "1.7rem",
                                        flexShrink: 0,
                                        backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${avatar_id})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "contain",
                                        backgroundColor: factionColor,
                                        borderRadius: 0.8,
                                        border: `${factionColor} 1px solid`,
                                    }}
                                />
                            )}
                            {factionLogoBlobID && factionLogoBlobID != NullUUID && (
                                <Box
                                    sx={{
                                        mt: "-0.1rem !important",
                                        width: fontSize ? `${1.7 * fontSize}rem` : "1.7rem",
                                        height: fontSize ? `${1.7 * fontSize}rem` : "1.7rem",
                                        flexShrink: 0,
                                        backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${factionLogoBlobID})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "contain",
                                        backgroundColor: factionColor,
                                        borderRadius: 0.8,
                                        border: `${factionColor} 1px solid`,
                                    }}
                                />
                            )}
                            {user_rank && rankDeets && (
                                <TooltipHelper
                                    placement="top"
                                    text={
                                        <>
                                            <strong>RANK: </strong>
                                            {rankDeets.title}
                                            <br />
                                            {rankDeets.desc}
                                        </>
                                    }
                                >
                                    <Box>{rankDeets.icon}</Box>
                                </TooltipHelper>
                            )}
                        </Stack>

                        <Box>
                            <Typography
                                onClick={() => toggleIsPopoverOpen()}
                                sx={{
                                    display: "inline",
                                    color: message_color,
                                    fontWeight: 700,
                                    fontSize: fontSize ? `${1.33 * fontSize}rem` : "1.33rem",
                                    verticalAlign: "middle",
                                    ":hover": {
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                    },
                                    ":active": {
                                        opacity: 0.7,
                                    },
                                }}
                            >
                                {`${truncate(username, 20)}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.7, fontSize: fontSize ? `${1.1 * fontSize}rem` : "1.1rem" }}>{`#${gid}`}</span>
                            </Typography>

                            {from_user_stat && (
                                <Box sx={{ flexShrink: 0, display: "inline-block", ml: ".4rem", cursor: "default" }}>
                                    <Typography
                                        sx={{
                                            display: "inline-block",
                                            lineHeight: 1,
                                            fontFamily: fonts.nostromoBold,
                                            fontSize: smallFontSize,
                                            color: abilityKillColor,
                                        }}
                                    >
                                        [
                                    </Typography>
                                    <SvgSkull2 size={smallFontSize} fill={abilityKillColor} sx={{ display: "inline-block" }} />
                                    <Typography
                                        sx={{
                                            display: "inline-block",
                                            ml: ".1rem",
                                            lineHeight: 1,
                                            fontFamily: fonts.nostromoBold,
                                            fontSize: smallFontSize,
                                            color: abilityKillColor,
                                        }}
                                    >
                                        {from_user_stat.ability_kill_count}]
                                    </Typography>
                                </Box>
                            )}

                            <Typography
                                sx={{
                                    display: "inline-block",
                                    ml: ".4rem",
                                    color: multiplierColor,
                                    textAlign: "center",
                                    fontFamily: fonts.nostromoBold,
                                    fontSize: smallFontSize,
                                    opacity: (total_multiplier || 0) > 0 ? 1 : 0.7,
                                }}
                            >
                                {total_multiplier || 0}x
                            </Typography>

                            {is_citizen && (
                                <TooltipHelper placement="top" text={"CITIZEN"}>
                                    <Typography
                                        sx={{
                                            display: "inline-block",
                                            cursor: "default",
                                            ml: ".4rem",
                                            pb: ".3rem",
                                            textAlign: "center",
                                            fontFamily: fonts.nostromoBold,
                                            fontSize: smallFontSize,
                                        }}
                                    >
                                        🦾
                                    </Typography>
                                </TooltipHelper>
                            )}
                        </Box>
                    </Stack>

                    <Typography
                        sx={{
                            display: "inline-block",
                            alignSelf: "flex-start",
                            flexShrink: 0,
                            ml: "auto",
                            pt: ".2rem",
                            color: "grey",
                            opacity: 0.4,
                            ":hover": { opacity: 1 },
                            fontSize: fontSize ? `${0.98 * fontSize}rem` : "0.98rem",
                        }}
                    >
                        {dateFormatter(sentAt)}
                    </Typography>
                </Stack>

                <Box sx={{ ml: "2.1rem" }}>{chatMessage}</Box>
            </Box>

            {isPopoverOpen && (
                <UserDetailsPopover
                    factionLogoBlobID={factionLogoBlobID}
                    factionColor={factionColor}
                    factionSecondaryColor={factionSecondaryColor}
                    messageColor={message_color}
                    fromUserFactionID={faction_id}
                    username={username}
                    userStat={from_user_stat}
                    popoverRef={popoverRef}
                    open={isPopoverOpen}
                    onClose={() => toggleIsPopoverOpen(false)}
                    toggleBanModalOpen={toggleBanModalOpen}
                    user={user}
                    gid={gid}
                />
            )}

            {banModalOpen && user && faction_id === user.faction_id && (
                <UserBanForm
                    user={user}
                    open={banModalOpen}
                    onClose={() => toggleBanModalOpen(false)}
                    prefillUser={{
                        id,
                        username,
                        gid,
                    }}
                />
            )}
        </>
    )
}