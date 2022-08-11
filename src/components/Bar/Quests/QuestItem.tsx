import { Checkbox, Stack, Typography } from "@mui/material"
import { colors } from "../../../theme/theme"
import { QuestProgress, QuestStat } from "../../../types"

export const QuestItem = ({ questStat, progress }: { questStat: QuestStat; progress?: QuestProgress }) => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                p: ".1rem .5rem",
                borderRadius: 1,
                backgroundColor: "#FFFFFF06",
            }}
        >
            <Checkbox
                size="small"
                checked={questStat.obtained}
                sx={{
                    transform: "scale(1.4)",
                    ".Mui-checked": { color: colors.neonBlue },
                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.neonBlue}50` },
                }}
            />

            <Typography
                sx={{
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
    )
}
