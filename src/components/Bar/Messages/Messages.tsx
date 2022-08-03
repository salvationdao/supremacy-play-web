import { Badge, Box, IconButton, Modal, Stack } from "@mui/material"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { SvgClose, SvgMail } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsUser, useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { siteZIndex } from "../../../theme/theme"
import { SystemMessage, SystemMessageDataType } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
import { MessagesComposeView } from "./MessagesComposeView/MessagesComposeView"
import { MessagesMainView } from "./MessagesMainView/MessagesMainView"

export interface SystemMessageDisplayable extends SystemMessage {
    icon: ReactNode
}

export const Messages = () => {
    const theme = useTheme()
    const [modalOpen, toggleModalOpen] = useToggle(false)

    const { send } = useGameServerCommandsUser("/user_commander")
    const [totalUnread, setTotalUnread] = useState<number>()
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

    const [composeView, setComposeView] = useState<SystemMessageDataType>()

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

            <Modal open={modalOpen} onClose={() => toggleModalOpen(false)} sx={{ zIndex: siteZIndex.Modal }}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "120rem",
                        maxWidth: "90vw",
                        boxShadow: 6,
                        outline: "none",
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
                            position: "relative",
                            height: "72rem",
                            maxHeight: "90vh",
                        }}
                    >
                        {!composeView ? (
                            <MessagesMainView lastUpdated={lastUpdated} onCompose={(type: SystemMessageDataType) => setComposeView(type)} />
                        ) : (
                            <MessagesComposeView onBack={() => setComposeView(undefined)} type={composeView} />
                        )}

                        <IconButton size="small" onClick={() => toggleModalOpen(false)} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                            <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                        </IconButton>
                    </ClipThing>
                </Box>
            </Modal>
        </>
    )
}
