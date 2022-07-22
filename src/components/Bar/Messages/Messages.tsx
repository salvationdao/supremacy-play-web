import { Badge, Box, IconButton, Pagination, Popover, Stack, Typography } from "@mui/material"
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
    const popoverRef = useRef(null)
    const [localOpen, toggleLocalOpen] = useToggle(false)

    const { send } = useGameServerCommandsUser("/user_commander")
    const [messages, setMessages] = useState<SystemMessageDisplayable[]>([])
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
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

    const dismissMessage = useCallback(
        async (id: string) => {
            try {
                await send<
                    SystemMessage[],
                    {
                        id: string
                    }
                >(GameServerKeys.SystemMessageDismiss, {
                    id,
                })
            } catch (e) {
                let message = "Failed to dismiss system message."
                if (typeof e === "string") {
                    message = e
                } else if (e instanceof Error) {
                    message = e.message
                }
                setError(message)
                console.error(e)
            }
        },
        [send],
    )

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
                        You do not have any messages at the moment.
                    </Typography>
                </Stack>
            )
        }

        return (
            <Stack sx={{ p: "1rem" }} spacing="1rem">
                <Box
                    sx={{
                        pb: "1rem",
                        borderBottom: `${theme.factionTheme.primary}70 1.5px solid`,
                    }}
                >
                    <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack, textTransform: "uppercase" }}>
                        System Messages
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.red }}>
                        {error}
                    </Typography>
                </Box>
                <Stack spacing=".8rem">
                    <Stack direction="row" alignItems="center" justifyContent="end" spacing=".4rem">
                        <SvgHistoryClock size="1rem" fill={colors.grey} />
                        <Typography
                            variant="caption"
                            sx={{
                                color: colors.grey,
                            }}
                        >
                            Last updated: {lastUpdated.toISOString()}
                        </Typography>
                    </Stack>
                    {messages.map((m) => (
                        <MessageItem key={m.id} message={m} onDismiss={() => dismissMessage(m.id)} />
                    ))}
                </Stack>
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
            </Stack>
        )
    }, [messages, theme.factionTheme.primary, theme.factionTheme.secondary, error, lastUpdated, totalPages, page, dismissMessage, changePage])

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
                        <IconButton onClick={() => toggleLocalOpen(true)}>
                            <SvgMail size="2.2rem" />
                        </IconButton>
                    </Badge>
                </Box>
            </Stack>
            <Popover
                open={localOpen}
                anchorEl={popoverRef.current}
                onClose={() => toggleLocalOpen(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
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
                        height: "100%",
                        width: "100%",
                        maxWidth: "40rem",
                    }}
                >
                    {content}
                </ClipThing>
            </Popover>
        </>
    )
}
