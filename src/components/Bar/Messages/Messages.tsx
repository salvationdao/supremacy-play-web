import { Badge, Box, IconButton, Popover, Stack } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react"
import { SvgMail, SvgWrapperProps } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsUser, useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { siteZIndex } from "../../../theme/theme"
import { SystemMessage } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { MessagesComposeView } from "./MessagesComposeView/MessagesComposeView"
import { MessagesMainView } from "./MessagesMainView/MessagesMainView"

export interface SystemMessageDisplayable extends SystemMessage {
    icon: React.VoidFunctionComponent<SvgWrapperProps>
}

export const Messages = () => {
    const theme = useTheme()
    const popoverRef = useRef(null)
    const [modalOpen, toggleModalOpen] = useToggle(false)

    const { send } = useGameServerCommandsUser("/user_commander")
    const [totalUnread, setTotalUnread] = useState<number>()
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

    const [isComposeView, setIsComposeView] = useState(false)

    const fetchMessages = useCallback(async () => {
        try {
            const resp = await send<{
                total: number
                total_unread: number
                system_messages: SystemMessage[] | null
            }>(GameServerKeys.SystemMessageList)
            if (!resp || !resp.system_messages) return
            setTotalUnread(resp.total_unread)
        } catch (e) {
            console.error(e)
        }
    }, [send])

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
                    {!isComposeView ? (
                        <MessagesMainView lastUpdated={lastUpdated} onCompose={() => setIsComposeView(true)} />
                    ) : (
                        <MessagesComposeView onBack={() => setIsComposeView(false)} />
                    )}
                </ClipThing>
            </Popover>
        </>
    )
}
