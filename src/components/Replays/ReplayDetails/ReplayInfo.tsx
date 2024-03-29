import { Stack, Typography } from "@mui/material"
import { colors, fonts } from "../../../theme/theme"
import { BattleReplay } from "../../../types"
import { SocialsShare } from "./SocialsShare"

export const ReplayInfo = ({ battleReplay }: { battleReplay?: BattleReplay }) => {
    return (
        <Stack direction="row">
            <Stack sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontFamily: fonts.nostromoBlack }}>
                    BATTLE #{battleReplay?.battle.battle_number}
                </Typography>

                <Typography sx={{ fontFamily: fonts.nostromoBold, color: colors.lightGrey }}>
                    {battleReplay?.battle.ended_at?.toLocaleDateString("en-us", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZoneName: "short",
                        hour12: false,
                    })}
                </Typography>
            </Stack>

            <SocialsShare />
        </Stack>
    )
}
