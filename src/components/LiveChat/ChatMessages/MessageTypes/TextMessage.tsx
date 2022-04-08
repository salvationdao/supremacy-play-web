import { Box, Button, Popover, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { ClipThing, UserBanForm } from "../../.."
import { SvgSkull2, SvgInfoCircular, SvgAbility, SvgDeath, SvgView } from "../../../../assets"
import { NullUUID, PASSPORT_SERVER_HOST_IMAGES } from "../../../../constants"
import { FactionsAll } from "../../../../containers"
import { dateFormatter, getUserRankDeets, shadeColor, truncate } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { colors } from "../../../../theme/theme"
import { TextMessageData } from "../../../../types/chat"
import { User, UserStat } from "../../../../types"
import { TooltipHelper } from "../../../Common/TooltipHelper"

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

const UserDetailsPopover = ({
    factionLogoBlobID,
    factionColor,
    factionSecondaryColor,
    fromUserFactionID,
    messageColor,
    username,
    gid,
    userStat,
    popoverRef,
    open,
    onClose,
    user,
    toggleBanModalOpen,
}: {
    factionLogoBlobID?: string
    factionColor?: string
    factionSecondaryColor?: string
    fromUserFactionID?: string
    messageColor?: string
    username: string
    gid: number
    userStat?: UserStat
    popoverRef: React.MutableRefObject<null>
    open: boolean
    onClose: () => void
    user?: User
    toggleBanModalOpen: (value?: boolean | undefined) => void
}) => {
    const [localOpen, toggleLocalOpen] = useToggle(open)

    useEffect(() => {
        if (!localOpen) {
            setTimeout(() => {
                onClose()
            }, 300)
        }
    }, [localOpen])

    if (!userStat) return null

    return (
        <>
            <Popover
                open={localOpen}
                anchorEl={popoverRef.current}
                onClose={() => toggleLocalOpen(false)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                sx={{
                    mt: "-.3rem",
                    ml: "-1rem",
                    zIndex: 10000,
                    ".MuiPaper-root": {
                        background: "none",
                    },
                }}
            >
                <ClipThing
                    clipSize="0"
                    border={{
                        isFancy: true,
                        borderColor: factionColor || colors.neonBlue,
                        borderThickness: ".2rem",
                    }}
                    innerSx={{ position: "relative" }}
                >
                    <Stack sx={{ minWidth: "20rem", px: "1.2rem", py: ".8rem", backgroundColor: colors.darkNavy }}>
                        <Stack direction="row" spacing=".5rem" sx={{ mt: ".3rem", mb: ".7rem" }}>
                            {factionLogoBlobID && factionLogoBlobID != NullUUID && (
                                <Box
                                    sx={{
                                        mt: "-0.1rem !important",
                                        width: "1.7rem",
                                        height: "1.7rem",
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
                            <Typography sx={{ color: messageColor, fontWeight: "fontWeightBold" }}>
                                {`${truncate(username, 20)}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${gid}`}</span>
                            </Typography>
                        </Stack>

                        <Stack spacing=".3rem" sx={{ ml: ".2rem" }}>
                            <Stack direction="row" spacing=".5rem">
                                <SvgAbility size="1.1rem" sx={{ pb: ".4rem" }} />
                                <Typography variant="body2">
                                    <strong>ABILITIES:</strong> {userStat.total_ability_triggered}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing=".5rem">
                                <SvgSkull2 size="1.1rem" sx={{ pb: ".4rem" }} />
                                <Typography variant="body2">
                                    <strong>MECH KILLS:</strong> {userStat.mech_kill_count}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing=".5rem">
                                <SvgDeath size="1.1rem" sx={{ pb: ".4rem" }} />
                                <Typography variant="body2">
                                    <strong>ABILITY KILLS:</strong> {userStat.ability_kill_count}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing=".5rem">
                                <SvgDeath size="1.1rem" sx={{ pb: ".4rem" }} />
                                <Typography variant="body2">
                                    <strong>ABILITY KILLS (7 DAYS):</strong> {userStat.last_seven_days_kills}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing=".5rem">
                                <SvgView size="1.1rem" />
                                <Typography variant="body2">
                                    <strong>SPECTATED:</strong> {userStat.view_battle_count}
                                </Typography>
                            </Stack>
                        </Stack>

                        {user && fromUserFactionID === user.faction_id && (
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                    toggleBanModalOpen()
                                    toggleLocalOpen(false)
                                }}
                                sx={{
                                    mt: ".7rem",
                                    px: ".8rem",
                                    pt: ".48rem",
                                    pb: ".3rem",
                                    backgroundColor: factionColor,
                                    border: `${factionColor} 1px solid`,
                                    borderRadius: 0.3,
                                    ":hover": { backgroundColor: `${factionColor}90` },
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        lineHeight: 1,
                                        fontWeight: "fontWeightBold",
                                        color: factionSecondaryColor,
                                    }}
                                >
                                    PUNISH
                                </Typography>
                            </Button>
                        )}
                    </Stack>
                </ClipThing>
            </Popover>
        </>
    )
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
        <Box sx={{ opacity: isSent ? 1 : 0.45, wordBreak: "break-word", "*": { userSelect: "text !important" } }}>
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
                            display: "inline-block",
                            color: message_color,
                            fontWeight: 700,
                            fontSize: fontSize ? `${1.33 * fontSize}rem` : "1.33rem",
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
                        <span style={{ marginLeft: ".2rem", opacity: 0.7 }}>{`#${gid}`}</span>
                    </Typography>

                    {from_user_stat && (
                        <Box sx={{ flexShrink: 0, display: "inline-block", ml: ".4rem", cursor: "default", verticalAlign: "top" }}>
                            <Typography
                                sx={{
                                    display: "inline-block",
                                    lineHeight: 1,
                                    fontFamily: "Nostromo Regular Bold",
                                    fontSize: fontSize ? `${0.9 * fontSize}rem` : "0.9rem",
                                    color: abilityKillColor,
                                }}
                            >
                                [
                            </Typography>
                            <SvgSkull2
                                size={fontSize ? `${0.85 * fontSize}rem` : "0.85rem"}
                                fill={abilityKillColor}
                                sx={{
                                    display: "inline-block",
                                }}
                            />
                            <Typography
                                sx={{
                                    display: "inline-block",
                                    lineHeight: 1,
                                    fontFamily: "Nostromo Regular Bold",
                                    fontSize: fontSize ? `${0.9 * fontSize}rem` : "0.9rem",
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
                            fontFamily: "Nostromo Regular Bold",
                            fontSize: fontSize ? `${0.9 * fontSize}rem` : "0.9rem",
                            verticalAlign: "top",
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
                                    textAlign: "center",
                                    fontFamily: "Nostromo Regular Bold",
                                    fontSize: fontSize ? `${0.9 * fontSize}rem` : "0.9rem",
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
                            display: "inline-block",
                            ml: ".4rem",
                            color: "grey",
                            opacity: 0.5,
                            fontSize: fontSize ? `${1 * fontSize}rem` : "1rem",
                        }}
                    >
                        {dateFormatter(sentAt)}
                    </Typography>
                </Box>
            </Stack>

            <Box sx={{ ml: "2.1rem" }}>{chatMessage}</Box>

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
        </Box>
    )
}
