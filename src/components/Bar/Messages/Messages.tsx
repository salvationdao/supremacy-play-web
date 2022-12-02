import { Badge, Box, IconButton, Stack } from "@mui/material"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { SvgMail } from "../../../assets"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsUser, useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { SystemMessage, SystemMessageDataType } from "../../../types"
import { NiceModal } from "../../Common/Nice/NiceModal"
import { MessagesComposeView } from "./MessagesComposeView/MessagesComposeView"
import { MessagesMainView } from "./MessagesMainView/MessagesMainView"

export interface SystemMessageDisplayable extends SystemMessage {
    icon: ReactNode
}

export const Messages = () => {
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

    useGameServerSubscriptionSecuredUser<boolean>(
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
                    mx: "1rem",
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
                                fontWeight: "bold",
                            },
                        }}
                    >
                        <IconButton onClick={() => toggleModalOpen(true)}>
                            <SvgMail size="2rem" />
                        </IconButton>
                    </Badge>
                </Box>
            </Stack>

            <NiceModal open={modalOpen} onClose={() => toggleModalOpen(false)} sx={{ width: "120rem", maxWidth: "90vw", height: "130rem", maxHeight: "90vh" }}>
                {!composeView ? (
                    <MessagesMainView lastUpdated={lastUpdated} onCompose={(type: SystemMessageDataType) => setComposeView(type)} />
                ) : (
                    <MessagesComposeView onBack={() => setComposeView(undefined)} type={composeView} />
                )}
            </NiceModal>
        </>
    )
}
