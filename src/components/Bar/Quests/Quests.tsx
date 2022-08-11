import { IconButton, Stack } from "@mui/material"
import { useRef } from "react"
import { SvgMail } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useToggle } from "../../../hooks"
import { useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { QuestStat } from "../../../types/user"
import { QuestsPopover } from "./QuestsPopover"

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

            {questStats && popoverOpen && (
                <QuestsPopover open={popoverOpen} popoverRef={popoverRef} questStats={questStats} onClose={() => togglePopoverOpen(false)} />
            )}
        </>
    )
}
