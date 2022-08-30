import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import Confetti from "react-confetti"
import { SvgChest, SvgInfoCircular } from "../../../assets"
import { colors, fonts } from "../../../theme/theme"
import { QuestProgress, QuestStat } from "../../../types"
import { ProgressBar } from "../../Common/ProgressBar"
import { TooltipHelper } from "../../Common/TooltipHelper"

export const QuestItem = ({ questStat, progress, showConfetti }: { questStat: QuestStat; progress?: QuestProgress; showConfetti: boolean }) => {
    const cappedCurrent = progress ? Math.min(progress.current, progress.goal) : 0
    const progressPercent = progress ? (100 * cappedCurrent) / progress.goal : 0
    const [showShowConfetti, setShowShowConfetti] = useState(false)

    // This timeout allows the popover to fully animate before we do other animations, else it will lage
    useEffect(() => {
        if (!showConfetti) return
        setTimeout(() => {
            setShowShowConfetti(true)
        }, 400)
    }, [showConfetti])

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing="1rem"
            sx={{
                position: "relative",
                py: "1.2rem",
                pl: ".5rem",
                pr: "1.6rem",
                borderRadius: 1,
                backgroundColor: `${colors.purple}16`,
                userSelect: "none",
                opacity: questStat.obtained && !showConfetti ? 0.4 : 1,
                border: questStat.obtained && !showConfetti ? "none" : `${colors.purple}50 1px solid`,
                overflow: "hidden",
            }}
        >
            <Confetti
                width={1000}
                height={40}
                gravity={0.04}
                initialVelocityX={1}
                tweenDuration={10000}
                run={showShowConfetti}
                numberOfPieces={600}
                recycle={false}
            />

            <TooltipHelper color={colors.purple} placement="top-end" text={questStat.description}>
                <Box sx={{ position: "absolute", top: ".4rem", right: ".4rem", opacity: 0.4, ":hover": { opacity: 1 } }}>
                    <SvgInfoCircular size="1.3rem" />
                </Box>
            </TooltipHelper>

            <Stack spacing=".8rem" sx={{ flex: 1 }}>
                <Stack spacing=".8rem" direction="row" alignItems="center" justifyContent="space-between">
                    <Typography
                        sx={{
                            lineHeight: 1,
                            fontWeight: "fontWeightBold",
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1, // change to max number of lines
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {questStat.name}
                    </Typography>
                </Stack>

                {progress && (
                    <Stack spacing=".8rem" direction="row" alignItems="center">
                        <ProgressBar
                            color={colors.green}
                            backgroundColor={`${colors.red}BB`}
                            orientation="horizontal"
                            thickness="7px"
                            percent={progressPercent}
                        />

                        <Typography
                            variant="body2"
                            sx={{
                                color: progressPercent < 100 ? colors.red : colors.green,
                                lineHeight: 1,
                                fontWeight: "fontWeightBold",
                            }}
                        >
                            {cappedCurrent}/{progress.goal}
                        </Typography>
                    </Stack>
                )}

                <Stack direction="row" alignItems="center">
                    <SvgChest size="1.6rem" sx={{ mr: ".7rem" }} />

                    <Typography variant="subtitle2" sx={{ color: colors.gold, lineHeight: 1, fontFamily: fonts.nostromoBlack }}>
                        REWARD:&nbsp;
                    </Typography>

                    <Typography variant="subtitle2" sx={{ lineHeight: 1, fontFamily: fonts.nostromoBold }}>
                        SUPPORT MACHINE
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}
