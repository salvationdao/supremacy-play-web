import { Box, Fade, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { UserBanForm } from "../../../.."
import { SvgInfoCircular, SvgSkull2 } from "../../../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../../../constants"
import { dateFormatter, getUserRankDeets, shadeColor, truncate } from "../../../../../helpers"
import { useToggle } from "../../../../../hooks"
import { colors, fonts } from "../../../../../theme/theme"
import { ChatMessageType, Faction, TextMessageData, User } from "../../../../../types"
import { TooltipHelper } from "../../../../Common/TooltipHelper"
import { UserDetailsPopover } from "./UserDetailsPopover"
import { useChat } from "../../../../../containers"
import { GameServerKeys } from "../../../../../keys"
import { useGameServerCommandsUser } from "../../../../../hooks/useGameServer"
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"

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
    getFaction,
    user,
    isEmoji,
    locallySent,
    previousMessage,
    containerRef,
    isScrolling,
    chatMessages,
}: {
    data: TextMessageData
    sentAt: Date
    fontSize: number
    isSent?: boolean
    isFailed?: boolean
    filterZeros?: boolean
    filterSystemMessages?: boolean
    getFaction: (factionID: string) => Faction
    user: User
    isEmoji: boolean
    locallySent?: boolean
    previousMessage: ChatMessageType | undefined
    containerRef: React.RefObject<HTMLDivElement>
    isScrolling: boolean
    chatMessages: ChatMessageType[]
}) => {
    const { from_user, user_rank, message_color, avatar_id, message, total_multiplier, is_citizen, from_user_stat, metadata } = data
    const { id, username, gid, faction_id } = from_user
    const { userGidRecord, addToUserGidRecord } = useChat()
    const { send } = useGameServerCommandsUser("/user_commander")

    const popoverRef = useRef(null)
    const textMessageRef = useRef<HTMLDivElement>(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()
    const [banModalOpen, toggleBanModalOpen] = useToggle()
    const [displayTimestamp, setDisplayTimestamp] = useToggle()
    const [isPreviousMessager, setIsPreviousMessager] = useToggle()

    const multiplierColor = useMemo(() => getMultiplierColor(total_multiplier || 0), [total_multiplier])
    const abilityKillColor = useMemo(() => {
        if (!from_user_stat || from_user_stat.ability_kill_count == 0 || !message_color) return colors.grey
        if (from_user_stat.ability_kill_count < 0) return colors.red
        return shadeColor(message_color, 30)
    }, [from_user_stat, message_color])
    const factionColor = useMemo(() => (faction_id ? getFaction(faction_id).primary_color : message_color), [faction_id, getFaction, message_color])
    const factionSecondaryColor = useMemo(() => (faction_id ? getFaction(faction_id).secondary_color : "#FFFFFF"), [faction_id, getFaction])
    const faction_logo_url = useMemo(() => (faction_id ? getFaction(faction_id).logo_url : ""), [faction_id, getFaction])
    const rankDeets = useMemo(() => (user_rank ? getUserRankDeets(user_rank, ".8rem", "1.8rem") : undefined), [user_rank])
    const smallFontSize = useMemo(() => (fontSize ? `${0.9 * fontSize}rem` : "0.9rem"), [fontSize])
    const shouldNotify = useMemo(
        () => metadata && user.gid in metadata.tagged_users_read && !metadata.tagged_users_read[user.gid],
        [metadata?.tagged_users_read],
    )

    const renderFontSize = useCallback(() => {
        if (isEmoji) return (fontSize || 1.1) * 3
        return (fontSize || 1.1) * 1.35
    }, [isEmoji, fontSize])

    const isVisible = useCallback(() => {
        if (!containerRef.current || !textMessageRef.current || isScrolling) return

        //Get container properties
        const cTop = containerRef.current?.scrollTop
        const cBottom = cTop + containerRef.current?.clientHeight

        //Get element properties
        const eTop = textMessageRef.current?.offsetTop
        const eBottom = textMessageRef.current?.clientHeight

        // if (!cTop || !cBottom || !eTop || !eBottom) return
        //Check if in view
        return eTop >= cTop && eBottom <= cBottom
    }, [containerRef, textMessageRef, isScrolling])

    useEffect(() => {
        if (metadata && Object.keys(metadata?.tagged_users_read).length === 0) return
        const visibleBool = isVisible()
        const isRead = metadata?.tagged_users_read[user.gid]
        if (visibleBool && isRead === false) {
            setTimeout(async () => {
                try {
                    const resp = await send<User>(GameServerKeys.ReadTaggedMessage, {
                        chat_history_id: data.id,
                    })
                    if (!resp) return
                } catch (err) {
                    console.error(err)
                }

                const msg = chatMessages.find((msg) => (msg.data as TextMessageData).id === data.id)
                if (!msg || !msg.data || !(msg.data as TextMessageData).metadata) return
                const msgData = msg.data as TextMessageData
                if (msgData && msgData.metadata && "tagged_users_read" in msgData.metadata) {
                    msgData.metadata.tagged_users_read[user.gid] = true
                }
            }, 2000)
        }
    }, [isVisible, data, chatMessages])

    const renderJSXMessage = useCallback(
        (msg: string) => {
            if (metadata && Object.keys(metadata?.tagged_users_read).length === 0) return <Box component={"span"}>{msg}</Box>

            const newMsgArr: ReactJSXElement[] = []

            const matchedArr = msg.match(/#\d+/g)
            matchedArr?.map(async (match) => {
                const gidSubstring = parseInt(match.substring(1))
                const taggedUser = userGidRecord[gidSubstring] ?? undefined
                //if not make a call to the backend to find the user and add to record
                if (!taggedUser) {
                    try {
                        const resp = await send<User>(GameServerKeys.GetPlayerByGid, {
                            gid: gid,
                        })
                        if (!resp) return
                        addToUserGidRecord(resp)
                    } catch (err) {
                        console.error(err)
                    }
                }
            })

            const stringsArr = msg.split(/#\d+/)

            stringsArr.map((str, i) => {
                newMsgArr.push(<Box component={"span"}>{str}</Box>)
                if (matchedArr && matchedArr[i]) {
                    const gidSubstring = parseInt(matchedArr[i].substring(1))
                    newMsgArr.push(
                        <Box component={"span"}>
                            <Box sx={{ display: "inline" }}> </Box>
                            <UsernameJSX data={data} fontSize={fontSize} user={userGidRecord[gidSubstring]} factionColor={factionColor} />
                        </Box>,
                    )
                }
            })

            return (
                <>
                    {newMsgArr.map((x, i) => (
                        <Box component={"span"} key={i}>
                            {x}
                        </Box>
                    ))}
                </>
            )
        },
        [addToUserGidRecord, userGidRecord],
    )

    const chatMessage = useMemo(() => {
        const messageFontSize = renderFontSize()
        return <Box sx={{ fontSize: `${messageFontSize}rem` }}>{renderJSXMessage(message)}</Box>
    }, [message, renderFontSize, renderJSXMessage])

    useEffect(() => {
        if (!previousMessage || previousMessage.type != "TEXT") return
        const prev = previousMessage.data as TextMessageData
        if (prev.from_user.id === data.from_user.id) {
            setIsPreviousMessager(true)
        }
    }, [previousMessage, setIsPreviousMessager, data])

    // For the hide zero multi setting
    if ((!locallySent && filterZeros && (!total_multiplier || total_multiplier <= 0)) || filterSystemMessages) return null

    return (
        <>
            <Box sx={{ opacity: isSent ? 1 : 0.45, wordBreak: "break-word", "*": { userSelect: "text !important" } }} ref={textMessageRef}>
                {(!isPreviousMessager || (previousMessage && sentAt > new Date(previousMessage.sent_at.getTime() + 2 * 60000))) && (
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: ".5rem" }}>
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
                                {faction_logo_url && (
                                    <Box
                                        sx={{
                                            mt: "-0.1rem !important",
                                            width: fontSize ? `${1.7 * fontSize}rem` : "1.7rem",
                                            height: fontSize ? `${1.7 * fontSize}rem` : "1.7rem",
                                            flexShrink: 0,
                                            backgroundImage: `url(${faction_logo_url})`,
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
                                <UsernameJSX data={data} fontSize={fontSize} user={from_user} toggleIsPopoverOpen={toggleIsPopoverOpen} />

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
                    </Stack>
                )}

                <Stack
                    direction={"column"}
                    sx={{ ml: "2.1rem", position: "relative" }}
                    onMouseEnter={() => setDisplayTimestamp(true)}
                    onMouseLeave={() => setDisplayTimestamp(false)}
                >
                    <Fade in>
                        <Typography
                            sx={{
                                display: displayTimestamp ? "inline-block" : "none",
                                alignSelf: "flex-start",
                                flexShrink: 0,
                                ml: "auto",
                                color: "#FFFFFF",
                                fontSize: fontSize ? `${0.98 * fontSize}rem` : "0.98rem",
                                position: "absolute",
                                backgroundColor: "rgba(18, 18, 18, .6)",
                                right: 0,
                                bottom: 0,
                            }}
                        >
                            {dateFormatter(sentAt)}
                        </Typography>
                    </Fade>
                    <Box sx={{ backgroundColor: shouldNotify ? "rgba(0,116,217, .4)" : "unset", borderRadius: ".3rem" }}>{chatMessage}</Box>
                </Stack>
            </Box>

            {isPopoverOpen && (
                <UserDetailsPopover
                    factionColor={factionColor}
                    factionSecondaryColor={factionSecondaryColor}
                    fromUserFactionID={faction_id}
                    userStat={from_user_stat}
                    popoverRef={popoverRef}
                    open={isPopoverOpen}
                    onClose={() => toggleIsPopoverOpen(false)}
                    toggleBanModalOpen={toggleBanModalOpen}
                    user={user}
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

interface UsernameJSXProps {
    data: TextMessageData
    fontSize: number
    toggleIsPopoverOpen?: (value?: boolean) => void
    factionColor?: string
    user: User | undefined
}

export const UsernameJSX = ({ data, fontSize, toggleIsPopoverOpen, user, factionColor }: UsernameJSXProps) => {
    const { message_color } = data

    console.log(fontSize)
    return (
        <>
            <Typography
                onClick={() => (toggleIsPopoverOpen ? toggleIsPopoverOpen() : null)}
                sx={{
                    display: "inline",
                    color: toggleIsPopoverOpen ? message_color : factionColor,
                    backgroundColor: toggleIsPopoverOpen ? "unset" : colors.darkNavyBlue,
                    borderRadius: toggleIsPopoverOpen ? "unset" : 0.5,
                    fontWeight: toggleIsPopoverOpen ? 700 : "unset",
                    fontSize: toggleIsPopoverOpen && fontSize ? `${1.33 * fontSize}rem` : `${1.2 * fontSize}rem`,
                    verticalAlign: "middle",
                    ":hover": toggleIsPopoverOpen
                        ? {
                              cursor: "pointer",
                              textDecoration: "underline",
                          }
                        : "unset",
                    ":active": {
                        opacity: 0.7,
                    },
                }}
            >
                {`${truncate(user?.username || "", 20)}`}
                <span
                    style={{
                        marginLeft: ".2rem",
                        opacity: 0.7,
                        fontSize: fontSize ? `${1.1 * fontSize}rem` : "1.1rem",
                    }}
                >{`#${user?.gid}`}</span>
            </Typography>
        </>
    )
}
