import { Box, Divider, Stack, Typography } from "@mui/material"
import { SvgSupToken } from "../../../../../assets"
import { supFormatterNoFixed } from "../../../../../helpers"
import { colors, fonts } from "../../../../../theme/theme"
import { BlueprintPlayerAbility, PlayerAbility } from "../../../../../types"
import { PlayerAbilityCard } from "../../../../VotingSystem/PlayerAbilities/PlayerAbilityCard"

interface MechOwnerBattleRewardProps {
    message: string
    data: MechOwnerBattleRewardData
}

export interface MechOwnerBattleRewardData {
    rewarded_sups: string
    rewarded_player_ability?: BlueprintPlayerAbility
}

export const MechOwnerBattleReward = ({ message, data }: MechOwnerBattleRewardProps) => {
    const sups = data.rewarded_sups
    const ability = data.rewarded_player_ability
    const playerAbility: PlayerAbility | undefined = ability
        ? {
              id: "",
              blueprint_id: "",
              count: 1,
              last_purchased_at: new Date(),
              ability: ability,
          }
        : undefined

    return (
        <Stack spacing=".3rem">
            <Typography variant="h6">{message}</Typography>

            <Divider sx={{ my: "1rem !important", borderColor: "#FFFFFF28" }} />

            <Typography sx={{ fontFamily: fonts.nostromoBold, lineHeight: 1, pb: "1rem" }}>CONSOLATION REWARD:</Typography>

            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    pb: ".4rem",
                    borderRadius: 1,
                }}
            >
                <Typography sx={{ fontFamily: fonts.nostromoBold, lineHeight: 1 }}>Sups: </Typography>
                <SvgSupToken size="1.9rem" fill={colors.yellow} sx={{ mr: ".2rem", pb: ".4rem" }} />
                <Typography variant="h6" sx={{ lineHeight: 1 }}>
                    {supFormatterNoFixed(sups, 2)}
                </Typography>
            </Stack>

            {ability && playerAbility && (
                <Stack direction="column">
                    <Typography sx={{ fontFamily: fonts.nostromoBold, lineHeight: 1 }}>Ability: </Typography>

                    <Box sx={{ width: "8rem", height: "14rem" }}>
                        <PlayerAbilityCard key={ability.id} playerAbility={playerAbility} viewOnly />
                    </Box>
                </Stack>
            )}
        </Stack>
    )
}
