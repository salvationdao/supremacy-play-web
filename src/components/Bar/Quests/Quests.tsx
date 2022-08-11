import { CircularProgress, Divider, Stack, Typography } from "@mui/material"
import { useRef } from "react"
import { SvgQuest } from "../../../assets"
import { useToggle } from "../../../hooks"
import { useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { QuestStat } from "../../../types/user"
import { QuestsPopover } from "./QuestsPopover"

export const Quests = () => {
    const popoverRef = useRef(null)
    const [popoverOpen, togglePopoverOpen] = useToggle(false)

    const questStats = useGameServerSubscriptionUser<QuestStat[]>({
        URI: "/quest_stat",
        key: GameServerKeys.SubPlayerQuestStats,
    })

    if (!questStats) {
        return (
            <Stack alignItems="center" sx={{ width: "10rem" }}>
                <CircularProgress size="1.8rem" sx={{ color: colors.purple }} />
            </Stack>
        )
    }

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
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing=".9rem"
                    ref={popoverRef}
                    onClick={() => togglePopoverOpen()}
                    sx={{
                        mr: ".3rem",
                        px: ".7rem",
                        py: ".6rem",
                        cursor: "pointer",
                        borderRadius: 1,
                        backgroundColor: popoverOpen ? "#FFFFFF12" : "unset",
                        ":hover": {
                            backgroundColor: "#FFFFFF12",
                        },
                        ":active": {
                            opacity: 0.8,
                        },
                    }}
                >
                    <SvgQuest size="1.9rem" fill={colors.purple} />
                    <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBold, lineHeight: 1, whiteSpace: "nowrap" }}>
                        {questStats.filter((qs) => qs.obtained).length}/{questStats.length}
                    </Typography>
                </Stack>

                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        height: "2.3rem",
                        my: "auto !important",
                        ml: "1.7rem",
                        borderColor: "#494949",
                        borderRightWidth: 1.6,
                    }}
                />
            </Stack>

            {questStats && popoverOpen && (
                <QuestsPopover open={popoverOpen} popoverRef={popoverRef} questStats={questStats} onClose={() => togglePopoverOpen(false)} />
            )}
        </>
    )
}
