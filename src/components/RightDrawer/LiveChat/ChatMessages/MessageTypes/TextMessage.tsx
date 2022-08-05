import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import { Box, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { UserBanForm } from "../../../.."
import { SvgInfoCircular, SvgSkull2 } from "../../../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../../../constants"
import { useAuth, useChat, useSupremacy } from "../../../../../containers"
import { dateFormatter, getUserRankDeets, shadeColor, truncate } from "../../../../../helpers"
import { useToggle } from "../../../../../hooks"
import { useGameServerCommandsUser } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts } from "../../../../../theme/theme"
import { ChatMessageType, Faction, TextMessageData, User } from "../../../../../types"
import { TooltipHelper } from "../../../../Common/TooltipHelper"
import { Reactions } from "../../AdditionalOptions/Reactions"
import { UserDetailsPopover } from "./UserDetailsPopover"

export const TextMessage = ({
    data,
    sentAt,
    fontSize,
    isSent,
    isFailed,
    filterSystemMessages,
    getFaction,
    user,
    isEmoji,
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
    filterSystemMessages?: boolean
    getFaction: (factionID: string) => Faction
    user: User
    isEmoji: boolean
    previousMessage: ChatMessageType | undefined
    containerRef: React.RefObject<HTMLDivElement>
    isScrolling: boolean
    chatMessages: ChatMessageType[]
}) => {
    const { from_user, user_rank, message_color, avatar_id, message, from_user_stat, metadata } = data
    const { id, username, gid, faction_id } = from_user
    const { isHidden, isActive } = useAuth()
    const { userGidRecord, addToUserGidRecord, sendBrowserNotification, tabValue } = useChat()
    const { send } = useGameServerCommandsUser("/user_commander")

    const popoverRef = useRef(null)
    const textMessageRef = useRef<HTMLDivElement>(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()
    const [banModalOpen, toggleBanModalOpen] = useToggle()
    const [isPreviousMessager, setIsPreviousMessager] = useToggle()
    const [shouldNotify, setShouldNotify] = useToggle(metadata && user.gid in metadata.tagged_users_read && !metadata.tagged_users_read[user.gid])
    const [isHovered, setIsHovered] = useToggle()

    const abilityKillColor = useMemo(() => {
        if (!from_user_stat || from_user_stat.ability_kill_count == 0 || !message_color) return colors.grey
        if (from_user_stat.ability_kill_count < 0) return colors.red
        return shadeColor(message_color, 30)
    }, [from_user_stat, message_color])
    const factionColor = useMemo(() => (faction_id ? getFaction(faction_id).primary_color : message_color), [faction_id, getFaction, message_color])
    const factionSecondaryColor = useMemo(() => (faction_id ? getFaction(faction_id).secondary_color : "#FFFFFF"), [faction_id, getFaction])
    const faction_logo_url = useMemo(() => (faction_id ? getFaction(faction_id).logo_url : ""), [faction_id, getFaction])
    const rankDeets = useMemo(() => (user_rank ? getUserRankDeets(user_rank, ".8rem", "1.8rem") : undefined), [user_rank])

    const smallFontSize = useMemo(() => (fontSize ? `${1 * fontSize}rem` : "0.9rem"), [fontSize])
    const renderFontSize = useCallback(
        (isEmojiOverride = false) => {
            if (isEmoji && !isEmojiOverride) return (fontSize || 1.1) * 3
            return (fontSize || 1.1) * 1.35
        },
        [isEmoji, fontSize],
    )

    const isVisibleInChat = useCallback(() => {
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
        const visibleBool = isVisibleInChat()
        const isRead = metadata?.tagged_users_read[user.gid]

        if (isRead === false && (isHidden || !isActive)) {
            if (chatMessages.findIndex((x) => x.id === data.id) === chatMessages.length - 1) {
                sendBrowserNotification(`New Chat Message`, `${username} has tagged you in a message.`)
            }
            return
        }

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

                if (data.id) {
                    setShouldNotify(false)
                }
            }, 1000)
        }
    }, [isVisibleInChat, data, chatMessages, metadata, send, user.gid, isHidden, isActive, sendBrowserNotification, tabValue, username, setShouldNotify])

    const chatMessage = useMemo(() => {
        //if no tagged users return the message
        if (metadata && Object.keys(metadata?.tagged_users_read).length === 0) return <span>{message}</span>

        const newMsgArr: ReactJSXElement[] = []

        const matchedArr = message.match(/#\d+/g)
        matchedArr?.map(async (match) => {
            const gidSubstring = parseInt(match.substring(1))
            const taggedUser = userGidRecord[gidSubstring] ?? undefined
            //if not make a call to the backend to find the user and add to record
            if (!taggedUser) {
                try {
                    const resp = await send<User>(GameServerKeys.GetPlayerByGid, {
                        gid: gidSubstring,
                    })
                    if (!resp) return
                    addToUserGidRecord(resp)
                } catch (err) {
                    console.error(err)
                }
            }
        })

        //splitting the message on tags, identifying #12345 patterns ex hi, #1234 how are you? => ['hi,', ' how are you'] (tags are stored in match array)
        const stringsArr = message.split(/#\d+/)

        //looping through the string array
        stringsArr.map((str, i) => {
            //pushing the first string
            newMsgArr.push(<span>{str}</span>)
            //if there is an item in matchedArr with the same index, push it into the new string, even if the tag is the first thing, it will still be split with an empty string at the start of stringsArr
            if (matchedArr && matchedArr[i]) {
                //getting the gid from tag
                const gidSubstring = parseInt(matchedArr[i].substring(1))
                //finding the user in the GID Record (added above)
                const taggedUser = userGidRecord[gidSubstring]
                //if taggedUser doesnt exist or the user tagged themselves or user tagged taggedUser of a different faction in faction chat, just push the whole string, not rendering the tag
                if (!taggedUser || gidSubstring === gid || (taggedUser.faction_id !== user.faction_id && tabValue !== 0)) {
                    newMsgArr.push(<span>{matchedArr[i]}</span>)
                    return
                }

                newMsgArr.push(
                    <span>
                        <UsernameJSX data={data} fontSize={renderFontSize(true)} user={taggedUser} />{" "}
                    </span>,
                )
            }
        })

        return (
            <>
                {newMsgArr.map((x, i) => (
                    <span key={i}>{x}</span>
                ))}
            </>
        )
    }, [addToUserGidRecord, data, gid, message, metadata, renderFontSize, send, tabValue, user.faction_id, userGidRecord])

    useEffect(() => {
        if (!previousMessage || previousMessage.type != "TEXT") return
        const prev = previousMessage.data as TextMessageData
        if (prev.from_user.id === data.from_user.id) {
            setIsPreviousMessager(true)
        }
    }, [previousMessage, setIsPreviousMessager, data])

    // For the hide zero multi setting
    if (filterSystemMessages) return null

    return (
        <>
            <Box sx={{ opacity: isSent ? 1 : 0.45 }} ref={textMessageRef}>
                {(!isPreviousMessager || (previousMessage && sentAt > new Date(previousMessage.sent_at.getTime() + 2 * 60000))) && (
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: ".8rem", mb: ".5rem" }}>
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
                                <UsernameJSX data={data} fontSize={renderFontSize(true)} user={from_user} toggleIsPopoverOpen={toggleIsPopoverOpen} />

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
                            </Box>
                        </Stack>

                        <Typography
                            sx={{
                                alignSelf: "center",
                                flexShrink: 0,
                                ml: "auto",
                                color: colors.grey,
                                opacity: 0.7,
                                fontSize: `${renderFontSize(true)}rem`,
                            }}
                        >
                            {dateFormatter(sentAt)}
                        </Typography>
                    </Stack>
                )}

                <Box>
                    <Stack
                        direction={"column"}
                        sx={{
                            ml: "1.8rem",
                            backgroundColor: shouldNotify ? "rgba(0,116,217, .4)" : isHovered ? "#121212" : "unset",
                            borderRadius: ".3rem",
                            transition: shouldNotify ? "background-color 2s" : "unset",
                            position: "relative",
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <Box
                            sx={{ fontFamily: fonts.shareTech, lineHeight: 1, color: "#FFFFFF", fontSize: `${renderFontSize()}rem`, zIndex: isHovered ? 2 : 1 }}
                        >
                            {chatMessage}
                        </Box>
                        {!!metadata?.likes.net && <Reactions fontSize={fontSize} data={data} />}
                        {isHovered && <Reactions fontSize={fontSize} hoverOnly={true} data={data} />}
                    </Stack>
                </Box>
            </Box>

            {isPopoverOpen && (
                <UserDetailsPopover
                    factionColor={factionColor}
                    factionSecondaryColor={factionSecondaryColor}
                    userStat={from_user_stat}
                    popoverRef={popoverRef}
                    open={isPopoverOpen}
                    onClose={() => toggleIsPopoverOpen(false)}
                    toggleBanModalOpen={toggleBanModalOpen}
                    user={user}
                    fromUser={from_user}
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
    user: User | undefined
}

export const UsernameJSX = ({ data, fontSize, toggleIsPopoverOpen, user }: UsernameJSXProps) => {
    const { getFaction } = useSupremacy()
    const { message_color } = data

    const faction = useMemo(() => getFaction(user?.faction_id || ""), [getFaction, user?.faction_id])

    return (
        <Typography
            onClick={() => (toggleIsPopoverOpen ? toggleIsPopoverOpen() : null)}
            sx={{
                display: "inline",
                cursor: toggleIsPopoverOpen ? "pointer" : "unset",
                p: toggleIsPopoverOpen ? "unset" : ".08rem .5rem",
                color: toggleIsPopoverOpen ? message_color : faction.secondary_color,
                backgroundColor: toggleIsPopoverOpen ? "unset" : faction.primary_color,
                borderRadius: toggleIsPopoverOpen ? "unset" : 0.5,
                fontWeight: toggleIsPopoverOpen ? 700 : "unset",
                fontSize: `${fontSize}rem`,
                verticalAlign: "middle",
                ":hover": toggleIsPopoverOpen
                    ? {
                          cursor: "pointer",
                          textDecoration: "underline",
                      }
                    : undefined,
                ":active": {
                    opacity: 0.8,
                },
            }}
        >
            {toggleIsPopoverOpen ? "" : "@"}
            {`${truncate(user?.username || "", 20)}`}
            <span
                style={{
                    marginLeft: ".2rem",
                    fontSize: `${1.1 * fontSize}rem`,
                }}
            >{`#${user?.gid}`}</span>
        </Typography>
    )
}
