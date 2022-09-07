import { Divider, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { BATTLE_ARENA_OPEN } from "../../../../../constants"
import { dateFormatter } from "../../../../../helpers"
import { colors, fonts } from "../../../../../theme/theme"
import { NewBattleMessageData } from "../../../../../types"

export const NewBattleMessage = ({ data, sentAt }: { data: NewBattleMessageData; sentAt: Date }) => {
    return useMemo(() => {
        if (!BATTLE_ARENA_OPEN) return null

        return (
            <Stack direction={"row"} alignItems={"center"} sx={{ py: "0.5rem" }}>
                <Divider sx={{ flex: "1" }} />
                <Typography variant={"caption"} sx={{ color: colors.grey, flexShrink: "0", px: "1rem", fontFamily: fonts.nostromoBold }}>
                    BATTLE #{data.battle_number || null} ({dateFormatter(sentAt)})
                </Typography>
                <Divider sx={{ flex: "1" }} />
            </Stack>
        )
    }, [data.battle_number, sentAt])
}
