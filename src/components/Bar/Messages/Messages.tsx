import { Badge, Box, Button, Divider, FormControlLabel, IconButton, Pagination, Popover, Stack, Switch, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgAnnouncement, SvgDamage1, SvgHistoryClock, SvgListView, SvgMail, SvgWrapperProps } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { usePagination, useToggle } from "../../../hooks"
import { useGameServerCommandsUser, useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { SystemMessage, SystemMessageDataType } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { FancyButton } from "../../Common/FancyButton"
import { MessageDisplay } from "./MessageDisplay"
import { MessageItem } from "./MessageItem"

export interface SystemMessageDisplayable extends SystemMessage {
    icon: React.VoidFunctionComponent<SvgWrapperProps>
}

export const Messages = () => {
    const theme = useTheme()
    const popoverRef = useRef(null)
    const [modalOpen, toggleModalOpen] = useToggle(false)

    const { send } = useGameServerCommandsUser("/user_commander")
    const [messages, setMessages] = useState<SystemMessageDisplayable[]>([])
    const [focusedMessage, setFocusedMessage] = useState<SystemMessageDisplayable>()
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
    const [error, setError] = useState<string>()
    const [totalUnread, setTotalUnread] = useState<number>()
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
                }

                return {
                    ...r,
                    icon,
                }
            })
            setTotalUnread(resp.total_unread)
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
    }, [messages, focusedMessage, error, totalPages, theme.factionTheme.primary, theme.factionTheme.secondary, page, readMessage, changePage])

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
                        badgeContent={totalUnread}
                        color="error"
                        sx={{
                            "& .MuiBadge-badge": {
                                top: 10,
                                right: 6,
                                height: 14,
                                minWidth: 14,
                                fontSize: "1.5rem",
                                fontWeight: "fontWeightBold",
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
                        height: "600px",
                        maxHeight: "100vh",
                        width: "1000px",
                        maxWidth: "100vw",
                    }}
                >
                    <Stack direction="row" p="2rem" height="100%">
                        <Stack
                            sx={{
                                height: "100%",
                                minWidth: "200px",
                            }}
                        >
                            <Box flex={1}>
                                <FancyButton
                                    clipThingsProps={{
                                        clipSize: "7px",
                                        opacity: 1,
                                    }}
                                    size="large"
                                    sx={{
                                        fontSize: "2rem",
                                        px: "1.2rem",
                                        backgroundColor: theme.factionTheme.primary,
                                    }}
                                >
                                    Compose Message
                                </FancyButton>
                            </Box>
                            <Stack
                                spacing="1rem"
                                sx={{
                                    minHeight: "50%",
                                    maxHeight: "180px",
                                }}
                            >
                                <Box
                                    sx={{
                                        pb: "1rem",
                                        borderBottom: `${theme.factionTheme.primary}70 1.5px solid`,
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                                        RECENT CHATS
                                    </Typography>
                                </Box>
                                <Stack spacing=".5rem" sx={{
                                    overflowY: "auto",
                                    overflowX: "hidden",
                                    direction: "ltr",
                                    scrollbarWidth: "none",
                                    "::-webkit-scrollbar": {
                                        width: ".4rem",
                                    },
                                    "::-webkit-scrollbar-track": {
                                        background: "#FFFFFF15",
                                        borderRadius: 3,
                                    },
                                    "::-webkit-scrollbar-thumb": {
                                        background: theme.factionTheme.primary,
                                        borderRadius: 3,
                                    },
                                }}>
                                    <Button
                                        sx={{
                                            width: "100%",
                                            borderRadius: 0,
                                            justifyContent: "start",
                                            "&:hover": {
                                                backgroundColor: `${theme.factionTheme.primary}55`,
                                            },
                                        }}
                                    >
                                        <Typography>Dude</Typography>
                                    </Button>
                                    <Button
                                        sx={{
                                            width: "100%",
                                            borderRadius: 0,
                                            justifyContent: "start",
                                            "&:hover": {
                                                backgroundColor: `${theme.factionTheme.primary}55`,
                                            },
                                        }}
                                    >
                                        <Typography>Dude</Typography>
                                    </Button>
                                    <Button
                                        sx={{
                                            width: "100%",
                                            borderRadius: 0,
                                            justifyContent: "start",
                                            "&:hover": {
                                                backgroundColor: `${theme.factionTheme.primary}55`,
                                            },
                                        }}
                                    >
                                        <Typography>Dude</Typography>
                                    </Button>
                                    <Button
                                        sx={{
                                            width: "100%",
                                            borderRadius: 0,
                                            justifyContent: "start",
                                            "&:hover": {
                                                backgroundColor: `${theme.factionTheme.primary}55`,
                                            },
                                        }}
                                    >
                                        <Typography>Dude</Typography>
                                    </Button>
                                    <Button
                                        sx={{
                                            width: "100%",
                                            borderRadius: 0,
                                            justifyContent: "start",
                                            "&:hover": {
                                                backgroundColor: `${theme.factionTheme.primary}55`,
                                            },
                                        }}
                                    >
                                        <Typography>Dude</Typography>
                                    </Button>
                                    <Button
                                        sx={{
                                            width: "100%",
                                            borderRadius: 0,
                                            justifyContent: "start",
                                            "&:hover": {
                                                backgroundColor: `${theme.factionTheme.primary}55`,
                                            },
                                        }}
                                    >
                                        <Typography>Dude</Typography>
                                    </Button>
                                    <Button
                                        sx={{
                                            width: "100%",
                                            borderRadius: 0,
                                            justifyContent: "start",
                                            "&:hover": {
                                                backgroundColor: `${theme.factionTheme.primary}55`,
                                            },
                                        }}
                                    >
                                        <Typography>Dude</Typography>
                                    </Button>
                                    <Button
                                        sx={{
                                            width: "100%",
                                            borderRadius: 0,
                                            justifyContent: "start",
                                            "&:hover": {
                                                backgroundColor: `${theme.factionTheme.primary}55`,
                                            },
                                        }}
                                    >
                                        <Typography>Dude</Typography>
                                    </Button>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Divider
                            orientation="vertical"
                            sx={{
                                mx: "1rem",
                                backgroundColor: `${theme.factionTheme.primary}70`,
                            }}
                        />
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
                </ClipThing>
            </Popover>
        </>
    )
}
