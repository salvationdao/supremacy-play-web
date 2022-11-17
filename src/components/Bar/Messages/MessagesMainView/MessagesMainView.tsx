import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SvgAbility, SvgAnnouncement, SvgDamage1, SvgEmptySet, SvgHistoryClock, SvgMail, SvgNotification, SvgSyndicateFlag } from "../../../../assets"
import { useAuth } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { usePagination } from "../../../../hooks"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { useLocalStorage } from "../../../../hooks/useLocalStorage"
import { GameServerKeys } from "../../../../keys"
import { TruncateTextLines } from "../../../../theme/styles"
import { colors, fonts } from "../../../../theme/theme"
import { FeatureName, SystemMessage, SystemMessageDataType } from "../../../../types"
import { CoolTable } from "../../../Common/CoolTable"
import { NiceButton } from "../../../Common/Nice/NiceButton"
import { PreferenceToggle } from "../../ProfileCard/PreferencesModal/NotificationPreferences"
import { SystemMessageDisplayable } from "../Messages"
import { MessageDisplay } from "./MessageDisplay/MessageDisplay"

export interface MessagesMainViewProps {
    lastUpdated: Date
    onCompose: (type: SystemMessageDataType) => void
}

export const MessagesMainView = ({ lastUpdated, onCompose }: MessagesMainViewProps) => {
    const theme = useTheme()
    const { userHasFeature } = useAuth()
    const { send } = useGameServerCommandsUser("/user_commander")

    const [messages, setMessages] = useState<SystemMessageDisplayable[]>([])
    const [focusedMessage, setFocusedMessage] = useState<SystemMessageDisplayable>()
    const [error, setError] = useState<string>()
    const [hideRead, setHideRead] = useLocalStorage<boolean>("hideReadMessages", false)
    const { page, changePage, setTotalItems, totalItems, changePageSize, pageSize } = usePagination({
        pageSize: 15,
        page: 0,
    })

    const fetchMessages = useCallback(async () => {
        try {
            const resp = await send<
                {
                    total: number
                    total_unread: number
                    system_messages: SystemMessage[] | null
                },
                {
                    page: number
                    page_size: number
                    hide_read: boolean
                }
            >(GameServerKeys.SystemMessageList, {
                page: page,
                page_size: pageSize,
                hide_read: hideRead,
            })
            if (!resp || !resp.system_messages) return

            const displayables = resp.system_messages.map<SystemMessageDisplayable>((r) => {
                let icon = <SvgAnnouncement fill={colors.orange} size="1.6rem" />
                switch (r.data_type) {
                    case SystemMessageDataType.MechQueue:
                        icon = <SvgNotification size="1.6rem" />
                        break
                    case SystemMessageDataType.MechBattleComplete:
                        icon = <SvgDamage1 fill={colors.green} size="1.6rem" />
                        break
                    case SystemMessageDataType.MechBattleBegin:
                        icon = <SvgNotification size="1.6rem" />
                        break
                    case SystemMessageDataType.Faction:
                        icon = <SvgSyndicateFlag fill={theme.factionTheme.primary} size="1.6rem" />
                        break
                    case SystemMessageDataType.PlayerAbilityRefunded:
                        icon = <SvgAbility fill={colors.orange} size="1.6rem" />
                        break
                    case SystemMessageDataType.ExpiredBattleLobby:
                        icon = <SvgEmptySet fill={colors.red} size="1.6rem" />
                        break
                    case SystemMessageDataType.BattleLobbyInvitation:
                        icon = <SvgMail fill={colors.red} size="1.6rem" />
                        break
                }

                return {
                    ...r,
                    icon,
                }
            })
            setTotalItems(resp.total)
            setMessages(displayables)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to get system messages."
            setError(message)
            console.error(err)
        }
    }, [hideRead, page, pageSize, send, setTotalItems, theme.factionTheme.primary])

    useEffect(() => {
        changePage(0)
    }, [changePage, hideRead, pageSize])

    useEffect(() => {
        fetchMessages()
    }, [fetchMessages, lastUpdated])

    const readMessage = useCallback(
        async (id: string) => {
            try {
                await send<SystemMessage[], { id: string }>(GameServerKeys.SystemMessageDismiss, {
                    id,
                })
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to dismiss system message."
                setError(message)
                console.error(err)
            }
        },
        [send],
    )

    const content = useMemo(() => {
        if (messages.length === 0 && !focusedMessage) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ flex: 1, p: "1rem" }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: colors.lightGrey,
                            fontFamily: fonts.nostromoBold,
                            textAlign: "center",
                        }}
                    >
                        YOUR INBOX IS EMPTY
                    </Typography>
                </Stack>
            )
        } else {
            return (
                <Stack sx={{ flex: 1 }}>
                    <Stack sx={{ flex: 1 }}>
                        <CoolTable
                            tableHeadings={["FROM", "TITLE", "BODY", "TIME"]}
                            alignments={["left", "left", "left", "left"]}
                            widths={["18rem", "15rem", "auto", "8rem"]}
                            titleRowHeight="3.5rem"
                            cellPadding=".6rem 1rem"
                            items={messages}
                            paginationProps={{
                                page,
                                pageSize,
                                totalItems,
                                changePage,
                                changePageSize,
                                pageSizeOptions: [15, 25, 35],
                            }}
                            renderItem={(item) => {
                                return {
                                    rowProps: {
                                        onClick: () => {
                                            if (!item.read_at) readMessage(item.id)
                                            setFocusedMessage(item)
                                        },
                                        sx: {
                                            ".MuiTableCell-root": {
                                                opacity: !item.read_at || focusedMessage?.id === item.id ? 1 : 0.5,
                                                "*": { fontWeight: !item.read_at ? "bold" : "unset" },
                                            },
                                            backgroundColor: focusedMessage?.id === item.id ? "#FFFFFF40 !important" : "unset",
                                            outline: focusedMessage?.id === item.id ? "#FFFFFF38 solid 1px" : "unset",
                                            "&:hover":
                                                focusedMessage?.id !== item.id
                                                    ? {
                                                          cursor: "pointer",
                                                          backgroundColor: "#FFFFFF26",
                                                          outline: "#FFFFFF38 solid 1px",
                                                      }
                                                    : undefined,
                                        },
                                    },
                                    cells: [
                                        <Stack key={0} spacing="1rem" direction="row" alignItems="center">
                                            {item.icon}
                                            <Typography
                                                sx={{
                                                    ...TruncateTextLines(1),
                                                    width: "100%",
                                                    maxWidth: "100px",
                                                    textAlign: "left",
                                                    textTransform: "none",
                                                }}
                                            >
                                                {item.sender.username}
                                            </Typography>
                                        </Stack>,
                                        <Typography
                                            key={1}
                                            sx={{
                                                ...TruncateTextLines(1),
                                                width: "100%",
                                                maxWidth: "100px",
                                                textAlign: "left",
                                            }}
                                        >
                                            {item.title}
                                        </Typography>,
                                        <Typography
                                            key={2}
                                            sx={{
                                                ...TruncateTextLines(1),
                                                textAlign: "left",
                                                textTransform: "none",
                                            }}
                                        >
                                            {item.message}
                                        </Typography>,
                                        <Typography key={3}>
                                            {item.sent_at.getHours()}:{`${item.sent_at.getMinutes() < 10 ? "0" : ""}${item.sent_at.getMinutes()}`}
                                        </Typography>,
                                    ],
                                }
                            }}
                        />
                    </Stack>

                    <Box sx={{ height: "60%", borderTop: `${theme.factionTheme.primary} 1px solid` }}>
                        {focusedMessage ? (
                            <MessageDisplay message={focusedMessage} onClose={() => setFocusedMessage(undefined)} />
                        ) : (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: colors.grey,
                                        fontFamily: fonts.nostromoBold,
                                        textAlign: "center",
                                    }}
                                >
                                    Select a message to view here.
                                </Typography>
                            </Stack>
                        )}
                    </Box>
                </Stack>
            )
        }
    }, [messages, page, pageSize, totalItems, changePage, changePageSize, focusedMessage, theme.factionTheme.primary, readMessage])

    return (
        <Stack direction="row" height="100%">
            {userHasFeature(FeatureName.systemMessages) && (
                <Stack sx={{ height: "100%", backgroundColor: "#000000", borderRight: `${colors.darkGrey} 1px solid` }}>
                    <Stack spacing="1.4rem" flex={1} sx={{ p: "1.6rem" }}>
                        <NiceButton corners buttonColor={colors.green} onClick={() => onCompose(SystemMessageDataType.Global)}>
                            Compose Global Message
                        </NiceButton>

                        <NiceButton corners buttonColor={theme.factionTheme.primary} onClick={() => onCompose(SystemMessageDataType.Faction)}>
                            Compose Faction Message
                        </NiceButton>
                    </Stack>
                </Stack>
            )}

            <Stack sx={{ flex: 1, height: "100%" }}>
                <Stack sx={{ p: ".6rem 1.6rem", pt: "1rem", borderBottom: `${colors.darkGrey} 1px solid` }}>
                    <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                        YOUR INBOX
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing=".5rem">
                        <SvgHistoryClock size="1.2rem" />
                        <Typography>Last updated: {lastUpdated.toISOString()}</Typography>

                        <Box sx={{ ml: "auto !important" }}>
                            <PreferenceToggle title="Hide read" checked={hideRead} onChangeFunction={(e) => setHideRead(e.currentTarget.checked)} />
                        </Box>
                    </Stack>

                    {error && (
                        <Typography variant="body2" sx={{ color: colors.red }}>
                            {error}
                        </Typography>
                    )}
                </Stack>

                {content}
            </Stack>
        </Stack>
    )
}
