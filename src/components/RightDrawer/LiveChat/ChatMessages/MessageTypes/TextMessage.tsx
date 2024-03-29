import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import { Box, Stack, Typography } from "@mui/material"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { UserBanForm } from "../../../.."
import { SvgInfoCircular, SvgReportFlag, SvgSkull } from "../../../../../assets"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../../../constants"
import { ClickedOnUser, useAuth, useChat, useGlobalNotifications, useSupremacy } from "../../../../../containers"
import { checkIfIsEmoji, dateFormatter, getUserRankDeets, shadeColor, truncate } from "../../../../../helpers"
import { useToggle } from "../../../../../hooks"
import { useGameServerCommandsUser } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts } from "../../../../../theme/theme"
import { ChatMessage, ChatMessageType, RoleType, TextMessageData, User } from "../../../../../types"
import { NiceTooltip } from "../../../../Common/Nice/NiceTooltip"
import { Reactions } from "../../AdditionalOptions/Reactions"
import { ReportModal } from "../../AdditionalOptions/ReportModal"
import { UserDetailsPopover } from "./UserDetailsPopover"

interface TextMessageProps {
    message: ChatMessage
    containerRef: React.RefObject<HTMLDivElement>
    isScrolling: boolean
    previousMessage?: ChatMessage
    latestMessage?: ChatMessage
    isFailed: boolean
    tabFactionID: string | null
}

const propsAreEqual = (prevProps: TextMessageProps, nextProps: TextMessageProps) => {
    return (
        prevProps.message.id === nextProps.message.id &&
        prevProps.message.received_at === nextProps.message.received_at &&
        prevProps.isScrolling === nextProps.isScrolling &&
        prevProps.previousMessage?.id === nextProps.previousMessage?.id &&
        prevProps.latestMessage?.id === nextProps.latestMessage?.id &&
        prevProps.isFailed === nextProps.isFailed &&
        prevProps.tabFactionID === nextProps.tabFactionID
    )
}

