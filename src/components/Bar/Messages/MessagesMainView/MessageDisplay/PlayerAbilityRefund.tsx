import { Box, Divider, Stack, Typography } from "@mui/material"
import { SvgSupToken } from "../../../../../assets"
import { supFormatterNoFixed } from "../../../../../helpers"
import { colors, fonts } from "../../../../../theme/theme"
import { BlueprintPlayerAbility, PlayerAbility } from "../../../../../types"
import { ClipThing } from "../../../../Common/ClipThing"
import { PlayerAbilityCard } from "../../../../LeftDrawer/BattleArena/PlayerAbilities/PlayerAbilityCard"

interface PlayerAbilityReversedProps {
    message: string
    data: PlayerAbilityReversedData[]
}

export interface PlayerAbilityReversedData {
    amount: number
    player_ability: BlueprintPlayerAbility
}

export const PlayerAbilityReversedMessage = ({ message, data }: PlayerAbilityReversedProps) => {
    return (
        <Stack spacing=".3rem">
            <Typography variant="h6">{message}</Typography>

            <Divider sx={{ my: "1rem !important", borderColor: "#FFFFFF28" }} />

            <Stack alignItems="center" direction="row" spacing="2rem">
                {data.map((d, i) => {
                    if (!d.player_ability) return null
                    const playerAbility: PlayerAbility = {
                        id: "",
                        blueprint_id: "",
                        count: d.amount,
                        last_purchased_at: new Date(),
                        cooldown_expires_on: new Date(),
                        ability: d.player_ability,
                    }

                    return (
                        <Box key={i} sx={{ width: "12.5rem", minHeight: "13rem" }}>
                            <PlayerAbilityCard playerAbility={playerAbility} viewOnly />
                        </Box>
                    )
                })}
            </Stack>
        </Stack>
    )
}
