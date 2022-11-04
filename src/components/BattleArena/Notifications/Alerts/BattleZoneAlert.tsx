import { Box, Stack } from "@mui/material"
import { useTimer } from "use-timer"
import { ClipThing, StyledNormalText } from "../../.."
import { SvgEmergency } from "../../../../assets"
import { colors } from "../../../../theme/theme"
import { BattleZoneStruct } from "../../../../types"

export const BattleZoneAlert = ({ data }: { data: BattleZoneStruct }) => {
    const { time } = useTimer({
        autostart: true,
        initialTime: Date.now() / 1000 + data.warn_time,
        endTime: 0,
        timerType: "DECREMENTAL",
    })

    return (
        <ClipThing
            clipSize="3px"
            border={{
                borderColor: colors.red,
                borderThickness: ".2rem",
            }}
            opacity={0.6}
            backgroundColor={colors.darkNavy}
        >
            <Stack spacing=".5rem" sx={{ px: "1.44rem", pt: "1.2rem", pb: ".8rem" }}>
                <Box>
                    <SvgEmergency fill={colors.red} size="1.3rem" sx={{ display: "inline", ml: ".4rem", mr: "1.2rem" }} />
                    <StyledNormalText text={time <= 0 ? "Battle Zone Shrinking" : `Battle Zone Shrinking in ${time} second${time === 1 ? "" : "s"}`} />
                </Box>
            </Stack>
        </ClipThing>
    )
}