export const TextMessage = React.memo(function TextMessage({
    message,
    containerRef,
    isScrolling,
    previousMessage,
    latestMessage,
    isFailed,
    tabFactionID,
}: TextMessageProps) {
    const { newSnackbarMessage, sendBrowserNotification } = useGlobalNotifications()
    const { getFaction } = useSupremacy()
    const { send } = useGameServerCommandsUser("/user_commander")
    const { user, userID, isHidden, isActive } = useAuth()
    const { userGidRecord, addToUserGidRecord, addToUserGidRecordCallback, tabValue, fontSize, setClickedOnUser } = useChat()

    // States
    const [refreshMessage, toggleRefreshMessage] = useToggle()
    const textMessageRef = useRef<HTMLDivElement>(null)
    const popoverRef = useRef(null)
    const [isPopoverOpen, toggleIsPopoverOpen] = useToggle()
    const [banModalOpen, toggleBanModalOpen] = useToggle()
    const [reportModalOpen, setReportModalOpen] = useToggle()
    const [isHovered, setIsHovered] = useState(false)

    // Memorized values
    const data = useMemo(() => message.data as TextMessageData, [message.data])

    // Extract calculated data from the message
    const {
        user_rank,
        avatar_id,
        content,
        from_user_stat,
        metadata,
        from_user,
        isTagged,
        isEmoji,
        abilityKillColor,
        factionColor,
        factionSecondaryColor,
        factionLogoUrl,
        factionLabel,
    } = useMemo(() => {
        const { from_user, user_rank, message_color, avatar_id, message: content, from_user_stat, metadata } = data
        const isEmoji: boolean = checkIfIsEmoji(content)
        const isTagged = metadata && user.gid in metadata.tagged_users_read

        const fromUserFaction = from_user.faction_id ? getFaction(from_user.faction_id) : undefined
        const factionColor = fromUserFaction ? fromUserFaction.palette.primary : message_color
        const factionSecondaryColor = fromUserFaction ? fromUserFaction.palette.text : "#FFFFFF"
        const factionLogoUrl = fromUserFaction ? fromUserFaction.logo_url : ""

        let abilityKillColor = ""
        if (!from_user_stat || from_user_stat.ability_kill_count == 0 || !message_color) {
            abilityKillColor = colors.grey
        } else if (from_user_stat.ability_kill_count < 0) {
            abilityKillColor = colors.red
        } else {
            shadeColor(message_color, 30)
        }

        return {
            user_rank,
            avatar_id,
            content,
            from_user_stat,
            metadata,
            from_user,
            isTagged,
            isEmoji,
            abilityKillColor,
            factionColor,
            factionSecondaryColor,
            factionLogoUrl,
            factionLabel: fromUserFaction?.label,
        }
    }, [data, getFaction, user.gid])

    const isAlreadyReported = useMemo(() => metadata?.reports.includes(userID), [metadata?.reports, userID])
    const rankDeets = useMemo(() => (user_rank ? getUserRankDeets(user_rank, ".8rem", "1.8rem") : undefined), [user_rank])
    const fontSizes = useMemo(
        () => ({
            small: fontSize ? `${1 * fontSize}rem` : "0.9rem",
            normal: `${(fontSize || 1.3) * 1.5}rem`,
            large: `${(fontSize || 1.6) * 2.1}rem`,
            emoji: `${(fontSize || 1.3) * 3}rem`,
        }),
        [fontSize],
    )

    const isPreviousMessager = useMemo(() => {
        if (previousMessage && previousMessage.type === ChatMessageType.Text) {
            const prev = previousMessage.data as TextMessageData
            if (prev.from_user.id === data.from_user.id) {
                return true
            }
        }
        return false
    }, [data.from_user.id, previousMessage])

    const isMessageVisibleInChat = useMemo(() => {
        if (!containerRef.current || !textMessageRef.current || isScrolling) return false

        //Get container properties
        const cTop = containerRef.current?.scrollTop
        const cBottom = cTop + containerRef.current?.clientHeight

        //Get element properties
        const eTop = textMessageRef.current?.offsetTop
        const eBottom = textMessageRef.current?.clientHeight

        // if (!cTop || !cBottom || !eTop || !eBottom) return
        //Check if in view
        return eTop >= cTop && eBottom <= cBottom
    }, [containerRef, isScrolling])

    // Send server user read tagged message or send user browser notifications about they got tagged
    useEffect(() => {
        if (!isTagged || !metadata || Object.keys(metadata?.tagged_users_read).length === 0) return
        const isRead = metadata?.tagged_users_read[user.gid]

        // Send browser notification to user if tab is not visible
        if (isRead === false && (isHidden || !isActive)) {
            // Check if its the last message
            if (latestMessage?.id === message.id) {
                sendBrowserNotification.current({ title: `New Chat Message`, text: `${from_user.username} has tagged you in a message.` })
            }
            return
        }

        if (isMessageVisibleInChat && isRead === false) {
            // Tell server user read the message
            send<User>(GameServerKeys.ReadTaggedMessage, {
                chat_history_id: message.id,
            })
        }
    }, [
        from_user.username,
        isActive,
        isHidden,
        isMessageVisibleInChat,
        isTagged,
        latestMessage?.id,
        message.id,
        metadata,
        send,
        sendBrowserNotification,
        user.gid,
    ])

    // Get tagged user details from cache, if not exist, fetch from server
    useEffect(() => {
        ;(async () => {
            const matchedArray = content.match(/#\d+/g)
            const taggedUserFetches = matchedArray?.map(
                (match) =>
                    new Promise<boolean>((resolve) => {
                        const gidSubstring = parseInt(match.substring(1))
                        const taggedUser = userGidRecord.current[gidSubstring] || undefined

                        if (!taggedUser) {
                            ;(async () => {
                                try {
                                    // Put it in first so other TextMessage components wouldn't repeat the fetch
                                    addToUserGidRecord({
                                        id: "",
                                        username: "loading",
                                        faction_id: "",
                                        gid: gidSubstring,
                                        rank: "NEW_RECRUIT",
                                        features: [],
                                        role_type: RoleType.player,
                                    })

                                    const resp = await send<User>(GameServerKeys.GetPlayerByGid, {
                                        gid: gidSubstring,
                                    })
                                    if (resp) addToUserGidRecord(resp)
                                } catch (err) {
                                    console.error(err)
                                } finally {
                                    resolve(true)
                                }
                            })()
                        } else if (!taggedUser.id) {
                            addToUserGidRecordCallback(gidSubstring, () => toggleRefreshMessage())
                            resolve(true)
                        } else {
                            resolve(true)
                        }
                    }),
            )
            if (taggedUserFetches) {
                await Promise.all(taggedUserFetches)
                toggleRefreshMessage()
            }
        })()
    }, [addToUserGidRecord, addToUserGidRecordCallback, content, send, toggleRefreshMessage, userGidRecord])

    const chatMessage = useMemo(() => {
        // If no tagged users, directly return the message
        if (metadata && Object.keys(metadata?.tagged_users_read).length === 0) return <span>{content}</span>

        // Splitting the message on tags, identifying #12345 patterns e.g.: hi, #1234 how are you? => ['hi,', ' how are you'] (tags are stored in match array)
        const matchedArray = content.match(/#\d+/g)
        const stringsArray = content.split(/#\d+/g)
        const newMessageArray: ReactJSXElement[] = []

        // Looping through the string array
        stringsArray.map((str, i) => {
            // Pushing the first string
            newMessageArray.push(<span>{str}</span>)
            // If there is an item in matchedArr with the same index, push it into the new string, even if the tag is the first thing, it will still be split with an empty string at the start of stringsArr

            if (matchedArray && matchedArray[i]) {
                // Getting the gid from tag
                const gidSubstring = parseInt(matchedArray[i].substring(1))
                // Finding the user in the GID Record (added in above useEffect)
                const taggedUser = userGidRecord.current[gidSubstring]

                // If taggedUser doesnt exist or the user tagged themselves or user tagged taggedUser of a different faction in faction chat, just push the whole string, not rendering the tag
                if (!taggedUser || gidSubstring === from_user.gid || (taggedUser.faction_id !== user.faction_id && tabValue !== 0)) {
                    newMessageArray.push(<span>{matchedArray[i]}</span>)
                    return
                }

                newMessageArray.push(
                    <span>
                        <UsernameJSX
                            data={data}
                            fontSize={fontSizes.normal}
                            user={taggedUser}
                            setClickedOnUser={setClickedOnUser}
                            tabFactionID={tabFactionID}
                        />{" "}
                    </span>,
                )
            }
        })
        return (
            <>
                {newMessageArray.map((x, i) => (
                    <span key={i}>{x}</span>
                ))}
            </>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, from_user.gid, content, metadata, fontSizes, tabValue, user.faction_id, userGidRecord, refreshMessage])

    return useMemo(
        () => (
            <>
                <Box sx={{ position: "relative", opacity: message.received_at ? 1 : 0.45 }} ref={textMessageRef}>
                    {isFailed && (
                        <SvgInfoCircular size="1.2rem" fill={colors.red} sx={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-38%)" }} />
                    )}

                    {(!isPreviousMessager || (previousMessage && message.sent_at > new Date(previousMessage.sent_at.getTime() + 2 * 60000))) && (
                        <Stack direction="row" justifyContent="space-between" sx={{ mt: ".8rem", mb: ".5rem" }}>
                            <Stack ref={popoverRef} direction="row" spacing=".5rem" alignItems="center">
                                <Stack direction="row" spacing=".4rem" alignItems="center">
                                    {avatar_id && (
                                        <Box
                                            sx={{
                                                width: fontSizes.large,
                                                height: fontSizes.large,
                                                flexShrink: 0,
                                                backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${avatar_id})`,
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "center",
                                                backgroundSize: "contain",
                                                backgroundColor: factionColor,
                                                borderRadius: "50%",
                                                border: `${factionColor} 1px solid`,
                                            }}
                                        />
                                    )}

                                    {factionLogoUrl && (
                                        <NiceTooltip placement="top-start" text={factionLabel}>
                                            <Box
                                                sx={{
                                                    width: fontSizes.large,
                                                    height: fontSizes.large,
                                                    flexShrink: 0,
                                                    backgroundImage: `url(${factionLogoUrl})`,
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundPosition: "center",
                                                    backgroundSize: "contain",
                                                }}
                                            />
                                        </NiceTooltip>
                                    )}

                                    {user_rank && rankDeets && (
                                        <NiceTooltip
                                            placement="top-start"
                                            renderNode={
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        p: ".5rem 1.2rem",
                                                        color: "#FFFFFF",
                                                        fontFamily: fonts.rajdhaniMedium,
                                                        textAlign: "start",
                                                        maxWidth: "25rem",
                                                    }}
                                                >
                                                    <strong>RANK: </strong>
                                                    {rankDeets.title}
                                                    <br />
                                                    {rankDeets.desc}
                                                </Typography>
                                            }
                                        >
                                            <Box>{rankDeets.icon}</Box>
                                        </NiceTooltip>
                                    )}
                                </Stack>

                                <UsernameJSX
                                    data={data}
                                    fontSize={`${fontSizes.normal}rem`}
                                    user={from_user}
                                    toggleIsPopoverOpen={toggleIsPopoverOpen}
                                    setClickedOnUser={setClickedOnUser}
                                    tabFactionID={tabFactionID}
                                />

                                {from_user_stat && (
                                    <NiceTooltip placement="top-start" text={`${from_user_stat.ability_kill_count} ability kills`}>
                                        <Typography
                                            sx={{
                                                flexShrink: 0,
                                                lineHeight: 1,
                                                fontSize: fontSizes.normal,
                                                color: abilityKillColor,
                                                cursor: "default",
                                            }}
                                        >
                                            [<SvgSkull size={fontSizes.normal} fill={abilityKillColor} inline />
                                            {from_user_stat.ability_kill_count}]
                                        </Typography>
                                    </NiceTooltip>
                                )}
                            </Stack>

                            <Typography
                                sx={{
                                    alignSelf: "center",
                                    flexShrink: 0,
                                    ml: "auto",
                                    color: colors.grey,
                                    opacity: 0.7,
                                    fontSize: fontSizes.normal,
                                }}
                            >
                                {dateFormatter(message.sent_at)}
                            </Typography>
                        </Stack>
                    )}

                    <Box>
                        <Stack
                            direction={"column"}
                            sx={{
                                backgroundColor: isHovered ? "#121212" : "unset",
                                borderRadius: ".3rem",
                                position: "relative",
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <Stack direction={"row"} sx={{ lineHeight: 1.2, color: "#FFFFFF", zIndex: 1, alignItems: "center" }}>
                                {userID && (
                                    <SvgReportFlag
                                        fill={isAlreadyReported ? colors.red : "grey"}
                                        size={"1.5rem"}
                                        sx={{
                                            mr: "1rem",
                                            opacity: isHovered ? 1 : 0,
                                            cursor: userID ? "pointer" : "cursor",
                                        }}
                                        onClick={() => {
                                            if (isAlreadyReported) {
                                                newSnackbarMessage("Your report has already been sent.", "warning")
                                                return
                                            }
                                            setReportModalOpen(true)
                                        }}
                                    />
                                )}
                                <Box
                                    sx={{
                                        fontFamily: fonts.rajdhaniMedium,
                                        lineHeight: 1.2,
                                        color: "#FFFFFF",
                                        fontSize: isEmoji ? fontSizes.emoji : fontSizes.normal,
                                        zIndex: isHovered ? 2 : 1,
                                    }}
                                >
                                    {chatMessage}
                                </Box>
                            </Stack>

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

                {banModalOpen && user && from_user.faction_id === user.faction_id && (
                    <UserBanForm
                        open={banModalOpen}
                        onClose={() => toggleBanModalOpen(false)}
                        prefillUser={{
                            id: from_user.id,
                            username: from_user.username,
                            gid: from_user.gid,
                        }}
                    />
                )}

                {reportModalOpen && (
                    <ReportModal fromUser={from_user} message={data} setReportModalOpen={setReportModalOpen} reportModalOpen={reportModalOpen} />
                )}
            </>
        ),
        [
            abilityKillColor,
            avatar_id,
            banModalOpen,
            chatMessage,
            data,
            factionColor,
            factionLabel,
            factionLogoUrl,
            factionSecondaryColor,
            fontSize,
            fontSizes.emoji,
            fontSizes.large,
            fontSizes.normal,
            from_user,
            from_user_stat,
            isAlreadyReported,
            isEmoji,
            isFailed,
            isHovered,
            isPopoverOpen,
            isPreviousMessager,
            message.received_at,
            message.sent_at,
            metadata?.likes.net,
            newSnackbarMessage,
            previousMessage,
            rankDeets,
            reportModalOpen,
            setClickedOnUser,
            setReportModalOpen,
            tabFactionID,
            toggleBanModalOpen,
            toggleIsPopoverOpen,
            user,
            userID,
            user_rank,
        ],
    )
},
propsAreEqual)

interface UsernameJSXProps {
    tabFactionID: string | null
    data: TextMessageData
    fontSize: string
    toggleIsPopoverOpen?: (value?: boolean) => void
    user: User | undefined
    setClickedOnUser?: React.Dispatch<React.SetStateAction<ClickedOnUser | undefined>>
}

const propsAreEqualUsernameJSX = (prevProps: UsernameJSXProps, nextProps: UsernameJSXProps) => {
    return (
        prevProps.data.message_color === nextProps.data.message_color &&
        prevProps.fontSize === nextProps.fontSize &&
        prevProps.user?.id === nextProps.user?.id &&
        prevProps.tabFactionID === nextProps.tabFactionID
    )
}

export const UsernameJSX = React.memo(function UsernameJSX({ data, fontSize, toggleIsPopoverOpen, user, setClickedOnUser, tabFactionID }: UsernameJSXProps) {
    const { getFaction } = useSupremacy()
    const { message_color } = data

    const faction = useMemo(() => getFaction(user?.faction_id || ""), [getFaction, user?.faction_id])

    return (
        <Typography
            onContextMenu={
                toggleIsPopoverOpen
                    ? (e) => {
                          toggleIsPopoverOpen()
                          e.preventDefault()
                          e.stopPropagation()
                      }
                    : undefined
            }
            onClick={setClickedOnUser && user ? () => setClickedOnUser({ user, tabFactionID }) : undefined}
            sx={{
                display: "inline",
                cursor: toggleIsPopoverOpen ? "pointer" : "unset",
                p: toggleIsPopoverOpen ? "unset" : ".08rem .5rem",
                color: toggleIsPopoverOpen ? message_color : faction.palette.text,
                backgroundColor: toggleIsPopoverOpen ? "unset" : faction.palette.primary,
                borderRadius: toggleIsPopoverOpen ? "unset" : 0.5,
                fontSize,
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
            {toggleIsPopoverOpen ? truncate(user?.username || "", 20) : `@${user?.username}`}
            <span
                style={{
                    marginLeft: ".2rem",
                    fontSize,
                }}
            >{`#${user?.gid}`}</span>
        </Typography>
    )
}, propsAreEqualUsernameJSX)
