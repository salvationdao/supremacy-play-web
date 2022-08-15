import { CircularProgress, Divider, Stack, Typography } from "@mui/material"
import { useRef, useState } from "react"
import { SvgQuest } from "../../../assets"
import { useToggle } from "../../../hooks"
import { useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { shake } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { QuestProgress, QuestStat } from "../../../types/user"
import { QuestsPopover } from "./QuestsPopover"

export const Quests = () => {
    const popoverRef = useRef(null)
    const [popoverOpen, togglePopoverOpen] = useToggle(false)
    const [questProgressions, setQuestProgressions] = useState<QuestProgress[]>()
    const [confetti, setConfetti] = useState<string[]>([])

    const questStats = useGameServerSubscriptionUser<QuestStat[]>({
        URI: "/quest_stat",
        key: GameServerKeys.SubPlayerQuestStats,
    })

    useGameServerSubscriptionUser<QuestProgress[]>(
        {
            URI: "/quest_progression",
            key: GameServerKeys.SubPlayerQuestStatsProgression,
        },
        (payload) => {
            if (!payload) return
            setQuestProgressions((prev) => {
                if (!prev) return payload
                const clonedArray = [...prev]

                payload.forEach((p) => {
                    const index = clonedArray.findIndex((i) => i.quest_id === p.quest_id)
                    if (index >= 0) {
                        if (p.current === p.goal) setConfetti((prev) => prev.concat(p.quest_id))
                        clonedArray[index] = p
                        return
                    }
                    clonedArray.push(p)
                })

                return clonedArray
            })
        },
    )

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
                        animation: confetti.length > 0 ? `${shake} 1s infinite` : "unset",
                        ":hover": {
                            backgroundColor: "#FFFFFF12",
                        },
                        ":active": {
                            opacity: 0.8,
                        },
                    }}
                >
                    <SvgQuest size="1.7rem" fill={colors.purple} />
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
                <QuestsPopover
                    open={popoverOpen}
                    popoverRef={popoverRef}
                    questStats={questStats}
                    questProgressions={questProgressions}
                    onClose={() => {
                        togglePopoverOpen(false)
                        setConfetti([])
                    }}
                    confetti={confetti}
                />
            )}
        </>
    )
}
