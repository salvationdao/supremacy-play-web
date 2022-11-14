import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Popover, Stack, Typography } from "@mui/material"
import { MutableRefObject, useEffect, useMemo } from "react"
import { useTimer } from "use-timer"
import { SvgClose, SvgExpandMoreIcon } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { timeSinceInWords } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { QuestProgress, QuestStat } from "../../../types"
import { NiceBoxThing } from "../../Common/Nice/NiceBoxThing"
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
    const theme = useTheme()
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
        <Popover
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
            sx={{
                mt: ".8rem",
                zIndex: siteZIndex.Popover,
                ".MuiPaper-root": {
                    mt: ".8rem",
                    background: "none",
                    boxShadow: 0,
                },
            }}
        >
            <NiceBoxThing border={{ color: colors.purple }} background={{ colors: [theme.factionTheme.background] }} sx={{ height: "100%" }}>
                <Stack sx={{ position: "relative", width: "38rem", maxHeight: "90vh", pb: "1.1rem" }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                            px: "2.2rem",
                            height: "5rem",
                            background: `linear-gradient(${colors.purple} 26%, ${colors.purple}95)`,
                            boxShadow: 1.5,
                        }}
                    >
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>YOUR CHALLENGES</Typography>
                    </Stack>

                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
                            ml: "1rem",
                            mr: ".5rem",
                            pr: ".5rem",
                            my: "1rem",
                            direction: "ltr",
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
                                        sx={{ m: "0 !important", ".MuiAccordionSummary-root.Mui-expanded": { backgroundColor: "#FFFFFF20", minHeight: 0 } }}
                                    >
                                        <AccordionSummary expandIcon={<SvgExpandMoreIcon />} sx={{ minHeight: 0, ":hover": { opacity: 0.95 } }}>
                                            <Stack>
                                                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                                    {eventName} ({countObtained}/{questStatsFiltered.length})
                                                </Typography>

                                                <Typography variant="subtitle2" sx={{ fontFamily: fonts.nostromoBold, span: { color: colors.neonBlue } }}>
                                                    <Countdown
                                                        initialTime={(new Date(questStatsFiltered[0]?.end_at).getTime() - new Date().getTime()) / 1000}
                                                    />
                                                </Typography>
                                            </Stack>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ p: "1rem 1rem 2rem" }}>
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

                    <IconButton size="small" onClick={() => toggleLocalOpen(false)} sx={{ position: "absolute", top: 0, right: ".2rem" }}>
                        <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </Stack>
            </NiceBoxThing>
        </Popover>
    )
}

const Countdown = ({ initialTime }: { initialTime?: number }) => {
    const { time } = useTimer({
        autostart: true,
        initialTime: initialTime,
        endTime: 0,
        timerType: "DECREMENTAL",
    })

    return <span>Resets {time > 0 ? "in " + timeSinceInWords(new Date(), new Date(new Date().getTime() + time * 1000), true) : "soon"}</span>
}
