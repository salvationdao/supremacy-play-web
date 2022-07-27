import { Box, colors, Divider, FormControlLabel, Pagination, Stack, Switch, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SvgAnnouncement, SvgDamage1, SvgHistoryClock, SvgListView, SvgSyndicateFlag } from "../../../../assets"
import { useAuth } from "../../../../containers"
import { usePagination } from "../../../../hooks"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { fonts, theme } from "../../../../theme/theme"
import { FeatureName, SystemMessage, SystemMessageDataType } from "../../../../types"
import { FancyButton } from "../../../Common/FancyButton"
import { SystemMessageDisplayable } from "../Messages"
import { MessageDisplay } from "./MessageDisplay/MessageDisplay"
import { MessageItem } from "./MessageItem"

export interface MessagesMainViewProps {
    lastUpdated: Date
    onCompose: (type: SystemMessageDataType) => void
}

export const MessagesMainView = ({ lastUpdated, onCompose }: MessagesMainViewProps) => {
    const { userHasFeature } = useAuth()
    const { send } = useGameServerCommandsUser("/user_commander")

    const [messages, setMessages] = useState<SystemMessageDisplayable[]>([])
    const [focusedMessage, setFocusedMessage] = useState<SystemMessageDisplayable>()
    const [error, setError] = useState<string>()
    const [hideRead, setHideRead] = useState(false)
    const { page, changePage, totalPages, setTotalItems, pageSize } = usePagination({
        pageSize: 5,
        page: 1,
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
                page: page - 1,
                page_size: pageSize,
                hide_read: hideRead,
            })
            if (!resp || !resp.system_messages) return

            const displayables = resp.system_messages.map<SystemMessageDisplayable>((r) => {
                let icon = SvgAnnouncement
                switch (r.data_type) {
                    case SystemMessageDataType.MechQueue:
                        icon = SvgListView
                        break
                    case SystemMessageDataType.MechBattleComplete:
                        icon = SvgDamage1
                        break
                    case SystemMessageDataType.Faction:
                        icon = SvgSyndicateFlag
                }

                return {
                    ...r,
                    icon,
                }
            })
            setTotalItems(resp.total)
            setMessages(displayables)
        } catch (e) {
            let message = "Failed to get system messages."
            if (typeof e === "string") {
                message = e
            } else if (e instanceof Error) {
                message = e.message
            }
            setError(message)
            console.error(e)
        }
    }, [hideRead, page, pageSize, send, setTotalItems])

    useEffect(() => {
        changePage(1)
    }, [changePage, hideRead])

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
        let messagesRender = null

        if (messages.length === 0) {
            messagesRender = (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", p: "1rem" }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            opacity: 0.9,
                            textAlign: "center",
                            textTransform: "uppercase",
                        }}
                    >
                        YOUR INBOX IS EMPTY.
                    </Typography>
                </Stack>
            )
        } else {
            messagesRender = (
                <Stack spacing="1rem" height="100%">
                    <Stack spacing=".8rem" flex={1}>
                        {messages.map((m) => (
                            <MessageItem
                                key={m.id}
                                message={m}
                                selected={focusedMessage?.id === m.id}
                                onSelect={() => {
                                    if (!m.read_at) {
                                        readMessage(m.id)
                                    }
                                    setFocusedMessage(m)
                                }}
                            />
                        ))}
                    </Stack>
                    {totalPages > 1 && (
                        <Box
                            sx={{
                                p: "1rem",
                                borderTop: `${theme.factionTheme.primary}70 1.5px solid`,
                                backgroundColor: "#00000070",
                            }}
                        >
                            <Pagination
                                size="small"
                                count={totalPages}
                                page={page}
                                sx={{
                                    ".MuiButtonBase-root": { borderRadius: 0.8, fontFamily: fonts.nostromoBold, fontSize: "1.2rem" },
                                    ".Mui-selected": {
                                        color: theme.factionTheme.secondary,
                                        backgroundColor: `${theme.factionTheme.primary} !important`,
                                    },
                                }}
                                onChange={(e, p) => changePage(p)}
                            />
                        </Box>
                    )}
                </Stack>
            )
        }

        return (
            <Stack flex={1} minHeight={0}>
                {error && (
                    <Typography variant="body2" sx={{ color: colors.red }}>
                        {error}
                    </Typography>
                )}
                <Stack
                    spacing="1rem"
                    sx={{
                        minHeight: "50%",
                        mb: "1rem",
                    }}
                >
                    {messagesRender}
                </Stack>
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        p: ".6rem 1.2rem",
                        backgroundColor: "#FFFFFF10",
                    }}
                >
                    {focusedMessage ? (
                        <MessageDisplay message={focusedMessage} />
                    ) : (
                        <Stack alignItems="center" justifyContent="center" height="100%">
                            <Typography
                                variant="body2"
                                sx={{
                                    color: colors.grey,
                                    fontFamily: fonts.nostromoBold,
                                    opacity: 0.9,
                                    textAlign: "center",
                                }}
                            >
                                Select an item to view its contents.
                            </Typography>
                        </Stack>
                    )}
                </Box>
            </Stack>
        )
    }, [messages, focusedMessage, error, totalPages, page, readMessage, changePage])

    return (
        <Stack direction="row" p="2rem" height="100%">
            {userHasFeature(FeatureName.systemMessages) && (
                <>
                    <Stack
                        sx={{
                            height: "100%",
                            minWidth: "200px",
                        }}
                    >
                        <Stack spacing="1rem" flex={1}>
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "7px",
                                }}
                                size="large"
                                sx={{
                                    fontSize: "2rem",
                                    px: "1.2rem",
                                    backgroundColor: theme.factionTheme.primary,
                                }}
                                onClick={() => onCompose(SystemMessageDataType.Global)}
                            >
                                Compose Global Message
                            </FancyButton>
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "7px",
                                }}
                                size="large"
                                sx={{
                                    fontSize: "2rem",
                                    px: "1.2rem",
                                    backgroundColor: theme.factionTheme.primary,
                                }}
                                onClick={() => onCompose(SystemMessageDataType.Faction)}
                            >
                                Compose Faction Message
                            </FancyButton>
                        </Stack>
                    </Stack>
                    <Divider
                        orientation="vertical"
                        sx={{
                            mx: "1rem",
                            backgroundColor: `${theme.factionTheme.primary}70`,
                        }}
                    />
                </>
            )}
            <Stack
                sx={{
                    flex: 1,
                    height: "100%",
                }}
                spacing="1rem"
            >
                <Stack
                    direction="row"
                    sx={{
                        pb: "1rem",
                        borderBottom: `${theme.factionTheme.primary}70 1.5px solid`,
                    }}
                >
                    <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                        INBOX
                    </Typography>
                    <FormControlLabel
                        control={<Switch size="small" checked={hideRead} onChange={(e, c) => setHideRead(c)} />}
                        label="Hide Read"
                        sx={{
                            ml: "auto",
                            fontSize: "1rem",
                            "& .MuiSwitch-switchBase.Mui-checked": {
                                color: theme.factionTheme.primary,
                                "&:hover": {
                                    backgroundColor: `${theme.factionTheme.primary}dd`,
                                },
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: theme.factionTheme.primary,
                            },
                        }}
                    />
                </Stack>
                <Stack direction="row" alignItems="center" spacing=".4rem" sx={{ opacity: 0.5, ":hover": { opacity: 1 } }}>
                    <SvgHistoryClock size="1.2rem" />
                    <Typography>Last updated: {lastUpdated.toISOString()}</Typography>
                </Stack>
                {content}
            </Stack>
        </Stack>
    )
}
