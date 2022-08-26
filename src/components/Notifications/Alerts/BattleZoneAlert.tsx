import { Box, Stack } from "@mui/material"
import { ClipThing, StyledNormalText } from "../.."
import { SvgEmergency } from "../../../assets"
import { colors } from "../../../theme/theme"
import { BattleZoneStruct } from "../../../types"
import { useTimer } from "../../../hooks"
import { useMemo } from "react"

export const BattleZoneAlert = ({ data }: { data: BattleZoneStruct }) => {
    const endTime = useMemo(() => new Date(Date.now() + data.warnTime * 1000), [data.warnTime])
    const { totalSecRemain } = useTimer(endTime)

    return (
        <ClipThing
            clipSize="3px"
            border={{
                borderColor: colors.red,
                isFancy: true,
                borderThickness: ".2rem",
            }}
            opacity={0.8}
            backgroundColor={colors.darkNavy}
        >
            <Stack spacing=".5rem" sx={{ px: "1.44rem", pt: "1.2rem", pb: ".8rem" }}>
                <Box>
                    <SvgEmergency fill={colors.red} size="1.3rem" sx={{ display: "inline", ml: ".4rem", mr: "1.2rem" }} />
                    <StyledNormalText
                        text={
                            totalSecRemain <= 0
                                ? "Battle Zone Shrinking"
                                : `Battle Zone Shrinking in ${totalSecRemain} second${totalSecRemain === 1 ? "" : "s"}`
                        }
                    />
                </Box>
            </Stack>
        </ClipThing>
    )
}
