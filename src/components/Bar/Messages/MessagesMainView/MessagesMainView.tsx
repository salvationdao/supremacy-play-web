import { Box, Stack, Switch, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SvgAnnouncement, SvgDamage1, SvgHealth, SvgHistoryClock, SvgNotification, SvgSyndicateFlag } from "../../../../assets"
import { useAuth } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { usePagination } from "../../../../hooks"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { FeatureName, SystemMessage, SystemMessageDataType } from "../../../../types"
import { CoolTable } from "../../../Common/CoolTable"
import { FancyButton } from "../../../Common/FancyButton"
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
    const [hideRead, setHideRead] = useState(false)
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
                    case SystemMessageDataType.Faction:
                        icon = <SvgSyndicateFlag fill={theme.factionTheme.primary} size="1.6rem" />
                        break
                    case SystemMessageDataType.MechOwnerBattleReward:
                        icon = <SvgHealth fill={colors.yellow} size="1.6rem" />
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
        if (messages.length === 0) {
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
                        YOUR INBOX IS EMPTY.
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
                                                opacity: !item.read_at ? 1 : 0.5,
                                                "*": { fontWeight: !item.read_at ? "fontWeightBold" : "unset" },
                                            },
                                            backgroundColor: focusedMessage?.id === item.id ? "#FFFFFF26" : "unset",
                                            "&:hover": {
                                                cursor: "pointer",
                                                backgroundColor: "#FFFFFF26",
                                                border: "#FFFFFF38 solid 1px",
                                            },
                                        },
                                    },
                                    cells: [
                                        <Stack key={0} spacing="1rem" direction="row" alignItems="center">
                                            {item.icon}
                                            <Typography
                                                sx={{
                                                    display: "-webkit-box",
                                                    overflow: "hidden",
                                                    overflowWrap: "anywhere",
                                                    width: "100%",
                                                    maxWidth: "100px",
                                                    textOverflow: "ellipsis",
                                                    WebkitLineClamp: 1, // change to max number of lines
                                                    WebkitBoxOrient: "vertical",
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
                                                display: "-webkit-box",
                                                overflow: "hidden",
                                                overflowWrap: "anywhere",
                                                width: "100%",
                                                maxWidth: "100px",
                                                textOverflow: "ellipsis",
                                                WebkitLineClamp: 1, // change to max number of lines
                                                WebkitBoxOrient: "vertical",
                                                textAlign: "left",
                                            }}
                                        >
                                            {item.title}
                                        </Typography>,
                                        <Typography
                                            key={2}
                                            sx={{
                                                display: "-webkit-box",
                                                overflow: "hidden",
                                                overflowWrap: "anywhere",
                                                textOverflow: "ellipsis",
                                                WebkitLineClamp: 1, // change to max number of lines
                                                WebkitBoxOrient: "vertical",
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

                    <Box sx={{ height: "50%", borderTop: `${theme.factionTheme.primary} 1px solid` }}>
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
                <Stack sx={{ height: "100%", backgroundColor: "#000000", borderRight: `${theme.factionTheme.primary}70 1.5px solid` }}>
                    <Stack spacing="1.4rem" flex={1} sx={{ p: "1.6rem" }}>
                        <FancyButton
                            clipThingsProps={{
                                clipSize: "9px",
                                clipSlantSize: "0px",
                                backgroundColor: theme.factionTheme.primary,
                                opacity: 1,
                                border: { borderColor: theme.factionTheme.primary, borderThickness: "1px" },
                                sx: { position: "relative" },
                            }}
                            sx={{ px: "1.6rem", py: ".6rem", color: theme.factionTheme.secondary }}
                            onClick={() => onCompose(SystemMessageDataType.Global)}
                        >
                            <Typography sx={{ fontWeight: "fontWeightBold", color: theme.factionTheme.secondary }}>Compose Global Message</Typography>
                        </FancyButton>

                        <FancyButton
                            clipThingsProps={{
                                clipSize: "9px",
                                clipSlantSize: "0px",
                                backgroundColor: theme.factionTheme.primary,
                                opacity: 1,
                                border: { borderColor: theme.factionTheme.primary, borderThickness: "1px" },
                                sx: { position: "relative" },
                            }}
                            sx={{ px: "1.6rem", py: ".6rem", color: theme.factionTheme.secondary }}
                            onClick={() => onCompose(SystemMessageDataType.Faction)}
                        >
                            <Typography sx={{ fontWeight: "fontWeightBold", color: theme.factionTheme.secondary }}>Compose Faction Message</Typography>
                        </FancyButton>
                    </Stack>
                </Stack>
            )}

            <Stack sx={{ flex: 1, height: "100%" }}>
                <Stack sx={{ p: ".6rem 1.6rem", pt: "1rem", borderBottom: `${theme.factionTheme.primary}70 1.5px solid` }}>
                    <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                        YOUR INBOX
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing=".4rem">
                        <SvgHistoryClock size="1.2rem" />
                        <Typography>Last updated: {lastUpdated.toISOString()}</Typography>

                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ ml: "auto !important" }}>
                            <Switch
                                size="small"
                                checked={hideRead}
                                onChange={(e, c) => setHideRead(c)}
                                sx={{
                                    transform: "scale(.7)",
                                    ".Mui-checked": { color: theme.factionTheme.primary },
                                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${theme.factionTheme.primary}50` },
                                }}
                            />
                            <Typography variant="body2" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                                Hide Read
                            </Typography>
                        </Stack>
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
