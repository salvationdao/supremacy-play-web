import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from "@mui/material"
import { MutableRefObject, useEffect, useMemo } from "react"
import { useTimer } from "use-timer"
import { SvgExpandMoreIcon } from "../../../assets"
import { timeSinceInWords } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { QuestProgress, QuestStat } from "../../../types"
import { NicePopover } from "../../Common/Nice/NicePopover"
import { QuestItem } from "./QuestItem"

export const QuestsPopover = ({
    open,
    questStats,
    questProgressions,
    onClose,
    popoverRef,
    confetti,
}: {
    open: boolean
    questStats: QuestStat[]
    questProgressions?: QuestProgress[]
    onClose: () => void
    popoverRef: MutableRefObject<null>
    confetti: string[]
}) => {
    const [localOpen, toggleLocalOpen] = useToggle(open)

    const eventNames = useMemo(
        () => questStats.reduce<string[]>((acc, qs) => (acc.findIndex((a) => a === qs.round_name) >= 0 ? acc : [...acc, qs.round_name]), []),
        [questStats],
    )

    useEffect(() => {
        if (!localOpen) {
            const timeout = setTimeout(() => {
                onClose()
            }, 300)

            return () => clearTimeout(timeout)
        }
    }, [localOpen, onClose])

    return (
        <NicePopover
            open={localOpen}
            anchorEl={popoverRef.current}
            onClose={() => toggleLocalOpen(false)}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
        >
            <Stack sx={{ position: "relative", width: "38rem", maxHeight: "90vh" }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                        flexShrink: 0,
                        px: "2.2rem",
                        height: "5rem",
                        backgroundColor: colors.purple,
                    }}
                >
                    <Typography sx={{ fontFamily: fonts.nostromoBlack }}>YOUR CHALLENGES</Typography>
                </Stack>

                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                    }}
                >
                    {eventNames.length > 0 &&
                        eventNames.map((eventName, i) => {
                            const questStatsFiltered = questStats.filter((qs) => qs.round_name === eventName)
                            const itemHasConfetti = questStatsFiltered.some((qs) => confetti.findIndex((i) => i === qs.id) >= 0)
                            const countObtained = questStatsFiltered.filter((qs) => {
                                const progress = questProgressions?.find((qp) => qp.quest_id === qs.id)
                                return progress ? progress.current >= progress.goal : false
                            }).length

                            return (
                                <Accordion
                                    key={eventName}
                                    defaultExpanded={i === 0 || itemHasConfetti}
                                    sx={{
                                        m: "0 !important",
                                        ".MuiAccordionSummary-root": {
                                            backgroundColor: (theme) => theme.factionTheme.s900,
                                            "&.Mui-expanded": {
                                                backgroundColor: `${colors.purple}40`,
                                                minHeight: 0,
                                            },
                                        },
                                    }}
                                >
                                    <AccordionSummary expandIcon={<SvgExpandMoreIcon />} sx={{ minHeight: 0, ":hover": { opacity: 0.95 } }}>
                                        <Stack>
                                            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                                {eventName} ({countObtained}/{questStatsFiltered.length})
                                            </Typography>

                                            <Typography variant="subtitle2" sx={{ fontFamily: fonts.nostromoBold, span: { color: colors.neonBlue } }}>
                                                <Countdown initialTime={(new Date(questStatsFiltered[0]?.end_at).getTime() - new Date().getTime()) / 1000} />
                                            </Typography>
                                        </Stack>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: "1rem 1rem 2rem", backgroundColor: (theme) => theme.factionTheme.background }}>
                                        <Stack spacing="1rem">
                                            {questStatsFiltered.map((qs) => {
                                                const progress = questProgressions?.find((qp) => qp.quest_id === qs.id)

                                                return (
                                                    <QuestItem
                                                        key={`qs-key-${qs.id}-${progress?.current}`}
                                                        questStat={qs}
                                                        progress={progress}
                                                        showConfetti={confetti.findIndex((i) => i === qs.id) >= 0}
                                                    />
                                                )
                                            })}
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                            )
                        })}
                </Box>
            </Stack>
        </NicePopover>
    )
}

const Countdown = ({ initialTime }: { initialTime?: number }) => {
    const { time } = useTimer({
        autostart: true,
        initialTime: initialTime ? Math.round(initialTime) : initialTime,
        endTime: 0,
        timerType: "DECREMENTAL",
    })

    return <span>Resets {time > 0 ? "in " + timeSinceInWords(new Date(), new Date(new Date().getTime() + time * 1000), true) : "soon"}</span>
}
