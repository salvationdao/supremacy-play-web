import { Typography } from "@mui/material"
import { useTimer } from "use-timer"
import { StyledImageText } from "../../.."
import { SvgEmergency } from "../../../../assets"
import { colors } from "../../../../theme/theme"
import { BattleZoneStruct } from "../../../../types"
import { NiceBoxThing } from "../../../Common/Nice/NiceBoxThing"

export const BattleZoneAlert = ({ data }: { data: BattleZoneStruct }) => {
    const { time } = useTimer({
        autostart: true,
        initialTime: Math.round(Date.now() / 1000 + data.warn_time),
        endTime: 0,
        timerType: "DECREMENTAL",
    })

    return (
        <NiceBoxThing border={{ color: `${colors.red}80` }} background={{ colors: [colors.darkNavy], opacity: 0.3 }} sx={{ p: ".6rem 1.4rem" }}>
            <Typography>
                <SvgEmergency inline fill={colors.red} size="1.2rem" />{" "}
                <StyledImageText>{time <= 0 ? "Battle Zone Shrinking" : `Battle Zone Shrinking in ${time} second${time === 1 ? "" : "s"}`}</StyledImageText>
            </Typography>
        </NiceBoxThing>
    )
}
