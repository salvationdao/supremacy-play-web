import { Box, Stack, Typography } from "@mui/material"
import React, { useState } from "react"
import Confetti from "react-confetti"
import { SvgChest, SvgInfoCircular } from "../../../assets"
import { colors, fonts } from "../../../theme/theme"
import { QuestProgress, QuestStat } from "../../../types"
import { ProgressBar } from "../../Common/ProgressBar"
import { NiceTooltip } from "../../Common/Nice/NiceTooltip"
import { TruncateTextLines } from "../../../theme/styles"

interface QuestItemProps {
    questStat: QuestStat
    progress?: QuestProgress
    showConfetti: boolean
}

const propsAreEqual = (prevProps: QuestItemProps, nextProps: QuestItemProps) => {
    return (
        prevProps.questStat.id === nextProps.questStat.id &&
        prevProps.progress?.current === nextProps.progress?.current &&
        prevProps.showConfetti === nextProps.showConfetti
    )
}

export const QuestItem = React.memo(function QuestItem({ questStat, progress, showConfetti }: QuestItemProps) {
    const cappedCurrent = progress ? Math.min(progress.current, progress.goal) : 0
    const progressPercent = progress ? (100 * cappedCurrent) / progress.goal : 0
    const [showShowConfetti, setShowShowConfetti] = useState(showConfetti)
    const [completed, setCompleted] = useState(questStat.obtained)

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing="1rem"
            sx={{
                position: "relative",
                py: "1.2rem",
                pl: ".5rem",
                pr: "1.4rem",
                borderRadius: 1,
                backgroundColor: `${colors.purple}16`,
                userSelect: "none",
                opacity: completed && !showShowConfetti ? 0.4 : 1,
                border: completed && !showShowConfetti ? "none" : `${colors.purple}50 1px solid`,
                overflow: "hidden",
            }}
        >
            {showShowConfetti && (
                <Confetti
                    width={400}
                    height={80}
                    gravity={0.04}
                    initialVelocityX={1}
                    tweenDuration={8000}
                    run={showShowConfetti}
                    numberOfPieces={100}
                    recycle={false}
                    onConfettiComplete={() => {
                        setTimeout(() => {
                            setCompleted(true)
                            setShowShowConfetti(false)
                        }, 1500)
                    }}
                />
            )}

            <NiceTooltip color={colors.purple} placement="top-end" text={questStat.description}>
                <Box sx={{ position: "absolute", top: ".4rem", right: ".4rem", opacity: 0.4, ":hover": { opacity: 1 } }}>
                    <SvgInfoCircular size="1.3rem" />
                </Box>
            </NiceTooltip>

            <Stack spacing=".8rem" sx={{ flex: 1 }}>
                <Stack spacing=".8rem" direction="row" alignItems="center" justifyContent="space-between">
                    <Typography
                        sx={{
                            lineHeight: 1,
                            fontWeight: "fontWeightBold",
                            ...TruncateTextLines(1),
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
                    <SvgChest size="1.6rem" />

                    <Typography variant="subtitle2" sx={{ mx: ".7rem", color: colors.gold, fontFamily: fonts.nostromoBlack }}>
                        REWARD:
                    </Typography>

                    <Typography variant="subtitle2" sx={{ fontFamily: fonts.nostromoBold }}>
                        SUPPORT MACHINE ABILITY
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}, propsAreEqual)
