import { Badge, Box, IconButton, Pagination, Popover, Stack, Switch, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgAnnouncement, SvgDamage1, SvgHistoryClock, SvgListView, SvgMail, SvgWrapperProps } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { usePagination, useToggle } from "../../../hooks"
import { useGameServerCommandsUser, useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { SystemMessage, SystemMessageType } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { MessageItem } from "./MessageItem"

export interface SystemMessageDisplayable extends SystemMessage {
    icon: React.VoidFunctionComponent<SvgWrapperProps>
}

export const Messages = () => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [messages, setMessages] = useState<SystemMessageDisplayable[]>([])
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

    const popoverRef = useRef(null)
    const [modalOpen, toggleModalOpen] = useToggle(false)
    const [showTimestamps, setShowTimestamps] = useState(true)
    const [error, setError] = useState<string>()
    const { page, changePage, totalPages, totalItems, setTotalItems, pageSize } = usePagination({
        pageSize: 10,
        page: 1,
    })

    const fetchMessages = useCallback(async () => {
        try {
            const resp = await send<
                {
                    total: number
                    system_messages: SystemMessage[] | null
                },
                {
                    page: number
                    page_size: number
                }
            >(GameServerKeys.SystemMessageList, {
                page: page - 1,
                page_size: pageSize,
            })
            if (!resp || !resp.system_messages) return

            const displayables = resp.system_messages.map<SystemMessageDisplayable>((r) => {
                let icon = SvgAnnouncement
                switch (r.type) {
                    case SystemMessageType.MechQueue:
                        icon = SvgListView
                        break
                    case SystemMessageType.MechBattleComplete:
                        icon = SvgDamage1
                        break
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
    }, [page, pageSize, send, setTotalItems])

    useEffect(() => {
        fetchMessages()
    }, [fetchMessages, lastUpdated])

    useGameServerSubscriptionUser<boolean>(
        {
            URI: "/system_messages",
            key: GameServerKeys.SubSystemMessageListUpdated,
        },
        (payload) => {
            if (!payload) return
            setLastUpdated(new Date())
        },
    )

    const dismissMessage = useCallback(
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
                <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "10rem", p: "1rem" }}>
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
        }

        return (
            <Stack spacing="1rem">
                <Stack spacing=".8rem" sx={{ p: "1rem 2rem 1.5rem 1.5rem" }}>
                    {messages.map((m) => (
                        <MessageItem key={m.id} message={m} onDismiss={() => dismissMessage(m.id)} showTimestamps={showTimestamps} />
                    ))}
                </Stack>

                {totalPages > 1 && (
                    <Box
                        sx={{
                            pt: "1rem",
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
    }, [messages, totalPages, theme.factionTheme.primary, theme.factionTheme.secondary, page, showTimestamps, dismissMessage, changePage])

    return (
        <>
            <Stack
                ref={popoverRef}
                direction="row"
                alignItems="center"
                sx={{
                    mx: "1.2rem",
                    height: "100%",
                }}
            >
                <Box>
                    <Badge
                        badgeContent={totalItems}
                        color="error"
                        sx={{
                            "& .MuiBadge-badge": {
                                top: 10,
                                right: 6,
                                height: 14,
                                minWidth: 14,
                                fontSize: "1.2rem",
                            },
                        }}
                    >
                        <IconButton onClick={() => toggleModalOpen(true)}>
                            <SvgMail size="2.2rem" />
                        </IconButton>
                    </Badge>
                </Box>
            </Stack>

            <Popover
                open={modalOpen}
                anchorEl={popoverRef.current}
                onClose={() => toggleModalOpen(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                sx={{
                    mt: ".5rem",
                    zIndex: siteZIndex.Popover,
                    ".MuiPaper-root": {
                        background: "none",
                        boxShadow: 0,
                    },
                }}
            >
                <ClipThing
                    clipSize="10px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={theme.factionTheme.background}
                    sx={{
                        width: "52rem",
                        maxWidth: "80vw",
                    }}
                >
                    <Stack
                        sx={{
                            p: "1rem 2rem",
                            borderBottom: `${theme.factionTheme.primary}70 1.5px solid`,
                        }}
                    >
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing="1.5rem">
                            <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                                SYSTEM MESSAGES
                            </Typography>

                            <Stack direction="row" alignItems="center">
                                <Switch
                                    disabled={messages.length === 0}
                                    size="small"
                                    checked={showTimestamps}
                                    onChange={(e, c) => setShowTimestamps(c)}
                                    sx={{
                                        transform: "scale(.7)",
                                        ".Mui-checked": { color: (theme) => theme.factionTheme.primary },
                                        ".Mui-checked+.MuiSwitch-track": { backgroundColor: (theme) => `${theme.factionTheme.primary}50` },
                                    }}
                                />

                                <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>Show Timestamps</Typography>
                            </Stack>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing=".4rem" sx={{ opacity: 0.5, ":hover": { opacity: 1 } }}>
                            <SvgHistoryClock size="1.2rem" />
                            <Typography>Last updated: {lastUpdated.toISOString()}</Typography>
                        </Stack>

                        {error && (
                            <Typography variant="body2" sx={{ color: colors.red }}>
                                {error}
                            </Typography>
                        )}
                    </Stack>

                    {content}
                </ClipThing>
            </Popover>
        </>
    )
}
