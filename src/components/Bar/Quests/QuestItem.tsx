import { Checkbox, Stack, Typography } from "@mui/material"
import { colors } from "../../../theme/theme"
import { QuestProgress, QuestStat } from "../../../types"
import { ProgressBar } from "../../Common/ProgressBar"
import { TooltipHelper } from "../../Common/TooltipHelper"

export const QuestItem = ({ questStat, progress }: { questStat: QuestStat; progress?: QuestProgress }) => {
    return (
        <TooltipHelper color={colors.purple} placement="left" text={questStat.description}>
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    p: ".2rem .5rem",
                    pr: "1.6rem",
                    borderRadius: 1,
                    backgroundColor: `${colors.purple}12`,
                    opacity: questStat.obtained ? 0.5 : 1,
                    userSelect: "none",
                }}
            >
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

                <Stack spacing=".3rem" sx={{ flex: 1 }}>
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
                        <ProgressBar
                            color={colors.green}
                            backgroundColor={colors.red}
                            orientation="horizontal"
                            thickness="7px"
                            percent={progress.current / progress.goal}
                        />
                    )}
                </Stack>
            </Stack>
        </TooltipHelper>
    )
}
