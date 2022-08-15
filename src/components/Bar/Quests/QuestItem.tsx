import { Checkbox, Stack, Typography } from "@mui/material"
import { colors } from "../../../theme/theme"
import { QuestProgress, QuestStat } from "../../../types"
import { ProgressBar } from "../../Common/ProgressBar"
import { TooltipHelper } from "../../Common/TooltipHelper"
import Confetti from "react-confetti"

export const QuestItem = ({ questStat, progress, showConfetti }: { questStat: QuestStat; progress?: QuestProgress; showConfetti: boolean }) => {
    const progressPercent = progress ? (100 * progress.current) / progress.goal : 0

    return (
        <TooltipHelper color={colors.purple} placement="left" text={questStat.description}>
            <Stack
                direction="row"
                alignItems="center"
                spacing=".3rem"
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    p: ".8rem .5rem",
                    pr: "1.6rem",
                    borderRadius: 1,
                    backgroundColor: `${colors.purple}12`,
                    userSelect: "none",
                }}
            >
                <Confetti
                    width={1000}
                    height={100}
                    gravity={0.04}
                    initialVelocityX={1}
                    tweenDuration={10000}
                    run={showConfetti}
                    numberOfPieces={400}
                    recycle={false}
                />

                <Checkbox
                    size="small"
                    checked={questStat.obtained}
                    disabled
                    sx={{
                        transform: "scale(1.8)",
                        color: colors.purple,
                        ".Mui-checked, .MuiSvgIcon-root": { color: `${colors.purple} !important` },
                        ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.purple}50 !important` },
                    }}
                />

                <Stack spacing=".6rem" sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
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

                        {progress && (
                            <Typography
                                variant="body2"
                                sx={{ color: progressPercent < 100 ? colors.red : colors.green, lineHeight: 1, fontWeight: "fontWeightBold" }}
                            >
                                {progress.current}/{progress.goal}
                            </Typography>
                        )}
                    </Stack>

                    {progress && (
                        <ProgressBar
                            color={colors.green}
                            backgroundColor={`${colors.red}BB`}
                            orientation="horizontal"
                            thickness="7px"
                            percent={progressPercent}
                        />
                    )}
                </Stack>
            </Stack>
        </TooltipHelper>
    )
}
