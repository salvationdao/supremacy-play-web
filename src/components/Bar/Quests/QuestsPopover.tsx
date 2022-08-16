import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Popover, Stack, Typography } from "@mui/material"
import { MutableRefObject, useEffect, useMemo } from "react"
import { ClipThing } from "../.."
import { SvgClose, SvgExpandMoreIcon } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useToggle } from "../../../hooks"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { QuestProgress, QuestStat } from "../../../types"
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

    const roundNames = useMemo(
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
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: colors.purple,
                    borderThickness: ".2rem",
                }}
                backgroundColor={theme.factionTheme.background}
                sx={{ height: "100%" }}
            >
                <Box sx={{ position: "relative", width: "38rem", maxHeight: "90vh", pb: "1.1rem" }}>
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
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>YOUR QUESTS</Typography>
                    </Stack>

                    {roundNames.length > 0 &&
                        roundNames.map((roundName, i) => {
                            const questStatsFiltered = questStats.filter((qs) => qs.round_name === roundName)
                            const itemHasConfetti = questStatsFiltered.some((qs) => confetti.findIndex((i) => i === qs.id) >= 0)

                            return (
                                <Accordion
                                    key={roundName}
                                    defaultExpanded={i === 0 || itemHasConfetti}
                                    sx={{ m: "0 !important", ".MuiAccordionSummary-root.Mui-expanded": { backgroundColor: "#FFFFFF20", minHeight: 0 } }}
                                >
                                    <AccordionSummary expandIcon={<SvgExpandMoreIcon />} sx={{ minHeight: 0, ":hover": { opacity: 0.95 } }}>
                                        <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                            {roundName} ({questStatsFiltered.filter((qs) => qs.obtained).length}/{questStatsFiltered.length})
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing=".7rem">
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

                    <IconButton size="small" onClick={() => toggleLocalOpen(false)} sx={{ position: "absolute", top: 0, right: ".2rem" }}>
                        <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </Box>
            </ClipThing>
        </Popover>
    )
}
