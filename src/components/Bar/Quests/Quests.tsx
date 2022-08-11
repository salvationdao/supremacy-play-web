import { Badge, Box, IconButton, Modal, Stack } from "@mui/material"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { SvgClose, SvgMail } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsUser, useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { siteZIndex } from "../../../theme/theme"
import { SystemMessage, SystemMessageDataType } from "../../../types"
import { QuestStat } from "../../../types/user"
import { ClipThing } from "../../Common/ClipThing"
import { MessagesComposeView } from "./MessagesComposeView/MessagesComposeView"
import { MessagesMainView } from "./MessagesMainView/MessagesMainView"
import { QuestsPopover } from "./QuestsPopover"

export interface SystemMessageDisplayable extends SystemMessage {
    icon: ReactNode
}

export const Quests = () => {
    const theme = useTheme()
    const popoverRef = useRef(null)
    const [popoverOpen, togglePopoverOpen] = useToggle(false)

    const questStats = useGameServerSubscriptionUser<QuestStat[]>({
        URI: "/quest_stat",
        key: GameServerKeys.SubPlayerQuestStats,
    })

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
                        <IconButton onClick={() => togglePopoverOpen(true)}>
                            <SvgMail size="2.2rem" />
                        </IconButton>
            </Stack>
			
			<QuestsPopover popoverRef={popoverRef} onClose={} />
        </>
    )
}
