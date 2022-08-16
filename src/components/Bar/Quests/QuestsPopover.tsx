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

    const roundNames = useMemo(() => questStats.reduce<string[]>((acc, qs) => (qs.round_name in acc ? acc : [...acc, qs.round_name]), []), [questStats])

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
                <Box sx={{ position: "relative", width: "38rem", maxHeight: "90vh", px: "2rem", py: "1.4rem" }}>
                    <Typography sx={{ mb: ".4rem", fontFamily: fonts.nostromoBlack, color: colors.purple }}>YOUR QUESTS</Typography>

                    <Typography variant="body2" sx={{ mb: ".8rem", fontWeight: "fontWeightBold", color: colors.grey }}>
                        <i>
                            YOU&apos;VE COMPLETED {questStats.filter((qs) => qs.obtained).length}/{questStats.length} QUESTS
                        </i>
                    </Typography>

                    {roundNames.length > 0 &&
                        roundNames.map((roundName) => {
                            return (
                                <Accordion key={roundName}>
                                    <AccordionSummary expandIcon={<SvgExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                        <Typography>{roundName}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing=".7rem">
                                            {questStats
                                                .filter((qs) => qs.round_name === roundName)
                                                .map((qs) => {
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
